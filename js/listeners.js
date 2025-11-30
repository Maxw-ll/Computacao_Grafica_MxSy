function setupMouse(canvas) {

    canvas.addEventListener("mousedown", function(e) {

        if (mirrorMode === true) {

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

        pick(e.offsetX, e.offsetY);

        if (selectedObj !== null) {
            dragging = true;
            lastMouse = { x: e.offsetX, y: e.offsetY };
        }
    });

    canvas.addEventListener("mousemove", function(e) {

        if (mirrorMode === true && mirrorPoints.length === 1) {
            let px = (2 * e.offsetX / gl.canvas.width) - 1;
            let py = 1 - (2 * e.offsetY / gl.canvas.height);

            mirrorPreview = [mirrorPoints[0], [px, py]];
            return;
        }

        if (dragging === false || selectedObj === null || mirrorMode === true) {
            return;
        }

        let dxPixels = e.offsetX - lastMouse.x;
        let dyPixels = e.offsetY - lastMouse.y;

        let dx = (dxPixels / gl.canvas.width) * 2;
        let dy = -(dyPixels / gl.canvas.height) * 2;

        if (mode === "translate") {
            selectedObj.translation[0] += dx;
            selectedObj.translation[1] += dy;
        }

        if (mode === "rotate") {
            selectedObj.rotation += dx * 200;
        }

        if (mode === "scale") {
            let s = 1 + dx;
            selectedObj.scale[0] *= s;
            selectedObj.scale[1] *= s;
        }

        selectedObj.transform = rebuildMatrix(selectedObj);

        lastMouse = { x: e.offsetX, y: e.offsetY };
    });

    canvas.addEventListener("mouseup", function() {
        dragging = false;
    });
}

window.addEventListener("keydown", function(e) {

    let key = e.key.toLowerCase();

    if (key === "t") {
        setMode("translate");
    }

    if (key === "r") {
        setMode("rotate");
    }

    if (key === "e") {
        setMode("scale");
    }

    if (key === "w") {
        enterMirrorMode();
    }
});
