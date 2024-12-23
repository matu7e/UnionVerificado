// Variables para la paginación
let publicaciones = [];
let currentPage = 1;
// Asumiendo que ya tienes el token en una variable
const token = localStorage.getItem('authToken');


const registrosPorPagina = 15;
const publicacionesUrl = 'http://localhost:3000/publicaciones'; // URL de tus publicaciones
// Estado de acción actual para el modal de confirmación
let currentAction = null;
let currentId = null;

// Obtener los elementos de los modales y botones
const newPublicationModal = document.getElementById('newPublicationModal');
const confirmModal = document.getElementById('confirmModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const closeModalButtonFooter = document.getElementById('closeModalButtonFooter');
const closeConfirmModalButton = document.getElementById('closeConfirmModal');
const cancelConfirmButton = document.getElementById('cancelConfirmButton');
const btnGuardar = document.getElementById('btnGuardar');
const confirmActionButton = document.getElementById('confirmActionButton');
const loader = document.getElementById('loader'); // Elemento del loader

// Función para mostrar el loader
function showLoader() {
    loader.style.display = 'block'; // Mostrar el loader
}

// Función para ocultar el loader
function hideLoader() {
    loader.style.display = 'none'; // Ocultar el loader
}

// Función para abrir el modal y bloquear el scroll
function openModal(modal) {
    modal.style.display = 'block';
    document.body.classList.add('no-scroll'); // Bloquear el scroll
}
// Cambiar de página
document.getElementById('pageSelect').addEventListener('change', (event) => {
    currentPage = parseInt(event.target.value);
    mostrarPagina(currentPage);
});

// Función para cerrar el modal y restaurar el scroll si todos los modales están cerrados
function closeModal(modal) {
    modal.style.display = 'none';

    // Verificar si hay algún modal abierto
    const modals = [newPublicationModal, confirmModal];
    const isAnyModalOpen = modals.some(m => m.style.display === 'block');

    if (!isAnyModalOpen) {
        document.body.classList.remove('no-scroll'); // Restaurar el scroll
    }
}

// Función para previsualizar la imagen seleccionada
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '';
    }
}

// Cerrar modales si se hace clic fuera de ellos
window.addEventListener('click', (event) => {
    if (event.target === newPublicationModal) {
        closeModal(newPublicationModal);
    } else if (event.target === confirmModal) {
        closeModal(confirmModal);
    }
});


// Función para limpiar los campos del formulario
function resetForm() {
    const form = document.getElementById('publicationForm');
    form.reset();
    document.getElementById('imagePreview').src = ''; // Limpiar vista previa de la imagen
}

openModalButton.addEventListener('click', () => {
    resetForm(); // Limpiar los campos antes de abrir el modal
    openModal(newPublicationModal);
});

closeModalButton.addEventListener('click', () => closeModal(newPublicationModal));
closeModalButtonFooter.addEventListener('click', () => closeModal(newPublicationModal));
closeConfirmModalButton.addEventListener('click', () => closeModal(confirmModal));
cancelConfirmButton.addEventListener('click', () => closeModal(confirmModal));

btnGuardar.addEventListener('click', (event) => {
    event.preventDefault(); // Prevenir la recarga de la página

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const enlace = document.getElementById('enlace').value.trim();

    if (!titulo) {
        showAlert('aviso', 'Por favor, complete todos los campos.');
        return;
    }

    currentAction = 'crear'; // Establecer la acción actual a 'crear'
    openModal(confirmModal);
});

// Función para crear la publicación
function createPublication() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const enlace = document.getElementById('enlace').value;

    const token = localStorage.getItem('authToken');
    const url = 'http://localhost:3000/publicaciones';
    const method = 'POST';

    fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            titulo: titulo,
            descripcion: descripcion,
            enlace: enlace,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la creación de la publicación');
        }
        return response.json();
    })
    .then(data => {
        const id_pub = data.id_pub;

        cargarPublicaciones(); // Cargar las publicaciones después de la creación
        uploadImage(id_pub); // Cargar la imagen después de crear la publicación
        showAlert('success', 'Publicación creada con éxito.');
    })
    .catch(error => {
        console.error('Error al crear publicación:', error);
        showAlert('error', 'Error al crear la publicación.');
    })
    .finally(() => {
        hideLoader(); // Ocultar loader al finalizar
        closeModal(confirmModal);
        closeModal(newPublicationModal);
    });
}

// Función para cargar la imagen de la publicación
function uploadImage(id_pub) {
    hideLoader(); // Ocultar loader si no hay imagen
    const imageInput = document.getElementById('imagen');
    const imageFile = imageInput.files[0];


    if (!imageFile) {
        hideLoader();
        showAlert('aviso', 'No se seleccionó una imagen para subir.');
        return;
    }

    const formData = new FormData();
    formData.append('imagen', imageFile);
    const token = localStorage.getItem('authToken');
    const url = `http://localhost:3000/publicaciones/${id_pub}/cargaImagen`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la carga de la imagen');
        }
        return response.json();
    })
    .then(data => {
        showAlert('success', 'Imagen cargada con éxito.');
        cargarPublicaciones()
    })
    .catch(error => {
        console.error('Error al cargar la imagen:', error);
        showAlert('error', 'Error al cargar la imagen.');
    });
}

// Evento para confirmar la acción
confirmActionButton.addEventListener('click', () => {
    if (currentAction === 'eliminar') {
        eliminarPublicacion(currentId);
    } else if (currentAction === 'crear') {
        createPublication();
    }
    closeModal(confirmModal);
});

// Función para cargar todas las publicaciones al iniciar
function cargarPublicaciones() {
    

    showLoader(); // Mostrar loader al iniciar la carga
    const token = localStorage.getItem('authToken');
    fetch(publicacionesUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Agrega el token a los encabezados
            'Content-Type': 'application/json' // Opcional, según tu backend
        }
    })
    .then(response => {
        // Asegúrate de que la respuesta sea OK antes de intentar convertirla a JSON
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        publicaciones = data; // Aquí se cargan las publicaciones
        mostrarPagina(currentPage); // Mostrar la página actual
        actualizarPaginador(); // Actualizar paginador
        mostrarTotalRegistros(); // Mostrar total de registros
        
    })
    .catch(error => console.error('Error al cargar las publicaciones:', error))
    .finally(() => {
        hideLoader(); // Ocultar loader al finalizar
    });
}

// Función para mostrar el total de registros
function mostrarTotalRegistros() {
    const totalRegistros = document.getElementById('totalRegistros');
    if (totalRegistros) { // Verificar que el elemento exista
        totalRegistros.textContent = `Total de publicaciones: ${publicaciones.length}`; // Actualiza el texto con la longitud del array
    } else {
        console.error("Elemento 'totalRegistros' no encontrado");
    }
}

// Lógica de paginación
function actualizarPaginador() {
    const totalPaginas = Math.ceil(publicaciones.length / registrosPorPagina);
    const paginador = document.getElementById('paginador');
    
    if (paginador) { // Verificar que el paginador exista
        paginador.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.onclick = () => {
                currentPage = i;
                mostrarPagina(currentPage);
            };
            paginador.appendChild(pageButton);
        }
    } else {
        console.error("Elemento 'paginador' no encontrado");
    }
}


// Función para mostrar la página de publicaciones
function mostrarPagina(pagina) {
    const tableBody = document.querySelector('#miTabla tbody');
    tableBody.innerHTML = '';
    
    const start = (pagina - 1) * registrosPorPagina;
    const end = start + registrosPorPagina;
    const publicacionesPagina = publicaciones.slice(start, end);

    publicacionesPagina.forEach(publicacion => {
        const titulo = publicacion.titulo || '-';
        const descripcion = publicacion.descripcion || '-';
        const enlace = publicacion.enlace ? `<a href="${publicacion.enlace}" target="_blank">Enlace</a>` : '-';
        const fechaPublicacion = publicacion.fecha_publicacion 
            ? new Date(publicacion.fecha_publicacion).toLocaleDateString("es-ES") 
            : '-';
        
        const iconoVerImagen = publicacion.imagen 
        ? `<i class="fa-solid fa-eye icon-view" title="Ver imagen" onclick="verImagen('${publicacion.imagen.replace(/\\/g, "/")}')"></i>`
        : '<i class="fa-solid fa-eye icon-view-disabled" title="Imagen no disponible"></i>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${titulo}</td>
            <td>${descripcion}</td>
            <td>${enlace}</td>
            <td>${fechaPublicacion}</td>
            <td>
                ${iconoVerImagen}
                <i class="fa-solid fa-trash icon-delete" title="Eliminar publicación" onclick="confirmarEliminacion(${publicacion.id_publicacion})"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para mostrar el modal de confirmación de eliminación
function confirmarEliminacion(id) {
    currentAction = 'eliminar';
    currentId = id;
    openModal(confirmModal);
}


// Evento para cerrar el modal
document.getElementById('closeImagePreview').addEventListener('click', function() {
    document.getElementById('imagePreviewModal').style.display = 'none';
});

// Cerrar el modal al hacer clic fuera de la imagen
document.getElementById('imagePreviewModal').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});
function verImagen(rutaImagen) {
    // Concatenar el prefijo a la ruta de la imagen
    const imageUrl = `../../../Backend/${rutaImagen}`;
    // Asignar la ruta de la imagen al src del elemento de vista previa
    document.getElementById('previewImage').src = imageUrl;
    // Mostrar el modal con la imagen
    document.getElementById('imagePreviewModal').style.display = 'flex';
}



function eliminarPublicacion(id) {
    

    showLoader(); // Mostrar loader al iniciar la eliminación
    const token = localStorage.getItem('authToken');
    fetch(`http://localhost:3000/publicaciones/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Opcional, según tu backend
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar publicación');
        }
        showAlert('success', 'Publicación eliminada con éxito.');
        return cargarPublicaciones(); // Recargar publicaciones después de eliminar
    })
    .catch(error => {
        console.error('Error al eliminar la publicación:', error);
        showAlert('error', 'Error al eliminar la publicación.');
    })
    .finally(() => {
        hideLoader();
        closeModal(confirmModal);
    });
}

// Función para actualizar el paginador
function actualizarPaginador() {
    const totalPaginas = Math.ceil(publicaciones.length / registrosPorPagina);
    document.getElementById('totalPaginas').textContent = totalPaginas;

    const pageSelect = document.getElementById('pageSelect');
    pageSelect.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        pageSelect.appendChild(option);
    }
}
// Función para cerrar el modal de imagen
document.getElementById('closeImagePreview').addEventListener('click', () => {
    document.getElementById('imagePreviewModal').style.display = 'none';
});

// Función para cerrar el modal al hacer clic fuera de la imagen
window.addEventListener('click', (event) => {
    const imageModal = document.getElementById('imagePreviewModal');
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
});

// Función para mostrar el total de registros
function mostrarTotalRegistros() {
    const totalRegistros = publicaciones.length;
    document.getElementById('totalRegistros').textContent = `Total de Registros: ${totalRegistros}`;
}



// Cargar las publicaciones al inicio
document.addEventListener('DOMContentLoaded', cargarPublicaciones());
