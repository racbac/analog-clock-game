// Analog_clock constructor
// Input: HTML canvas element
// Output: creates a new Analog_clock, to be drawn in the given canvas
function Analog_clock(canvas_element) {
    this.canvas_elem = canvas_element;
    this.canvas = this.canvas_elem.getContext("2d");
    this.radius = 0;
    this.time;
}

// draw_analog
// Input: integer difficulty of clock face
// Output: Draws an analog clock of given difficulty. See function names in switch statement
Analog_clock.prototype.draw_analog = function (level) {
    // get container's height and width, for responsiveness
    var width = this.canvas_elem.height = this.canvas_elem.width = this.canvas_elem.clientWidth;
    this.radius = width / 2;
    this.canvas.translate(this.radius, this.radius);

    // determine the clock to draw
    this.draw_face();
    switch (parseInt(level)) {
        case 1:
            this.draw_hr_nums(); this.draw_hr_ticks(); this.draw_minor_nums(); this.draw_min_ticks();
            break;
        case 2:
            this.draw_hr_nums(); this.draw_hr_ticks(); this.draw_major_nums(); this.draw_min_ticks();
            break;       
        case 3:
            this.draw_hr_nums(); this.draw_hr_ticks(); this.draw_min_ticks();
            break;     
        case 4:
            this.draw_hr_ticks(); this.draw_min_ticks();
            break;
        case 5:
            this.draw_hr_ticks();
            break;
        default:
            this.draw_hr_nums(); this.draw_hr_ticks(); this.draw_minor_nums(); this.draw_min_ticks();
            break;
    }
    this.draw_hands();
};

// draw_face
// Input:
// Output: Draws the clock rim and center nodule
Analog_clock.prototype.draw_face = function() {
    // draw the outer circle    
    this.canvas.beginPath();
    this.canvas.arc(0, 0, this.radius, 0, 2*Math.PI);
    this.canvas.fillStyle = "cyan";
    this.canvas.fill();
    this.canvas.stroke();


    // draw rim
    this.canvas.beginPath();
    this.canvas.arc(0, 0, this.radius * 0.84, 0, 2*Math.PI);
    this.canvas.fillStyle = " #F1F1F1";
    this.canvas.fill();
    this.canvas.stroke();

    // center
    this.canvas.beginPath();
    this.canvas.arc(0, 0, 2 * this.radius * 0.01, 0, 2*Math.PI);
    this.canvas.fillStyle = "#222827";
    this.canvas.fill();
    this.canvas.stroke();
};

// draw_hr_nums
// Input:
// Output: Draws large hour numbers 1-12 on the face
Analog_clock.prototype.draw_hr_nums = function() {
    // major numbers
    var radian;
    this.canvas.textAlign = "center"; this.canvas.textBaseline = "middle"; this.canvas.font = "1.2em cursive";
    for(var i = 1; i < 13; i++) {
        radian = Math.PI * (i / 6 - 1 / 2);
        this.canvas.fillText(i.toString(), this.radius * 0.67 * Math.cos(radian), this.radius * 0.67 * Math.sin(radian));
    }
};

// draw_major_nums
// Input:
// Output: Draw small minute numbers 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, and 55 on the rim
Analog_clock.prototype.draw_major_nums = function() {
    // minor numbers
    this.canvas.textAlign = "center"; this.canvas.textBaseline = "middle";  this.canvas.fillStyle = "black";
    this.canvas.font = "bold 0.9em 'Comic Sans MS' cursive"; 
    for(var i = 0; i < 12; i++) {
        radian = Math.PI * (i / 6 - 1 / 2);
        this.canvas.fillText((i * 5).toString(), this.radius * 0.92 * Math.cos(radian), this.radius * 0.92 * Math.sin(radian));
    }
}

// draw_minor_nums
// Input:
// Output: draw small minute numbers 0-59 on the clock rim
Analog_clock.prototype.draw_minor_nums = function() {
    // minor numbers
    this.canvas.textAlign = "center"; this.canvas.textBaseline = "middle";  this.canvas.fillStyle = "black";
    this.canvas.font = "bold 0.7em cursive"; 
    for(var i = 0; i < 60; i++) {
        radian = Math.PI * (i / 30 - 1 / 2);
        this.canvas.fillText((i).toString(), this.radius * 0.92 * Math.cos(radian), this.radius * 0.92 * Math.sin(radian));
    }
}

// draw_hr_ticks
// Input:
// Output: Draw thick dashes inside the rim hor each hour
Analog_clock.prototype.draw_hr_ticks = function() {
    // major dashes
    this.canvas.lineWidth = 4;
    for(var i = 1; i < 13; i++) {
        radian = i * Math.PI / 6 - Math.PI / 2;
        this.canvas.beginPath();
        this.canvas.moveTo(this.radius * 0.76 * Math.cos(radian), this.radius * 0.76 * Math.sin(radian));
        this.canvas.lineTo(this.radius * 0.835 * Math.cos(radian), this.radius * 0.835 * Math.sin(radian));
        this.canvas.stroke();
    }
}

// draw_min_ticks
// Input: 
// Output: draw thin dashes for each minute inside the tim
Analog_clock.prototype.draw_min_ticks = function() {
    // minor dashes
    this.canvas.lineWidth = 2; 
    for(var i = 1; i < 60; i++) {
        radian = i * Math.PI / 30 - Math.PI / 2;
        this.canvas.beginPath();
        this.canvas.moveTo(this.radius * 0.8 * Math.cos(radian), this.radius * 0.8 * Math.sin(radian));
        this.canvas.lineTo(this.radius * 0.835 * Math.cos(radian), this.radius * 0.835 * Math.sin(radian));
        this.canvas.stroke();
    }
}

// draw_hands
// Input:
// Output: draw the hour, minute, and second hands at the clock's stored time
Analog_clock.prototype.draw_hands = function() {
    // hands
    if (!this.time) {return;}
    var x, y;
    // hour
    var hr = this.time.getHours(); var min = this.time.getMinutes(); var sec = this.time.getSeconds();
    this.canvas.beginPath();
    this.canvas.lineCap = "round"; this.canvas.lineWidth = 8
    this.canvas.moveTo(0, 0);
    radian = Math.PI * (hr / 6 + min / 360 - 1/2);
    x = this.radius * 0.55 * Math.cos(radian); y = this.radius * 0.55 * Math.sin(radian);
    this.canvas.lineTo(x, y);
    this.canvas.stroke();

    // minute
    this.canvas.beginPath();
    this.canvas.lineWidth = 4
    this.canvas.moveTo(0, 0);
    radian = Math.PI * (min / 30 + sec / 1800 - 1/2);
    this.canvas.lineTo(this.radius * 0.7 * Math.cos(radian), this.radius * 0.7* Math.sin(radian));
    this.canvas.stroke();

    // second
    this.canvas.beginPath();
    this.canvas.lineWidth = 2
    this.canvas.moveTo(0, 0);
    radian = Math.PI * (sec / 30 - 1/2);
    this.canvas.lineTo(this.radius * 0.75 * Math.cos(radian), this.radius * 0.75 * Math.sin(radian));
    this.canvas.stroke();
}

// random_time
// Input: difficulty of time
// Output: Sets the clock's stored time to a random time of varying difficulty to read: on the hour, half hour, quarter hour, five minutes, or minute
Analog_clock.prototype.random_time = function(level) {
    switch (level) {
        case 1:
            this.time = new Date("1 " + rand(1,12) + ":00" + ":" + rand(0,59));
            break;
        case 2:
            this.time = new Date("1 " + rand(1,12) + ":" + (30 * rand(0,1)) + ":" + rand(0,59));
            break;
        case 3:
            this.time = new Date("1 " + rand(1,12) + ":" + (15 * rand(0,3)) + ":" + rand(0,59));
            break;
        case 4:
            this.time = new Date("1 " + rand(1,12) + ":" + (5 * rand(0,11)) + ":" + rand(0,59));
            break;
        default:
            this.time = new Date("1 " + rand(1,12) + ":" + rand(0,59) + ":" + rand(0,59));
            break;
    }
        
    this.draw_analog(this.time);
}

// 
// Input: minimum and maximum numbers of range, inclusive
// Output: a random integer between and including minimum and maximum
function rand(min, max) {
    // add current time as fake random seed
    return Math.floor((Math.random() + new Date().getTime() % 1) * (max - min + 1) + min);
}