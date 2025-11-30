function rebuildMatrix(obj) {
    let M = mat4();
    M = mult(M, translate(obj.translation[0], obj.translation[1], 0));
    M = mult(M, rotate(obj.rotation, [0, 0, 1]));
    M = mult(M, scalem(obj.scale[0], obj.scale[1], 1));
    return M;
}

function applyMat4ToVec2(M, v) {
    const x = v[0];
    const y = v[1];

    let nx = M[0][0] * x + M[0][1] * y + M[0][3];
    let ny = M[1][0] * x + M[1][1] * y + M[1][3];

    return [nx, ny];
}

function computeLocalCenter(obj) {
    let sx = 0;
    let sy = 0;

    for (let i = 0; i < obj.vertices.length; i++) {
        sx += obj.vertices[i][0];
        sy += obj.vertices[i][1];
    }

    let cx = sx / obj.vertices.length;
    let cy = sy / obj.vertices.length;

    return [cx, cy];
}
