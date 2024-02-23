interface Point3D {
    x: number;
    y: number;
    z: number;
}

interface Point2D {
    x: number;
    y: number;
}

const cubeVertices: Point3D[] = [
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 }
];

const cubeEdges: number[][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
];

let angle: number = 0;
let gameStarted: boolean = false;

function rotateVertex(vertex: Point3D, angle: number): Point3D {
    const cosA: number = Math.cos(angle);
    const sinA: number = Math.sin(angle);
    return {
        x: vertex.x * cosA - vertex.z * sinA,
        y: vertex.y,
        z: vertex.x * sinA + vertex.z * cosA
    };
}

function project(vertex: Point3D): Point2D {
    const scale: number = 2;
    const zOffset: number = 5;
    return {
        x: 2 + Math.round(scale * vertex.x / (vertex.z + zOffset)),
        y: 2 + Math.round(scale * vertex.y / (vertex.z + zOffset))
    };
}

function draw(): void {
    if (!gameStarted) {
        return;
    }

    basic.clearScreen();
    cubeEdges.forEach(edge => {
        const startVertex: Point2D = project(rotateVertex(cubeVertices[edge[0]], angle));
        const endVertex: Point2D = project(rotateVertex(cubeVertices[edge[1]], angle));
        line(startVertex.x, startVertex.y, endVertex.x, endVertex.y);
    });
}

function line(x0: number, y0: number, x1: number, y1: number): void {
    const dx: number = Math.abs(x1 - x0);
    const dy: number = -Math.abs(y1 - y0);
    let sx: number = (x0 < x1) ? 1 : -1;
    let sy: number = (y0 < y1) ? 1 : -1;
    let err: number = dx + dy;
    while (true) {
        led.plot(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        let e2: number = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
    }
}

input.onButtonPressed(Button.AB, function () {
    gameStarted = true;
});

basic.forever(function () {
    draw();
    angle += 0.05; // Adjust rotation speed here
    basic.pause(100); // Adjust refresh rate here
});
