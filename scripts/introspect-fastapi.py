#!/usr/bin/env python3
"""
FastAPI introspection script.
Extracts routes, Pydantic schemas, and dependencies from the backend.
Outputs markdown to stdout.
Usage: python3 scripts/introspect-fastapi.py > docs/context/api.md
"""
import sys
import os
import json
import subprocess
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

def try_openapi_endpoint() -> dict | None:
    """Try to fetch OpenAPI schema from running FastAPI server."""
    try:
        import urllib.request
        with urllib.request.urlopen("http://localhost:8000/openapi.json", timeout=3) as resp:
            return json.loads(resp.read())
    except Exception:
        return None

def try_import_app() -> dict | None:
    """Try to import FastAPI app and extract OpenAPI schema directly."""
    try:
        backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
        sys.path.insert(0, backend_path)
        os.chdir(backend_path)
        from app.main import app
        return app.openapi()
    except Exception as e:
        return None
    finally:
        os.chdir(os.path.join(os.path.dirname(__file__), ".."))

def parse_routes(openapi: dict) -> list[dict]:
    """Parse routes from OpenAPI schema."""
    routes = []
    paths = openapi.get("paths", {})
    for path, methods in paths.items():
        for method, details in methods.items():
            if method.upper() in ("GET", "POST", "PUT", "PATCH", "DELETE"):
                routes.append({
                    "method": method.upper(),
                    "path": path,
                    "summary": details.get("summary", ""),
                    "description": details.get("description", ""),
                    "tags": details.get("tags", []),
                    "response_model": list(details.get("responses", {}).keys()),
                    "parameters": [p.get("name") for p in details.get("parameters", [])],
                    "request_body": bool(details.get("requestBody")),
                    "security": bool(details.get("security")),
                })
    return routes

def parse_schemas(openapi: dict) -> dict:
    """Parse Pydantic schemas from OpenAPI components."""
    return openapi.get("components", {}).get("schemas", {})

def render_markdown(openapi: dict) -> str:
    """Render OpenAPI schema as markdown documentation."""
    routes = parse_routes(openapi)
    schemas = parse_schemas(openapi)
    title = openapi.get("info", {}).get("title", "API")
    version = openapi.get("info", {}).get("version", "")

    lines = [
        f"# {title} — API Context",
        f"",
        f"> Auto-generated on {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"> Do not edit manually. Regenerate with: `npm run context:api`",
        f"",
        f"## Summary",
        f"- **Version:** {version}",
        f"- **Routes:** {len(routes)}",
        f"- **Schemas:** {len(schemas)}",
        f"",
    ]

    # Routes grouped by tag
    tags: dict[str, list] = {}
    for route in routes:
        tag = route["tags"][0] if route["tags"] else "default"
        tags.setdefault(tag, []).append(route)

    lines.append("## Routes")
    lines.append("")
    for tag, tag_routes in sorted(tags.items()):
        lines.append(f"### {tag.title()}")
        lines.append("")
        lines.append("| Method | Path | Auth | Summary |")
        lines.append("|--------|------|------|---------|")
        for r in tag_routes:
            auth = "🔒" if r["security"] else "🌐"
            summary = r["summary"] or r["description"] or "—"
            lines.append(f"| `{r['method']}` | `{r['path']}` | {auth} | {summary} |")
        lines.append("")

    # Pydantic schemas
    if schemas:
        lines.append("## Pydantic Schemas")
        lines.append("")
        for name, schema in sorted(schemas.items()):
            props = schema.get("properties", {})
            required = schema.get("required", [])
            lines.append(f"### `{name}`")
            if schema.get("description"):
                lines.append(f"{schema['description']}")
            lines.append("")
            if props:
                lines.append("| Field | Type | Required |")
                lines.append("|-------|------|----------|")
                for field, spec in props.items():
                    ftype = spec.get("type", spec.get("$ref", "object").split("/")[-1])
                    req = "✅" if field in required else "—"
                    lines.append(f"| `{field}` | `{ftype}` | {req} |")
                lines.append("")

    return "\n".join(lines)

def main():
    # Try live server first, then import
    openapi = try_openapi_endpoint()
    source = "live server (http://localhost:8000)"

    if not openapi:
        openapi = try_import_app()
        source = "direct import (backend/app/main.py)"

    if not openapi:
        print("# API Context — Introspection Failed")
        print("")
        print("> Could not reach FastAPI server or import app module.")
        print("> Start the backend with `make backend` then rerun `npm run context:api`.")
        sys.exit(0)

    print(f"# Source: {source}", file=sys.stderr)
    print(render_markdown(openapi))

if __name__ == "__main__":
    main()
