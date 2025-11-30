function reflectPointOverLine(P, A, B) {
    let px = P[0] - A[0];
    let py = P[1] - A[1];

    let dx = B[0] - A[0];
    let dy = B[1] - A[1];

    let theta = Math.atan2(dy, dx);

    let x1 = px * Math.cos(-theta) - py * Math.sin(-theta);
    let y1 = px * Math.sin(-theta) + py * Math.cos(-theta);

    let x2 = x1;
    let y2 = -y1;

    let xr = x2 * Math.cos(theta) - y2 * Math.sin(theta);
    let yr = x2 * Math.sin(theta) + y2 * Math.cos(theta);

    return [xr + A[0], yr + A[1]];
}

function applyMirrorToSelected() {

    if (selectedObj === null) {
        return;
    }

    let obj = selectedObj;

    let A = mirrorPoints[0];
    let B = mirrorPoints[1];

    let worldVerts = [];

    for (let i = 0; i < obj.vertices.length; i++) {
        let v = obj.vertices[i];
        let w = applyMat4ToVec2(obj.transform, v);
        worldVerts.push(w);
    }

    let reflected = [];

    for (let i = 0; i < worldVerts.length; i++) {
        let p = worldVerts[i];
        let r = reflectPointOverLine(p, A, B);
        reflected.push(r);
    }

    let cx = 0;
    let cy = 0;

    for (let i = 0; i < reflected.length; i++) {
        cx += reflected[i][0];
        cy += reflected[i][1];
    }

    cx /= reflected.length;
    cy /= reflected.length;

    let localVerts = [];

    for (let i = 0; i < reflected.length; i++) {
        let vx = reflected[i][0] - cx;
        let vy = reflected[i][1] - cy;
        localVerts.push(vec2(vx, vy));
    }

    obj.vertices = localVerts;

    obj.translation = vec2(cx, cy);
    obj.rotation = 0;
    obj.scale = vec2(1, 1);
    obj.transform = rebuildMatrix(obj);
}

function renderMirrorLine() {

    let shouldDraw = false;

    if (mirrorPreview !== null) {
        shouldDraw = true;
    }

    if (mirrorPoints.length >= 2) {
        shouldDraw = true;
    }

    if (shouldDraw === false) {
        return;
    }

    let A;
    let B;

    if (mirrorPreview !== null) {
        A = mirrorPreview[0];
        B = mirrorPreview[1];
    } else {
        A = mirrorPoints[0];
        B = mirrorPoints[1];
    }

    let dx = B[0] - A[0];
    let dy = B[1] - A[1];

    let len = Math.sqrt(dx * dx + dy * dy);

    dx /= len;
    dy /= len;

    let L = 5;

    let P1 = [A[0] - dx * L, A[1] - dy * L];
    let P2 = [A[0] + dx * L, A[1] + dy * L];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, flatten([
        vec2(P1[0], P1[1]),
        vec2(P2[0], P2[1])
    ]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform4fv(colorLoc, [1, 1, 1, 1]);
    gl.uniformMatrix4fv(transformLoc, false, flatten(mat4()));

    gl.drawArrays(gl.LINES, 0, 2);
}
