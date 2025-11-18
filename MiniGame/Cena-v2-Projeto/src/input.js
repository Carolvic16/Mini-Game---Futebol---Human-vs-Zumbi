export const teclasPressionadas = {

    w: false,
    a: false,
    s: false,
    d: false,

    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false

};

// listeners = key up e down - 
export function setupEventListeners() {
    document.addEventListener('keydown', (evento) => {
        const key = evento.key;
        if (teclasPressionadas.hasOwnProperty(key)) {
            teclasPressionadas[key] = true;
        } else if (teclasPressionadas.hasOwnProperty(key.toLowerCase())) {
            teclasPressionadas[key.toLowerCase()] = true;
        }
    });

    document.addEventListener('keyup', (evento) => {
        const key = evento.key;
        if (teclasPressionadas.hasOwnProperty(key)) {
            teclasPressionadas[key] = false;
        } else if (teclasPressionadas.hasOwnProperty(key.toLowerCase())) {
            teclasPressionadas[key.toLowerCase()] = false;
        }
    });
}