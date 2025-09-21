#!/bin/bash

# Script de despliegue para Dashboard Bolsa Docents
# Desarrollado por @CarlesMiranda

echo "🚀 Iniciando despliegue de Dashboard Bolsa Docents..."
echo "🔧 Fix aplicado: Botón de login corregido"

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

echo "✅ Configuración verificada"

# Desplegar
echo "📤 Desplegando a Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Despliegue exitoso!"
    echo "🌐 Tu aplicación está disponible en: https://nomenaments-lleida.web.app"
    echo ""
    echo "🔧 Cambios desplegados:"
    echo "   ✅ Botón de login corregido (no más estado 'Verificando' infinito)"
    echo "   ✅ Sistema de autenticación mejorado con SecurityManager"
    echo "   ✅ Gestión de errores robusta con timeout de seguridad"
    echo "   ✅ Reset automático del botón en caso de error"
    echo ""
    echo "🧪 Para probar:"
    echo "   • Usuario: Sefirot70 (o sefirot70)"
    echo "   • Contraseña: Absa1234"
    echo ""
else
    echo "❌ Error en el despliegue"
    exit 1
fi
