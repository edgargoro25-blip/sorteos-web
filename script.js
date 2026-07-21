document.getElementById('btnSortear').addEventListener('click', () => {
    const texto = document.getElementById('participantes').value.trim();
    const lineas = texto.split('\n').map(item => item.trim()).filter(item => item !== "");

    const divResultado = document.getElementById('resultado');
    const ganadorTexto = document.getElementById('ganadorTexto');

    if (lineas.length === 0) {
        alert("Por favor, ingresa al menos un participante.");
        divResultado.classList.add('hidden');
        return;
    }

    // Efecto visual rápido de selección aleatoria (opcional)
    let contador = 0;
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * lineas.length);
        ganadorTexto.textContent = lineas[randomIndex];
        contador++;
        
        if (contador > 10) {
            clearInterval(interval);
            // Selección final real
            const ganadorFinal = Math.floor(Math.random() * lineas.length);
            ganadorTexto.textContent = "🎉 " + lineas[ganadorFinal] + " 🎉";
            divResultado.classList.remove('hidden');
        }
    }, 100);
});
