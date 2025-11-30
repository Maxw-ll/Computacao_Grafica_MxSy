// Estado global

let gl;
let program;
let vPosition, colorLoc, transformLoc;

let mode = "translate"; 
let dragging = false;
let selectedObj = null;
let lastMouse = null;

// Estado do espelho
let mirrorMode = false;
let mirrorPoints = [];
let mirrorPreview = null;

function enterMirrorMode() {
    mirrorMode = true;
    mirrorPoints = [];
    mirrorPreview = null;
}

function setMode(newMode) {

    // Cancelar linha inacabada
    if (mirrorMode && mirrorPoints.length < 2) {
        mirrorPoints = [];
        mirrorPreview = null;
    }

    // Apagar linha final ao trocar de modo
    if (mirrorPoints.length === 2 && newMode !== "mirror") {
        mirrorPoints = [];
        mirrorPreview = null;
    }

    mirrorMode = false;
    mode = newMode;
}
