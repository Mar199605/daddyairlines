let canvas;
let squares = [];
let mouseoverstate = false;
let r = 30;

let edgeY = 0;
let edgeX = 0;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    bgcolor = 200;


    r = windowWidth / 60;
    let row = int(windowHeight / r);
    let column = int(windowWidth / r);

    // check edge (need to modify)
    edgeX = r / 2 + column * r;
    edgeY = r / 2 + row * r;

    for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) {
            let x = r / 2 + j * r;
            let y = r / 2 + i * r;
            let b = new Square(x, y, r);
            squares.push(b);
        }

    }
}

function mousePressed() {
    for (b of squares) {
        if (b.intersects(mouseX, mouseY)) {
            b.clicked();
        }
    }
}

function mouseOver() {

    // check mouseOver
    if (mouseX < edgeX && mouseX > 0) {
        if (mouseY < edgeY && mouseY > 0) {
            mouseoverstate = true;
        } else {
            mouseoverstate = false;
        }
    } else {
        mouseoverstate = false;
    }


    if (mouseoverstate) {
        //Influence other squares
        for (q of squares) {
            let dis = 10 + (abs((dist(q.x, q.y, mouseX, mouseY) - 80)) ^ 2) / 80;
            if (dis > r) {
                dis = r;
            }
            if (dist(q.x, q.y, mouseX, mouseY) < 60) {
                dis = dis * 1.5;
            }
            q.inf(dis);
        }
        for (b of squares) {
            if (b.intersects(mouseX, mouseY)) {
                b.over();
            }
        }
    }

    if (mouseoverstate == false) {
        for (var i = 0; i < squares.length; i++) {
            squares[i].notover();
        }
    }

}

function draw() {
    background(bgcolor);
    ellipse(mouseX, mouseY, 5, 5);
    mouseOver();

    for (b of squares) {
        b.show();
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    num = squares.length;
    squares.splice(0, num);

    r = windowWidth / 60;
    let row = int(windowHeight / r);
    let column = int(windowWidth / r);

    // check edge (need to modify)
    edgeX = r + column * r;
    edgeY = r + row * r;

    for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) {
            let x = r + j * r;
            let y = r + i * r;
            let b = new Square(x, y, r);
            squares.push(b);
        }

    }
}
