namespace golf {
    export class MovingPlatform extends Platform {
        protected points: Point[];
        protected pathIndex: number;
        
        protected fun: LinearFunction;
        protected timer: number;
        protected interval: number;

        constructor(map: Image) {
            super(map, 0, 0, TileScale.Eight);
            this.points = [];
            this.fun = new LinearFunction();
        }

        setPath(points: Point[], interval: number) {
            this.points = points;
            this.interval = interval;
            this.timer = this.interval;
            this.pathIndex = 0;
            this.updateTimingFunction();
        }

        __update(camera: scene.Camera, dt: number) {
            dt = dt * 1000

            this.timer -= dt;

            if (this.timer < 0) {
                this.pathIndex = (this.pathIndex + 1) % this.points.length;
                this.updateTimingFunction();
            }

            this.fun.moveTo(this, 1 - (this.timer / this.interval));
        }

        protected updateTimingFunction() {
            this.fun.setAnchor(this.points[this.pathIndex], this.points[(this.pathIndex + 1) % this.points.length]);
            this.timer = this.interval;
        }
    }

    export class LinearFunction {
        protected p0x: number;
        protected p0y: number;
        protected p1x: number;
        protected p1y: number;

        setAnchor(p0: Point, p1: Point) {
            this.p0x = p0.x;
            this.p0y = p0.y;
            this.p1x = p1.x;
            this.p1y = p1.y;
        }

        setP0(x: number, y: number) {
            this.p0x = x;
            this.p0y = y
        }

        setP1(x: number, y: number) {
            this.p1x = x;
            this.p1y = y
        }

        moveTo(target: Platform, t: number) {
            target.move(
                Fx.sub(Fx8((this.p0x + (this.p1x - this.p0x) * t)), target.left),
                Fx.sub(Fx8((this.p0y + (this.p1y - this.p0y) * t)), target.top)
            );
        }
    }
} 