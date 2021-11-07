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
            // line(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
            pbezier(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y, 0);
            pop();
        }
        if (i % 2 == 0 && i == (pts.length - 1)) {
            pbezier(pts[i].x, pts[i].y, mouseX, mouseY, 1);
        }
    }

}

function pbezier(x1, y1, x2, y2, dash) {

    let d = (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))) * 1.5;
    let x3 = 0;
    let y3 = 0;


    if (x2 > x1) {
        x3 = x2 - d * (y1 - y2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        y3 = y2 + d * (x1 - x2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    } else {
        x3 = x2 + d * (y1 - y2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        y3 = y2 - d * (x1 - x2) / Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    }

    let x4 = x3 - x2 + x1;
    let y4 = y3 - y2 + y1;

    push();
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    if (dash == 1) {
        drawingContext.setLineDash([random(4,5),5]);
    }
    curveVertex(x4, y4);
    curveVertex(x1, y1);
    curveVertex(x2, y2);
    curveVertex(x3, y3);
    endShape();
    pop();
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
