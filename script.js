// ==========================================
// CONFIGURACIÓN DE API
// ==========================================
const YOUTUBE_API_KEY = 'AIzaSyD1Z9om2ffNKsVxpsM44iWba44yOJVacac'; 

// ==========================================
// VARIABLES GLOBALES (Almacenamiento)
// ==========================================
let participantesManual = [];
let participantesYouTube = [];

// ==========================================
// GESTIÓN DE PESTAÑAS (Tabs)
// ==========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        actualizarContadorTotal();
    });
});

// ==========================================
// ENTRADA MANUAL (Múltiples participaciones permitidas)
// ==========================================
const inputManual = document.getElementById('listaManual');
if (inputManual) {
    inputManual.addEventListener('input', () => {
        const texto = inputManual.value;
        const lineas = texto.split('\n').map(l => l.trim()).filter(l => l !== "");
        
        // Guardar todas las líneas sin filtrar duplicados
        participantesManual = lineas.map(nombre => ({ 
            autor: nombre, 
            comentario: "Ingreso manual" 
        }));
        
        actualizarContadorTotal();
    });
}

// ==========================================
// CARGAR COMENTARIOS DE YOUTUBE (Acumulativo y sin borrar duplicados)
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

        // Extractor flexible (Shorts, Watch, youtu.be)
        let videoId = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            videoId = match[2];
        } else {
            statusText.innerHTML = "❌ URL de YouTube no válida. Revisa el enlace.";
            return;
        }

        if (YOUTUBE_API_KEY === 'TU_CLAVE_API_NUEVA_AQUI' || !YOUTUBE_API_KEY) {
            statusText.innerHTML = "⚠️ Configura tu YOUTUBE_API_KEY en script.js.";
            return;
        }

        statusText.innerHTML = "⏳ Extrayendo comentarios (esto puede tardar unos segundos)...";
        let comentariosNuevos = [];
        let nextPageToken = '';

        try {
            do {
                const apiURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}&maxResults=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
                
                const response = await fetch(apiURL);
                const data = await response.json();
                
                if (data.error) throw new Error(data.error.message);

                data.items.forEach(item => {
                    const comment = item.snippet.topLevelComment.snippet;
                    comentariosNuevos.push({
                        autor: comment.authorDisplayName,
                        comentario: comment.textDisplay
                    });
                });

                nextPageToken = data.nextPageToken;
            } while (nextPageToken);

            // Sumar los comentarios nuevos a los que ya teníamos de otros videos
            participantesYouTube = [...participantesYouTube, ...comentariosNuevos];
            
            // Limpiar la casilla para permitir pegar otro enlace rápido
            urlInput.value = '';
            
            statusText.innerHTML = `✅ ¡Video cargado! Total acumulado: ${participantesYouTube.length} participaciones en YouTube.`;
            actualizarContadorTotal();

        } catch (error) {
            statusText.innerHTML = `❌ Error: ${error.message}`;
        }
    });
}

// ==========================================
// FUNCIONES DE COMBINACIÓN Y SORTEO
// ==========================================
const checkCombinar = document.getElementById('checkCombinar');
if (checkCombinar) {
    checkCombinar.addEventListener('change', () => {
        actualizarContadorTotal();
    });
}

function obtenerListaActiva() {
    const estaCombinado = document.getElementById('checkCombinar')?.checked;

    // Si la casilla está marcada, unimos ambas listas
    if (estaCombinado) {
        return [...participantesManual, ...participantesYouTube];
    }

    // Si no está marcada, devolvemos solo la de la pestaña activa
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
    const estaCombinado = document.getElementById('checkCombinar')?.checked;
    
    if (totalElem) {
        const prefijo = estaCombinado ? "Total de boletos combinados" : "Participaciones cargadas";
        totalElem.innerHTML = `${prefijo}: <strong>${lista.length}</strong>`;
    }
    if (btnSortear) {
        btnSortear.disabled = lista.length === 0;
    }
}

// Lógica para elegir ganador
const btnSortear = document.getElementById('btnSortear');
if (btnSortear) {
    btnSortear.addEventListener('click', () => {
        const listaActual = obtenerListaActiva();
        if (listaActual.length === 0) return;

        btnSortear.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sorteando...';
        btnSortear.disabled = true;

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

// Cerrar tarjeta de ganador
const btnCerrar = document.getElementById('btnCerrarResultado');
if (btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        document.getElementById('pantallaResultado').classList.add('hidden');
    });
}
