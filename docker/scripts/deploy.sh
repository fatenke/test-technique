#!/bin/bash

set -euo pipefail

echo "🚀 Deploying NoteApp (production)..."

# aller dans le dossier du projet
cd "$(dirname "$0")/.."

echo "📦 Pull latest images from GHCR..."
docker compose -f docker-compose.prod.yml pull

echo "🔄 Restart containers..."
docker compose -f docker-compose.prod.yml up -d

echo "🩺 Checking status..."
docker ps

echo "✅ Deployment finished successfully!"