// src/fisica.js
import * as THREE from "three";

// Dimensões do campo e bola
const LIMITE_X = 75;
const LIMITE_Z = 40;
const LARGURA_GOL_Z = 10;
const RAIO_BOLA = 1.5;

// Física
const ATRITO = 0.98;
const GRAVIDADE = 0.05;
const FORCA_CHUTE = 1.5;

// Movimento do jogador e chute
export function moverEChutar(jogador, bola, bolaVelocidade, teclas, input, velocidadeExterna) {
    if (!jogador) return;

    const direcao = new THREE.Vector3(0, 0, 0);
    const velocidade = Math.max(velocidadeExterna, 0.4); // Velocidade mínima

    // Controles WASD / setas
    if (input[teclas.frente]) direcao.z += 1;
    if (input[teclas.tras]) direcao.z -= 1;
    if (input[teclas.esquerda]) direcao.x += 1;
    if (input[teclas.direita]) direcao.x -= 1;

    // Move e gira o jogador
    if (direcao.length() > 0) {
        direcao.normalize();
        jogador.position.add(direcao.clone().multiplyScalar(velocidade));
        jogador.rotation.y = Math.atan2(direcao.x, direcao.z);
    }

    // Mantém dentro do campo
    jogador.position.x = Math.max(-LIMITE_X, Math.min(LIMITE_X, jogador.position.x));
    jogador.position.z = Math.max(-LIMITE_Z, Math.min(LIMITE_Z, jogador.position.z));

    // Chute se estiver perto
    const distancia = jogador.position.distanceTo(bola.position);
    if (distancia < 4.5) {
        const forca = new THREE.Vector3()
            .subVectors(bola.position, jogador.position)
            .normalize();
        forca.y = 0.1; // Rasteiro
        bolaVelocidade.copy(forca.multiplyScalar(FORCA_CHUTE));
    }
}

// Atualiza física da bola
export function animarBola(bola, velocidade) {
    if (!bola) return;

    // Gravidade e movimento
    velocidade.y -= GRAVIDADE;
    bola.position.add(velocidade);

    // Quicar no chão
    if (bola.position.y < RAIO_BOLA) {
        bola.position.y = RAIO_BOLA;
        velocidade.y *= -0.5;
        velocidade.x *= ATRITO;
        velocidade.z *= ATRITO;
    }

    // Rotação visual
    if (bola.position.y <= RAIO_BOLA + 0.5) {
        bola.rotation.x += velocidade.z * 0.1;
        bola.rotation.z -= velocidade.x * 0.1;
    }

    // Paredes e linha do gol
    const dentroDoGol = Math.abs(bola.position.z) < LARGURA_GOL_Z;

    if (!dentroDoGol) {
        if (bola.position.x > LIMITE_X) { bola.position.x = LIMITE_X; velocidade.x *= -0.8; }
        if (bola.position.x < -LIMITE_X) { bola.position.x = -LIMITE_X; velocidade.x *= -0.8; }
    }

    if (bola.position.z > LIMITE_Z) { bola.position.z = LIMITE_Z; velocidade.z *= -0.8; }
    if (bola.position.z < -LIMITE_Z) { bola.position.z = -LIMITE_Z; velocidade.z *= -0.8; }
}
