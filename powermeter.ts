class PowerMeter {
    protected static instance: PowerMeter;
    protected renderable: scene.Renderable;

    protected currentPower: number;
    protected powerChangeRate: number;

    protected startPoint: number;
    protected placedPoint: number;
    protected finishedAction: boolean;

    protected constructor() {
        this.currentPower = 20;
        this.powerChangeRate = 1;
        game.onUpdate(() => this.updatePower());
    }

    protected updatePower() {
        if (this.renderable && !this.finishedAction) {
            this.currentPower += this.powerChangeRate;
            if (this.currentPower > 100) {
                this.currentPower = 100;
                this.powerChangeRate *= -1;
            } else if (this.currentPower < 0) {
                this.currentPower = 0;
                this.powerChangeRate *= -1;
            }
        }
    }

    power() {
        if (!this.finished()) {
            return undefined;
        }
        return Math.abs(this.placedPoint - this.startPoint);
    }
    
    accuracy() {
        if (!this.finished()) {
            return undefined;
        }
        const diff = Math.abs(this.currentPower - this.startPoint);

        return diff;
    }

    action() {
        if (this.placedPoint == null) {
            this.placedPoint = this.currentPower;
        } else {
            this.finishedAction = true;
        }
    }

    active() {
        return !!this.renderable;
    }

    finished() {
        return this.finishedAction;
    }

    start() {
        if (this.renderable)
            return;

        this.clear();

        this.powerChangeRate = Math.abs(this.powerChangeRate);
        this.currentPower = Math.randomRange(10, 30);
        this.startPoint = this.currentPower;

        this.renderable = scene.createRenderable(
            zindex.POWER_BAR,
            (target, camera) => {
                const base = img`
                    . . . . a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a . . . .
                    . . a a a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a a a . .
                    . a a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a a .
                    a a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a a
                    a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a
                    a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a
                    a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a
                    a a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a a
                    . a a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a a .
                    . . a a a d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d a a a . .
                    . . . . a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a . . . .
                `;
                const barWidth = base.width - 2;
                const padding = (screen.width - base.width) >> 1;

                const heightAtCol = (column: number) => {
                    column |= 0;
                    if (column <= 0 || column > barWidth) {
                        return -1;
                    }
                    switch (column) {
                        case 1:
                        case base.width - 2:
                            return 4;
                        case 2:
                        case base.width - 3:
                            return 3;
                        case 3:
                        case base.width - 4:
                        case 4:
                        case base.width - 5:
                            return 2;
                        default:
                            return 1;
                    }
                }

                const drawPct = (pct: number, color: number) => {
                    const col = (barWidth * pct) / 100;
                    const padding = heightAtCol(col);

                    if (padding != -1) {
                        base.drawLine(
                            col,
                            padding,
                            col,
                            base.height - padding - 1,
                            color
                        );
                    }
                }

                drawPct(this.startPoint, 0xC);

                if (this.placedPoint != null) {
                    drawPct(this.placedPoint, 0xC);
                }

                if (this.currentPower != null) {
                    drawPct(this.currentPower, 0x1);
                }

                screen.drawTransparentImage(
                    base,
                    padding,
                    screen.height - padding - base.height
                );
            }
        );
    }

    clear() {
        if (this.renderable) {
            this.renderable.destroy();
            this.renderable = undefined;
        }

        this.placedPoint = undefined;
        this.finishedAction = false;
    }

    static getInstance() {
        if (!PowerMeter.instance) {
            PowerMeter.instance = new PowerMeter();
        }
        return PowerMeter.instance;
    }
}

