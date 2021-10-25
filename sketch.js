let bubbles = [];
let button;

function setup() {
    createCanvas(600, 400);
    createP('');
    bgcolor = 50;
    button = createButton("go");
    button.mousePressed(changeColor);

    for (var i = 0; i < 20; i++) {
        let x = random(width);
        let y = random(height);
        let r = random(20, 100);
        let b = new Bubble(x, y, r, r);
        bubbles.push(b);
    }
}

function changeColor(){
    bgcolor = random(255);

}

function draw() {
    background(bgcolor);

    ellipse(mouseX, mouseY, 5, 5);

    for (b of bubbles) {
        b.move();
        b.show();

        let overlapping = false;
        for (other of bubbles) {
            if (b !== other && b.intersects(other)) {
                overlapping = true;
            }
        }

        if (overlapping) {
            b.changeColor(255);
        } else {
            b.changeColor(0);
        }
    }
}
