// src/camera.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let cameraTV, cameraP1, cameraP2; // Câmeras
let controls; // Controles da câmera TV
let activeView = 'tv'; // Modo de exibição ativo

export function setupCamerasAndControls(domElement) {
    cameraTV = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // Visão geral
    cameraTV.position.set(0, 40, 60);
    cameraTV.lookAt(0, 0, 0);

    cameraP1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500); // Jogador 1
    cameraP2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500); // Jogador 2

    controls = new OrbitControls(cameraTV, domElement); // OrbitControls só para TV
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;

    const btnPan = document.getElementById('btn-panoramica'); // Botão visão geral
    const btnSplit = document.getElementById('btn-split'); // Botão tela dividida

    if (btnPan) {
        btnPan.addEventListener('click', () => {
            activeView = 'tv';
            updateButtonStyles(btnPan, btnSplit);
        });
    }

    if (btnSplit) {
        btnSplit.addEventListener('click', () => {
            activeView = 'split';
            updateButtonStyles(btnSplit, btnPan);
        });
    }
}

function updateButtonStyles(activeBtn, inactiveBtn) {
    if (activeBtn) activeBtn.style.backgroundColor = '#ffff00';
    if (inactiveBtn) inactiveBtn.style.backgroundColor = '#ffffff';
}

export function renderCameras(renderer, scene, player1, player2) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (activeView === 'tv') {
        renderer.setViewport(0, 0, width, height); // Tela cheia
        renderer.setScissor(0, 0, width, height);
        renderer.setScissorTest(true);
        renderer.render(scene, cameraTV);
        if (controls) controls.update();

    } else if (activeView === 'split') {
        renderer.setScissorTest(true);
        const aspect = (width / 2) / height; // Proporção de meia tela

        if (player1) {
            cameraP1.aspect = aspect;
            cameraP1.updateProjectionMatrix();
            cameraP1.position.copy(player1.position).add(new THREE.Vector3(-20, 15, 0)); // Câmera atrás do P1
            cameraP1.lookAt(player1.position.x + 50, 0, player1.position.z);
        }

        renderer.setViewport(0, 0, width / 2, height);
        renderer.setScissor(0, 0, width / 2, height);
        renderer.render(scene, cameraP1);

        if (player2) {
            cameraP2.aspect = aspect;
            cameraP2.updateProjectionMatrix();
            cameraP2.position.copy(player2.position).add(new THREE.Vector3(20, 15, 0)); // Câmera atrás do P2
            cameraP2.lookAt(player2.position.x - 50, 0, player2.position.z);
        }

        renderer.setViewport(width / 2, 0, width / 2, height);
        renderer.setScissor(width / 2, 0, width / 2, height);
        renderer.render(scene, cameraP2);
    }
}

export function handleResize(newWidth, newHeight) {
    if (cameraTV) {
        cameraTV.aspect = newWidth / newHeight;
        cameraTV.updateProjectionMatrix();
    }
    if (cameraP1) {
        cameraP1.aspect = (newWidth / 2) / newHeight;
        cameraP1.updateProjectionMatrix();
    }
    if (cameraP2) {
        cameraP2.aspect = (newWidth / 2) / newHeight;
        cameraP2.updateProjectionMatrix();
    }
}
