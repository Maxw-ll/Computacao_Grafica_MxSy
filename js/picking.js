function pick(x, y) {
    if (mirrorMode) return;

    let cx = (2 * x / gl.canvas.width) - 1;
    let cy = 1 - 2 * (y / gl.canvas.height);

    selectedObj = null;

    for (let obj of objects) {

        let inv = inverse(obj.transform);

        let xp = inv[0][0] * cx + inv[0][1] * cy + inv[0][3];
        let yp = inv[1][0] * cx + inv[1][1] * cy + inv[1][3];

        if (pointInPolygon([xp, yp], obj.vertices)) {
            obj.selected = true;
            selectedObj = obj;
        } else {
            obj.selected = false;
        }
    }
}

// Teste ponto em polígono
function pointInPolygon(point, verts) {
    let [x, y] = point;
    let inside = false;

    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
        let xi = verts[i][0], yi = verts[i][1];
        let xj = verts[j][0], yj = verts[j][1];

        let intersect =
            (yi > y) !== (yj > y) &&
            x < (xj - xi) * (y - yi) / ((yj - yi) || 0.00001) + xi;

        if (intersect) inside = !inside;
    }
    return inside;
}
