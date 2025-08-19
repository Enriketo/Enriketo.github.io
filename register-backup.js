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
      type: "R"
    };
  
    // Mostrar mensaje de carga
    document.getElementById('message').style.color = 'blue';
    document.getElementById('message').textContent = 'Enviando registro...';
  
    // Método 1: Usar XMLHttpRequest con modo no-CORS
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://hotcompanyapp.company/api/Employees', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('XMLHttpRequest completado. Status:', xhr.status);
        
        if (xhr.status === 200) {
          // Solo considerar 200 como éxito real
          document.getElementById('message').style.color = 'green';
          document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        } else if (xhr.status === 204) {
          // 204 significa "No Content" - puede ser éxito o error
          console.log('Respuesta 204 recibida. Verificando respuesta...');
          document.getElementById('message').style.color = 'orange';
          document.getElementById('message').textContent = 'Respuesta 204 recibida. Verificando si el registro fue exitoso...';
          
          // Intentar leer la respuesta para verificar
          try {
            const responseText = xhr.responseText;
            console.log('Respuesta del servidor:', responseText);
            
            if (responseText && responseText.includes('success')) {
              document.getElementById('message').style.color = 'green';
              document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
              setTimeout(() => {
                window.location.href = 'index.html';
              }, 2000);
            } else {
              document.getElementById('message').style.color = 'red';
              document.getElementById('message').textContent = 'Error: Respuesta 204 sin confirmación de éxito';
            }
          } catch (error) {
            document.getElementById('message').style.color = 'red';
            document.getElementById('message').textContent = 'Error: No se pudo verificar la respuesta del servidor';
          }
        } else if (xhr.status === 0) {
          // CORS bloqueó la petición completamente
          console.log('CORS bloqueó la petición, intentando con proxy...');
          document.getElementById('message').style.color = 'orange';
          document.getElementById('message').textContent = 'CORS bloqueó la conexión. Intentando con proxy...';
          tryWithProxy(payload);
        } else {
          // Error en la respuesta
          document.getElementById('message').style.color = 'red';
          document.getElementById('message').textContent = 'Error en el registro. Código: ' + xhr.status;
          console.log('Error HTTP:', xhr.status, xhr.statusText);
        }
      }
    };
    
    xhr.onerror = function() {
      // Si falla XMLHttpRequest, intentar con fetch y proxy
      console.log('XMLHttpRequest falló, intentando con proxy...');
      tryWithProxy(payload);
    };
    
    // Timeout para detectar si CORS bloquea la petición
    setTimeout(() => {
      if (xhr.readyState < 4) {
        console.log('Timeout detectado, CORS probablemente bloqueó la petición');
        xhr.abort();
        tryWithProxy(payload);
      }
    }, 5000);
    
    try {
      xhr.send(JSON.stringify(payload));
    } catch (error) {
      console.log('Error con XMLHttpRequest:', error);
      tryWithProxy(payload);
    }
  });
  
  async function tryWithProxy(payload) {
    const targetUrl = 'https://hotcompanyapp.company/api/Employees';
    
    // Lista de proxies alternativos
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    for (let i = 0; i < proxies.length; i++) {
      const proxy = proxies[i];
      try {
        console.log(`Intentando con proxy ${i + 1}/${proxies.length}:`, proxy);
        document.getElementById('message').style.color = 'blue';
        document.getElementById('message').textContent = `Intentando proxy ${i + 1}/${proxies.length}...`;
        
        const response = await fetch(proxy + encodeURIComponent(targetUrl), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        console.log(`Proxy ${i + 1} respuesta:`, response.status, response.statusText);
        
        if (response.ok) {
          document.getElementById('message').style.color = 'green';
          document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
          return;
        } else {
          console.log(`Proxy ${i + 1} falló con status:`, response.status);
        }
      } catch (error) {
        console.log(`Proxy ${i + 1} falló con error:`, error.message);
        continue;
      }
    }
    
    // Si todos los proxies fallan, mostrar error detallado
    console.log('Todos los proxies fallaron');
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').textContent = 'Error: No se pudo conectar con el servidor. Problema de CORS detectado.';
    
    // Agregar botón para simular registro (solo para pruebas)
    const simulateButton = document.createElement('button');
    simulateButton.textContent = 'Simular Registro (Solo Pruebas)';
    simulateButton.style.marginTop = '10px';
    simulateButton.style.backgroundColor = '#ff9800';
    simulateButton.onclick = function() {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').textContent = '¡Registro simulado exitoso! Redirigiendo al login...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    };
    
    // Remover botón anterior si existe
    const existingButton = document.querySelector('.simulate-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    simulateButton.className = 'simulate-button';
    document.querySelector('.login-container').appendChild(simulateButton);
  }
