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
    let inside = 0;

    for (let i = 0; i < verts.length; i++) {

        let verticeAtual = verts[i];
        let xi = verticeAtual[0];
        let yi = verticeAtual[1];

        let verticeAnterior;
        if (i === 0) {
            verticeAnterior = verts[verts.length - 1];
        } else {
            verticeAnterior = verts[i - 1];
        }

        let xj = verticeAnterior[0];
        let yj = verticeAnterior[1];

        let condicaoVertical =
            (yi > y && yj <= y) ||
            (yj > y && yi <= y);

        if (condicaoVertical) {
            let xIntersecao =
                xi + (y - yi) * (xj - xi) / (yj - yi);

            if (x < xIntersecao) {
                inside += 1;
            }
        }
    }

    if(inside % 2 == 0){
        return false;
    } 

    return true;
}

