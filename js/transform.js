// Reconstruir matriz do objeto
function rebuildMatrix(obj) {
    let M = mat4();
    M = mult(M, translate(obj.translation[0], obj.translation[1], 0));
    M = mult(M, rotate(obj.rotation, [0, 0, 1]));
    M = mult(M, scalem(obj.scale[0], obj.scale[1], 1));
    return M;
}

// Aplicar mat4 em vec2
function applyMat4ToVec2(M, v) {
    const x = v[0], y = v[1];
    return [
        M[0][0] * x + M[0][1] * y + M[0][3],
        M[1][0] * x + M[1][1] * y + M[1][3]
    ];
}

// Calcular centro local
function computeLocalCenter(obj) {
    let sx = 0, sy = 0;
    for (let v of obj.vertices) {
        sx += v[0];
        sy += v[1];
    }
    return [sx / obj.vertices.length, sy / obj.vertices.length];
}
