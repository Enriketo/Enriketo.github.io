# Configuración del Cloudflare Worker para CORS

## Paso 1: Crear cuenta en Cloudflare Workers

1. Ve a https://workers.cloudflare.com/
2. Haz clic en "Sign up" o "Sign in"
3. Crea una cuenta gratuita (no requiere tarjeta de crédito)

## Paso 2: Crear un nuevo Worker

1. En el dashboard de Cloudflare Workers, haz clic en "Create a Worker"
2. Dale un nombre como "cors-proxy-register"
3. Haz clic en "Deploy"

## Paso 3: Configurar el código del Worker

1. En el editor que se abre, borra todo el código existente
2. Copia y pega el contenido del archivo `cloudflare-worker.js`
3. Haz clic en "Save and deploy"

## Paso 4: Obtener la URL del Worker

1. Después del deploy, verás una URL como: `https://cors-proxy-register.your-subdomain.workers.dev`
2. Copia esta URL - la necesitarás para el siguiente paso

## Paso 5: Actualizar el código del frontend

Una vez que tengas la URL del Worker, actualiza el archivo `register-backup.js` para usar la nueva URL.

## Notas importantes:

- El Worker es completamente gratuito para hasta 100,000 requests por día
- No requiere configuración adicional
- Maneja automáticamente los headers CORS
- Convierte respuestas 204 en 200 con JSON de éxito

## Solución de problemas:

Si el Worker no funciona:
1. Verifica que el código se haya copiado correctamente
2. Asegúrate de que `ALLOWED_ORIGIN` coincida con tu dominio de GitHub Pages
3. Revisa los logs del Worker en el dashboard de Cloudflare
