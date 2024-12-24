document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger");
  const navbarMenu = document.getElementById("navbar-menu");
  const menuLinks = navbarMenu.querySelectorAll("a"); // Selecciona todos los enlaces en el menú

  hamburger.addEventListener("click", function() {
      navbarMenu.classList.toggle("open");
      document.body.classList.toggle("no-scroll");
  });

  menuLinks.forEach(link => {
      link.addEventListener("click", function() {
          navbarMenu.classList.remove("open");
          document.body.classList.remove("no-scroll");
      });
  });
});

function showAlert(type, message) {
    const alertElement = document.getElementById(`alert-${type}`);
    alertElement.textContent = message; // Establece el mensaje
    alertElement.style.display = 'block'; // Muestra el aviso

    // Oculta el aviso después de 3 segundos
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}
