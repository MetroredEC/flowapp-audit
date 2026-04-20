#!/bin/bash

# AuditMed Installation Script
# Automatiza la instalación inicial de desarrollo

set -e

echo "🚀 AuditMed - Instalación Automática"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) detectado"

# Frontend setup
echo ""
echo "📦 Configurando Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ node_modules ya existe"
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Creado .env (verificar configuración)"
else
    echo "✓ .env ya existe"
fi

cd ..

# Backend setup
echo ""
echo "🔧 Configurando Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ node_modules ya existe"
fi

# Check wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📥 Instalando Wrangler..."
    npm install -g wrangler
fi

echo "✓ Wrangler $(wrangler --version) disponible"

cd ..

echo ""
echo "✅ Instalación completada"
echo ""
echo "Próximos pasos:"
echo "  1. Frontend:  cd frontend && npm run dev"
echo "  2. Backend:   cd backend && wrangler dev"
echo "  3. Abre:      http://localhost:5173"
echo ""
echo "Para más info, lee SETUP.md"
