function setupMouse(canvas) {

    canvas.addEventListener("mousedown", (e) => {

        // MODO ESPELHO
        if (mirrorMode) {

            let px = (2 * e.offsetX / gl.canvas.width) - 1;
            let py = 1 - (2 * e.offsetY / gl.canvas.height);

            mirrorPoints.push([px, py]);

            if (mirrorPoints.length === 1) {
                mirrorPreview = [mirrorPoints[0], mirrorPoints[0]];
            }

            if (mirrorPoints.length === 2) {
                mirrorMode = false;
                mirrorPreview = null;
                applyMirrorToSelected();
            }

            return;
        }

        // MODO NORMAL
        pick(e.offsetX, e.offsetY);

        if (selectedObj) {
            dragging = true;
            lastMouse = { x: e.offsetX, y: e.offsetY };
        }
    });

    canvas.addEventListener("mousemove", (e) => {

        if (mirrorMode && mirrorPoints.length === 1) {

            let px = (2 * e.offsetX / gl.canvas.width) - 1;
            let py = 1 - (2 * e.offsetY / gl.canvas.height);

            mirrorPreview = [mirrorPoints[0], [px, py]];
            return;
        }

        if (!dragging || !selectedObj || mirrorMode) return;

        let dxPixels = e.offsetX - lastMouse.x;
        let dyPixels = e.offsetY - lastMouse.y;

        let dx = (dxPixels / gl.canvas.width) * 2;
        let dy = -(dyPixels / gl.canvas.height) * 2;

        let o = selectedObj;

        if (mode === "translate") {
            o.translation[0] += dx;
            o.translation[1] += dy;
        }
        if (mode === "rotate") {
            o.rotation += dx * 200;
        }
        if (mode === "scale") {
            let s = 1 + dx;
            o.scale[0] *= s;
            o.scale[1] *= s;
        }

        o.transform = rebuildMatrix(o);
        lastMouse = { x: e.offsetX, y: e.offsetY };
    });

    canvas.addEventListener("mouseup", () => {
        dragging = false;
    });
}


// Teclado
window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();

    if (k === "t") setMode("translate");
    if (k === "r") setMode("rotate");
    if (k === "e") setMode("scale");
    if (k === "w") enterMirrorMode();
});
