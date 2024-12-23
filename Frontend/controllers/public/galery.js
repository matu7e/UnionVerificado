document.addEventListener('DOMContentLoaded', function() {
    let modal = document.querySelector('.modal');
    let modalImg = document.querySelector('#modal-img');
    let images = document.querySelectorAll('.gallery-item img');
    let currentIndex = 0;

    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
            currentIndex = index;
        });
    });

    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex].src;
    });

    document.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex].src;
    });

    // Cerrar el modal cuando se hace clic fuera de la imagen
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
