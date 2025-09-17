#!/bin/bash

# Script para conectar con GitHub y subir el proyecto
# Desarrollado por @CarlesMiranda

echo "🚀 Configurando conexión con GitHub..."

# Configurar el repositorio remoto
GITHUB_USER="Sephirot70"
REPO_NAME="dashboard-bolsa-docents-lleida"

echo "📡 Añadiendo repositorio remoto..."
git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git

echo "📤 Subiendo código a GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "🎉 ¡Proyecto subido exitosamente a GitHub!"
    echo "🌐 Repositorio disponible en: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Ve a https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo "2. Asegúrate de que el repositorio sea público"
    echo "3. Configura GitHub Pages si deseas (opcional)"
    echo "4. Procede con el despliegue a Firebase"
else
    echo "❌ Error al subir a GitHub"
    echo "🔧 Posibles soluciones:"
    echo "1. Asegúrate de que el repositorio existe en GitHub"
    echo "2. Verifica tus credenciales de GitHub"
    echo "3. Crea el repositorio manualmente en GitHub si no existe"
fi
