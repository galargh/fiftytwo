function RGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

RGB.prototype.toHEX = function() {
    function getHEX(n) {
        v = n.toString(16);
        if (v.length == 1) {
            return '0' + v;
        }
        return v;
    }
    return '#' + getHEX(this.r) + getHEX(this.g) + getHEX(this.b);
};

function ColorSlide(fromRGB, toRGB) {
    this.from = fromRGB;
    this.to = toRGB;
}

ColorSlide.prototype.get = function(step, nOfSteps) {
    if (step <= 0) {
        return this.from;
    }
    if (step >= nOfSteps) {
        return this.to;
    }
    var f = (step / nOfSteps);
    var r = this.from.r + f * (this.to.r - this.from.r);
    var g = this.from.g + f * (this.to.g - this.from.g);
    var b = this.from.b + f * (this.to.b - this.from.b);
    return (new RGB(Math.floor(r), Math.floor(g), Math.floor(b)));
};

var blue = new RGB(0, 90, 200);
var green = new RGB(90, 200, 90);
var red = new RGB(200, 90, 0);

var greenToBlue = new ColorSlide(green, blue);
var greenToRed = new ColorSlide(green, red);

function getBackgroundColor(diff) {
    diff = (diff*10).toFixed();
    if (diff < 0) {
        return {
            backgroundColor: greenToBlue.get(-diff, 100).toHEX()
        };
    }
    return {
        backgroundColor: greenToRed.get(diff, 100).toHEX()
    };
}

var noteFrequencies = [
    16.352,
    17.324,
    18.354,
    19.445,
    20.602,
    21.827,
    23.125,
    24.500,
    25.957,
    27.500,
    29.135,
    30.868
];
var notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];
var octaveCutoffs = [
    0.0,
    31.7855,
    63.5705,
    127.14,
    254.285,
    508.565,
    1017.135,
    2034.25,
    4068.55,
    8137.05,
    16274.15,
    32548.25
];

module.exports = {
    octaveCutoffs: octaveCutoffs,
    notes: notes,
    noteFrequencies: noteFrequencies,
    getBackgroundColor: getBackgroundColor
};
