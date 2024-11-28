// seleciona o elemento canvas e obtém o contexto 2D 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// carregar as imagens
const airplaneImage = new Image(); // imagem do avião 
airplaneImage.src = 'images/airplane.png';
const droneImage = new Image(); // imagem do drone 
droneImage.src = 'images/drone.png';
const bgroundImage = new Image(); // imagem para o fundo
bgroundImage.src = 'images/cloud.png';

// variaveis para a imagem de fundo 
var windSpeed = 1; // velocidade do vento (para mover as nuvens)
var bgX = 0; // Posição inicial das nuvens

// carregar as músicas 
let bgMusic = new Audio(); // música do fundo
bgMusic.src = 'sounds/nodens_field.mp3';
let levelUpSound = new Audio(); // Som para incrementar o nível
levelUpSound.src = 'sounds/level_up.mp3';
let gameOverSound = new Audio(); // Som para quando o perde
gameOverSound.src = 'sounds/go_arcade.mp3';

// Variáveis para controlar o countdown
let countdown = 3;
let countdownActive = false;

// Variável para controlar o nível
let level = 1;
let levelUpMessage = false; // Para mostrar o incremento do nível na tela 
let levelUpMessageTime = 2000; // Tempo em milissegundos para exibir a mensagem de incremento do nível

// outras variáveis
let startTime; // para guardar o tempo inicial

// Função para iniciar a música do fundo
function playBgMusic() {
    bgMusic.volume = 0.5;
    bgMusic.loop = true;
    bgMusic.play();
}
// Função para terminar a música do fundo
function stopBgMusic() {
    bgMusic.pause();
}

// Função para tocar o som do incremento de nível
function playLevelUpSound() {
    levelUpSound.volume = 0.5;
    levelUpSound.loop = false;
    levelUpSound.play();
}

// Função para tocar o som do game over
function playGameOverSound() {
    gameOverSound.volume = 0.5;
    gameOverSound.loop = false;
    gameOverSound.play();
}

// Array para armazenar as drones
const drones = [];

// Função para criar um novo drone
function createDrone() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 55,
        height: 55,
        speedX: 1,
        speedY: 1
    };
}

// Inicialmente cria 1 drones
for (let i = 0; i < 1; i++) {
    drones.push(createDrone());
}

// Função para desenhar o drone na tela
function drawDrones() {
    // Desenha as imagens dos drones na tela
    for (const drone of drones) {
        ctx.drawImage(droneImage, drone.x, drone.y, drone.width, drone.height);
    }
};

// Função para movimentar os drones na tela
function moveDrones() {
    for (const drone of drones) {
        // Move o drone para a direita
        drone.x += drone.speedX;
        // Move o drone para baixo
        drone.y += drone.speedY;
        // Verifica se o drone saiu da tela
        if (drone.x > canvas.width || drone.x < 0) drone.speedX *= -1;
        if (drone.y > canvas.height || drone.y < 0) drone.speedY *= -1;
    }
};

// Função para desenhar o fundo do canvas
function drawBackground() {
    // Move as nuvens para a direita
    bgX += windSpeed;

    // Reinicia a posição das nuvens quando elas saem da tela
    if (bgX >= canvas.width) {
        bgX = 0;
    }

    // desenhar a imagem do fundo na tela
    ctx.drawImage(bgroundImage, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgroundImage, bgX - canvas.width, 0, canvas.width, canvas.height);
};

// Define as propriedades iniciais do avião
const airplane = {
    x: canvas.width / 2, // Posição inicial no centro da tela (eixo x)
    y: canvas.height / 2, // Posição inicial no centro da tela (eixo y)
    width: 80, // Largura do avião
    height: 60, // Altura do avião
    speed: 3, // Velocidade inicial
    angle: 0 // Ângulo inicial (em radianos) 
};

// Objeto para armazenar o estado das teclas pressionadas
let keys = {};

// Evento de pressionar uma tecla
window.addEventListener('keydown', (e) => {
    keys[e.key] = true; // Marca a tecla como pressionada 
});

// Evento de soltar uma tecla
window.addEventListener('keyup', (e) => {
    keys[e.key] = false; // Marca a tecla como não pressionada 
});

// Função para atualizar a posição e ângulo do avião
function update() {
    // Verifica se a tecla 'ArrowLeft' está pressionada 
    if (keys['ArrowLeft']) {
        airplane.angle -= 0.05; // Gira o avião no sentido anti-horário
    }
    // Verifica se a tecla 'ArrowRight' está pressionada 
    if (keys['ArrowRight']) {
        airplane.angle += 0.05; // Gira o avião no sentido horário 
    }
    // Verifica se a tecla 'ArrowUp' está pressionada 
    if (keys['ArrowUp']) {
        airplane.x += airplane.speed * Math.cos(airplane.angle); // Move para frente no eixo x
        airplane.y += airplane.speed * Math.sin(airplane.angle); // Move para frente no eixo y
    }
    // Verifica se a tecla 'ArrowDown' está pressionada
    if (keys['ArrowDown']) {
        airplane.x -= airplane.speed * Math.cos(airplane.angle); // Move para trás no eixo x 
        airplane.y -= airplane.speed * Math.sin(airplane.angle); // Move para trás no eixo y
    }
    // Garante que o avião não saia da tela no eixo x
    airplane.x = Math.max(0, Math.min(canvas.width - airplane.width, airplane.x));
    // Garante que o avião não saia da tela no eixo y 
    airplane.y = Math.max(0, Math.min(canvas.height - airplane.height, airplane.y));
}

// Função para desenhar o avião na tela 
function drawAirplane() {
    ctx.save(); // Salva o estado atual do contexto
    ctx.translate(airplane.x + airplane.width / 2, airplane.y + airplane.height / 2); // Translada o contexto para o centro do avião 
    ctx.rotate(airplane.angle); // Gira o contexto pelo ângulo do avião 
    ctx.drawImage(airplaneImage, -airplane.width / 2, -airplane.height / 2, airplane.width, airplane.height); // Desenha a imagem do avião
    ctx.restore(); // Restaura o estado original do contexto 
}

// Função para detectar colisão
function checkCollision() {
    for (const drone of drones) {
        if (airplane.x < drone.x + drone.width &&
            airplane.x + airplane.width > drone.x &&
            airplane.y < drone.y + drone.height &&
            airplane.y + airplane.height > drone.y) {
            return true; // Colisão detectada
        }
    }
    return false;
}

// Função para desenhar o countdown na tela
function drawCountdown() {
    if (countdownActive) {
        ctx.fillStyle = 'blue';
        ctx.font = '40px Consolas';
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
    }
}

// função para desenhar a mensagem de incremento do nível na tela
function drawLevelUpMessage() {
    if (levelUpMessage) {
        ctx.fillStyle = 'blue';
        ctx.font = '30px Consolas';
        ctx.fillText('Level Up!', canvas.width / 2 - 100, canvas.height / 2 - 50);
        ctx.fillText(`Nível: ${level}`, canvas.width / 2 - 100, canvas.height / 2 - 10);
    }
}

// Função para terminar o jogo e parar os contadores
function stopGame() {
    clearTimeout(countdownTotal);
    clearInterval(countdownTimer);
    stopBgMusic();
    playGameOverSound();
}

// Função principal de loop para atualizar e desenhar o avião 
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    playBgMusic(); // Toca o som de fundo
    drawBackground(); // Desenha o fundo
    drawDrones(); // Desenha as drones
    drawAirplane(); // Desenha o avião na tela 
    moveDrones(); // Move as drones
    drawCountdown(); // Desenha o countdown na tela
    drawLevelUpMessage(); // Desenha a mensagem de incremento do nível na tela

    update(); // Atualiza a posição e ângulo do avião

    // Mostrar o relógio na tela
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    ctx.fillStyle = 'black';
    ctx.font = '20px Consolas';
    ctx.fillText(`Tempo: ${timeElapsed}s`, 10, 20);

    // Mostrar o Nível na tela
    ctx.fillStyle = 'black';
    ctx.font = '20px Consolas';
    ctx.fillText(`Nível: ${level}`, canvas.width - 100, 20);

    // Verifica colisão
    if (checkCollision()) {
        //alert('Game Over!');
        ctx.fillStyle = 'red';
        ctx.font = '100px Consolas';
        ctx.fillText(`Game Over!`, canvas.width / 2 - 270, canvas.height / 2 - 50);
        stopGame(); // Para terminar o jogo
        return;
    }
    requestAnimationFrame(loop); // Chama a função loop novamente no próximo frame 
}

// Inicia o loop quando a imagem do avião é carregada 
airplaneImage.onload = () => {
    startTime = Date.now(); // Define o tempo inicial
    loop(); // Inicia o loop 
};

// Aumenta a velocidade do avião e dos drones
setInterval(() => {
    airplane.speed += 0.5;  // Aumenta a velocidade do avião
    for (const drone of drones) {
        drone.speedX *= 1.1;  // Aumenta a velocidade horizontal das drones
        drone.speedY *= 1.1;  // Aumenta a velocidade vertical das drones
    }
}, 10000);  // A cada 10 segundos

// Função para iniciar o countdown, adicionar nova drone e incrementar o nível
function startCountdown() {
    countdown = 3;
    countdownActive = true;
    const interval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(interval);
            countdownActive = false;
            drones.push(createDrone()); // Adiciona a nova drone
            level++; // Incrementa o nível
            levelUpMessage = true; // Ativa a mensagem de incremento do nível
            setTimeout(() => {
                levelUpMessage = false; // Desativa a mensagem após algum tempo
            }, levelUpMessageTime);
            playLevelUpSound(); // Toca o som de incremento do nível
        }
    }, 1000); // Reduz o countdown a cada segundo
}

// variável para controlar o contador
let countdownTimer;
let countdownTotal;

// Inicia o primeiro countdown após 7 segundos
countdownTotal =setTimeout(() => {
    startCountdown();
    // Depois, inicia o countdown a cada 10 segundos
    countdownTimer = setInterval(() => {
        startCountdown();
    }, 10000);
}, 7000);