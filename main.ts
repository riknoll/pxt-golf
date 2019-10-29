const testCourse = new golf.Course(img`
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    1 1 1 1 1 1 1 1 1 1 a . . . . . . b 1 1
    1 1 1 1 1 1 1 1 1 a . . . . . . . . b 1
    1 a . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 . . . . . . . . . . . . . . . . . . 1
    1 4 . . . . . . . . . . . . . . . . . 1
    1 1 1 1 1 1 1 1 1 1 1 1 4 . . . . . . 1
    1 1 1 1 1 1 1 1 1 1 1 1 a . . . . . 5 1
    1 a . . . b 1 1 1 a . . . . . . . 5 1 1
    1 . . . . . d 3 c . . . . . . . 5 1 1 1
    1 . . . . . 7 2 6 . . . . . . 5 1 1 1 1
    1 4 . . . 5 1 1 1 4 . . . . 5 1 1 1 1 1
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
`, new golf.Point(24, 88), new golf.Point(24, 40), 3);

testCourse.onLoad(function () {
    const p = new golf.MovingPlatform(img`
        5 4
        b a
    `);

    p.setPath([
        new golf.Point(screen.width - 48, 48),
        new golf.Point(screen.width - 48, 24),
    ], 1000);
})

const g = new golf.Game();
g.loadCourse(testCourse);