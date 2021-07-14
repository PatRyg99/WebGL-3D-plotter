// Patryk Rygiel

const vertCode = `
    uniform mat4 transformMatrix;
    
    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float vSize;

    varying vec4 vColor;

    void main(void) {
        gl_Position = transformMatrix * coordinates;
        gl_PointSize = vSize;
        vColor = color;
    }
`
const fragCode = `
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`

const fragBlendCode = `
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        vec4 bg = vec4(0.0, 0.0, 0.0, 0.8);
        gl_FragColor = mix(vColor, bg, gl_FragCoord.z);
    }
`

const vertLightCode = `
    uniform mat4 transformMatrix;

    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float vSize;
    attribute vec3 normal;

    varying vec4 vColor;
    varying vec3 vNormal;

    void main(void) {
        gl_Position = transformMatrix * coordinates;
        gl_PointSize = vSize;
        vColor = color;
        vNormal = normal;
    }
`

const fragLightCode = `
    precision mediump float;

    varying vec4 vColor;
    varying vec3 vNormal;
    
    uniform vec3 reverseLightDirection;

    void main(void) {
        vec3 normal = normalize(vNormal);
        float light = dot(normal, reverseLightDirection);
        
        vec3 ambient = 0.9 * vec3(1.0, 1.0, 1.0);

        gl_FragColor = vColor;
        gl_FragColor.rgb *= light * ambient;
    }
`

const ShaderEnum = Object.freeze({
    "basic": [vertCode, fragCode], 
    "blend": [vertCode, fragBlendCode], 
    "light": [vertLightCode, fragLightCode]
})

function initGL(gl, canvas, shaderType) {
    // --------------------- ATTACHING SHADER ---------------------
    const vertShader = setShader(gl, shaderType[0], gl.VERTEX_SHADER)
    const fragShader = setShader(gl, shaderType[1], gl.FRAGMENT_SHADER)

    // -------------------- CREATING SHADER PROGRAM ----------------------
    const shaderProgram = setupProgram(gl, [vertShader, fragShader])
    
    // ------------------- BIND ATTRIBUTES LOCATIONS --------------------
    if(shaderType === ShaderEnum.light) {
        bindAttributes(gl, shaderProgram, ["coordinates", "color", "vSize", "normal"])  
    } else {
        bindAttributes(gl, shaderProgram, ["coordinates", "color", "vSize"])   
    }

    // ------------------- INIT BACKGROUND AND RENDERING ----------------------
    gl.enable(gl.DEPTH_TEST)
    gl.viewport(0, 0, canvas.width, canvas.height)

    return shaderProgram
}

function renderAll(gl, shaderProgram, datas, shaderType) {

    // --------------------- CLEARING BUFFER ----------------------
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    for(var i = 0; i < datas.length; i++) {
        render(gl, shaderProgram, datas[i], shaderType)
    }
}

function render(gl, shaderProgram, data, shaderType) {

    // --------------------- BUFFERS -----------------------
    const vertexBuffer = setBuffer(gl, data.vertices)
    const colorBuffer = setBuffer(gl, data.colors)
    const vsizeBuffer = setBuffer(gl, data.vsize)

    // ------------------- APPLYING TRANSFORMATION MATRIX --------------------
    var transformMatrix = gl.getUniformLocation(shaderProgram, 'transformMatrix');
    gl.uniformMatrix4fv(transformMatrix, false, glMatrix4FromMatrix(data.tfmMatrix));

    // ------------------- ATTACHING SHADERS TO BUFFERS -------------------
    attachBuffer(gl, vertexBuffer, 0, 4)
    attachBuffer(gl, colorBuffer, 1, 4)
    attachBuffer(gl, vsizeBuffer, 2, 1)
    
    // ------------------- APPLYING LIGHT ----------------------
    if(shaderType === ShaderEnum.light) {
        const normalsBuffer = setBuffer(gl, data.normals)

        var lightSource = gl.getUniformLocation(shaderProgram, "reverseLightDirection");
        gl.uniform3fv(lightSource, normalize([0.5, 0.7, 1]));  

        attachBuffer(gl, normalsBuffer, 3, 3)
    }

    // ------------------DRAWING THE PRIMITIVE -------------------
    gl.drawArrays(data.glType, 0, data.vertices.length)
}

function normalize(v) {
    var dst = []
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    if (length > 0.00001) {
      dst.push(v[0] / length);
      dst.push(v[1] / length);
      dst.push(v[2] / length);
    }
    return dst;
  }