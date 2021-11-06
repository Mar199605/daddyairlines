let canvas;
let squares = [];
let mouseoverstate = false;
let r = 30;

let edgeY = 0;
let edgeX = 0;

let ln = 0;
let pn = 0;

let pts = [];

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
            let x = (r / 2) + j * r;
            let y = (r / 2) + i * r;
            let b = new Square(x, y, r);
            squares.push(b);
        }

    }

}

function mousePressed() {
    for (b of squares) {
        if (b.intersects(mouseX, mouseY)) {
            b.clicked();
            if (pn % 2 == 0) {
                b.l = 1;
            } else {
                b.l = 2;
            }
            pts.push(b);
            pn = pn + 1;
        }
    }

}

function mouseOver() {

    // check mouseOver
    if (mouseX < edgeX && mouseX > 0) {
        if (mouseY < edgeY && mouseY > 0) {
            if (!mouseoverstate) {
                for (b of squares) {
                    b.t = 0;
                }
            }
            mouseoverstate = true;

        } else {
            //change timestate of every square
            if (mouseoverstate) {
                for (b of squares) {
                    b.t = 0;
                }
            }
            mouseoverstate = false;

        }
    } else {
        //change timestate of every square
        if (mouseoverstate) {
            for (b of squares) {
                b.t = 0;
            }
        }
        mouseoverstate = false;

    }



    if (mouseoverstate) {
        //Influence other squares
        for (q of squares) {
            let dis = (r / 3) + (abs((dist(q.x, q.y, mouseX, mouseY) - (3 * r))) ^ 2) / (3 * r);
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

    if (!mouseoverstate) {
        for (b of squares) {
            b.notover();
        }
    }

}

function connect() {

    for (let i = 0; i < pts.length; i++) {
        if (i % 2 != 0 && i > 0) {
            push();
            strokeWeight(4);
            line(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
            pbezier(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
            pop();
        }
    }

}

function pbezier(x1, y1, x2, y2) {
    
}

function draw() {
    background(bgcolor);

    mouseOver();
    connect();

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
            let x = r / 2 + j * r;
            let y = r / 2 + i * r;
            let b = new Square(x, y, r);
            squares.push(b);
        }

    }
}
