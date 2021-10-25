
class Bubble {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.brightness = 0;
        

        this.show = function () {
            stroke(255);
            fill(this.brightness, 125);
            ellipse(this.x, this.y, this.r*2);
        };

        this.move = function () {
            this.x = this.x + random(-1, 1);
            this.y = this.y + random(-1, 1);
        };

        this.changeColor = function (c) {
            this.brightness = c;
        }

        this.intersects = function(other){
            let d = dist(this.x, this.y, other.x, other.y);
            return (d < (this.r + other.r));
        }

    }
}