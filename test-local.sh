#!/bin/bash

# Servidor de prueba local para Dashboard Bolsa Docents
# Desarrollado por @CarlesMiranda

echo "🌐 Iniciando servidor local de prueba..."

# Verificar si Python está disponible
if command -v python3 &> /dev/null; then
    echo "✅ Usando Python 3"
    echo "📱 Abriendo servidor en: http://localhost:8000"
    echo "🔐 Credenciales: Usuario: Sefirot70 | Contraseña: Absa1234"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Usando Python 2"
    echo "📱 Abriendo servidor en: http://localhost:8000"
    echo "🔐 Credenciales: Usuario: Sefirot70 | Contraseña: Absa1234"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python no está instalado"
    echo "Instala Python para probar localmente o usa otro servidor web"
    exit 1
fi
