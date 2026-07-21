// --- CONFIGURACIÓN ---
const YOUTUBE_API_KEY = AIzaSyD1Z9om2ffNKsVxpsM44iWba44yOJVacac; 

// --- VARIABLES GLOBALES ---
let participantesActuales = [];

// --- NAVEGACIÓN POR PESTAÑAS ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        
        actualizarParticipantes([]); // Reiniciar al cambiar de pestaña
    });
});

// --- ENTRADA MANUAL ---
document.getElementById('listaManual').addEventListener('input', (e) => {
    const lineas = e.target.value.split('\n').map(l => l.trim()).filter(l => l !== "");
    const formated = lineas.map(nombre => ({ autor: nombre, comentario: "Ingreso manual" }));
    actualizarParticipantes(formated);
});

// --- YOUTUBE API ---
document.getElementById('btnCargarYT').addEventListener('click', async () => {
    const url = document.getElementById('ytUrl').value;
    const statusText = document.getElementById('ytStatus');
    
    // Extraer Video ID de la URL
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
        statusText.innerHTML = "⚠️ Debes configurar tu YOUTUBE_API_KEY en el archivo script.js";
        return;
    }

    statusText.innerHTML = "⏳ Cargando comentarios (esto puede tardar un poco)...";
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
        } while (nextPageToken); // Sigue buscando hasta que no haya más páginas

        // Filtrar duplicados para que nadie tenga doble oportunidad
        const unicos = [];
        const nombresVistos = new Set();
        for (const item of comentariosObtenidos) {
            if (!nombresVistos.has(item.autor)) {
                nombresVistos.add(item.autor);
                unicos.push(item);
            }
        }

        statusText.innerHTML = `✅ ¡Éxito! Se filtraron participantes duplicados.`;
        actualizarParticipantes(unicos);

    } catch (error) {
        statusText.innerHTML = `❌ Error: ${error.message}`;
    }
});

// --- LÓGICA DE SORTEO ---
function actualizarParticipantes(lista) {
    participantesActuales = lista;
    document.getElementById('totalParticipantes').innerHTML = `Participantes cargados: <strong>${lista.length}</strong>`;
    document.getElementById('btnSortear').disabled = lista.length === 0;
}

document.getElementById('btnSortear').addEventListener('click', () => {
    if (participantesActuales.length === 0) return;

    const btn = document.getElementById('btnSortear');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sorteando...';
    btn.disabled = true;

    // Efecto de suspenso
    setTimeout(() => {
        const ganador = participantesActuales[Math.floor(Math.random() * participantesActuales.length)];
        
        document.getElementById('nombreGanador').textContent = ganador.autor;
        document.getElementById('comentarioGanador').innerHTML = `"${ganador.comentario}"`;
        
        document.getElementById('pantallaResultado').classList.remove('hidden');
        
        btn.innerHTML = '<i class="fa-solid fa-trophy"></i> ¡Sortear Ganador!';
        btn.disabled = false;
    }, 2000);
});

document.getElementById('btnCerrarResultado').addEventListener('click', () => {
    document.getElementById('pantallaResultado').classList.add('hidden');
});
