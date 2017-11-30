// Constants
var game_minutes = 10;

// HTML elements
var grade = document.getElementById("grade");
var student_ans = document.getElementById("student");
var download_btn = document.getElementById("download")
var student_name = document.getElementById("student_name");
var game_level = document.getElementById("level");
var analog_clock_canvas = document.getElementById("analog_clock_canvas");
var correct_answers = document.getElementById("correct_answers");
var end_game_btn = document.getElementById("end_game");
var start_game_btn = document.getElementById("start_game");
var check_answer_btn = document.getElementById("check_answer");
var game_timer = document.getElementById("game_time");

// Global variables
var game1; var clock1; var countdown_interval; var countdown_timeout;
clock1 = new Analog_clock(analog_clock_canvas); clock1.draw_analog();
student_name.focus();
// Game's export functions add to these strings, so they hold multiple students' results for the day
var csv_str = "Student,Level,Answer,Guess 1,Time 1(s),Guess 2,Time 2(s),Guess 3,Time 3(s)\n";
var table_str = "";


// timer()
// Input: desired time limit in minutes
// Output: starts a timer that will stop the current game after it's been running for 10 minutes, to give someone else a turn
function time_game(time_limit) {
    var countdown = time_limit;
    game_timer.innerHTML = "Minutes left: " + countdown;
    countdown_interval = setInterval(function() {
        game_timer.innerHTML = "Minutes left: " + --countdown;
    }, 60000);

    countdown_timeout = setTimeout(function() {
        clearInterval(countdown_interval);
        alert("You've been playing for " + time_limit + " minutes. It's someone else's turn!");
        end_game_btn.click();
    }, time_limit * 60000 + 1000);
}
    

// update_info()
// Input: 
// Output: Translates the Game's evaluation of the student's answer into feedback on the HTML page. Displays in HTML elements the number of correct answers so far, the current level, whether the latest answer was correct or incorrect, and the correct answer (if needed). 
function update_info() {
    var correct = game1.process_answer(student_ans.value);
    correct_answers.innerHTML = "Correct answers: " + game1.total_correct;

    if (correct == 1) {  // correct answer
        grade.innerHTML = "Correct"; 
        grade.style.color = "green"; 
        student_ans.placeholder = "hh:mm";
    
        }  else if (correct == 0) {  // incorrect answer, same round
        grade.innerHTML = "Incorrect"; 
        grade.style.color = "red"; 
        student_ans.placeholder = student_ans.value;
    
        } else if (correct == 2) {  // game finished
        grade.style.color = "green";
        grade.innerHTML = "You finished the game! Well done!";
        setTimeout(function() {
            end_game_btn.click();
        }, 1500);
        
        return;
            
    } else {  // incorrect answer, next round
        grade.innerHTML = "Incorrect.<br>The time is " + game1.clock.time.toLocaleTimeString().substr(0, 8) + "<br>Click the clock to continue";
        
        student_ans.disabled = true; check_answer_btn.disabled = true;
        analog_clock_canvas.addEventListener("click", function() {
            game1.start_round();
            student_ans.disabled = false; check_answer_btn.disabled = false;
            grade.innerHTML = ""; student_ans.innerHTML = ""; student_ans.placeholder = "hh:mm";
            student_ans.focus();
            analog_clock_canvas.removeEventListener("click", arguments.callee);
        });
    }
    student_ans.value = "";

    grade.style.animationName = "pulse";
    setTimeout(function () {
        grade.style.animationName = "";
    }, 1000);

    game_level.innerHTML = "Level " + game1.curr_level;
    
}

// download
// Input:
// Output: Opens a new window, and inserts a table of all students' results and a link to a CSV file download
download_btn.onclick =  function () {  
    var pwd = prompt("Please enter the password:");
    if (pwd == "letmein") {
        // create csv and download link
        var dl_link = document.createElement("a");
        dl_link.innerHTML = "Download CSV";
        dl_link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_str);
        dl_link.target = '_blank';
        var now = new Date();
        dl_link.download = 'analog_practice_' + now.getMonth() + "-" + now.getDate() + "-" + now.getFullYear()  + '.csv';
        
        // create table
        var table = "<table>" + "<tr><td>Student</td><td>Level</td><td>Answer</td><td>Guess 1</td><td>Time 1 (s)</td><td>Guess 2</td><td>Time 2 (s)</td><td>Guess 3</td><td>Time 3 (s)</td></tr>" + table_str +  "</table>";

        // display table and download link in new window
        var newWindow = window.open("", "newWindow");
        newWindow.document.getElementsByTagName("body")[0].appendChild(dl_link);
        newWindow.document.getElementsByTagName("body")[0].innerHTML += table;

        // styling
            newWindow.document.getElementsByTagName("head")[0].innerHTML = "<style>table {border-collapse: collapse; } table, tr, td {border: 1px solid black; padding: 3px; }</style>";
    }
};

// keypress "Enter"
// Input: the keypress event
// Output: Associate enter with start game button if the student name field is in focus, or associate it with check answer button if the answer field is in focus
window.onkeypress = function(e) {
    var key = e.keyCode || e.which;
    if (student_ans === document.activeElement && key == 13) {
        update_info();
    } else if (student_name === document.activeElement && key == 13) {
        start_game_btn.click();
    }
};

// click check answer
// Input:
// Output: call update info, and refocus on asnwer textbox
check_answer_btn.onclick = function() { update_info(); student_ans.focus(); };

// start game button click
// Input: 
// Output: Validate that the user entered a name, so we're sure we can save their score. If they did, start the game. Otherwise, alert them.
start_game_btn.onclick = function() { 

    if (student_name.value == "") {
        student_name.style.border = "2px solid red"; 
        alert("Please enter your name.");
        student_name.focus();
    } else {
        student_name.style.border = "";
        game1 = new Clock_game(clock1, student_name.value);
        game1.start_round(); 

        student_ans.disabled = false; 
        check_answer_btn.disabled = false; 
        student_ans.focus();

        game_level.innerHTML = "Level " + game1.curr_level;
        correct_answers.innerHTML = "Correct answers: " + game1.total_correct;
        grade.innerHTML = "";
        time_game(game_minutes);
    }
};   

// end game click
// Input: 
// Output: Add this game to the global csv and table strings, and reset for the next player
end_game_btn.onclick = function() {
    csv_str += game1.export_csv();
    table_str += game1.export_table_str();

    clearInterval(countdown_interval); clearTimeout(countdown_timeout);
    student_ans.value = ""; student_name.value = "";
    
    student_ans.disabled = true;
    check_answer_btn.disabled = true;
    student_name.focus();
    alert("Your score is stored. Thank you for playing!");
}

// resize window
// Input: 
// Output: redraw the clock if the window resized, for image quality
window.addEventListener("resize", function() {
    clock1.draw_analog(game1 ? game1.curr_level : null );
});


