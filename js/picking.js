function pick(x, y) {

    if (mirrorMode === true) {
        return;
    }

    let cx = (2 * x / gl.canvas.width) - 1;
    let cy = 1 - (2 * y / gl.canvas.height);

    selectedObj = null;

    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];

        let inv = inverse(obj.transform);

        let xp = inv[0][0] * cx + inv[0][1] * cy + inv[0][3];
        let yp = inv[1][0] * cx + inv[1][1] * cy + inv[1][3];

        let inside = pointInPolygon([xp, yp], obj.vertices);

        if (inside === true) {
            obj.selected = true;
            selectedObj = obj;
        } else {
            obj.selected = false;
        }
    }
}

function pointInPolygon(point, verts) {

    let x = point[0];
    let y = point[1];
    let inside = false;

    for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {

        let xi = verts[i][0];
        let yi = verts[i][1];

        let xj = verts[j][0];
        let yj = verts[j][1];

        let cond1 = (yi > y) !== (yj > y);

        let cond2 = x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.00001) + xi;

        if (cond1 && cond2) {
            inside = !inside;
        }
    }

    return inside;
}
