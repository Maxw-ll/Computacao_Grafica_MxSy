function drawObject(obj) {

    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(obj.vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.uniformMatrix4fv(transformLoc, false, flatten(obj.transform));
    gl.uniform4fv(colorLoc, new Float32Array(obj.selected ? obj.selectedColor : obj.color));

    gl.drawArrays(gl.TRIANGLE_FAN, 0, obj.vertices.length);
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let obj of objects) {
        drawObject(obj);
    }

    renderMirrorLine();

    updateInfoPanel(); 

    requestAnimFrame(render);
}
