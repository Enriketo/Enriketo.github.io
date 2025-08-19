document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const payload = {
      username: username,
      password: password,
      type: "E" // Campo fijo que se envía junto con los datos
    };
  
    fetch('https://hotcompanyapp.company/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      // Aquí puedes manejar la respuesta del backend
      if (data.success) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').textContent = '¡Inicio de sesión exitoso!';
      } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = 'Credenciales incorrectas';
      }
    })
    .catch(error => {
      console.error('Error al conectar con el backend:', error);
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = 'No se pudo conectar con el servidor';
    });
  });
  