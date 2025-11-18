// src/Cena.js

import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const TAMANHO_CAMPO_X = 75;
const TAMANHO_CAMPO_Z = 40;
const textureLoader = new THREE.TextureLoader();

export const cena = new THREE.Scene();

export function setupScene() { // Monta o campo, chão, linhas e modelos 3D

    cena.backgroundColor = 0xfff8ff;
    cena.background = new THREE.Color(0xfff8ff);

    const geometriaConcreto = new THREE.PlaneGeometry(220, 160);
    const materialConcreto = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.9
    });
    const concreto = new THREE.Mesh(geometriaConcreto, materialConcreto);
    concreto.rotation.x = -Math.PI / 2;
    concreto.position.y = -0.1;
    concreto.receiveShadow = true;
    cena.add(concreto);

    const URL_TEXTURA = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big.jpg';//cria a grama

    textureLoader.load(URL_TEXTURA, (textura) => {
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(8, 5);
        textura.colorSpace = THREE.SRGBColorSpace;

        const materialGrama = new THREE.MeshStandardMaterial({
            map: textura,
            roughness: 1,
        });

        const geometriaCampo = new THREE.PlaneGeometry(TAMANHO_CAMPO_X * 2, TAMANHO_CAMPO_Z * 2);
        const campo = new THREE.Mesh(geometriaCampo, materialGrama);
        campo.rotation.x = -Math.PI / 2;
        campo.position.y = -0.05;
        campo.receiveShadow = true;
        cena.add(campo);

    });

    const linhasGeometria = new THREE.PlaneGeometry(1, TAMANHO_CAMPO_Z * 2);
    const linhasMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const linhas = new THREE.Mesh(linhasGeometria, linhasMaterial);
    linhas.position.set(0, 0.01, 0);
    linhas.rotation.set(-Math.PI / 2, 0, 0);
    cena.add(linhas);

    const circuloGeometria = new THREE.RingGeometry(12, 13, 32);
    const circuloMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const circulo = new THREE.Mesh(circuloGeometria, circuloMaterial);
    circulo.position.set(0, 0.02, 0);
    circulo.rotation.set(-Math.PI / 2, 0, 0);
    cena.add(circulo);

    const fbxLoader = new FBXLoader();

    fbxLoader.load('assets/soccer-goal/goal.fbx', (objeto) => {
        objeto.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
        const escala = 0.04;

        const golEsq = objeto;
        golEsq.scale.set(escala, escala, escala);
        golEsq.position.set(-TAMANHO_CAMPO_X, 0, 0);
        cena.add(golEsq);

        const golDir = objeto.clone();
        golDir.scale.set(escala, escala, escala);
        golDir.position.set(TAMANHO_CAMPO_X, 0, 0);
        golDir.rotation.set(0, Math.PI, 0);
        cena.add(golDir);
    });

    const TEXTURA_ARQ = 'assets/low-quality-soccer-stadium/stadium-4k.png';
    textureLoader.load(TEXTURA_ARQ, (textura) => {
        fbxLoader.load('assets/low-quality-soccer-stadium/stadium.fbx', (objeto) => {
            const mat = new THREE.MeshPhongMaterial({ map: textura });
            objeto.traverse((c) => { if (c.isMesh) { c.material = mat; c.castShadow = true; c.receiveShadow = true; } });

            const escala = 0.02;
            objeto.scale.set(escala, escala, escala);
            objeto.position.set(0, -10, -TAMANHO_CAMPO_Z + 40);
            cena.add(objeto);
        });
    });
}

export function setupRenderer() { // Cria e configura o renderer WebGL
    const renderizador = new THREE.WebGLRenderer({ antialias: true });
    renderizador.outputColorSpace = THREE.SRGBColorSpace;
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.VSMShadowMap;
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.setClearColor(0xffffff);
    document.body.appendChild(renderizador.domElement);
    return renderizador;
}

export function setupLighting() { // Cria a iluminação ambiente e direcional
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    cena.add(luzAmbiente);

    const luzDirecional = new THREE.DirectionalLight(0xffffff, 1.2);
    luzDirecional.position.set(50, 100, 50);
    luzDirecional.castShadow = true;
    luzDirecional.shadow.bias = -0.0005;
    luzDirecional.shadow.mapSize.width = 2048;
    luzDirecional.shadow.mapSize.height = 2048;
    luzDirecional.shadow.camera.left = -100;
    luzDirecional.shadow.camera.right = 100;
    luzDirecional.shadow.camera.top = 100;
    luzDirecional.shadow.camera.bottom = -100;
    cena.add(luzDirecional);
}
