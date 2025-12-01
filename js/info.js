function updateInfoPanel() {

    let infoBox = document.getElementById("infoText");

    if (selectedObj === null) {
        infoBox.textContent = "Nenhum objeto selecionado";
        return;
    }

    let center = applyMat4ToVec2(
        selectedObj.transform,
        computeLocalCenter(selectedObj)
    );

    let text = "";

    text += "Nome: " + selectedObj.name + "\n";
    text += "Selecionado: " + selectedObj.selected + "\n\n";

    text += "--- Transformações ---\n";
    text += "Translação: (" +
        selectedObj.translation[0].toFixed(3) + ", " +
        selectedObj.translation[1].toFixed(3) + ")\n";

    text += "Rotação: " + selectedObj.rotation.toFixed(2) + " graus\n";

    text += "Escala: (" +
        selectedObj.scale[0].toFixed(2) + ", " +
        selectedObj.scale[1].toFixed(2) + ")\n\n";

    text += "Centro (No Mundo): (" +
        center[0].toFixed(3) + ", " +
        center[1].toFixed(3) + ")\n\n";

    text += "--- Vértices (Local) ---\n";

    for (let i = 0; i < selectedObj.vertices.length; i++) {
        let v = selectedObj.vertices[i];
        text += "v" + i + ": (" +
            v[0].toFixed(3) + ", " +
            v[1].toFixed(3) + ")\n";
    }

    text += "\n--- Vértices (Mundo) ---\n";

    for (let i = 0; i < selectedObj.vertices.length; i++) {
        let v = selectedObj.vertices[i];
        let w = applyMat4ToVec2(selectedObj.transform, v);

        text += "v" + i + ": (" +
            w[0].toFixed(3) + ", " +
            w[1].toFixed(3) + ")\n";
    }

    infoBox.textContent = text;
}
