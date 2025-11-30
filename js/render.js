function drawObject(obj) {

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    let color;

    if (obj.selected === true) {
        color = obj.selectedColor;
    } else {
        color = obj.color;
    }

    gl.uniformMatrix4fv(transformLoc, false, flatten(obj.transform));
    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, obj.vertices.length);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < objects.length; i++) {
        drawObject(objects[i]);
    }

    renderMirrorLine();

    updateInfoPanel();

    requestAnimFrame(render);
}
