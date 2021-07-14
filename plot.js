// Patryk Rygiel

function generatePlot(margin, func, color=[0, 0.9, 0.9]) {
    var vertices = [];
    var colors = [];
    var vsizes = [];
    var normals = [];

    const samples = 150;
    const dSample = (2.0 - 2*margin) / samples;

    var points = [];
    var maxY = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;

    console.log("Calculating function...")

    // Generate function vertices
    for(var i = 0; i <= samples; i++) {
        for(var j = 0; j <= samples; j++) {

            // Current point
            var x1 = margin + dSample * i - 1.0;
            var z1 = margin + dSample * j - 1.0;
            var y1 = func(x1, z1)

            maxY = Math.max(maxY, y1)
            minY = Math.min(minY, y1)

            points.push({x: x1, y: y1, z: z1})
        }
    }

    console.log("Normalization...")

    // Normalization
    for(var i = 0; i < points.length; i++) {
        var y_norm = (points[i].y - minY) / (maxY - minY);
        y_norm *= 2.0 * (1.0 - margin);
        y_norm -= 1.0 - margin;

        points[i].y = y_norm
    }

    console.log("Triangulation...")
    
    // Triangulation
    for(var i = 0; i < samples; i++) {
        for(var j = 1; j <= samples; j++) {

            var idx = i * (samples + 1) + j

            // Create first triangle
            var p1 = points[idx + samples]
            var p2 = points[idx + samples + 1]
            var p3 = points[idx]

            var normal1 = calculateNormal(p3, p2, p1)

            // Create second triangle
            var p4 = points[idx-1]
            var p5 = points[idx + samples]
            var p6 = points[idx]

            var normal2 = calculateNormal(p6, p5, p4)

            // Append data
            vertices.push(
                p1.x, p1.y, p1.z, 1.0,
                p2.x, p2.y, p2.z, 1.0,
                p3.x, p3.y, p3.z, 1.0,

                p4.x, p4.y, p4.z, 1.0,
                p5.x, p5.y, p5.z, 1.0,
                p6.x, p6.y, p6.z, 1.0,
            )

            colors.push(
                color[0], color[1], color[2], 1,
                color[0], color[1], color[2], 1,
                color[0], color[1], color[2], 1,

                color[0], color[1], color[2], 1,
                color[0], color[1], color[2], 1,
                color[0], color[1], color[2], 1,
            )

            vsizes.push(3, 3, 3, 3, 3, 3)

            normals.push(
                normal1.x, normal1.y, normal1.z,
                normal1.x, normal1.y, normal1.z,
                normal1.x, normal1.y, normal1.z,

                normal2.x, normal2.y, normal2.z,
                normal2.x, normal2.y, normal2.z,
                normal2.x, normal2.y, normal2.z,
            )
        }
    }

    console.log("Generated")

    return new Data(vertices, colors, vsizes, gl.POINTS, normals);
}

function generateGrid(width, height, margin) {

    var vertices = [];
    var colors = [];
    var vsizes = [];
    var normals = [];

    // Generate X lines
    var xSpace = (2.0 - 2*margin) / width;

    for(var i = 0; i <= width; i++) {
        vertices = vertices.concat([
            margin + i*xSpace - 1.0, 0.0, -1.0 + margin, 1.0,
            margin + i*xSpace - 1.0, 0.0, 1.0 - margin, 1.0
        ]);
        
        colors = colors.concat([
            1, 1, 1, 1,
            1, 1, 1, 1,
        ]);

        vsizes = vsizes.concat([
            10
        ])

        normals = normals.concat([
            0, 1, 0,
        ])
    }

    // Generate Z lines
    var zSpace = (2.0 - 2*margin) / height;
    for(var i = 0; i <= height; i++) {
        vertices = vertices.concat([
            -1.0 + margin, 0.0, margin + i*zSpace - 1.0, 1.0,
            1.0 - margin, 0.0, margin + i*zSpace - 1.0, 1.0
        ]);
        
        colors = colors.concat([
            1, 1, 1, 1,
            1, 1, 1, 1,
        ]);

        vsizes = vsizes.concat([
            10
        ])

        normals = normals.concat([
            0, 1, 0,
        ])
    }

    // Generate Y axis
    vertices = vertices.concat([
        0.0, 1.0 - margin, 0.0, 1.0,
        0.0, -1.0 + margin, 0.0, 1.0
    ]);
    
    colors = colors.concat([
        1, 1, 1, 1,
        1, 1, 1, 1,
    ]);

    vsizes = vsizes.concat([
        10
    ])

    normals = normals.concat([
        1, 0, 1
    ])

    return new Data(vertices, colors, vsizes, gl.LINES, normals);
}