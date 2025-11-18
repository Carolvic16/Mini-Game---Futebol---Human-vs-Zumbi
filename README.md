# Mini-Game---Futebol---Human-vs-Zumbi
O projeto consiste em um minigame de futebol 3D multijogador local, desenvolvido para a web. A premissa é uma partida inusitada entre um Sobrevivente Humano e um Zumbi, onde o objetivo não é apenas marcar gols, mas dominar a física da bola em um ambiente tridimensional.  Autores: André Lyra &amp; Victória Carolina 

# Estádio 3D Interativo: Humanos vs Zumbis

## IFSP – Campus São João da Boa Vista
**Disciplina:** Computação Gráfica
**Autores:** André Lyra e Victória Carolina

---

# Sobre o Projeto
Este é um jogo de futebol 3D desenvolvido com Three.js, simulando uma partida apocalíptica entre Humanos e Zumbis. O projeto demonstra conceitos avançados de computação gráfica, incluindo iluminação realista, carregamento de modelos animados, física de colisão e câmeras múltiplas.

---

# Requisitos Atendidos

### Iluminação e Sombras
- **AmbientLight:** Iluminação base suave para evitar sombras pretas.
- **DirectionalLight:** Simula o sol e projeta sombras dinâmicas dos jogadores.
- **SpotLight:** Refletor central que cria um destaque dramático no gramado.

### Texturas e Materiais
- Arquibancada com mapeamento UV e textura 4K.
- Bola de futebol com textura realista (soccer.jpg).
- Skins personalizadas aplicadas aos modelos (Zumbi e Humano).

### Objetos 3D e Animações
- **FBXLoader:** Importação de personagens (Zumbi/Humano) e ambiente (Gols/Estádio).
- **AnimationMixer:** Sistema de animação de estados (Idle / Run) sem travamentos.
- **Correção de Esqueleto:** Ajuste de "Bone Mapping" para compatibilidade com animações do Mixamo.

### Jogabilidade e Física
- **Colisões:** Detecção de chute vetorial, colisão com traves e limites do campo.
- **Física da Bola:** Gravidade, atrito, rotação visual ao rolar e quique realista.
- **Sistema de Gols:** Detecção automática, placar interativo e lógica de Gol Contra com detecção de último toque.

### Câmeras e Navegação
- **Modo TV:** Visão panorâmica com controle orbital (OrbitControls).
- **Tela Dividida (Split Screen):** Câmeras individuais em 3ª pessoa seguindo cada jogador atrás do gol.

---

# Estrutura do Projeto

```text
Cena-v2-Projeto
│
├── assets/                  # Modelos 3D e Texturas
│   ├── characterMedium.fbx  # Modelo base do corpo
│   ├── idle.fbx / run.fbx   # Arquivos de animação
│   ├── soccer.jpg           # Textura da bola
│   └── ...
│
├── src/                     # Código Fonte Modular
│   ├── camera.js            # Gerenciamento de Câmeras (TV/Split)
│   ├── cena.js              # Setup do Estádio e Iluminação
│   ├── entidades.js         # Carregamento de Zumbi, Humano e Bola
│   ├── fisica.js            # Lógica de Movimento e Colisões
│   ├── input.js             # Captura de Teclado
│   └── main.js              # Game Loop e Lógica Principal
│
├── index.html               # Interface (Menu, Placar, Mensagens)
├── package.json             # Dependências
└── README.md                # Documentação

# Controles: 
Jogadoe 1: 
Mover: W A S D
Objetivo: Gol da Direita 

Joagor 2: 
Mover: Setas Direcionais
Objetivo: Gol Esquerda

Aperte o botão JOGAR AGORA na tela inicial para começar a partida

# Instalção e Exwcução: 
Esses comandos são iniciado sno terminal (CRTL + SHIFT +')
Dependencias: 
npm install: 
Iniciar servidor local: 
npx vite

### Recursos Utilizados:

Three.js: Biblioteca gráfica principal.

Mixamo (Adobe): Animações de esqueleto (Idle/Run).

Kenney Assets: Modelos 3D Low Poly.
Textura da grama: https://github.com/orgs/community/discussions/58455

### Documentação utilizada:
AnimationAction: https://threejs.org/docs/#AnimationAction 
Mixamo: https://www.mixamo.com/#/ 
ThreeJs: https://threejs.org/docs/ 

Link do Video: https://drive.google.com/file/d/1YnMFwzWUIwIKS21U0_Tz4og1yNV71dXv/view?usp=sharing
