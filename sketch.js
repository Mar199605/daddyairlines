grid = codegrid.CodeGrid();

let squares = [];
let mouseoverstate = false;

let edgeY = 0;
let edgeX = 0;

let pts = [];
let datas = [];


function preload() {
    mapimg = loadImage("https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/0,0,1/1024x512?access_token=pk.eyJ1IjoiaHVsa21hIiwiYSI6ImNrd2ljN3o0cjE2aWgycG11NmJvaWJ4MHUifQ.Ve1W7M0sPwfdCtSK5dbzeA");
}


function setup() {

    let cx = mercX(0);
    let cy = mercY(0);

    let windowWidth = 1024;
    let windowHeight = 512;
    let width = windowWidth;
    let height = windowHeight;


    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);

    translate(width / 2, height / 2);
    bgcolor = 200;


    r = width / 75;
    let row = int(windowHeight / r);
    let column = int(windowWidth / r);

    // check edge (need to modify)
    edgeX = column * r;
    edgeY = row * r;

    // add squares
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) {
            let x = (r / 2) + j * r - windowWidth / 2;
            let y = (r / 2) + i * r - windowHeight / 2;

            let lon = rmercX(x + cx);
            let lat = rmercY(y + cy);
            let code = geo(lat, lon);

            //rough search
            let rou = 1;
            if (code == 'None') {
                for (i1 = -1; i1 < 2; i1++) {
                    for (j1 = -1; j1 < 2; j1++) {
                        let lon_s = rmercX(x + cx + j1 * rou);
                        let lat_s = rmercY(y + cy + i1 * rou);
                        
                        if(geo(lat_s, lon_s) != 'None'){
                            code = geo(lat_s, lon_s);
                        }
                    }

                }
            }

            if (code != 'None' && code) {
                let squa = new Square(x, y, r, lon, lat, code);
                squares.push(squa);
            }
        }

    }


}


function draw() {

    background(bgcolor);

    translate(width / 2, height / 2);
    imageMode(CENTER);
    // image(mapimg, 0, 0);

    mouseOver();
    connect();

    ellipse(mouseX - width / 2, mouseY - height / 2, 8, 8);

    for (squa of squares) {
        squa.show();
    }


}

function mousePressed() {
    for (squa of squares) {
        if (squa.intersects(mouseX - width / 2, mouseY - height / 2)) {
            squa.clicked();

            pts.push(squa);
        }
    }

}

function mouseOver() {

    //check mouse in canvas
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
        if (!mouseoverstate) {
            for (squa of squares) {
                squa.t = 0;
            }
        }
        mouseoverstate = true;


    } else {
        //check mouse out canvas
        if (mouseoverstate) {
            for (squa of squares) {
                squa.t = 0;
            }
        }
        mouseoverstate = false;

    }




    if (mouseoverstate) {
        //Influence squares
        for (q of squares) {
            let dis = (r / 3) + (abs((dist(q.x, q.y, mouseX - width / 2, mouseY - height / 2) - (3 * r))) ^ 2) / (3 * r);
            if (dis > r) {
                dis = r;
            }
            if (dist(q.x, q.y, mouseX - width / 2, mouseY - height / 2) < 60) {
                dis = dis * 1.5;
            }
            q.inf(dis);
        }
        for (squa of squares) {
            if (squa.intersects(mouseX - width / 2, mouseY - height / 2)) {
                squa.over();
            }
        }
    }

    if (!mouseoverstate) {
        for (squa of squares) {
            squa.notover();
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
            pbezier(pts[i].x, pts[i].y, mouseX - width / 2, mouseY - height / 2, 1);
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
    strokeWeight(1);
    noFill();
    beginShape();
    if (dash == 1) {
        drawingContext.setLineDash([4, 5]);
    }
    curveVertex(x4, y4);
    curveVertex(x1, y1);
    curveVertex(x2, y2);
    curveVertex(x3, y3);
    endShape();
    pop();
}

// function windowResized() {

//     //!should be translation approach (later)
//     resizeCanvas(windowWidth, windowHeight);
//     num = squares.length;
//     squares.splice(0, num);

//     r = windowWidth / 60;
//     let row = int(windowHeight / r);
//     let column = int(windowWidth / r);

//     // check edge (need to modify)
//     edgeX = r + column * r;
//     edgeY = r + row * r;

//     for (var i = 0; i < row; i++) {
//         for (var j = 0; j < column; j++) {
//             let x = r / 2 + j * r;
//             let y = r / 2 + i * r;
//             let squa = new Square(x, y, r);
//             squares.push(squa);
//         }

//     }
// }


function geo(lat, lng) {
    grid.getCode(lat, lng, function (err, code) {
        var msg;
        if (err) {
            msg = err;
        } else {
            msg = "Calling getCode(" + lat + "," + lng + ") returned: " + code;
        }

        result = code;
    });
    return result;

}


//projection coordinate
function mercX(lon) {
    lon = radians(lon);
    var a = (256 / PI) * pow(2, 1);
    var b = lon + PI;
    return a * b;
}

function mercY(lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, 1);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}

function rmercX(x) {
    var a = (x * PI) / (256 * pow(2, 1)) - PI;
    return a * 180 / PI;
}

function rmercY(y) {
    var a = PI - (y * PI / 256) / pow(2, 1);
    var b = pow(Math.E, a);
    var c = Math.atan(b);
    var d = (4 * c - PI) / 2;
    return d * 180 / PI;

}
