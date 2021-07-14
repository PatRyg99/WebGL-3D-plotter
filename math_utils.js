// Patryk Rygiel

const identityMatrix4 = [
    [ 1,0,0,0 ],
    [ 0,1,0,0 ],
    [ 0,0,1,0 ],
    [ 0,0,0,1 ],
];

const scalarProduct4 = function( v,w ) {
    return v[0]*w[0]+v[1]*w[1]+v[2]*w[2]+v[3]*w[3];
};

const matrix4Column = function( m, c ) {
    return [ m[0][c], m[1][c], m[2][c], m[3][c] ]; 
};

const matrix4Product = function( m1, m2){ 
    var sp = scalarProduct4;
    var col = matrix4Column;
    return [ 
	[ sp(m1[0], col(m2, 0)) , sp(m1[0], col(m2, 1)),  sp(m1[0], col(m2, 2)),  sp(m1[0], col(m2, 3)) ], 
	[ sp(m1[1], col(m2, 0)) , sp(m1[1], col(m2, 1)),  sp(m1[1], col(m2, 2)),  sp(m1[1], col(m2, 3)) ], 
	[ sp(m1[2], col(m2, 0)) , sp(m1[2], col(m2, 1)),  sp(m1[2], col(m2, 2)),  sp(m1[1], col(m2, 3)) ], 
	[ sp(m1[3], col(m2, 0)) , sp(m1[3], col(m2, 1)),  sp(m1[3], col(m2, 2)),  sp(m1[3], col(m2, 3)) ] 
    ];
};

const glMatrix4 = function (
    xx, yx, zx, wx,
    xy, yy, zy, wy,
    xz, yz, zz, wz,
    xw, yw, zw, ww 
    ){
        return new Float32Array([ 
            xx, xy, xz, xw,
            yx, yy, yz, yw,
            zx, zy, zz, zw,
            wx, wy, wz, ww 
        ]);
    };
    

const glMatrix4FromMatrix = function( m ) {
    return glMatrix4( 
	m[0][0], m[0][1], m[0][2], m[0][3],
	m[1][0], m[1][1], m[1][2], m[1][3],
	m[2][0], m[2][1], m[2][2], m[2][3],
	m[3][0], m[3][1], m[3][2], m[3][3]
    );
};


const calculateNormal = function(p1, p2, p3) {

    var U = {x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z}
    var V = {x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z}

    return {
        x: U.y * V.z - U.z * V.y,
        y: U.z * V.x - U.x * V.z,
        z: U.x * V.y - U.y * V.x
    }
}