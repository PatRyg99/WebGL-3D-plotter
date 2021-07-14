// Patryk Rygiel

class Data {
    constructor(vertices, colors, vsize, glType, normals = []) {
        this.vertices = vertices;
        this.colors = colors;
        this.vsize = vsize;
        this.glType = glType;
        this.normals = normals;

        this.tfmMatrix = identityMatrix4;
    }

    reset() {
        this.tfmMatrix = identityMatrix4;
    }

    rotateYZ(alpha) {
        var c = Math.cos(alpha);
        var s = Math.sin(alpha); 
        var rot = [ 
            [1, 0,  0, 0],
            [0, c, -s, 0],
            [0, s,  c, 0], 
            [0, 0,  0, 1]
        ];
    
        this.tfmMatrix = matrix4Product(rot, this.tfmMatrix);
    }

    rotateXZ(alpha) {
        var c = Math.cos(alpha);
        var s = Math.sin(alpha);

        var rot = [
            [c, 0, -s, 0],
            [0, 1,  0, 0],
            [s, 0,  c, 0],
            [0, 0,  0, 1]
        ];
    
        this.tfmMatrix = matrix4Product(rot, this.tfmMatrix);
    }

    projectX(p) {
        this.tfmMatrix[0][2] += p;
    }

    translateX(t) {
        this.tfmMatrix[0][3] += t;
    }

    translateY(t) {
        this.tfmMatrix[1][3] += t;
    }

    translateZ(t) {
        this.tfmMatrix[2][3] += t;
    }
}