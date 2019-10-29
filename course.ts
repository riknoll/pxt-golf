namespace golf {
    export class Course {
        constructor(public map: Image, public puttPosition: Point, public holePosition: Point, public par: number) {
        }
    }

    export class Game {
        protected ball: Sprite;
        protected hole: Sprite;
        protected strokeCount: number;
        protected putting: boolean;
        protected hud: scene.Renderable;
        protected loadedCourse: Course;

        protected dialog: game.Dialog;

        constructor() {
            this.putting = false;

            game.onUpdate(() => this.onUpdate());
            sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, () => this.holeIn());
            this.hud = scene.createRenderable(0, (target, camera) => this.drawHUD(target, camera));

            let angle = 0;

            game.onShade(function () {
                if (controller.left.isPressed()) {
                    angle--;
                }
                if (controller.right.isPressed()) {
                    angle++;
                }
                screen.drawLine(this.ball.x, this.ball.y, this.ball.x + 15 * Math.cos(angle * (Math.PI / 180)), this.ball.y + 15 * Math.sin(angle * (Math.PI / 180)), 1)
            })

            controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
                this.hitBall(60, angle)
            });
        }

        loadCourse(c: Course) {
            if (this.ball) {
                this.ball.destroy();
            }

            if (this.hole) {
                this.hole.destroy();
            }

            scene.setBackgroundColor(4)
            enableSlopePhysics(c.map);

            this.ball = sprites.create(img`
                1 1 1
                1 1 1
                1 1 1
            `, SpriteKind.Player);

            this.ball._x = Fx8(c.puttPosition.x - 1);
            this.ball._y = Fx8(c.puttPosition.y - 1);

            this.hole = sprites.create(img`
                . f f f .
                f f f f f
                f f f f f
                f f f f f
                . f f f .
            `, SpriteKind.Enemy);

            this.hole._x = Fx8(c.holePosition.x - 2);
            this.hole._y = Fx8(c.holePosition.y - 2);

            this.strokeCount = 0;
            this.putting = true;
            this.loadedCourse = c;
        }

        onUpdate() {
            this.applyFriction();
        }

        protected drawHUD(target: Image, camera: scene.Camera) {
            if (this.strokeCount) screen.print("" + this.strokeCount, 1, target.height - 9)
            if (this.loadedCourse) screen.print("PAR " + this.loadedCourse.par, target.width - 32, target.height - 9);

            if (this.dialog) screen.drawImage(this.dialog.image,
                (target.width >> 1) - (this.dialog.image.width >> 1),
                (target.height >> 1) - (this.dialog.image.height >> 1))
        }

        protected hitBall(speed: number, angleDegrees: number) {
            if (!this.putting) return;
            this.putting = false;

            this.strokeCount++;

            const vx = Math.cos(angleDegrees * (Math.PI / 180)) * speed;
            const vy = Math.sin(angleDegrees * (Math.PI / 180)) * speed;

            this.ball.setVelocity(vx, vy);
        }

        protected applyFriction() {
            if (!this.ball) return;
            let speed = golf.speed(this.ball);
            const heading = golf.heading(this.ball);

            if (speed < 1) {
                speed = 0;

                this.putting = true;
                this.onPuttingStart();
            }
            else {
                speed -= 0.15;
            }

            this.ball.vx = speed * Math.cos(heading);
            this.ball.vy = speed * Math.sin(heading);
        }

        protected onPuttingStart() {

        }

        protected holeIn() {
            const score = this.strokeCount;
            const descriptor = getScoreDescriptor(score, this.loadedCourse.par);

            this.hole.destroy();
            game.splash(descriptor);
        }
    }

    function getScoreDescriptor(strokes: number, par: number) {
        const diff = strokes - par;

        switch (diff) {
            case 3:
                return "TRIPLE BOGEY";
            case 2:
                return "DOUBLE BOGEY";
            case 1:
                return "BOGEY";
            case 0:
                return "PAR";
            case -1:
                return "BIRDIE";
            case -2:
                return "EAGLE";
            case -3:
                return "ALBATROSS";
            case -4:
                return "CONDOR";
            default:
                return "+" + diff;
        }
    }
}