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

// Función para abrir el modal y bloquear el scroll
function openModal(modal) {
    modal.style.display = 'block';
    document.body.classList.add('no-scroll'); // Bloquear el scroll
}

// Función para cerrar el modal y restaurar el scroll si todos los modales están cerrados
function closeModal(modal) {
    modal.style.display = 'none';

    // Verificar si hay algún modal abierto
    const modals = [newPublicationModal, confirmModal]; // Agrega aquí más modales si es necesario
    const isAnyModalOpen = modals.some(m => m.style.display === 'block');

    // Si no hay ningún modal abierto, quitar la clase que bloquea el scroll
    if (!isAnyModalOpen) {
        document.body.classList.remove('no-scroll'); // Restaurar el scroll
    }
}

// Función para limpiar los campos del formulario (mantener pero no usar al abrir modal)
function resetForm() {
    const form = document.getElementById('publicationForm');
    form.reset();
    document.getElementById('imagePreview').src = ''; // Limpiar vista previa de la imagen
}

// Evento para abrir el modal de nueva publicación
openModalButton.addEventListener('click', () => {
    openModal(newPublicationModal); // Solo abrir el modal, no limpiar el formulario
});

// Eventos para cerrar el modal de nueva publicación
closeModalButton.addEventListener('click', () => closeModal(newPublicationModal));
closeModalButtonFooter.addEventListener('click', () => closeModal(newPublicationModal));

// Evento para guardar y abrir el modal de confirmación
btnGuardar.addEventListener('click', () => {
    openModal(confirmModal);
});

// Eventos para cerrar el modal de confirmación
closeConfirmModalButton.addEventListener('click', () => closeModal(confirmModal));
cancelConfirmButton.addEventListener('click', () => closeModal(confirmModal));

// Función para ejecutar la acción de confirmación
function submitForm() {
    // Aquí puedes agregar la lógica para enviar el formulario o realizar la acción
    closeModal(confirmModal); // Cerrar el modal de confirmación
    closeModal(newPublicationModal); // Cerrar el modal de nueva publicación
}

// Evento para confirmar la acción
confirmActionButton.addEventListener('click', submitForm);

// Cerrar modales si se hace clic fuera de ellos
window.addEventListener('click', (event) => {
    if (event.target === newPublicationModal) {
        closeModal(newPublicationModal);
    } else if (event.target === confirmModal) {
        closeModal(confirmModal);
    }
});

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