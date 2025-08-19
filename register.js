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
      type: "R" // Campo fijo para registro
    };
  
    fetch('https://hotcompanyapp.company/api/Employees', {
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
        document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login...';
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').textContent = data.message || 'Error en el registro';
      }
    })
    .catch(error => {
      console.error('Error al conectar con el backend:', error);
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = 'No se pudo conectar con el servidor';
    });
  });
