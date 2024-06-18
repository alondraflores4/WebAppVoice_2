let statusText;

document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    statusText = document.getElementById("status");
    let capturingUsername = true;

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';

        try {
            recognition.start();
            statusText.textContent = "Reconocimiento de voz iniciado. Diga su usuario.";
        } catch (error) {
            console.error("Error al iniciar el reconocimiento de voz:", error);
            statusText.textContent = "Error al iniciar el reconocimiento de voz.";
        }

        recognition.addEventListener("result", (e) => {
            const transcript = e.results[0][0].transcript.trim();
            console.log("Texto reconocido:", transcript);

            if (capturingUsername) {
                usernameInput.value = transcript;
                capturingUsername = false;
                statusText.textContent = "Usuario capturado. Diga su contraseña.";
                recognition.stop(); // Detener para capturar la contraseña
                recognition.start(); // Reiniciar para capturar la contraseña
            } else {
                passwordInput.value = transcript;
                statusText.textContent = "Contraseña capturada. Iniciando sesión...";
                login();
            }
        });

        recognition.addEventListener("end", () => {
            try {
                if (capturingUsername) {
                    statusText.textContent = "Diga su usuario.";
                } else {
                    statusText.textContent = "Diga su contraseña.";
                }
                if (!capturingUsername) {
                    recognition.start(); // Reiniciar en caso de que se detenga y no esté capturando nada
                }
            } catch (error) {
                console.error("Error al reiniciar el reconocimiento de voz:", error);
                statusText.textContent = "Error al reiniciar el reconocimiento de voz.";
            }
        });

        recognition.addEventListener("error", (event) => {
            console.error("Error en el reconocimiento de voz:", event.error);
            statusText.textContent = "Error en el reconocimiento de voz. Reiniciando...";
            if (event.error === "no-speech") {
                recognition.stop();
                recognition.start(); // Reiniciar después de un segundo
            }
        });

        function login() {
            const username = usernameInput.value;
            const password = passwordInput.value;
            statusText.textContent = "Sesión iniciada. Inicio de sesión exitoso."; // Mostrar mensaje en statusText
            setTimeout(() => {
                statusText.textContent = ""; // Limpiar mensaje después de 2 segundos
            }, 2000);
        }

        document.addEventListener('keydown', (event) => event.preventDefault());
        document.addEventListener('mousedown', (event) => event.preventDefault());

    } else {
        alert("Tu navegador no soporta la API de Reconocimiento de Voz.");
    }
});


