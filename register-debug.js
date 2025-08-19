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
  
    // Mostrar mensaje de carga
    document.getElementById('message').style.color = 'blue';
    document.getElementById('message').textContent = 'Probando diferentes formatos...';
  
    // Probar diferentes formatos de payload
    testDifferentFormats(username, email, password);
  });
  
  async function testDifferentFormats(username, email, password) {
    const targetUrl = 'https://hotcompanyapp.company/api/Employees';
    
    // Diferentes formatos a probar
    const formats = [
      {
        name: 'Formato 1 - Con type',
        payload: { username, email, password, type: "R" }
      },
      {
        name: 'Formato 2 - Sin type',
        payload: { username, email, password }
      },
      {
        name: 'Formato 3 - Con role',
        payload: { username, email, password, role: "user" }
      },
      {
        name: 'Formato 4 - Con userType',
        payload: { username, email, password, userType: "R" }
      },
      {
        name: 'Formato 5 - Con employeeType',
        payload: { username, email, password, employeeType: "R" }
      }
    ];
    
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i];
      console.log(`\n🧪 Probando ${format.name}:`, format.payload);
      
      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(format.payload)
        });
        
        console.log(`📤 ${format.name} - Status:`, response.status, 'Type:', response.type);
        
        if (response.type === 'opaque') {
          console.log(`✅ ${format.name} - Petición enviada (opaque response)`);
          // Continuar probando otros formatos
        } else if (response.ok) {
          console.log(`🎉 ${format.name} - ¡ÉXITO! Status:`, response.status);
          handleSuccess();
          return;
        } else {
          console.log(`❌ ${format.name} - Error:`, response.status, response.statusText);
          
          // Intentar leer el cuerpo del error
          try {
            const errorText = await response.text();
            console.log(`❌ ${format.name} - Detalles:`, errorText);
          } catch (e) {
            console.log(`❌ ${format.name} - No se pudo leer el error`);
          }
        }
      } catch (error) {
        console.log(`❌ ${format.name} - Excepción:`, error.message);
      }
      
      // Pequeña pausa entre intentos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Si todos los formatos fallan, mostrar opciones
    console.log('\n🔍 Todos los formatos probados. Mostrando opciones...');
    showDebugOptions();
  }
  
  function handleSuccess() {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').textContent = '¡Registro exitoso! Redirigiendo al login en 5 segundos...';
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 5000);
  }
  
  function showDebugOptions() {
    document.getElementById('message').style.color = 'orange';
    document.getElementById('message').textContent = 'Se probaron diferentes formatos. Revisa la consola para detalles.';
    
    // Crear contenedor para opciones
    const optionsContainer = document.createElement('div');
    optionsContainer.style.marginTop = '15px';
    optionsContainer.style.textAlign = 'center';
    
    // Botón para simular éxito
    const simulateButton = document.createElement('button');
    simulateButton.textContent = 'Simular Registro Exitoso';
    simulateButton.style.marginRight = '10px';
    simulateButton.style.backgroundColor = '#4CAF50';
    simulateButton.style.padding = '8px 16px';
    simulateButton.style.border = 'none';
    simulateButton.style.borderRadius = '4px';
    simulateButton.style.color = 'white';
    simulateButton.style.cursor = 'pointer';
    
    simulateButton.onclick = function() {
      console.log('🎭 Simulando registro exitoso');
      handleSuccess();
    };
    
    // Botón para intentar con proxy
    const proxyButton = document.createElement('button');
    proxyButton.textContent = 'Intentar con Proxy';
    proxyButton.style.backgroundColor = '#2196F3';
    proxyButton.style.padding = '8px 16px';
    proxyButton.style.border = 'none';
    proxyButton.style.borderRadius = '4px';
    proxyButton.style.color = 'white';
    proxyButton.style.cursor = 'pointer';
    
    proxyButton.onclick = function() {
      console.log('🔄 Intentando con proxy...');
      // Aquí podrías implementar la lógica del proxy
      document.getElementById('message').textContent = 'Función de proxy no implementada en debug mode';
    };
    
    // Agregar botones al contenedor
    optionsContainer.appendChild(simulateButton);
    optionsContainer.appendChild(proxyButton);
    optionsContainer.className = 'options-container';
    
    // Remover contenedor anterior si existe
    const existingContainer = document.querySelector('.options-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    document.querySelector('.login-container').appendChild(optionsContainer);
  }
