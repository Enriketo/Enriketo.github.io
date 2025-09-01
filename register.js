document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = 'Las contraseñas no coinciden';
      return;
    }
  
    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
  
    const payload = {
      username: username,
      email: email,
      password: password,
      //type: "R" // Campo fijo para registro
    };
  
    // Mostrar mensaje de "procesando"
    document.getElementById('message').style.color = 'blue';
    document.getElementById('message').textContent = 'Procesando registro...';
    
    // Hacer petición a través del Cloudflare Worker para evitar problemas de CORS
    // TODO: Reemplazar con tu URL del worker real
    const workerUrl = 'https://your-worker-name.your-subdomain.workers.dev';
    
    // Alternativa temporal: usar proxy CORS público
    const targetUrl = 'https://hotcompanyapp.company/api/Employees';
    const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${targetUrl}`;
    
    fetch(corsProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      // Log detallado de la respuesta para debugging
      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      if (!response.ok) {
        // Si hay error HTTP, obtener el cuerpo de la respuesta para más detalles
        return response.text().then(errorText => {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Respuesta: ${errorText}`);
        });
      }
      
      return response.json();
    })
    .then(data => {
      // Log de la respuesta exitosa
      console.log('Respuesta exitosa del servidor:', data);
      
      // Aquí puedes manejar la respuesta del backend
      if (data.success) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = data.message || 'Error en el registro';
        console.error('Error en la respuesta del servidor:', data);
      }
    })
    .catch(error => {
      // Log detallado del error para debugging
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      
      // Mostrar mensaje de error en la página
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = `Error: ${error.message}`;
      
      // Mostrar información adicional para debugging
      console.log('Información adicional para debugging:');
      console.log('- Payload enviado:', payload);
      console.log('- URL del endpoint:', targetUrl);
      console.log('- Timestamp del error:', new Date().toISOString());
      
      // El usuario permanece en la página para poder revisar la consola
    });
  });
