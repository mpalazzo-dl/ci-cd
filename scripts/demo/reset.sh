#!/usr/bin/env bash
# Reset the blue/green demo: point every alias back at the baseline environment.
# Usage: scripts/demo/reset.sh [baseline-env]   (reads .env for space + token)
set -euo pipefail

cd "$(dirname "$0")/../.."
set -a; . ./.env; set +a

BASELINE="${1:-v_1.0.0-10-2-26}"
API="https://api.contentful.com/spaces/$NEXT_PUBLIC_CF_SPACE"

for alias in dev staging master; do
  version=$(curl -sf -H "Authorization: Bearer $NEXT_CF_MANAGEMENT_TOKEN" "$API/environment_aliases/$alias" | jq -r .sys.version)
  curl -sf -X PUT "$API/environment_aliases/$alias" \
    -H "Authorization: Bearer $NEXT_CF_MANAGEMENT_TOKEN" \
    -H "Content-Type: application/vnd.contentful.management.v1+json" \
    -H "X-Contentful-Version: $version" \
    -d "{\"environment\":{\"sys\":{\"type\":\"Link\",\"linkType\":\"Environment\",\"id\":\"$BASELINE\"}}}" >/dev/null
  echo "alias $alias -> $BASELINE"
done

echo
echo "Aliases reset. Also reset contentful/release.json on dev/staging/main so the pipeline matches,"
echo "then re-stage Loop 2 by bumping release.json on dev to the new environment."
