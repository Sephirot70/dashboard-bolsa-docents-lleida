#!/bin/bash

# Script de despliegue para Dashboard Bolsa Docents
# Desarrollado por @CarlesMiranda

echo "🚀 Iniciando despliegue de Dashboard Bolsa Docents..."

# Verificar que Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado."
    echo "Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar que estamos logueados en Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Necesitas hacer login en Firebase..."
    firebase login
fi

# Verificar configuración
if [ ! -f "firebase-config.js" ]; then
    echo "❌ No se encontró firebase-config.js"
    echo "Asegúrate de configurar tu proyecto Firebase primero."
    exit 1
fi

# Verificar que la configuración no tenga valores por defecto
if grep -q "TU_API_KEY" firebase-config.js; then
    echo "❌ firebase-config.js contiene valores por defecto."
    echo "Actualiza la configuración con los datos de tu proyecto Firebase."
    exit 1
fi

echo "✅ Configuración verificada"

# Desplegar
echo "📤 Desplegando a Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "🎉 ¡Despliegue exitoso!"
    echo "Tu aplicación está disponible en:"
    firebase hosting:channel:list | grep -E "live|hosting" | head -1
else
    echo "❌ Error en el despliegue"
    exit 1
fi
