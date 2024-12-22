// Validación del formulario
function validateForm(event) {
    event.preventDefault(); // Evita que el formulario se envíe hasta que sea válido
    let isValid = true;

    // Función auxiliar para mostrar/ocultar mensajes de error
    function toggleError(input, errorElement, condition) {
        if (condition) {
            input.classList.add('is-invalid');
            errorElement.style.display = 'block';
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            errorElement.style.display = 'none';
        }
    }

    // Asumiendo que ya tienes el token en una variable
const token = localStorage.getItem('authToken');
const decodedToken = jwt_decode(token);

// Validación de datos personales
const firstName = document.getElementById('firstName');
const firstNameError = document.getElementById('firstNameError');
toggleError(firstName,firstNameError,!firstName.value.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,16}$/));
  

const lastName = document.getElementById('lastName');
const lastNameError = document.getElementById('lastNameError');
toggleError(lastName, lastNameError, !lastName.value.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,16}$/));

const dni = document.getElementById('dni');
const dniError = document.getElementById('dniError');
toggleError(dni, dniError, !dni.value.match(/^\d{8,11}$/));

const dob = document.getElementById('dob');
const dobError = document.getElementById('dobError');
toggleError(dob, dobError, !dob.value);

const bloodGroup = document.getElementById('bloodGroup');
const bloodGroupError = document.getElementById('bloodGroupError');
toggleError(bloodGroup, bloodGroupError, !bloodGroup.value.match(/^(A|B|AB|O)[+-]$/));

const phone = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');
toggleError(phone, phoneError, !phone.value.match(/^\d{8,12}$/));

const email = document.getElementById('email');
const emailError = document.getElementById('emailError');
toggleError(email, emailError, !email.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/));

const address = document.getElementById('address');
const addressError = document.getElementById('addressError');
toggleError(address, addressError, !address.value);

// Validación de datos del tutor
const tutorDNI = document.getElementById('tutorDNI');
const tutorDNIError = document.getElementById('tutorDNIError');
toggleError(tutorDNI, tutorDNIError, !tutorDNI.value.match(/^\d{8,11}$/));

const tutorFirstName = document.getElementById('tutorFirstName');
const tutorFirstNameError = document.getElementById('tutorFirstNameError');
toggleError(tutorFirstName, tutorFirstNameError, !tutorFirstName.value.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{4,16}$/));

const tutorLastName = document.getElementById('tutorLastName');
const tutorLastNameError = document.getElementById('tutorLastNameError');
toggleError(tutorLastName, tutorLastNameError, !tutorLastName.value.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{4,16}$/));

const relationship = document.getElementById('relationship');
const relationshipError = document.getElementById('relationshipError');
toggleError(relationship, relationshipError, !relationship.value.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{4,16}$/));

const tutorPhone = document.getElementById('tutorPhone');
const tutorPhoneError = document.getElementById('tutorPhoneError');
toggleError(tutorPhone, tutorPhoneError, !tutorPhone.value.match(/^\d{8,12}$/));


    if (isValid) {
        // Llamada para actualizar datos del alumno
        updateAlumno(dni.value);

        // Llamada para subir la imagen del alumno
        uploadImage(dni.value);

        // Llamada para actualizar datos del tutor
        updateTutor(tutorDNI.value);

        
    }
}



    
   



// Actualiza los datos del alumno
async function updateAlumno(dni) {
    const token = localStorage.getItem('authToken');
    const data = {
        email: document.getElementById('email').value,
        direccion: document.getElementById('address').value,
        dni_tutor: document.getElementById('tutorDNI').value,
        id_escuela: document.getElementById('escuela').value,
        id_cinto: document.getElementById('cinto').value,
        telefono: document.getElementById('phone').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/miembros/${dni}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            ,
            body: JSON.stringify(data)  
        });

        if (response.ok) {
            
            handleAlerts('success', 'Datos del alumno actualizados con éxito.');

        } else {
            handleAlerts('error', 'Ocurrió un error al actualizar intente de nuevo mas tarde.');
        }
    } catch (error) {
        console.error('Error al actualizar datos del alumno:', error);
        handleAlerts('error', 'Ocurrió un error al actualizar intente de nuevo mas tarde.');
    }
}


// Sube la imagen del alumno
async function uploadImage(dni) {
    const imageInput = document.getElementById('image-upload'); // Se cambió a 'image-upload'
    const formData = new FormData();
    formData.append('imagen', imageInput.files[0]); // Asegurarse de que la imagen esté seleccionada

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/miembros/${dni}/cargaImagen`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

         if (response.ok) {
             handleAlerts('success', 'Imagen perfil actualizada.');
        // } else {
            // alert('Error al subir la imagen');
         }
    } catch (error) {
        // console.error('Error al subir la imagen:', error);
        // alert('Ocurrió un error al subir la imagen');
    }
}

// Actualiza los datos del tutor
async function updateTutor(tutorDNI) {
    const token = localStorage.getItem('authToken');
    const tutorData = {
        dni_tutor: tutorDNI,
        nombre: document.getElementById('tutorFirstName').value,
        apellido: document.getElementById('tutorLastName').value,
        telefono: document.getElementById('tutorPhone').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/tutores/${tutorDNI}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tutorData)
        });

        if (response.ok) {
            handleAlerts('success', 'Datos del tutor actualizados con éxito.');
        } else {
            handleAlerts('error', 'Ocurrió un error al actualizar intente de nuevo mas tarde.');
        }
    } catch (error) {
        console.error('Error al actualizar datos del tutor:', error);
        handleAlerts('error', 'Ocurrió un error al actualizar intente de nuevo mas tarde.');
    }
    fetchUserData(dni)
    
}
// Manejo de alertas
function handleAlerts(type, message = null) {
    // Ocultar alertas existentes
    document.getElementById('alert-error').style.display = 'none';
    document.getElementById('alert-success').style.display = 'none';
    document.getElementById('alert-aviso').style.display = 'none';

    // Si se proporciona un mensaje, mostrar la alerta correspondiente
    if (message) {
        const alert = document.getElementById(`alert-${type}`);
        alert.textContent = message;
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000); // Ocultar alerta después de 3 segundos
    }
}

// Asigna el evento 'submit' al formulario
document.getElementById('user-form').addEventListener('submit', validateForm);
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