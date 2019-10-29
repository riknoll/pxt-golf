namespace golf {
    export interface Anchor {
        x: number;
        y: number;
    }

    export class Point implements Anchor {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export function reflectVector(incoming: Point, normal: Point) {
        return subVector(incoming, scaleVector(2 * dotProduct(incoming, normal), normal));
    }

    export function dotProduct(a: Point, b: Point) {
        return a.x * b.x + a.y * b.y;
    }

    export function addVector(a: Point, b: Point) {
        return new Point(a.x + b.x, a.y + b.y);
    }

    export function addToVector(a: Point, b: Point) {
        a.x += b.x;
        a.y += b.y;
        return a;
    }

    export function subVector(a: Point, b: Point) {
        return new Point(a.x - b.x, a.y - b.y);
    }

    export function subFromVector(a: Point, b: Point) {
        a.x -= b.x;
        a.y -= b.y;
        return a;
    }

    export function scaleVector(scalar: number, vector: Point) {
        return new Point(scalar * vector.x, scalar * vector.y);
    }

    export function scaleVectorBy(scalar: number, vector: Point) {
        vector.x *= scalar;
        vector.y *= scalar;
        return vector;
    }

    export function magnitude(vector: Point) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    export function sumVectors(vectors: Point[]) {
        return vectors.reduce(addToVector, new Point(0, 0));
    }

    export function averageVectors(vectors: Point[]) {
        return scaleVector(1 / vectors.length, sumVectors(vectors));
    }

    export function normalize(vector: Point) {
        const mag = magnitude(vector);
        return mag ? scaleVector(1 / mag, vector) : vector;
    }

    export function rotate(origin: Point, point: Point, angle: number) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return new Point(
            origin.x + cos * (point.x - origin.x) - sin * (point.y - origin.y),
            origin.y + sin * (point.x - origin.x) + cos * (point.y - origin.y)
        );
    }

    export function drawPolygon(points: Point[], center: Point, color: number, camera: scene.Camera) {
        const ox = center.x - camera.offsetX;
        const oy = center.y - camera.offsetY;

        let prev = points[0];
        let current: Point;

        for (let i = 1; i < points.length; i++) {
            current = points[i];
            screen.drawLine(
                prev.x + ox,
                prev.y + oy,
                current.x + ox,
                current.y + oy,
                color);
            prev = current;
        }
        screen.drawLine(
            prev.x + ox,
            prev.y + oy,
            points[0].x + ox,
            points[0].y + oy,
            color);
    }
}