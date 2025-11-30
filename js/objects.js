// Objetos do trabalho (polígonos em espaço local)
let objects = [
    {
        name: "triangulo",
        color: [1.0, 0.2, 0.2, 1.0],
        selectedColor: [1.0, 1.0, 0.0, 1.0],

        // Espaço local
        vertices: [
            vec2(0.5, 0.15),
            vec2(0.35, -0.15),
            vec2(0.65, -0.15)
        ],

        // Estado dinâmico
        transform: mat4(),
        selected: false,
        translation: vec2(0, 0),
        rotation: 0,
        scale: vec2(1, 1),
    },

    {
        name: "quadrado",
        color: [0.2, 0.6, 1.0, 1.0],
        selectedColor: [1.0, 1.0, 0.0, 1.0],

        vertices: [
            vec2(-0.20, 0.20),
            vec2(0.20, 0.20),
            vec2(0.20, -0.20),
            vec2(-0.20, -0.20)
        ],

        transform: mat4(),
        selected: false,
        translation: vec2(0, 0),
        rotation: 0,
        scale: vec2(1, 1),
    },

        {
        name: "Pentagono",
        color: [1.0, 0.1, 1.0, 1.0],
        selectedColor: [1.0, 1.0, 0.0, 1.0],

        vertices: [
            vec2(-0.538, 0.165),
            vec2(-0.32, 0.053),
            vec2(-0.393, -0.198),
            vec2(-0.683, -0.198),
            vec2(-0.756, 0.053)
        ],

        transform: mat4(),
        selected: false,
        translation: vec2(0, 0),
        rotation: 0,
        scale: vec2(1, 1),
    }
];
