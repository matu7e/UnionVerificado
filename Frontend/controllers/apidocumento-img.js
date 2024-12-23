


// Selección de los elementos del DOM
const fileInputDoc = document.getElementById('file-upload');
const dropAreaDoc = document.getElementById('drop-area');
const fileInputImg = document.getElementById('image-upload');
    const dropAreaImg = document.getElementById('drop-area-img');
// Mostrar el nombre del archivo seleccionado
fileInputDoc.addEventListener('change', function() {
    if (fileInputDoc.files.length > 0) {
        const fileNames = Array.from(fileInputDoc.files).map(file => file.name).join(', ');
        dropAreaDoc.textContent = fileNames;
    }
});




// Asumiendo que ya tienes el token en una variable
const token = localStorage.getItem('authToken');
const decodedToken = jwt_decode(token);
const dni = decodedToken.dni;  



    

   

// Manejar el envío del archivo al servidor
document.getElementById('upload-ficha-button').addEventListener('click', async (event) => {
    // Evita la recarga de la página y la propagación del evento
    event.preventDefault();
    event.stopPropagation();

    const file = fileInputDoc.files[0];
    if (!file) {
        showAlert('aviso', 'Por favor, selecciona un archivo para cargar.');

        return;
    }

    const formData = new FormData();
    formData.append('ficha_medica', file);

    try {
        const response = await fetch(`${API_BASE_URL}/miembros/${dni}/cargaFichaMedica`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            showAlert('error', 'Error al importar Ficha medica.');
            throw new Error('Error al subir el archivo');
            
        } else {
            showAlert('success', 'Ficha médica importada con éxito.');
            fetchUserData(dni)
        }

        const result = await response.json();
        const alertMessage = document.getElementById('alert-message');
        alertMessage.textContent = 'Archivo subido exitosamente';
        alertMessage.className = 'alert alert-success';
        alertMessage.style.display = 'block';
 
        // GET Miembro
        async function fetchUserData(dni) {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/miembros/${dni}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error en la red: ' + response.statusText);
            return response.json();
        }
    } catch (error) {
        const alertMessage = document.getElementById('alert-message');
        alertMessage.textContent = error.message;
        alertMessage.className = 'alert alert-danger';
        alertMessage.style.display = 'block';
    }

    
});


