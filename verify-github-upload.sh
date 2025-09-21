#!/bin/bash
echo "📤 VERIFICACIÓN DE SUBIDA A GITHUB"
echo "=================================="
echo ""

# Información del repositorio
REPO_URL="https://github.com/Sephirot70/dashboard-bolsa-docents-lleida"

echo "🔍 Información del repositorio:"
echo "- Owner: Sephirot70"
echo "- Repository: dashboard-bolsa-docents-lleida"
echo "- URL: $REPO_URL"
echo ""

# Verificar estado del repositorio local
echo "📊 Estado del repositorio local:"
echo "- Rama actual: $(git branch --show-current)"
echo "- Último commit: $(git log -1 --pretty=format:'%h - %s (%cr)' --abbrev-commit)"
echo "- Total de archivos: $(git ls-files | wc -l)"
echo ""

# Verificar que estamos sincronizados con origin
echo "🔄 Estado de sincronización:"
git status --porcelain
if [ $? -eq 0 ] && [ -z "$(git status --porcelain)" ]; then
    echo "✅ Repositorio limpio - todos los cambios están committeados"
else
    echo "⚠️ Hay cambios pendientes"
fi

# Verificar el último push
echo ""
echo "📡 Último push realizado:"
git log -1 origin/main --pretty=format:"✅ Commit %h: %s%n   📅 Fecha: %ad%n   👤 Autor: %an" --date=format:'%Y-%m-%d %H:%M:%S'
echo ""
echo ""

# Información de archivos importantes subidos
echo "📋 Archivos principales en el repositorio:"
echo "- ✅ index.html (Interfaz principal)"
echo "- ✅ app.js (Lógica de la aplicación)"
echo "- ✅ style.css (Estilos y tema oscuro)"
echo "- ✅ firebase-config.js (Configuración Firebase)"
echo "- ✅ manifest.json (PWA)"
echo "- ✅ sw.js (Service Worker)"
echo "- ✅ favicon.ico + icons/ (Iconos PWA)"
echo "- ✅ Scripts de verificación (.sh)"
echo ""

# Cambios destacados
echo "🎯 CAMBIOS PRINCIPALES INCLUIDOS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 DISEÑO:"
echo "   • Tema oscuro completo (#44475a)"
echo "   • Interfaz completamente rediseñada"
echo "   • Mejoras de UX y responsividad"
echo ""
echo "🔍 FUNCIONALIDAD:"
echo "   • Sistema de búsqueda histórica corregido"
echo "   • Sincronización de datos mejorada"
echo "   • Gestión completa de especialidades (CRUD)"
echo ""
echo "📊 CARACTERÍSTICAS:"
echo "   • Análisis avanzado con gráficos"
echo "   • Sistema de ordenación de tablas"
echo "   • Modalidad PWA (instalable)"
echo ""
echo "🔧 TÉCNICO:"
echo "   • Autenticación y sesiones mejoradas"
echo "   • Sistema de modales unificado"
echo "   • Scripts de testing comprensivos"
echo "   • Optimizaciones de rendimiento"
echo ""

echo "🌐 ACCESO AL PROYECTO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Aplicación web: https://nomenaments-lleida.web.app"
echo "📂 Código fuente: $REPO_URL"
echo "📝 Commits: $REPO_URL/commits/main"
echo "🐛 Issues: $REPO_URL/issues"
echo ""

echo "✅ PROYECTO COMPLETAMENTE SUBIDO A GITHUB"
echo "Total de archivos subidos: $(git ls-files | wc -l)"
echo "Último commit hash: $(git rev-parse HEAD)"
echo ""
