// --- CONFIGURACIÓN DE YOUTUBE ---
// Reemplaza esto con tu API Key de Google Cloud si quieres usar YouTube
const YOUTUBE_API_KEY = AIzaSyD1Z9om2ffNKsVxpsM44iWba44yOJVacac; 

// --- VARIABLES GLOBALES ---
let participantesManual = [];
let participantesYouTube = [];

// --- GESTIÓN DE PESTAÑAS ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        // Actualizar el contador según la pestaña activa sin borrar datos
        actualizarContadorTotal();
    });
});

// --- ENTRADA MANUAL ---
const inputManual = document.getElementById('listaManual');
inputManual.addEventListener('input', () => {
    const texto = inputManual.value;
    const lineas = texto.split('\n').map(l => l.trim()).filter(l => l !== "");
    
    // Evitar duplicados en manual
    const unicos = [...new Set(lineas)];
    participantesManual = unicos.map(nombre => ({ autor: nombre, comentario: "Ingreso manual" }));
    
    actualizarContadorTotal();
});

// --- CARGAR COMENTARIOS DE YOUTUBE ---
document.getElementById('btnCargarYT').addEventListener('click', async () => {
    const url = document.getElementById('ytUrl').value.trim();
    const statusText = document.getElementById('ytStatus');
    
    if (!url) {
        statusText.innerHTML = "❌ Por favor, ingresa un enlace de YouTube.";
        return;
    }

    // Extraer Video ID
    let videoId = '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    if(match && match[1]) {
        videoId = match[1];
    } else {
        statusText.innerHTML = "❌ URL de YouTube no válida.";
        return;
    }

    if(YOUTUBE_API_KEY === 'TU_API_KEY_AQUI') {
        statusText.innerHTML = "⚠️ Configura tu YOUTUBE_API_KEY en script.js para usar esta función.";
        return;
    }

    statusText.innerHTML = "⏳ Cargando comentarios de YouTube...";
    let comentariosObtenidos = [];
    let nextPageToken = '';

    try {
        do {
            const apiURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}&maxResults=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
            
            const response = await fetch(apiURL);
            const data = await response.json();
            
            if(data.error) throw new Error(data.error.message);

            data.items.forEach(item => {
                const comment = item.snippet.topLevelComment.snippet;
                comentariosObtenidos.push({
                    autor: comment.authorDisplayName,
                    comentario: comment.textDisplay
                });
            });

            nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        // Filtrar duplicados para que cada usuario aparezca una sola vez
        const unicos = [];
        const nombresVistos = new Set();
        for (const item of comentariosObtenidos) {
            if (!nombresVistos.has(item.autor)) {
                nombresVistos.add(item.autor);
                unicos.push(item);
            }
        }

        participantesYouTube = unicos;
        statusText.innerHTML = `✅ ¡Éxito! Se cargaron ${participantesYouTube.length} comentarios únicos.`;
        actualizarContadorTotal();

    } catch (error) {
        statusText.innerHTML = `❌ Error: ${error.message}`;
    }
});

// --- CALCULAR Y MOSTRAR PARTICIPANTES SEGÚN LA PESTAÑA ACTIVA ---
function obtenerListaActiva() {
    const pestañaActiva = document.querySelector('.tab-btn.active').dataset.tab;
    if (pestañaActiva === 'manual') return participantesManual;
    if (pestañaActiva === 'youtube') return participantesYouTube;
    return [];
}

function actualizarContadorTotal() {
    const lista = obtenerListaActiva();
    document.getElementById('totalParticipantes').innerHTML = `Participantes cargados: <strong>${lista.length}</strong>`;
    document.getElementById('btnSortear').disabled = lista.length === 0;
}

// --- LÓGICA DE SORTEO ---
document.getElementById('btnSortear').addEventListener('click', () => {
    const listaActual = obtenerListaActiva();
    if (listaActual.length === 0) return;

    const btn = document.getElementById('btnSortear');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sorteando...';
    btn.disabled = true;

    setTimeout(() => {
        const ganador = listaActual[Math.floor(Math.random() * listaActual.length)];
        
        document.getElementById('nombreGanador').textContent = ganador.autor;
        document.getElementById('comentarioGanador').innerHTML = `"${ganador.comentario}"`;
        
        document.getElementById('pantallaResultado').classList.remove('hidden');
        
        btn.innerHTML = '<i class="fa-solid fa-trophy"></i> ¡Sortear Ganador!';
        btn.disabled = false;
    }, 1500);
});

document.getElementById('btnCerrarResultado').addEventListener('click', () => {
    document.getElementById('pantallaResultado').classList.add('hidden');
});
