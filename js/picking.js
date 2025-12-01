function pick(x, y) {

    if (mirrorMode === true) {
        return;
    }

    let mx = (2 * x / gl.canvas.width) - 1;
    let my = 1 - (2 * y / gl.canvas.height);

    selectedObj = null;

    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];

        let inv = inverse(obj.transform);

        let [mxl, myl] = applyMat4ToVec2(inv, [mx, my])

        let inside = pointInPolygon([mxl, myl], obj.vertices);

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
        let xCurrent = verticeAtual[0];
        let yCurrent = verticeAtual[1];

        let verticeAnterior;
        if (i === 0) {
            verticeAnterior = verts[verts.length - 1];
        } else {
            verticeAnterior = verts[i - 1];
        }

        let xLast = verticeAnterior[0];
        let yLast = verticeAnterior[1];

        let condicaoVertical =
            (yCurrent > y && yLast <= y) ||
            (yLast > y && yCurrent <= y);

        if (condicaoVertical) {
            let xIntersecao =
                xCurrent + (y - yCurrent) * (xLast - xCurrent) / (yLast - yCurrent);

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

