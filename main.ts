
golf.enableSlopePhysics(img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    1 . . . . . . . . d 3 3 c . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . 5 4 . . . . . . . . . . . . 1
    1 . . . . 1 1 . . . 7 9 8 6 . . . . . 1
    1 . . . . b a . . . d f e c . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . 7 2 2 6 . . . . . . 1
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
`)

const ball = sprites.create(img`
    1 1 1
    1 1 1
    1 1 1
`, SpriteKind.Player)

function hitBall(speed: number, angleDegrees: number) {
    const vx = Math.cos(angleDegrees * (Math.PI / 180)) * speed;
    const vy = Math.sin(angleDegrees * (Math.PI / 180)) * speed;

    ball.setVelocity(vx, vy)
}


let angle = 0;

game.onUpdate(function () {
    if (controller.left.isPressed()) {
        angle--;
    }
    if (controller.right.isPressed()) {
        angle++;
    }

    // Apply friction

    let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    const ballDirection = Math.atan2(ball.vy, ball.vx);

    if (speed < 1) {
        speed = 0;
    }
    else {
        speed -= 0.15;
    }

    ball.vx = speed * Math.cos(ballDirection);
    ball.vy = speed * Math.sin(ballDirection);
})

game.onShade(function () {
    screen.drawLine(ball.x, ball.y, ball.x + 15 * Math.cos(angle * (Math.PI / 180)), ball.y + 15 * Math.sin(angle * (Math.PI / 180)), 1)
})

controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    hitBall(60, angle)
});