import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { Resend } from "resend";
import { z } from "zod";

// ─── Payload schema ────────────────────────────────────────────────────────────

const HookPayloadSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    user_metadata: z.record(z.string(), z.unknown()).optional(),
  }),
  email_data: z.object({
    token: z.string(),
    token_hash: z.string(),
    redirect_to: z.string(),
    email_action_type: z.enum([
      "signup",
      "recovery",
      "magiclink",
      "invite",
      "email_change_new",
      "email_change_current",
    ]),
    site_url: z.string(),
    token_new: z.string().optional(),
    token_hash_new: z.string().optional(),
  }),
});

// ─── Template builder ──────────────────────────────────────────────────────────

function shell(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f0ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(102,0,204,0.08);">
          <tr>
            <td style="background-color:#6600CC;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Choppe Ton Exam</p>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Préparation au TOEIC</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #f0e6ff;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                © ${new Date().getFullYear()} Choppe Ton Exam &nbsp;·&nbsp;
                <a href="https://www.choppetonexam.com/cgv" style="color:#aaaaaa;text-decoration:none;">Conditions générales</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(url: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
    <tr>
      <td style="background-color:#6600CC;border-radius:10px;">
        <a href="${url}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:-0.1px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(url: string): string {
  return `<p style="margin:16px 0 0;font-size:12px;color:#aaaaaa;">
    Si le bouton ne fonctionne pas, copie-colle ce lien dans ton navigateur :<br/>
    <a href="${url}" style="color:#6600CC;word-break:break-all;">${url}</a>
  </p>`;
}

function buildEmailTemplate(
  type: z.infer<typeof HookPayloadSchema>["email_data"]["email_action_type"],
  firstName: string,
  actionUrl: string
): { subject: string; html: string } {
  switch (type) {
    case "signup":
    case "invite":
      return {
        subject: "Confirme ton adresse email — Choppe Ton Exam",
        html: shell(`
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">Bienvenue, ${firstName}&nbsp;!</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">
            Ton compte a bien été créé. Il te reste une étape : confirme ton adresse email pour activer ton accès et commencer à t'entraîner.
          </p>
          ${ctaButton(actionUrl, "Confirmer mon adresse email")}
          <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
            Ce lien est valable 24 heures. Si tu n'as pas créé de compte sur Choppe Ton Exam, tu peux ignorer cet email en toute sécurité.
          </p>
          ${fallbackLink(actionUrl)}
        `),
      };

    case "recovery":
      return {
        subject: "Réinitialisation de ton mot de passe — Choppe Ton Exam",
        html: shell(`
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">Réinitialise ton mot de passe</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">
            Tu as demandé à réinitialiser le mot de passe associé à ce compte. Clique sur le bouton ci-dessous pour en choisir un nouveau.
          </p>
          ${ctaButton(actionUrl, "Choisir un nouveau mot de passe")}
          <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
            Ce lien expire dans 1 heure. Si tu n'as pas fait cette demande, ignore cet email — ton mot de passe reste inchangé.
          </p>
          ${fallbackLink(actionUrl)}
        `),
      };

    case "magiclink":
      return {
        subject: "Ton lien de connexion — Choppe Ton Exam",
        html: shell(`
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">Connecte-toi à ton compte</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">
            Voici ton lien de connexion. Il est valable 1 heure et ne peut être utilisé qu'une seule fois.
          </p>
          ${ctaButton(actionUrl, "Me connecter")}
          <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
            Si tu n'as pas demandé ce lien, ignore cet email.
          </p>
          ${fallbackLink(actionUrl)}
        `),
      };

    case "email_change_new":
    case "email_change_current":
      return {
        subject: "Confirme le changement d'adresse email — Choppe Ton Exam",
        html: shell(`
          <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">Changement d'adresse email</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">
            Une demande de changement d'adresse email a été effectuée sur ton compte. Clique sur le bouton ci-dessous pour confirmer.
          </p>
          ${ctaButton(actionUrl, "Confirmer le changement")}
          <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
            Si tu n'as pas fait cette demande, contacte-nous immédiatement.
          </p>
          ${fallbackLink(actionUrl)}
        `),
      };
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Verify Standard Webhooks signature (svix)
  const secret = process.env.SUPABASE_AUTH_HOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Hook secret not configured" }, { status: 500 });
  }

  const body = await req.text();

  const webhookHeaders = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
  };

  // Supabase shows the secret as "v1,whsec_XXX" but svix expects "whsec_XXX"
  const normalizedSecret = secret.startsWith("v1,") ? secret.slice(3) : secret;

  let payload: z.infer<typeof HookPayloadSchema>;
  try {
    const wh = new Webhook(normalizedSecret);
    const verified = wh.verify(body, webhookHeaders);
    payload = HookPayloadSchema.parse(verified);
  } catch (err) {
    console.error("[send-email] Verification/parse error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user, email_data } = payload;

  // 3. Build the action URL Supabase will verify
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const actionUrl = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;

  // 4. Resolve first name from metadata, fall back to email prefix
  const firstName =
    (user.user_metadata?.first_name as string | undefined) ??
    user.email.split("@")[0];

  // 5. Build template + send
  const { subject, html } = buildEmailTemplate(
    email_data.email_action_type,
    firstName,
    actionUrl
  );

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const { error: sendError } = await resend.emails.send({
    from: "Choppe Ton Exam <contact@choppetonexam.com>",
    to: user.email,
    subject,
    html,
  });

  if (sendError) {
    console.error("[send-email] Resend error:", sendError);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  // Supabase expects 200 + empty object on success
  return NextResponse.json({});
}
