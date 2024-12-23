const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Mostrar el loader
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        redirectToLogin('Token no encontrado.');
        return;
    }

    try {
        const { dni, estado: userStatus, rol } = jwt_decode(token);
        if (!userStatus) {
            redirectToPayment();
            return;
        }


        

        fetchUserData(dni, token)
            .then(data => {
                handleUserData(data, token, rol);
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                loader.style.display = 'none'; // Ocultar el loader en caso de error
            });

        // Evento para generar el carnet
        const generarCarnetButton = document.getElementById('generarCarnetBtn');
        generarCarnetButton.addEventListener('click', () => {
            generatePDF(dni, token); // Llamar a la función para generar el PDF
        });

    } catch (error) {
        console.error('Error al decodificar el token:', error);
        loader.style.display = 'none'; // Ocultar el loader en caso de error
    }
});




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



// Manejo de datos de usuario
function handleUserData(data, token, rol) {
    const loader = document.getElementById('loader');
    loader.style.display = 'none'; // Ocultar el loader

    if (!data.activo) {
        handleAlerts('error', 'Usuario inactivo.');
        redirectToLogin('Usuario inactivo.');
        return;
    }

    populateUserInfo(data);
    handleFichaMedica(data);
    handleTutorData(data.dni_tutor);
    cargarCintos(data.cinto);
    cargarEscuelas(data.escuela);
    construirMenu(rol);
    actualizarDatos(data)
}

function populateUserInfo(data) {
    document.getElementById('firstName').value = data.nombre;
    document.getElementById('lastName').value = data.apellido;
    document.getElementById('dni').value = data.dni_miembro;
    document.getElementById('dob').value = data.fecha_nacimiento.split('T')[0];
    document.getElementById('bloodGroup').value = data.grupo_sanguineo;

    const avatarPath = `../../Backend/${data.imagen}`;
    const avatarElement = document.querySelector('.user-info .avatar');
    avatarElement.src = data.imagen ? avatarPath : '../../Backend/uploads/default.jpg';

    document.getElementById('phone').value = data.telefono;
    document.getElementById('email').value = data.email;
    document.getElementById('address').value = data.direccion;

    document.getElementById('tutorDNI').value = data.dni_tutor;
    document.getElementById('relationship').value = data.relacion_tutor;

    makeFieldsReadOnly([
        'firstName', 'lastName', 'dni', 'dob', 
        'bloodGroup', 'tutorDNI', 'tutorFirstName', 
        'tutorLastName', 'relationship'
    ]);
}
    
function makeFieldsReadOnly(fields) {
    fields.forEach(field => {
        document.getElementById(field).readOnly = true;
    });
}   

function handleFichaMedica(data) {

    const downloadLinkFicha = document.getElementById('download-ficha');
    if (!data.ficha_medica) {
        downloadLinkFicha.classList.add('disabled');
        handleAlerts('error', 'No posee ninguna ficha médica actualmente.');
    } else {
        downloadLinkFicha.href = `../../Backend/${data.ficha_medica}`;
        handleAlerts('success', 'Ficha médica disponible para descargar.');
        downloadLinkFicha.classList.remove('disabled');
    }

    const plantillaLink = document.querySelector('a[href$="plantilla-ficha-medica.pdf"]');
    plantillaLink.addEventListener('click', function() {
        handleAlerts('success', 'Descarga de la plantilla exitosa.');
    });

    downloadLinkFicha.addEventListener('click', function(event) {
        if (downloadLinkFicha.classList.contains('disabled')) {
            event.preventDefault();
            handleAlerts('error', 'No puede descargar la ficha médica porque no está disponible.');
        } else {
            handleAlerts('success', 'Descarga de la ficha médica exitosa.');
        }
    });
}

// Manejo de datos del tutor
function handleTutorData(dniTutor) {
    fetchData(`${API_BASE_URL}/tutores/${dniTutor}`, token)
        .then(data2 => {
            document.getElementById('tutorFirstName').value = data2.nombre;
            document.getElementById('tutorLastName').value = data2.apellido;
            document.getElementById('tutorPhone').value = data2.telefono;
        });
}

// Función para obtener datos
function fetchData(url) {
    const token = localStorage.getItem('authToken');
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la red: ' + response.statusText);
        return response.json();
    })
    .catch(error => {
        console.error(error);
        handleAlerts('error', 'Error al cargar los datos.');
    });
}

// Cargar cintos y escuelas
function cargarCintos(cintoActual) {
    const token = localStorage.getItem('authToken');
    const cintoSelect = document.getElementById('cinto');
    fetch(`${API_BASE_URL}/cintos`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Agregar el token en el header
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            cintoSelect.innerHTML = '<option value="">Selecciona un cinto</option>'; // Limpiar opciones
            data.forEach(cinto => {
                const option = document.createElement('option');
                option.value = cinto.id_cinto; // Asegúrate de que esto sea el ID
                option.textContent = cinto.descripcion;
                if (cinto.descripcion === cintoActual) {
                    option.selected = true;
                }
                cintoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los cintos:', error));
}

function cargarEscuelas(escuelaActual) {
    const token = localStorage.getItem('authToken');
    const escuelaSelect = document.getElementById('escuela');
    fetch(`${API_BASE_URL}/escuelas`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Agregar el token en el header
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            escuelaSelect.innerHTML = '<option value="">Selecciona su escuela</option>'; // Limpiar opciones
            data.forEach(escuela => {
                const option = document.createElement('option');
                option.value = escuela.id_escuela; // Asegúrate de que este sea el ID correcto
                option.textContent = escuela.nombre; // Asumir que el nombre de la escuela es lo que quieres mostrar
                if (escuela.nombre === escuelaActual) {
                    option.selected = true; // Seleccionar la escuela actual si coincide
                }
                escuelaSelect.appendChild(option); // Agregar la opción al select
            });
        })
        .catch(error => console.error('Error al cargar las escuelas:', error));
}

// Construir el menú
function construirMenu(rol) {
    const navbarMenu = document.getElementById('navbar-menu');
    navbarMenu.innerHTML = ''; // Limpiar el menú actual

    const logoU = '<img src="../assets/log1.png" alt="Logo" class="navbar-logo-U">'; // Logo para el menú
    navbarMenu.innerHTML += logoU; // Agregar logo al menú

    navbarMenu.innerHTML += `
        <li><a href="publicaciones.html">Publicaciones</a></li>
    `;

    if (rol === 'Instructor' || rol === 'Administrador' ) {
        navbarMenu.innerHTML += `
            <li><a href="ABM_alumnos.html">Mis Alumnos</a></li>
            <li><a href="ABM_escuelas.html">Mi Escuela</a></li>
            
        `;
    }
    navbarMenu.innerHTML += `
        <li><a id="actual" href="mi-perfil.html">Mi perfil</a></li>
    `;

    navbarMenu.innerHTML += `
        <li><a href="#" id="logoutButton" class="login-btn">Cerrar sesión</a></li>
    `;

    // Agregar el evento de cierre de sesión
    document.getElementById('logoutButton').addEventListener('click', function(event) {
        event.preventDefault();
        cerrarSesion();
    });
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('authToken');
    window.location.href = '../src/login.html';
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

// Redirecciones y configuración
function redirectToLogin(message) {
    console.error(message);
    window.location.href = '../src/login.html';
}

function redirectToPayment() {
    window.location.href = 'https://www.mercadopago.com.ar/...';
}

