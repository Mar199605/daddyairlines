class Square {

    grid = codegrid.CodeGrid();

    constructor(x, y, r, lon, lat, code) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.brightness = 0;
        this.clickstate = false;
        this.alpha = 10;
        this.lat = lat;
        this.lon = lon;
        this.code = code;

        //timecontrol
        this.t = 0;
        this.abst = 10;

        //overall style
        this.show = function () {
            stroke(255);
            fill(this.brightness, this.alpha);
            rectMode(CENTER);
            rect(this.x, this.y, this.r, this.r);
        };

        //check mouse on squares
        this.intersects = function (px, py) {
            if (px > this.x - (this.r / 2) && px < this.x + (this.r / 2) && py > this.y - (this.r / 2) && py < this.y + (this.r / 2)) {
                return true;
            }
        }
        //mouse on squares style
        this.over = function () {
            this.r = r;
            this.brightness = 255;
            this.alpha = 255;
        }

        this.notover = function () {
            this.chag = (r - this.r) * this.t / this.abst + this.r;
            this.r = this.chag;
            this.t = this.t + 1;
            if (this.t > this.abst) {
                this.t = this.abst;
            }
        }

        this.inf = function (dis) {
            this.chag = (dis - r) * this.t / this.abst + r;
            this.r = this.chag;
            this.t = this.t + 1;
            if (this.t > this.abst) {
                this.t = this.abst;
            }
            if (!this.clickstate) {
                this.brightness = 0;
                this.alpha = 10;
            }
        }

        //click style
        this.clicked = function () {
            print(this.code, this.lat, this.lon);
            if (this.clickstate) {
                this.clickstate = false;
                this.brightness = 0;
            } else {
                this.clickstate = true;
                this.brightness = 255;
            }
        }


    }
}
