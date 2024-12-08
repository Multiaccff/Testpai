// URL de tu Web App de Google Apps Script
const URL_SCRIPT = 'https://script.google.com/macros/s/AKfycbxwKSI_hozEYJIWO7FL_w2-N8v-raIP_5OUnytEGbV7pxIpwkDS50PZuH3OGrIQ9M969Q/exec';

// Evento de carga inicial del documento
document.addEventListener('DOMContentLoaded', () => {
    // Obtener elementos del formulario y sección de resultados
    const formularioBusqueda = document.getElementById('formulario-busqueda');
    const seccionResultados = document.getElementById('seccion-resultados');
    const tablaResultados = document.getElementById('tabla-resultados').querySelector('tbody');
    const botonCargarTodos = document.getElementById('boton-cargar-todos');
    const criterioBusquedaSelect = document.getElementById('criterio-busqueda');
    const valorBusquedaInput = document.getElementById('valor-busqueda');

    // Función para renderizar registros
    function renderizarRegistros(registros) {
        tablaResultados.innerHTML = ''; // Limpiar tabla

        // Validación si no hay registros
        if (!registros || registros.length === 0) {
            tablaResultados.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No se encontraron registros
                    </td>
                </tr>
            `;
            seccionResultados.style.display = 'block';
            return;
        }

        registros.forEach(registro => {
            const fila = `
                <tr>
                    <td>${registro.nro || '.'}</td>
                    <td>${registro.nombre || 'N/A'}</td>
                    <td>${registro.fechaNacimiento || 'N/A'}</td>
                    <td>${registro.direccion || 'N/A'}</td>
                    <td>${registro.referencia || '-'}</td>
					<td>${registro.madre || '-'}</td>
					<td>${registro.bcg || '-'}</td>
					<td>${registro.hepatitisB || '-'}</td>
					<td>${registro.penta1 || '-'}</td>
					<td>${registro.penta2 || '-'}</td>
					<td>${registro.pentaR1 || '-'}</td>
					<td>${registro.pentaR2 || '-'}</td>
					<td>${registro.aa || '-'}</td>
					<td>${registro.srp1 || '-'}</td>
					<td>${registro.srp2 || '-'}</td>
					<td>${registro.td1 || '-'}</td>
					<td>${registro.td2 || '-'}</td>
					<td>${registro.td3 || '-'}</td>
					<td>${registro.td4 || '-'}</td>
					<td>${registro.td5 || '-'}</td>
					<td>${registro.td6 || '-'}</td>
					<td>${registro.libro || '-'}</td>
					<td>${registro.pagina || '-'}</td>
                </tr>
            `;
            tablaResultados.innerHTML += fila;
        });
        
        seccionResultados.style.display = 'block';
    }

    // Función para manejar errores
    function manejarError(mensaje) {
        console.error(mensaje);
        tablaResultados.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    ${mensaje}
                </td>
            </tr>
        `;
        seccionResultados.style.display = 'block';
    }

    // Función para cargar todos los registros
    async function cargarTodosRegistros() {
        try {
            const respuesta = await fetch(URL_SCRIPT + '?modo=todos');
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const registros = await respuesta.json();
            renderizarRegistros(registros);
        } catch (error) {
            manejarError('Error al cargar registros. Intente nuevamente.');
        }
    }

    // Evento de submit para el formulario de búsqueda
    formularioBusqueda.addEventListener('submit', async (e) => {
        e.preventDefault();

        const criterioBusqueda = criterioBusquedaSelect.value;
        const valorBusqueda = valorBusquedaInput.value.trim();

        // Validaciones mejoradas
        if (!criterioBusqueda) {
            alert('Por favor, seleccione un criterio de búsqueda');
            return;
        }

        if (!valorBusqueda) {
            alert('Por favor, ingrese un valor de búsqueda');
            return;
        }

        try {
            // Determinar modo de búsqueda
            const modo = criterioBusqueda.toLowerCase() === 'nro' ? 'exacto' : 'parcial';

            
            // Construir URL de búsqueda
            const url = new URL(URL_SCRIPT);
            url.searchParams.set('criterio', criterioBusqueda);
            url.searchParams.set('valor', valorBusqueda);
            url.searchParams.set('modo', modo);

            const respuesta = await fetch(url.toString());
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            const registros = await respuesta.json();
            renderizarRegistros(registros);

        } catch (error) {
            manejarError('Error al buscar registros. Verifique su conexión e intente nuevamente.');
        }
    });

    // Evento para cargar todos los registros
    botonCargarTodos.addEventListener('click', cargarTodosRegistros);

    // Opcional: Añadir validación en tiempo real
    valorBusquedaInput.addEventListener('input', (e) => {
        // Ejemplo: Limitar longitud de búsqueda
        if (e.target.value.length > 50) {
            e.target.value = e.target.value.slice(0, 50);
        }
    });
});