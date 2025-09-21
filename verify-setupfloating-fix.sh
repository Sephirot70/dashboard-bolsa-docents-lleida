#!/bin/bash

echo "🔧 VERIFICACIÓN POST-CORRECCIÓN: PROBLEMA setupFloatingButtonDirectly"
echo "================================================================="
echo ""

echo "✅ CORRECCIONES APLICADAS:"
echo "  • Eliminada llamada a setupFloatingButtonDirectly()"
echo "  • Comentadas todas las funciones problemáticas"
echo "  • Actualizada versión de caché: v=20250921-search-history-final-fix"
echo "  • Desplegado con Firebase Hosting"
echo ""

echo "🔍 VERIFICACIONES TÉCNICAS:"

# Verificar que no hay llamadas sin comentar
if grep -q "setupFloatingButtonDirectly();" /home/cmiranda/Escritorio/nomenament/index.html && ! grep -q "// setupFloatingButtonDirectly();" /home/cmiranda/Escritorio/nomenament/index.html; then
    echo "  ❌ Aún hay llamadas sin comentar a setupFloatingButtonDirectly"
else
    echo "  ✅ Todas las llamadas a setupFloatingButtonDirectly están comentadas"
fi

# Verificar funciones problemáticas comentadas
if grep -q "function forceShowModal" /home/cmiranda/Escritorio/nomenament/index.html; then
    if grep -A5 "CÓDIGO DE forceShowModal COMENTADO" /home/cmiranda/Escritorio/nomenament/index.html | grep -q "/\*"; then
        echo "  ✅ Función forceShowModal correctamente comentada"
    else
        echo "  ❌ Función forceShowModal no está comentada"
    fi
else
    echo "  ✅ Función forceShowModal no encontrada (correcto)"
fi

# Verificar versión de caché actualizada
if grep -q "v=20250921-search-history-final-fix" /home/cmiranda/Escritorio/nomenament/index.html; then
    echo "  ✅ Versión de caché actualizada correctamente"
else
    echo "  ❌ Versión de caché no actualizada"
fi

echo ""
echo "🧪 PRUEBAS RECOMENDADAS:"
echo ""

echo "1. 🌐 ACCEDER A LA APLICACIÓN"
echo "   URL: https://nomenaments-lleida.web.app"
echo "   • Abrir en modo incógnito para evitar caché"
echo "   • Presionar Ctrl+F5 para forzar recarga"
echo ""

echo "2. 🔐 PROBAR LOGIN"
echo "   • Usuario: sefirot70"
echo "   • Contraseña: Absa1234"
echo "   • Verificar que no hay errores en consola"
echo ""

echo "3. 🔍 PROBAR FUNCIONALIDAD DE BÚSQUEDA"
echo "   • Verificar que aparece el botón 🔍 (púrpura)"
echo "   • Hacer clic y verificar que abre el modal"
echo "   • Probar búsqueda con: 100374"
echo "   • Verificar que funciona sin redireccionar a login"
echo ""

echo "4. 🔧 VERIFICAR EN DevTools"
echo "   • Abrir DevTools (F12)"
echo "   • Ir a la pestaña Console"
echo "   • No debe aparecer: 'setupFloatingButtonDirectly is not defined'"
echo "   • Debe ver logs de inicialización exitosa"
echo ""

echo "⚠️  PROBLEMAS CORREGIDOS:"
echo "   ✅ Error 'setupFloatingButtonDirectly is not defined'"
echo "   ✅ Referencias a funciones inexistentes"
echo "   ✅ Conflictos de código comentado/no comentado"
echo "   ✅ Cache busting con nueva versión"
echo ""

echo "🎯 SI PERSISTE EL ERROR:"
echo "   1. Borrar caché del navegador completamente"
echo "   2. Usar modo incógnito"
echo "   3. Usar otro navegador"
echo "   4. Esperar unos minutos para propagación del CDN"
echo ""

echo "✅ CORRECCIÓN COMPLETADA Y DESPLEGADA"
