namespace golf {
    export class Course {
        _onLoad: () => void;
        
        constructor(public map: Image, public puttPosition: Point, public holePosition: Point, public par: number) {
        }

        onLoad(cb: () => void) {
            this._onLoad = cb;
        }
    }

    export class Game {
        protected ball: Sprite;
        protected hole: Sprite;
        protected target: Sprite;
        protected strokeCount: number;
        protected putting: boolean;
        protected hud: scene.Renderable;
        protected loadedCourse: Course;

        protected dialog: game.Dialog;

        constructor() {
            this.putting = false;

            game.onUpdate(() => this.onUpdate());
            sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, () => this.holeIn());
            this.hud = scene.createRenderable(
                scene.HUD_Z,
                (target, camera) => this.drawHUD(target, camera),
                () => !PowerMeter.getInstance().active()
            );

            scene.createRenderable(
                zindex.PROJECTED_ANGLE,
                function () {
                    if (this.ball && this.target) {
                        const angle = angleToTarget(this.ball, this.target);
                        screen.drawLine(
                            this.ball.x,
                            this.ball.y,
                            this.ball.x + 10 * Math.cos(angle),
                            this.ball.y + 10 * Math.sin(angle),
                            1
                        );
                    }
                },
                () => this.putting
            );

            controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
                const pm = PowerMeter.getInstance();
                if (!this.putting) {
                    return;
                }
                if (!pm.active()) {
                    pm.start();
                    if (this.target) controller.moveSprite(this.target, 0, 0);
                } else if (!pm.finished()) {
                    pm.action();
                    if (pm.finished()) {
                        const acc = pm.accuracy()
                        const angle = angleToTarget(this.ball, this.target);
                        const randomVariance = Math.randomRange(-acc, acc) * (Math.PI / 180)

                        this.hitBall(pm.power(), angle + randomVariance);
                        pm.clear();
                        if (this.target) controller.moveSprite(this.target);
                    }
                }
            });

            controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
                PowerMeter.getInstance().clear();
                if (this.target) controller.moveSprite(this.target);
            });

            function angleToTarget(ball: Sprite, target: Sprite) {
                const diffY = target.bottom - ball.y - 1;
                const diffX = target.x - ball.x;

                return Math.atan2(diffY, diffX);
            }
        }

        loadCourse(c: Course) {
            if (this.ball) {
                this.ball.destroy();
            }

            if (this.hole) {
                this.hole.destroy();
            }

            if (this.target) {
                this.target.destroy();
            }

            scene.setBackgroundColor(4)
            enableSlopePhysics(c.map);
            
            SlopePhysics.getInstance().clearPlatforms();

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
            this.hole.flags |= SpriteStateFlag.NoCollide;

            this.createTarget();
            if (c._onLoad) c._onLoad();

            this.strokeCount = 0;
            this.putting = true;
            this.loadedCourse = c;
        }

        onUpdate() {
            this.applyFriction();
        }

        createTarget() {
            this.target = sprites.create(img`
                . . . f f f . . .
                . . . f 1 f . . .
                . . . f 1 f . . .
                f f f f 1 f f f f
                . f 1 1 1 1 1 f .
                . . f 1 1 1 f . .
                . . . f 1 f . . .
                . . . . f . . . .
                . . . d 1 d . . .
                . . . . d . . . .
            `);

            this.target.setFlag(SpriteFlag.StayInScreen, true);
            this.target.setFlag(SpriteFlag.Ghost, true);
            this.target.flags |= SpriteStateFlag.NoCollide;
            this.target.z = zindex.TARGET;
            if (this.ball) {
                this.target.bottom = this.ball.y + 1;
                this.target.left = this.ball.x + 5;
            }
            controller.moveSprite(this.target);
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

            const vx = Math.cos(angleDegrees) * speed;
            const vy = Math.sin(angleDegrees) * speed;

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
                speed -= 0.5;
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