var LEVEL_LENGTH = 5;
var GUESSES_ALLOWED = 3;
var MAX_LEVEL = 10;

// Round constructor
// Input: integer Game level,  correct answer for clock as string
// Output: Creates a new Round object with empty arrays for student guesses and corresponding times to make them, but set level and correct answer
function Round(new_level, new_answer) {
    this.level = new_level;
    this.guesses = [];
    this.answer = new_answer;
    this.times = [];
}

// Clock_game constructor
// Input: Analog_clock object, student name as string
// Output: Creates a new clock object
function Clock_game(new_clock, new_name) {
    this.curr_level = 1;
    this.clock = new_clock;
    this.student_name = new_name;
    this.ans_timer = new Date();
    this.rounds = [];
    this.total_correct = 0;
}

// start_round
// Input: 
// Output: Draw a new random time according to the game's level, start the timer, and create the Round object
Clock_game.prototype.start_round = function() {
    // set up round's level, time, start time
    this.clock.random_time(this.curr_level - Math.floor(this.curr_level / 2)); // repeat each time difficulty twice; one with minute numbering, one without
    this.clock.draw_analog(this.curr_level % 2 == 0 ? 3 : 1); // odd levels have minute numbering, even levels don't
    this.ans_timer = new Date();
    this.rounds.push(new Round(this.curr_level, this.clock.time.toLocaleTimeString().substring(0,this.clock.time.toLocaleTimeString().indexOf(":",3))));
};

// process_answer
// Input: the student's answer as a string
// Output: Add the answer and time to make it to the current Round object. Decide whether the answer was correct, correct and new level needed, correct and end of game, incorrect, or incorrect for the final time. Adjust the level and the timer accordingly. Return value indicates whether correct (1), incorrect (0), final incorrect (correct answer as Date), or done (2).
Clock_game.prototype.process_answer = function(ans) {
    // store time guessing and the guess
    this.rounds[this.rounds.length - 1].times.push(Math.abs(new Date() - this.ans_timer) / 1000);
    var colonPos = (ans.indexOf(":") == -1 ? ans.indexOf(" ") : ans.indexOf(":"));
    var student_ans = new Date(2000,1,1,ans.slice(0,colonPos),ans.slice(colonPos + 1, colonPos + 3));
    this.rounds[this.rounds.length - 1].guesses.push(student_ans.toLocaleTimeString().substring(0,this.clock.time.toLocaleTimeString().indexOf(":",3)));
    
    // if correct
    if (student_ans.toLocaleTimeString().substr(0,5) == this.clock.time.toLocaleTimeString().substr(0,5)) {
        this.total_correct++;
        // if new level needed
        if (this.total_correct % LEVEL_LENGTH == 0) {
            this.curr_level++;
        }
        // if game done
        if (this.curr_level == MAX_LEVEL + 1) {
            return 2;
        } else {
            this.start_round();
            return 1;
        }
    // if incorrect and time to move on
    }  else if (this.rounds[this.rounds.length - 1].guesses.length == GUESSES_ALLOWED) {    
        return this.clock.time;   
    }

    // if incorrect, restart timer for next guess
    else {
        this.ans_timer = new Date();
        return 0;
    }
};

// export_csv
// Input: 
// Output: Returns a string representing each Round in the Game as a comma separated value file. Does not include column labels.
Clock_game.prototype.export_csv = function() {
    var csv_str = "";
    this.rounds.forEach(function(round) {
        csv_str += this.student_name + "," + round.level + "," + round.answer;
        for (var i = 0; i < round.guesses.length; i++) {
            csv_str += "," + round.guesses[i] + "," + round.times[i].toFixed(1);
        }
        csv_str += "\n";
    }, this);
    return csv_str;
};

// export_table
// Input:
// Output: Returns a table HTML element, with each row representing a Round in the Game. Does not have column labels. Use with appendChild
Clock_game.prototype.export_table = function() {
    var table = document.createElement("table");
    var row;

    this.rounds.forEach(function(round) {
        row = document.createElement("tr");
        table.appendChild(row);

        row.appendChild(document.createElement("td")); row.lastChild.appendChild(document.createTextNode(this.student_name));
        row.appendChild(document.createElement("td")); row.lastChild.appendChild(document.createTextNode(round.level));
        row.appendChild(document.createElement("td")); row.lastChild.appendChild(document.createTextNode(round.answer));

        for (var i = 0; i < round.guesses.length; i++) {
            row.appendChild(document.createElement("td")); row.lastChild.appendChild(document.createTextNode(round.guesses[i]));
            row.appendChild(document.createElement("td")); row.lastChild.appendChild(document.createTextNode(round.times[i].toFixed(1)));
        }
    }, this);
    
    return table;
};

// export_table_str
// Input:
// Output: Returns a string that is the HTML code for a table representing each Round in the Game. Use with innerHTML or document.write
Clock_game.prototype.export_table_str = function() {
    debugger;
    var table_str = "";
    this.rounds.forEach(function(round) {
        table_str += "<tr><td>" + this.student_name + "</td><td>" + round.level + "</td><td>" + round.answer + "</td>";
        for (var i = 0; i < round.guesses.length; i++) {
            table_str += "<td>" + round.guesses[i] + "</td><td>" + round.times[i].toFixed(1) + "</td>";
        }
        for (var i = 0; i < GUESSES_ALLOWED - round.guesses.length; i++) {
            table_str += "<td></td><td></td>"
        }
        table_str += "</tr>";
    }, this);

    return table_str;
};