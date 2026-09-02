#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "===> Building React Frontend..."
cd frontend/frontend
npm install
npm run build
cd ../..

echo "===> Installing Backend Dependencies..."
pip install -r backend/requirements.txt

echo "===> Build finished successfully!"
