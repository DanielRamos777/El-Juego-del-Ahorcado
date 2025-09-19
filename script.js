// ======== Lista de palabras de distintas longitudes ========
const palabras = [
  // === 3 letras ===
  "sol","mar","pez","uva","oro","ave","pan","rio","tea","oso","hoy","sal","luz","nube","rey","cielo","voz","col","paz",

  // === 4 letras ===
  "casa","luna","flor","vino","mesa","gato","foca","cima","roca","puño","alma","seda","lago","hilo","pelo","faro","nido","rana","voto",

  // === 5 letras ===
  "perro","nieve","gatos","pluma","hojas","barco","queso","playa","tigre","piano","costa","fuego","mango","campo","tinta","llave","pared","rueda","silla","verde",

  // === 6 letras ===
  "codigo","ratona","planta","bosque","sender","paleta","brillo","laguna","botana","lagart","carros","camino","nuboso","sabana","oculto","rosado","castor","frutas","humano","sonido",

  // === 7 letras ===
  "montaña","caballo","caminar","planeta","avioneta","jirafas","torment","alegria","cultura","espejos","florido","granito","manzana","volante","orquidea","cancion","trueno","piedras","mercado","gigante"
];


let palabraSecreta = "";
let letrasCorrectas = [];
let letrasIncorrectas = [];
let intentos = 6;

const dificultadSelect = document.getElementById("dificultad");
const startBtn = document.getElementById("start-btn");
const gameSection = document.getElementById("game");
const wordEl = document.getElementById("word");
const lettersEl = document.getElementById("letters");
const inputEl = document.getElementById("guess-input");
const guessBtn = document.getElementById("guess-btn");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("reset-btn");
const canvas = document.getElementById("hangman");
const ctx = canvas.getContext("2d");
const keyboard = document.getElementById("keyboard");
const themeToggle = document.getElementById("theme-toggle");

// === Función para color dinámico según tema ===
function getStrokeColor() {
  return document.body.classList.contains("light") ? "#000" : "#fff";
}

// === Inicio del juego ===
startBtn.addEventListener("click", () => {
  const dificultad = parseInt(dificultadSelect.value);
  const palabrasFiltradas = palabras.filter(p => p.length === dificultad);

  if (palabrasFiltradas.length === 0) {
    alert("No hay palabras con esa longitud.");
    return;
  }

  palabraSecreta = palabrasFiltradas[Math.floor(Math.random() * palabrasFiltradas.length)];
  letrasCorrectas = [];
  letrasIncorrectas = [];
  intentos = 6;
  messageEl.textContent = "";

  document.getElementById("settings").classList.add("oculto");
  gameSection.classList.remove("oculto");

  dibujarBase();
  actualizarPalabra();
  lettersEl.textContent = "Letras incorrectas: ";
  generarTeclado();
});

// === Actualizar palabra en pantalla ===
function actualizarPalabra() {
  const display = palabraSecreta
    .split("")
    .map(l => (letrasCorrectas.includes(l) ? l : "_"))
    .join(" ");
  wordEl.textContent = display;

  if (!display.includes("_")) {
    messageEl.textContent = "🎉 ¡Ganaste!";
    desactivarTeclado();
  }
}

// === Manejar intento ===
function manejarIntento(letra) {
  if (!letra.match(/[a-zñ]/i) || letra.length !== 1) return;
  if (letrasCorrectas.includes(letra) || letrasIncorrectas.includes(letra)) return;

  if (palabraSecreta.includes(letra)) {
    letrasCorrectas.push(letra);
    actualizarPalabra();
  } else {
    letrasIncorrectas.push(letra);
    lettersEl.textContent = "Letras incorrectas: " + letrasIncorrectas.join(", ");
    intentos--;
    dibujarParte();
    if (intentos === 0) {
      messageEl.textContent = `💀 Perdiste. La palabra era: ${palabraSecreta}`;
      desactivarTeclado();
    }
  }
}

guessBtn.addEventListener("click", () => {
  const letra = inputEl.value.toLowerCase();
  inputEl.value = "";
  manejarIntento(letra);
});

resetBtn.addEventListener("click", () => location.reload());

// === Dibujo en canvas ===
function dibujarBase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = getStrokeColor();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(10, 230);
  ctx.lineTo(200, 230);
  ctx.moveTo(50, 230);
  ctx.lineTo(50, 20);
  ctx.lineTo(150, 20);
  ctx.lineTo(150, 40);
  ctx.stroke();
}

function dibujarParte() {
  ctx.strokeStyle = getStrokeColor();
  switch (intentos) {
    case 5: ctx.beginPath(); ctx.arc(150, 60, 20, 0, Math.PI * 2); ctx.stroke(); break;
    case 4: ctx.beginPath(); ctx.moveTo(150, 80); ctx.lineTo(150, 150); ctx.stroke(); break;
    case 3: ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(120, 130); ctx.stroke(); break;
    case 2: ctx.beginPath(); ctx.moveTo(150, 100); ctx.lineTo(180, 130); ctx.stroke(); break;
    case 1: ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(120, 190); ctx.stroke(); break;
    case 0: ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(180, 190); ctx.stroke(); break;
  }
}

// === Teclado virtual ===
function generarTeclado() {
  keyboard.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  letters.split("").forEach(l => {
    const btn = document.createElement("button");
    btn.textContent = l;
    btn.classList.add("key");
    btn.addEventListener("click", () => {
      manejarIntento(l.toLowerCase());
      btn.disabled = true;
    });
    keyboard.appendChild(btn);
  });
}

function desactivarTeclado() {
  document.querySelectorAll(".key").forEach(b => b.disabled = true);
}

// === Tema claro/oscuro con redibujo ===
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";

  // Redibujar con el color nuevo
  const partesFalladas = 6 - intentos;
  dibujarBase();
  for (let i = 0; i < partesFalladas; i++) {
    intentos++;
    dibujarParte();
    intentos--;
  }
});
