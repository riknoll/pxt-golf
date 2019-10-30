namespace jwunderl {
    export function testCourse() {
        const testCourse2 = new golf.Course(
            img`
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
                1 . . . . . . . . 1 1 . . . . . . . . 1
                1 . . . . . . . . 1 1 . . . . . . . . 1
                1 . . . . . . . . 1 1 . . . . . . . . 1
                1 . . . . . . . . 1 1 . . . . . . . . 1
                1 . . . . . . . . 1 1 . . . . 7 6 . . 1
                1 . . . . . . . . d c . . 7 9 1 a . . 1
                1 . . . . . . . . 5 4 . . b 1 1 . . . 1
                1 . . . . . . 7 9 1 1 8 6 . b 1 4 7 9 1
                1 . . . . . 5 1 1 1 1 1 1 4 . b 1 1 1 1
                1 . . . . . b 1 1 1 1 1 1 a . . 1 1 1 1
                1 . . . . . . d f 1 1 e c . . . b 1 1 1
                1 . . . . . . . . . . . . . . . 5 1 1 1
                1 1 1 1 1 1 1 1 8 2 2 9 1 1 1 1 1 1 1 1
                1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
            `, new golf.Point(24, 88), new golf.Point(screen.width - 16, 60), 3);

        const g2 = new golf.Game();
        g2.loadCourse(testCourse2);
    }
}