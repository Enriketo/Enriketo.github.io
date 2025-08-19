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
        if (xhr.status === 200 || xhr.status === 204) {
          // Éxito - incluso si es 204 (No Content)
          document.getElementById('message').style.color = 'green';
          document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        } else {
          // Error en la respuesta
          document.getElementById('message').style.color = 'red';
          document.getElementById('message').textContent = 'Error en el registro. Código: ' + xhr.status;
        }
      }
    };
    
    xhr.onerror = function() {
      // Si falla XMLHttpRequest, intentar con fetch y proxy
      console.log('XMLHttpRequest falló, intentando con proxy...');
      tryWithProxy(payload);
    };
    
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
    
    for (let proxy of proxies) {
      try {
        const response = await fetch(proxy + encodeURIComponent(targetUrl), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          document.getElementById('message').style.color = 'green';
          document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
          return;
        }
      } catch (error) {
        console.log('Proxy falló:', proxy, error);
        continue;
      }
    }
    
    // Si todos los proxies fallan, mostrar mensaje de error
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').textContent = 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }
