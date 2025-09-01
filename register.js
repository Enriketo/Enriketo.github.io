document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // ... (tu código de validación de contraseñas)

  const payload = {
    username: username,
    email: email,
    password: password
  };

  document.getElementById('message').style.color = 'blue';
  document.getElementById('message').textContent = 'Procesando registro...';
    
  const targetUrl = 'https://hotcompanyapp.company/api/Employees';

  fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    // Si la respuesta no es OK (2xx), lanza un error.
    if (!response.ok) {
      return response.json().then(errorData => {
        // Asumiendo que el servidor devuelve un JSON de error
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }).catch(() => {
        // Si no es un JSON, lanza un error genérico
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      });
    }
    // Si la respuesta es OK, devuelve el JSON.
    return response.json();
  })
  .then(data => {
    // ✅ VERIFICACIÓN CORREGIDA
    // Ahora verificamos si el objeto 'data' tiene una propiedad 'user'.
    if (data.user) {
      console.log('Usuario registrado exitosamente:', data.user);
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      // Si la respuesta es 2xx pero no tiene el objeto 'user', es un error de lógica.
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = data.message || 'Error en el registro';
      console.error('Error en la respuesta del servidor:', data);
    }
  })
  .catch(error => {
    console.error('Error completo:', error);
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').textContent = `Error: ${error.message}.`;
  });
});