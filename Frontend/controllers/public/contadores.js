


// Función para iniciar los contadores
function iniciarContadores() {
    // Contador 1: Sedes
    contar(20, 'contador1', 1);

    // Contador 2: Miembros
    contar(800, 'contador2', 25);

    // Contador 3: Años
    contar(30, 'contador3', 1);
}

// Función para contar hasta un número específico
function contar(numero, idElemento, incremento) {
    let contador = 0;
    const intervalo = setInterval(() => {
        if (contador >= numero) {
            clearInterval(intervalo);
            document.getElementById(idElemento).textContent = `+${numero}`;
        } else {
            contador += incremento;
            document.getElementById(idElemento).textContent = contador;
        }
    }, 50);
}

// Iniciar los contadores cuando la página se cargue completamente
window.onload = iniciarContadores;