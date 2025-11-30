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
    if (!selectedObj) return;

    let obj = selectedObj;
    let A = mirrorPoints[0];
    let B = mirrorPoints[1];

    let worldVerts = obj.vertices.map(v => applyMat4ToVec2(obj.transform, v));
    let reflected = worldVerts.map(v => reflectPointOverLine(v, A, B));

    let C = [0, 0];
    for (let p of reflected) {
        C[0] += p[0];
        C[1] += p[1];
    }
    C[0] /= reflected.length;
    C[1] /= reflected.length;

    obj.vertices = reflected.map(p => vec2(p[0] - C[0], p[1] - C[1]));

    obj.translation = vec2(C[0], C[1]);
    obj.rotation = 0;
    obj.scale = vec2(1, 1);
    obj.transform = rebuildMatrix(obj);
}

function renderMirrorLine() {
    if (!mirrorPreview && mirrorPoints.length < 1) return;

    let A, B;

    if (mirrorPreview) {
        A = mirrorPreview[0];
        B = mirrorPreview[1];
    } else if (mirrorPoints.length >= 2) {
        A = mirrorPoints[0];
        B = mirrorPoints[1];
    } else return;

    let dx = B[0] - A[0];
    let dy = B[1] - A[1];
    let len = Math.sqrt(dx*dx + dy*dy);

    dx /= len;
    dy /= len;

    let L = 5;
    let P1 = [A[0] - dx * L, A[1] - dy * L];
    let P2 = [A[0] + dx * L, A[1] + dy * L];

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([vec2(...P1), vec2(...P2)]), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniform4fv(colorLoc, new Float32Array([1, 1, 1, 1]));
    gl.uniformMatrix4fv(transformLoc, false, flatten(mat4()));

    gl.drawArrays(gl.LINES, 0, 2);
}
