#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       AuditMed - Setup de Instalación                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js no está instalado${NC}"
    echo "Descargalo desde: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
echo ""

# Install backend
echo -e "${YELLOW}Instalando Backend...${NC}"
cd backend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error instalando dependencias del backend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend instalado${NC}"
cd ..
echo ""

# Install frontend
echo -e "${YELLOW}Instalando Frontend...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error instalando dependencias del frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend instalado${NC}"
cd ..
echo ""

# Create .env file
echo -e "${YELLOW}Creando archivo .env...${NC}"
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}IMPORTANTE: Actualiza los valores en frontend/.env${NC}"
else
    echo -e "${GREEN}✓ .env ya existe${NC}"
fi
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       ✓ Instalación completada                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo ""
echo "1. Backend (Cloudflare Workers):"
echo "   cd backend"
echo "   npm run dev              # Desarrollo local"
echo "   wrangler publish         # Deploy a producción"
echo ""
echo "2. Frontend (GitHub Pages):"
echo "   cd frontend"
echo "   npm run dev              # Servidor de desarrollo"
echo "   npm run build            # Build para producción"
echo "   npm run deploy           # Deploy a GitHub Pages"
echo ""
echo "3. Configurar Cloudflare:"
echo "   - Crear D1 database"
echo "   - Ejecutar migraciones SQL"
echo "   - Configurar R2 bucket"
echo "   - Configurar KV namespace"
echo ""
echo "4. Configurar GitHub:"
echo "   - Habilitar GitHub Pages"
echo "   - Configurar secrets en Actions"
echo ""
echo -e "${YELLOW}Para más información, lee el README.md${NC}"
