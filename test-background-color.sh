#!/bin/bash
echo "🎨 VERIFICACIÓN DEL CAMBIO DE COLOR DE FONDO - ACTUALIZADO"
echo "=========================================================="
echo ""

# Verificar que el nuevo color está definido
echo "🔍 Verificando definición del nuevo color personalizado:"
grep -n "color-custom-bg.*68.*71.*90" style.css || echo "❌ Color personalizado no encontrado"
echo ""

# Verificar que el background usa el nuevo color
echo "🔍 Verificando que el background usa el nuevo color:"
grep -n "color-background.*color-custom-bg" style.css || echo "❌ Background no actualizado"
echo ""

# Verificar que los colores de superficie fueron ajustados
echo "🔍 Verificando ajustes de colores de superficie:"
echo "- Color de superficie (modales):"
grep -n "color-surface.*rgba.*255.*255.*255.*0.08" style.css || echo "❌ Superficie no ajustada"
echo ""

# Verificar que los elementos del modal de búsqueda fueron actualizados
echo "🔍 Verificando correcciones específicas del modal de búsqueda:"
echo "- Resumen de búsqueda:"
grep -A2 "search-summary {" style.css | grep "color-custom-bg" || echo "❌ Resumen no corregido"
echo "- Tabla de resultados (encabezados):"
grep -A2 "search-results-table th" style.css | grep "rgba.*255.*255.*255.*0.1" || echo "❌ Encabezados de tabla no corregidos"
echo "- Texto de títulos de búsqueda:"
grep -A2 "search-results-header h4" style.css | grep "color-text" || echo "❌ Títulos no corregidos"
echo ""

# Verificar que los colores de texto fueron ajustados
echo "🔍 Verificando ajustes de colores de texto:"
echo "- Color de texto principal:"
grep -n "color-text.*gray-100" style.css || echo "❌ Texto principal no ajustado"
echo "- Color de texto secundario:"
grep -n "color-text-secondary.*gray-300" style.css || echo "❌ Texto secundario no ajustado"
echo ""

echo "✅ VERIFICACIÓN COMPLETADA"
echo ""
echo "🌐 URL del sitio: https://nomenaments-lleida.web.app"
echo ""
echo "📋 CAMBIOS APLICADOS EN ESTA ACTUALIZACIÓN:"
echo "- Modal de búsqueda: Fondo corregido a esquema oscuro"
echo "- Área de resumen: Background actualizado"
echo "- Tabla de resultados: Encabezados y celdas con fondo oscuro"
echo "- Títulos y textos: Colores ajustados para contraste"
echo "- Superficie general: Transparencia ajustada para elementos flotantes"
echo ""
echo "🧪 INSTRUCCIONES DE PRUEBA ESPECÍFICAS:"
echo "1. Abre https://nomenaments-lleida.web.app"
echo "2. Haz login y verifica que el fondo general es gris azulado oscuro"
echo "3. Haz clic en el botón 🔍 para abrir el modal de búsqueda"
echo "4. Verifica que TODO el modal tiene fondo oscuro (no blanco)"
echo "5. Introduce un número de orden (ej: 10524) y busca"
echo "6. Verifica que el área de resultados también tiene fondo oscuro"
echo "7. Comprueba que todos los textos son legibles con buen contraste"
echo ""
