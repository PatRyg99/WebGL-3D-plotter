// Patryk Rygiel

// SETTING UP BUFFERS
function setBuffer(gl, data) {

    // Creating an empty buffer object to store data
    const buffer = gl.createBuffer()

    // Binding array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    // Pass the data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return buffer
}


// SETTING UP SHADERS
function setShader(gl, shaderCode, shaderType) {

    // Create vertex shader object
    var shader = gl.createShader(shaderType)

    // Attach vertex shader source code
    gl.shaderSource(shader, shaderCode)

    // Compile the vertex shader
    gl.compileShader(shader)

    return shader
}


// SETTING UP PROGRAM
function setupProgram(gl, shaders) {
    const program = gl.createProgram()

    for (var i = 0; i < shaders.length; i++) {
        gl.attachShader(program, shaders[i])
    } 

    gl.linkProgram(program)
    gl.useProgram(program)
    
    return program
}


// BIND ATTRIBUTE LOCATIONS
function bindAttributes(gl, program, attrs) {
    for(var i = 0; i < attrs.length; i++) {
        gl.bindAttribLocation(program, i, attrs[i])
    }
}


// ATTACHING BUFFER
function attachBuffer(gl, buffer, location, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(location)
}


// PRINTING ATTRS
function printAttrs(gl, program, attrLabel) {

    attrLabel.innerHTML = "Active attributes: \n"
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < numAttribs; ++i) {
        const info = gl.getActiveAttrib(program, i);
        attrLabel.innerHTML += `name: ${info.name}, type: ${info.type}, size: ${info.size}\n`
    }

    attrLabel.innerHTML += "\nUniform attributes: \n"
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < numUniforms; ++i) {
        const info = gl.getActiveUniform(program, i);
        attrLabel.innerHTML += `name: ${info.name}, type: ${info.type}, size: ${info.size}\n`
    }

    attrLabel.innerHTML += "\n"
}