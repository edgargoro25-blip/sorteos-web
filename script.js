@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');

body {
    font-family: 'Poppins', sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.app-container {
    background: #1e293b;
    width: 100%;
    max-width: 500px;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99, 102, 241, 0.2);
    border: 1px solid #334155;
}

header {
    text-align: center;
    margin-bottom: 25px;
}

header h1 {
    margin: 0;
    font-size: 28px;
    background: linear-gradient(to right, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

header p { margin: 5px 0 0 0; font-size: 14px; color: #94a3b8; }

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab-btn {
    flex: 1;
    background: #334155;
    border: none;
    color: #cbd5e1;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    transition: all 0.3s ease;
}

.tab-btn.active {
    background: #6366f1;
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.tab-content { display: none; }
.tab-content.active { display: block; animation: fadeIn 0.4s ease; }

textarea {
    width: 100%;
    height: 150px;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    color: white;
    padding: 12px;
    font-family: inherit;
    resize: none;
    box-sizing: border-box;
}

textarea:focus, input:focus {
    outline: none;
    border-color: #6366f1;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input {
    background: #0f172a;
    border: 1px solid #334155;
    padding: 12px;
    border-radius: 8px;
    color: white;
    font-family: inherit;
}

.btn-primary, .btn-secondary {
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    font-family: inherit;
    cursor: pointer;
    transition: 0.3s;
}

.btn-primary {
    width: 100%;
    background: linear-gradient(to right, #4f46e5, #7c3aed);
    color: white;
    font-size: 18px;
    margin-top: 15px;
}

.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(124, 58, 237, 0.4); }
.btn-primary:disabled { background: #334155; color: #64748b; cursor: not-allowed; }

.btn-secondary { background: #3b82f6; color: white; }
.btn-secondary:hover { background: #2563eb; }

.status-text { font-size: 12px; color: #94a3b8; margin-top: 8px; }
.warning { color: #f59e0b; }

#pantallaResultado {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

#pantallaResultado.hidden { display: none; }

.winner-card {
    background: #1e293b;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    border: 2px solid #fbbf24;
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    max-width: 80%;
}

#nombreGanador { color: #fbbf24; font-size: 32px; margin: 10px 0; }
#comentarioGanador { color: #cbd5e1; font-style: italic; margin-bottom: 20px; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
