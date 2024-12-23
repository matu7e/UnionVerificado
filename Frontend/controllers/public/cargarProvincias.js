// Función para cargar provincias desde el backend y mostrarlas en el select
async function cargarProvincias() {
  try {
      const response = await fetch('http://localhost:3000/georef'); // Endpoint para obtener provincias
      if (!response.ok) {
          throw new Error('Error al obtener las provincias');
      }

      const provincias = await response.json();

      const selectProvincia = document.getElementById('buscar-input');
      selectProvincia.innerHTML = '<option value="">Seleccione una provincia</option>'; // Resetea el select

      provincias.forEach(provincia => {
          const option = document.createElement('option');
          option.value = provincia.id;
          option.textContent = provincia.nombre;
          selectProvincia.appendChild(option);
      });

      // Configura el evento para cargar localidades cuando se seleccione una provincia
      selectProvincia.addEventListener('change', async (event) => {
          const provinciaId = event.target.value;
          if (provinciaId) {
              await cargarLocalidades(provinciaId);
          }
      });

  } catch (error) {
      console.error('Error:', error);
  }
}

// Función para cargar localidades de una provincia específica
async function cargarLocalidades(provinciaId) {
  try {
      const response = await fetch(`http://localhost:3000/georef/${provinciaId}`); // Endpoint para obtener localidades por provincia
      if (!response.ok) {
          throw new Error('Error al obtener las localidades');
      }

      const localidades = await response.json();

      const selectLocalidad = document.getElementById('buscar-localidad');
      selectLocalidad.innerHTML = '<option value="">Seleccione una localidad</option>'; // Resetea el select

      localidades.forEach(localidad => {
          const option = document.createElement('option');
          option.value = localidad.id;
          option.textContent = localidad.nombre;
          selectLocalidad.appendChild(option);
      });

      // Inicializar Select2 en el select de localidades después de cargar las localidades
      $('#buscar-localidad').select2({
          placeholder: 'Seleccione una localidad',
          allowClear: true
      });

  } catch (error) {
      console.error('Error:', error);
  }
}

// Llama a la función para cargar provincias al cargar la página
document.addEventListener('DOMContentLoaded', cargarProvincias);