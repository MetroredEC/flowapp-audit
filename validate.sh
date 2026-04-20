#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AuditMed - Project Validation Script              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

PASSED=0
FAILED=0

# Check Node.js
echo -e "${YELLOW}Verificando Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Node.js no instalado${NC}"
    ((FAILED++))
fi

# Check npm
echo -e "${YELLOW}Verificando npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ npm no instalado${NC}"
    ((FAILED++))
fi

# Check Git
echo -e "${YELLOW}Verificando Git...${NC}"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ ${GIT_VERSION}${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Git no instalado${NC}"
    ((FAILED++))
fi

# Check directory structure
echo ""
echo -e "${YELLOW}Verificando estructura de directorios...${NC}"

DIRS=("backend" "frontend" ".github")
for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ $dir/ existe${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ $dir/ no encontrado${NC}"
        ((FAILED++))
    fi
done

# Check important files
echo ""
echo -e "${YELLOW}Verificando archivos importantes...${NC}"

FILES=(
    "backend/wrangler.toml"
    "backend/package.json"
    "backend/src/index.ts"
    "frontend/package.json"
    "frontend/vite.config.ts"
    "frontend/.env.example"
    "setup.sh"
    "README.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ $file no encontrado${NC}"
        ((FAILED++))
    fi
done

# Check backend dependencies
echo ""
echo -e "${YELLOW}Verificando dependencias del backend...${NC}"
if [ -f "backend/package.json" ]; then
    if grep -q "wrangler" "backend/package.json"; then
        echo -e "${GREEN}✓ wrangler configurado${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ wrangler no encontrado${NC}"
        ((FAILED++))
    fi
fi

# Check frontend dependencies
echo ""
echo -e "${YELLOW}Verificando dependencias del frontend...${NC}"
if [ -f "frontend/package.json" ]; then
    if grep -q "react" "frontend/package.json"; then
        echo -e "${GREEN}✓ React configurado${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ React no encontrado${NC}"
        ((FAILED++))
    fi
fi

# Check database schema
echo ""
echo -e "${YELLOW}Verificando schema de base de datos...${NC}"
if [ -f "backend/migrations/0001_init.sql" ]; then
    if grep -q "CREATE TABLE" "backend/migrations/0001_init.sql"; then
        echo -e "${GREEN}✓ SQL schema encontrado${NC}"
        ((PASSED++))
    fi
fi

# Check documentation
echo ""
echo -e "${YELLOW}Verificando documentación...${NC}"

DOCS=("README.md" "QUICKSTART.md" "DEPLOYMENT.md" "TESTING.md" "KPIs.md" "CREDENTIALS.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓ $doc${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ $doc no encontrado${NC}"
    fi
done

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ RESULTADO DE LA VALIDACIÓN                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${GREEN}✓ Verificaciones pasadas: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Verificaciones fallidas: $FAILED${NC}"
else
    echo -e "${GREEN}✗ Verificaciones fallidas: 0${NC}"
fi

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║ ✓ PROYECTO VALIDADO CORRECTAMENTE                     ║${NC}"
    echo -e "${GREEN}║ Estás listo para ejecutar: bash setup.sh              ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║ ✗ Hay problemas en el proyecto                         ║${NC}"
    echo -e "${RED}║ Revisa los errores arriba                              ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
