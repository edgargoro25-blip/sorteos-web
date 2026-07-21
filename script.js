// ==========================================
// CONFIGURACIÓN DE API
// ==========================================
// Reemplaza 'TU_API_KEY_AQUI' por tu clave real de Google Cloud
const YOUTUBE_API_KEY = 'AIzaSyD1Z9om2ffNKsVxpsM44iWba44yOJVacac'; 


// ==========================================
// VARIABLES GLOBALES (Almacenamiento temporal)
// ==========================================
let participantesManual = [];
let participantesYouTube = [];


// ==========================================
// GESTIÓN DE PESTAÑAS (Tabs)
// ==========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover clase activa de todos los botones y contenidos
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Activar la pestaña seleccionada
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        // Actualizar el contador sin borrar datos existentes
        actualizarContadorTotal();
    });
});


// ==========================================
// ENTRADA MANUAL
// ==========================================
const inputManual = document.getElementById('listaManual');
if (inputManual) {
    inputManual.addEventListener('input', () => {
        const texto = inputManual.value;
        const lineas = texto.split('\n').map(l => l.trim()).filter(l => l !== "");
        
        // Evitar duplicados exactos en la lista manual
        const unicos = [...new Set(lineas)];
        participantesManual = unicos.map(nombre => ({ 
            autor: nombre, 
            comentario: "Ingreso manual" 
        }));
        
        actualizarContadorTotal();
    });
}


// ==========================================
// CARGAR COMENTARIOS DE YOUTUBE (Y SHORTS)
// ==========================================
const btnYT = document.getElementById('btnCargarYT');
if (btnYT) {
    btnYT.addEventListener('click', async () => {
        const urlInput = document.getElementById('ytUrl');
        const statusText = document.getElementById('ytStatus');
        const url = urlInput ? urlInput.value.trim() : '';
        
        if (!url) {
            statusText.innerHTML = "❌ Por favor, ingresa un enlace de YouTube.";
            return;
        }

        // Extractor ultra flexible para cualquier URL (Shorts, Watch, youtu.be, etc.)
        let videoId = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            videoId = match[2];
        } else {
            statusText.innerHTML = "❌ URL de YouTube no válida. Revisa el enlace.";
            return;
        }

        if (YOUTUBE_API_KEY === 'TU_API_KEY_AQUI' || !YOUTUBE_API_KEY) {
            statusText.innerHTML = "⚠️ Configura tu YOUTUBE_API_KEY en script.js para usar esta función.";
            return;
        }

        statusText.innerHTML = "⏳ Cargando comentarios de YouTube...";
        let comentariosObtenidos = [];
        let nextPageToken = '';

        try {
            // Paginación para obtener TODOS los comentarios del video
            do {
                const apiURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}&maxResults=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                
                const response = await fetch(apiURL);
                const data = await response.json();
                
                if (data.error) throw new Error(data.error.message);

                data.items.forEach(item => {
                    const comment = item.snippet.topLevelComment.snippet;
                    comentariosObtenidos.push({
                        autor: comment.authorDisplayName,
                        comentario: comment.textDisplay
                    });
                });

                nextPageToken = data.nextPageToken;
            } while (nextPageToken);

            // Filtrar usuarios duplicados (1 solo boleto/oportunidad por usuario)
            const unicos = [];
            const nombresVistos = new Set();
            for (const item of comentariosObtenidos) {
                if (!nombresVistos.has(item.autor)) {
                    nombresVistos.add(item.autor);
                    unicos.push(item);
                }
            }

            participantesYouTube = unicos;
            statusText.innerHTML = `✅ ¡Éxito! Se cargaron ${participantesYouTube.length} participantes únicos.`;
            actualizarContadorTotal();

        } catch (error) {
            statusText.innerHTML = `❌ Error: ${error.message}`;
        }
    });
}


// ==========================================
// FUNCIONES AUXILIARES Y LÓGICA DEL SORTEO
// ==========================================
function obtenerListaActiva() {
    const tabActiva = document.querySelector('.tab-btn.active');
    if (!tabActiva) return [];
    
    const pestaña = tabActiva.dataset.tab;
    if (pestaña === 'manual') return participantesManual;
    if (pestaña === 'youtube') return participantesYouTube;
    return [];
}

function actualizarContadorTotal() {
    const lista = obtenerListaActiva();
    const totalElem = document.getElementById('totalParticipantes');
    const btnSortear = document.getElementById('btnSortear');
    
    if (totalElem) {
        totalElem.innerHTML = `Participantes cargados: <strong>${lista.length}</strong>`;
    }
    if (btnSortear) {
        btnSortear.disabled = lista.length === 0;
    }
}

// Evento principal para elegir al ganador
const btnSortear = document.getElementById('btnSortear');
if (btnSortear) {
    btnSortear.addEventListener('click', () => {
        const listaActual = obtenerListaActiva();
        if (listaActual.length === 0) return;

        btnSortear.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sorteando...';
        btnSortear.disabled = true;

        // Tiempo de animación/suspenso (1.5 segundos)
        setTimeout(() => {
            const ganador = listaActual[Math.floor(Math.random() * listaActual.length)];
            
            document.getElementById('nombreGanador').textContent = ganador.autor;
            document.getElementById('comentarioGanador').innerHTML = `"${ganador.comentario}"`;
            
            document.getElementById('pantallaResultado').classList.remove('hidden');
            
            btnSortear.innerHTML = '<i class="fa-solid fa-trophy"></i> ¡Sortear Ganador!';
            btnSortear.disabled = false;
        }, 1500);
    });
}

// Cerrar ventana flotante del ganador
const btnCerrar = document.getElementById('btnCerrarResultado');
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        document.getElementById('pantallaResultado').classList.add('hidden');
    });
}
