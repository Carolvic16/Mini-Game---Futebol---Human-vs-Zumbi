// src/main.js
import * as THREE from "three";
import { setupRenderer, setupScene, setupLighting, cena } from "./cena.js";
import { setupCamerasAndControls, renderCameras, handleResize } from "./camera.js";
import { criarBola, carregarZombie, carregarHumano } from "./entidades.js";
import { animarBola, moverEChutar } from "./fisica.js";
import { setupEventListeners, teclasPressionadas } from "./input.js";

// ---- VARIÁVEIS DO JOGO ----
let jogador1 = null;
let jogador2 = null;
let bola = null;
const bolaVelocidade = new THREE.Vector3(0, 0, 0);

let jogoRolando = false;
let pausadoPorGol = false;

let golsZumbi = 0;
let golsHumano = 0;

// Animação dos modelos
let mixerJogador1 = null;
let mixerJogador2 = null;
const clock = new THREE.Clock();

// ---- SETUP INICIAL ----
setupScene();
setupLighting();
const renderizador = setupRenderer();
setupCamerasAndControls(renderizador.domElement);
setupEventListeners();

// ---- TELA INICIAL / PLAY ----
window.onload = () => {
    const btnPlay = document.getElementById('btn-play');
    const telaInicial = document.getElementById('tela-inicial');
    const placarDiv = document.getElementById('placar');

    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            telaInicial.style.display = 'none';
            placarDiv.style.display = 'block';
            jogoRolando = true;
        });
    }
};

// ---- ENTIDADES ----
bola = criarBola(cena);

// Jogador 1 (Zumbi)
carregarZombie(cena, -10, 0, (zumbi) => {
    jogador1 = zumbi;
    mixerJogador1 = zumbi.mixer;
});

// Jogador 2 (Humano)
carregarHumano(cena, 10, 0, (human) => {
    jogador2 = human;
    human.rotation.y = -Math.PI / 2;
    mixerJogador2 = human.mixer;
});

// ---- SISTEMA DE GOL ----
function verificarGol() {
    if (!bola || pausadoPorGol) return;

    if (bola.position.x > 76) {
        golsZumbi++;
        narrarGol("ZUMBI");
    }

    if (bola.position.x < -76) {
        golsHumano++;
        narrarGol("HUMANO");
    }
}

function narrarGol(quem) {
    pausadoPorGol = true;

    document.getElementById("score-zumbi").innerText = golsZumbi;
    document.getElementById("score-humano").innerText = golsHumano;

    const msg = document.getElementById("mensagem-gol");
    msg.innerText = `GOL DO ${quem}!`;
    msg.style.display = "block";

    setTimeout(() => {
        resetarPosicoes();
        pausadoPorGol = false;
        msg.style.display = "none";
    }, 2000);
}

function resetarPosicoes() {
    bolaVelocidade.set(0, 0, 0);
    bola.position.set(0, 2, 0);

    if (jogador1) jogador1.position.set(-20, 0, 0);
    if (jogador2) jogador2.position.set(20, 0, 0);
}

// ---- TROCA ANIMAÇÃO (RUN / IDLE) ----
function atualizarAnimacao(jogador, movendo) {
    if (!jogador?.acoes) return;

    const idle = jogador.acoes["idle"];
    const run = jogador.acoes["run"];

    if (movendo) {
        idle.stop();
        run.play();
    } else {
        run.stop();
        idle.play();
    }
}

// ---- LOOP PRINCIPAL ----
function renderizar() {
    requestAnimationFrame(renderizar);
    const delta = clock.getDelta();

    // Atualiza animações FBX
    mixerJogador1?.update(delta);
    mixerJogador2?.update(delta);

    if (jogoRolando && !pausadoPorGol) {
        // Detecta movimento
        const movendoJ1 = teclasPressionadas.w || teclasPressionadas.s || teclasPressionadas.a || teclasPressionadas.d;
        const movendoJ2 = teclasPressionadas.ArrowUp || teclasPressionadas.ArrowDown || teclasPressionadas.ArrowLeft || teclasPressionadas.ArrowRight;

        atualizarAnimacao(jogador1, movendoJ1);
        atualizarAnimacao(jogador2, movendoJ2);

        // Movimenta e chuta
        moverEChutar(jogador1, bola, bolaVelocidade, { frente: "w", tras: "s", esquerda: "a", direita: "d" }, teclasPressionadas, 0.5);
        moverEChutar(jogador2, bola, bolaVelocidade, { frente: "ArrowUp", tras: "ArrowDown", esquerda: "ArrowLeft", direita: "ArrowRight" }, teclasPressionadas, 0.5);

        animarBola(bola, bolaVelocidade);
        verificarGol();
    }

    renderCameras(renderizador, cena, jogador1, jogador2);
}

// ---- RESIZE ----
window.addEventListener("resize", () => {
    renderizador.setSize(window.innerWidth, window.innerHeight);
    handleResize(window.innerWidth, window.innerHeight);
});

renderizar();
