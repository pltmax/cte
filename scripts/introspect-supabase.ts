/**
 * Supabase introspection script.
 * Extracts tables, columns, RLS policies, RPC functions, triggers, enums, and extensions.
 * Outputs markdown to stdout.
 *
 * Usage: npx tsx scripts/introspect-supabase.ts > docs/context/database.md
 * Requires: DATABASE_URL in .env (Session mode, port 5432)
 */

import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

// Load .env manually (avoid needing dotenv as a peer dep)
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.trim().split("=");
    if (key && !key.startsWith("#")) {
      process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL not found in .env");
  console.error("Add: DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: "require" });

async function getTables() {
  return sql`
    SELECT
      t.table_name,
      t.table_schema,
      obj_description(c.oid) as description,
      c.relrowsecurity as rls_enabled,
      c.relforcerowsecurity as rls_forced
    FROM information_schema.tables t
    JOIN pg_class c ON c.relname = t.table_name
    JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name
  `;
}

async function getColumns(tableName: string) {
  return sql`
    SELECT
      column_name,
      data_type,
      is_nullable,
      column_default,
      character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ${tableName}
    ORDER BY ordinal_position
  `;
}

async function getForeignKeys(tableName: string) {
  return sql`
    SELECT
      kcu.column_name,
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name = ${tableName}
  `;
}

async function getRlsPolicies(tableName: string) {
  return sql`
    SELECT
      polname as policy_name,
      CASE polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        ELSE 'ALL'
      END as command,
      CASE polpermissive WHEN true THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END as permissive,
      pg_get_expr(polqual, polrelid) as using_expr,
      pg_get_expr(polwithcheck, polrelid) as with_check_expr
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = ${tableName}
    ORDER BY polname
  `;
}

async function getRpcFunctions() {
  return sql`
    SELECT
      p.proname as function_name,
      pg_get_function_arguments(p.oid) as arguments,
      pg_get_function_result(p.oid) as return_type,
      CASE p.prosecdef WHEN true THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END as security,
      obj_description(p.oid) as description
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind = 'f'
    ORDER BY p.proname
  `;
}

async function getEnums() {
  return sql`
    SELECT
      t.typname as enum_name,
      array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
    GROUP BY t.typname
    ORDER BY t.typname
  `;
}

async function getExtensions() {
  return sql`
    SELECT extname, extversion
    FROM pg_extension
    ORDER BY extname
  `;
}

async function getMigrations() {
  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  if (!fs.existsSync(migrationsDir)) return [];
  return fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort()
    .map(f => ({ name: f }));
}

function now() {
  return new Date().toISOString().replace("T", " ").slice(0, 16);
}

async function main() {
  const lines: string[] = [];

  lines.push(`# Database Context — Supabase`);
  lines.push(``);
  lines.push(`> Auto-generated on ${now()}`);
  lines.push(`> Do not edit manually. Regenerate with: \`npm run context:db\``);
  lines.push(``);

  // Extensions
  const extensions = await getExtensions();
  if (extensions.length > 0) {
    lines.push(`## Extensions`);
    lines.push(``);
    lines.push(`| Extension | Version |`);
    lines.push(`|-----------|---------|`);
    for (const ext of extensions) {
      lines.push(`| \`${ext.extname}\` | ${ext.extversion} |`);
    }
    lines.push(``);
  }

  // Enums
  const enums = await getEnums();
  if (enums.length > 0) {
    lines.push(`## Enums`);
    lines.push(``);
    for (const e of enums) {
      lines.push(`- \`${e.enum_name}\`: ${(e.values as string[]).map(v => `\`${v}\``).join(", ")}`);
    }
    lines.push(``);
  }

  // Tables
  const tables = await getTables();
  lines.push(`## Tables (${tables.length})`);
  lines.push(``);

  for (const table of tables) {
    const rlsStatus = table.rls_enabled ? "✅ RLS enabled" : "❌ NO RLS";
    lines.push(`### \`${table.table_name}\` — ${rlsStatus}`);
    lines.push(``);
    if (table.description) lines.push(`${table.description}`);
    lines.push(``);

    // Columns
    const columns = await getColumns(table.table_name);
    lines.push(`**Columns:**`);
    lines.push(``);
    lines.push(`| Column | Type | Nullable | Default |`);
    lines.push(`|--------|------|----------|---------|`);
    for (const col of columns) {
      const nullable = col.is_nullable === "YES" ? "✓" : "✗";
      const def = col.column_default ? `\`${col.column_default}\`` : "—";
      lines.push(`| \`${col.column_name}\` | \`${col.data_type}\` | ${nullable} | ${def} |`);
    }
    lines.push(``);

    // Foreign keys
    const fks = await getForeignKeys(table.table_name);
    if (fks.length > 0) {
      lines.push(`**Foreign Keys:**`);
      lines.push(``);
      for (const fk of fks) {
        lines.push(`- \`${fk.column_name}\` → \`${fk.foreign_table}.${fk.foreign_column}\``);
      }
      lines.push(``);
    }

    // RLS policies
    const policies = await getRlsPolicies(table.table_name);
    if (policies.length > 0) {
      lines.push(`**RLS Policies:**`);
      lines.push(``);
      for (const p of policies) {
        lines.push(`- **${p.policy_name}** (${p.command}, ${p.permissive})`);
        if (p.using_expr) lines.push(`  - USING: \`${p.using_expr}\``);
        if (p.with_check_expr) lines.push(`  - WITH CHECK: \`${p.with_check_expr}\``);
      }
      lines.push(``);
    } else if (table.rls_enabled) {
      lines.push(`> ⚠️ RLS is enabled but no policies found — all access will be denied.`);
      lines.push(``);
    }
  }

  // RPC Functions
  const rpcs = await getRpcFunctions();
  if (rpcs.length > 0) {
    lines.push(`## RPC Functions (${rpcs.length})`);
    lines.push(``);
    lines.push(`| Function | Arguments | Returns | Security |`);
    lines.push(`|----------|-----------|---------|----------|`);
    for (const fn of rpcs) {
      lines.push(`| \`${fn.function_name}\` | \`${fn.arguments || "none"}\` | \`${fn.return_type}\` | ${fn.security} |`);
    }
    lines.push(``);
  }

  // Migrations
  const migrations = await getMigrations();
  if (migrations.length > 0) {
    lines.push(`## Applied Migrations`);
    lines.push(``);
    for (const m of migrations) {
      lines.push(`- \`${m.name}\``);
    }
    lines.push(``);
  }

  console.log(lines.join("\n"));
  await sql.end();
}

main().catch(err => {
  console.error("Introspection failed:", err.message);
  process.exit(1);
});
