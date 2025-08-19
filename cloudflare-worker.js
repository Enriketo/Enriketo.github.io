// Cloudflare Worker para proxy CORS
// Deploy este código en https://workers.cloudflare.com/

const ALLOWED_ORIGIN = 'https://enriketo.github.io';
const TARGET_URL = 'https://hotcompanyapp.company/api/Employees';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Reenviar la petición al endpoint original
    const url = new URL(request.url);
    const targetUrl = TARGET_URL;
    
    // Preparar headers para la petición al backend
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Copiar headers relevantes del request original
    const contentType = request.headers.get('Content-Type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    // Crear la petición al backend
    const backendRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.body : null
    });

    // Hacer la petición al backend
    const response = await fetch(backendRequest);
    
    // Crear nueva respuesta con headers CORS
    const newHeaders = new Headers(response.headers);
    
    // Agregar headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    // Si el backend devuelve 204, convertir a 200 con mensaje de éxito
    let status = response.status;
    let body = response.body;
    
    if (response.status === 204) {
      status = 200;
      body = JSON.stringify({ 
        success: true, 
        message: 'Registro exitoso',
        originalStatus: 204 
      });
      newHeaders.set('Content-Type', 'application/json');
    }

    return new Response(body, {
      status: status,
      headers: newHeaders
    });

  } catch (error) {
    console.error('Error en el worker:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
