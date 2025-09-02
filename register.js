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
      password: password
    };
  
    // Mostrar mensaje de "procesando"
    document.getElementById('message').style.color = 'blue';
    document.getElementById('message').textContent = 'Procesando registro...';
    
    // Intentar petición directa primero
    const targetUrl = 'https://hotcompanyapp.company/api/Employees';
    
    fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      if (!response.ok) {
        return response.text().then(errorText => {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Respuesta: ${errorText}`);
        });
      }
      
      return response.json();
    })
    .then(data => {
      console.log('Respuesta exitosa del servidor:', data);
      
      if (data.success) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
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
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      
      // Si falla por CORS, intentar con proxy
      if (error.message.includes('CORS') || error.message.includes('Forbidden')) {
        console.log('Error de CORS detectado, intentando con proxy...');
        
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        
        fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          console.log('Respuesta del proxy:', response);
          if (!response.ok) {
            throw new Error(`Error del proxy: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Respuesta exitosa del proxy:', data);
          document.getElementById('message').style.color = 'green';
          document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        })
        .catch(proxyError => {
          console.error('Error del proxy:', proxyError);
          document.getElementById('message').style.color = 'red';
          document.getElementById('message').textContent = `Error: ${error.message}. Intenta más tarde.`;
        });
      } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = `Error: ${error.message}`;
      }
      
      console.log('Información adicional para debugging:');
      console.log('- Payload enviado:', payload);
      console.log('- URL del endpoint:', targetUrl);
      console.log('- Timestamp del error:', new Date().toISOString());
    });
  });
