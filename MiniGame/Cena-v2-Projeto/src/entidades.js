// src/entidades.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const RAIO_BOLA = 1.5;
const textureLoader = new THREE.TextureLoader();
const objLoader = new OBJLoader();
const fbxLoader = new FBXLoader();

// Cria a bola com textura e sombra
export function criarBola(cena) {
    const bolaWrapper = new THREE.Group();
    bolaWrapper.position.set(0, RAIO_BOLA, 0);
    cena.add(bolaWrapper);

    const texturaBola = textureLoader.load('assets/soccer.jpg', (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
    });

    const geometria = new THREE.SphereGeometry(RAIO_BOLA, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texturaBola,
        roughness: 0.4,
        metalness: 0
    });

    const meshBola = new THREE.Mesh(geometria, material);
    meshBola.castShadow = true;
    meshBola.receiveShadow = true;
    bolaWrapper.add(meshBola);
    return bolaWrapper;
}

// Carrega modelo de zumbi
export function carregarZombie(cena, x, z, callback) {
    const textura = textureLoader.load('assets/zombieMaleA.png');
    textura.colorSpace = THREE.SRGBColorSpace;

    fbxLoader.load('assets/characterMedium.fbx', (modelo) => {
        const escala = 0.02;
        modelo.scale.set(escala, escala, escala);
        modelo.position.set(x, 0, z);

        modelo.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = new THREE.MeshStandardMaterial({ map: textura, roughness: 0.8 });
            }
        });

        const mixer = new THREE.AnimationMixer(modelo);
        modelo.mixer = mixer;
        modelo.acoes = {};

        // Animação parada
        fbxLoader.load('assets/idle.fbx', (animIdle) => {
            const action = mixer.clipAction(animIdle.animations[0]);
            modelo.acoes['idle'] = action;
            action.play();
        });

        // Animação corrida
        fbxLoader.load('assets/run.fbx?v=fix', (animRun) => {
            modelo.acoes['run'] = mixer.clipAction(animRun.animations[0]);
        });

        cena.add(modelo);
        if (callback) callback(modelo);
    });
}

// Mesmo processo do zumbi, apenas muda textura
export function carregarHumano(cena, x, z, callback) {
    const textura = textureLoader.load('assets/humanMaleA.png');
    textura.colorSpace = THREE.SRGBColorSpace;

    fbxLoader.load('assets/characterMedium.fbx', (modelo) => {
        const escala = 0.02;
        modelo.scale.set(escala, escala, escala);
        modelo.position.set(x, 0, z);

        modelo.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = new THREE.MeshStandardMaterial({ map: textura, roughness: 0.8 });
            }
        });

        const mixer = new THREE.AnimationMixer(modelo);
        modelo.mixer = mixer;
        modelo.acoes = {};

        fbxLoader.load('assets/idle.fbx', (animIdle) => {
            const action = mixer.clipAction(animIdle.animations[0]);
            modelo.acoes['idle'] = action;
            action.play();
        });

        fbxLoader.load('assets/run.fbx?v=fix', (animRun) => {
            modelo.acoes['run'] = mixer.clipAction(animRun.animations[0]);
        });

        cena.add(modelo);
        if (callback) callback(modelo);
    });
}
