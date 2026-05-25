#!/bin/sh

# Exit on first failure.
set -e

# Render runtime env into /app/public/env.js so the client picks it up
# via `window.__ENV__` (see `lib/iblai/config.ts`). NEXT_PUBLIC_* vars
# that are build-time only would be baked at build time — courseai
# currently has none of those.
ENV_JS_PATH=/app/public/env.js

cat <<EOF > $ENV_JS_PATH
window.__ENV__ = {
  NODE_ENV: "${NODE_ENV}",
  NEXT_PUBLIC_API_BASE_URL: "${NEXT_PUBLIC_API_BASE_URL}",
  NEXT_PUBLIC_AUTH_URL: "${NEXT_PUBLIC_AUTH_URL}",
  NEXT_PUBLIC_BASE_WS_URL: "${NEXT_PUBLIC_BASE_WS_URL}",
  NEXT_PUBLIC_PLATFORM_BASE_DOMAIN: "${NEXT_PUBLIC_PLATFORM_BASE_DOMAIN}",
  NEXT_PUBLIC_MAIN_TENANT_KEY: "${NEXT_PUBLIC_MAIN_TENANT_KEY}",
  NEXT_PUBLIC_MFE_URL: "${NEXT_PUBLIC_MFE_URL}",
  NEXT_PUBLIC_SKILLSAI_URL: "${NEXT_PUBLIC_SKILLSAI_URL}",
};
EOF

echo "env.js generated at $ENV_JS_PATH"

exec "$@"
