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
  
    // Intentar con diferentes métodos
    tryDirectConnection(payload);
  });
  
  async function tryDirectConnection(payload) {
    const targetUrl = 'https://hotcompanyapp.company/api/Employees';
    
    try {
      console.log('Intentando conexión directa...');
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Respuesta directa:', response.status);
      
      if (response.ok) {
        handleSuccess();
        return;
      } else if (response.status === 204) {
        // 204 significa éxito pero sin contenido
        handleSuccess();
        return;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('Conexión directa falló:', error.message);
      tryProxyConnection(payload);
    }
  }
  
  async function tryProxyConnection(payload) {
    const targetUrl = 'https://hotcompanyapp.company/api/Employees';
    
    // Usar un proxy más confiable
    const proxyUrl = 'https://corsproxy.io/?';
    
    try {
      console.log('Intentando con proxy...');
      document.getElementById('message').style.color = 'blue';
      document.getElementById('message').textContent = 'Intentando con proxy...';
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Respuesta proxy:', response.status);
      
      if (response.ok) {
        handleSuccess();
        return;
      } else {
        throw new Error(`Proxy HTTP ${response.status}`);
      }
    } catch (error) {
      console.log('Proxy falló:', error.message);
      showFallbackOptions();
    }
  }
  
  function handleSuccess() {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }
  
  function showFallbackOptions() {
    console.log('Todos los métodos fallaron');
    document.getElementById('message').style.color = 'orange';
    document.getElementById('message').textContent = 'No se pudo conectar con el servidor. Problema de CORS detectado.';
    
    // Crear contenedor para opciones
    const optionsContainer = document.createElement('div');
    optionsContainer.style.marginTop = '15px';
    optionsContainer.style.textAlign = 'center';
    
    // Botón para simular registro
    const simulateButton = document.createElement('button');
    simulateButton.textContent = 'Simular Registro (Pruebas)';
    simulateButton.style.marginRight = '10px';
    simulateButton.style.backgroundColor = '#ff9800';
    simulateButton.style.padding = '8px 16px';
    simulateButton.style.border = 'none';
    simulateButton.style.borderRadius = '4px';
    simulateButton.style.color = 'white';
    simulateButton.style.cursor = 'pointer';
    
    simulateButton.onclick = function() {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').textContent = '¡Registro simulado exitoso! Redirigiendo al login...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    };
    
    // Botón para intentar de nuevo
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Intentar de Nuevo';
    retryButton.style.backgroundColor = '#2196F3';
    retryButton.style.padding = '8px 16px';
    retryButton.style.border = 'none';
    retryButton.style.borderRadius = '4px';
    retryButton.style.color = 'white';
    retryButton.style.cursor = 'pointer';
    
    retryButton.onclick = function() {
      // Limpiar mensajes y botones
      document.getElementById('message').textContent = '';
      const existingContainer = document.querySelector('.options-container');
      if (existingContainer) {
        existingContainer.remove();
      }
      // Intentar registro de nuevo
      document.getElementById('registerForm').dispatchEvent(new Event('submit'));
    };
    
    // Agregar botones al contenedor
    optionsContainer.appendChild(simulateButton);
    optionsContainer.appendChild(retryButton);
    optionsContainer.className = 'options-container';
    
    // Remover contenedor anterior si existe
    const existingContainer = document.querySelector('.options-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    document.querySelector('.login-container').appendChild(optionsContainer);
  }
