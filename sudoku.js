const easy=[
"6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345----298",
"685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
  "--9-------4----6-----3---2--5--4-36-------4-8----9---2---7-----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
  "-1-5----------42----5----7-----3---7----2------8------1-----------3-----------8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];
//create variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function() {
    // run startgame when button is clicked
    id("start-btn").addEventListener("click", startGame);

    // add event listener to each number in the number container
    for (let i = 0; i < document.querySelector("#number-container").children.length; i++) {
        document.querySelector("#number-container").children[i].addEventListener("click", function() {
            // if selecting is not disabled
            if (!disableSelect) {
                // if number is already selected
                if (this.classList.contains("selected")) {
                    // then remove selected
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    // deselect all the other numbers
                    for (let j = 0; j < 9; j++) {
                        if (document.querySelector("#number-container").children[j].classList.contains("selected")) {
                            document.querySelector("#number-container").children[j].classList.remove("selected");
                        }
                    }
                }
                // select it and update selectedNum variables
                this.classList.add("selected");
                selectedNum = this;
                updateMove();
            }
        });
    }
}


function startGame(){
//choose board difficulty
let board;
if(id("diff-1").checked)board = easy[0];
else if(id("diff-2").checked)board = medium[0];
else board =hard[0];
//set lives to 3 and enable selecting numbers and tiles
lives = 3;//set lives to 3 amd enable selecting the numbers and tiles
disableSelect = false;
id("lives").textContent = "Lives Remaining: 3";
//creates board based on difficulty
generateBoard(board);
//statrs the timer
startTimer();
//set theme based on input
if(id("theme-1").checked){
qs("body").classList.remove("dark");
}
else{
qs("body").classList.add("dark");
}
//show number container
id("number-container").classList.remove("hidden");
}


function startTimer(){//set timer based on input
if (id("time-1").checked) timeRemaining=300;
else if(id("time-2").checked) timeRemaining=600;
else timeRemaining=900;
//set timer for first secoond
id("timer").textContent = timeConversion(timeRemaining);
//set timer to update every sec
timer = setInterval(function(){//execute again at specified time interval
timeRemaining--;
// if not time remaining end game
if(timeRemaining === 0) endGame();
id("timer").textContent = timeConversion(timeRemaining);
},1000)
}

//convert sec into string of MM:SS format
function timeConversion(time){
let minutes =Math.floor(time/60);
if (minutes < 10)minutes = "0" + minutes;
let seconds = time % 60;
if (seconds < 10) seconds = "0" +seconds;
return minutes + ":" + seconds;
}

function generateBoard(board) {//clear previous board
    clearPrevious();
//let used to increment tile ids
    let idCount = 0;
//create 81 tiles
    for (let i = 0; i < 81; i++) {
//create a new papragaph element
        let tile = document.createElement("p");
//if the tile is not supposed to be blank
        if (board.charAt(i) != "-") {
//set tiletext to correct number
            tile.textContent = board.charAt(i);
        } else {
//add click event listener to tile
            tile.addEventListener("click", function () {
                if (!disableSelect) {
//if tile is already selected
                    if (tile.classList.contains("selected")) {
                        //then remove selection
tile.classList.remove("selected");
                        selectekdTile = null;
                    } else {
//deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
//assing tile id
        tile.id = idCount;
//increment for next tile
        idCount++;
//add tile class to all tiles
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
//add tile to board
        id("board").appendChild(tile);
    }
}

                                             

function updateMove() {

    // If the tile or number is selected
    if (selectedTile && selectedNum) {
        // Update the tile with the selected number
        selectedTile.textContent = selectedNum.textContent;

        // Check if the move is correct
        if (checkCorrect(selectedTile)) {
            // Correct move, remove selected classes and reset variables
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            selectedNum = null;
            selectedTile = null;
        } else {
            // Incorrect move
            disableSelect = true;
            selectedTile.classList.add("incorrect");

            // Delay the incorrect move handling
            setTimeout(function () {//evaluate
                lives--;

                if (lives === 0) {
                    endGame();
                } else {
                    id("lives").textContent = "Lives Remaining: " + lives;
                    disableSelect = false;
                }

                // Reset selectedTile and selectedNum, and remove classes
                selectedTile.classList.remove("incorrect", "selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }

        // Check if the game is done
        if (checkDone()) {
            endGame();
        }
    }
}

function checkDone(){
let tiles = qsa(".tile");
for (let i=0;i<tiles.length;i++){
if(tiles[i].textContent ==="") return false;
}
return true;

}



function endGame() {
    disableSelect = true;
    clearTimeout(timer);// cancel a timeout that was previously set
   
    if (lives === 0 || timeRemaining === 0) {
        window.alert("You Lost! Game Over.");
    } else {
        id("lives").textContent = "You Won!";
    }
}



function checkCorrect(tile){
let solution;
if(id("diff-1").checked)solution=easy[1];
else if(id("diff-2").checked)solution = medium[1];
else solution =hard[1];
if(solution.charAt(tile.id)==tile.textContent)  return true;
else return false;
}

function clearPrevious() {
    // Access all of the tiles
    let tiles = qsa(".tile");

    // Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].parentNode.removeChild(tiles[i]);
    }

    // If there is a timer, clear it
    if (timer) clearTimeout(timer);

    // Deselect the numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    // Clear selected variables
    selectedTile = null;
    selectedNum = null;
}

function id(id){
return document.getElementById(id);
}

function qs(selector)
{
return document.querySelector(selector);
}

function qsa(selector)
{
return document.querySelectorAll(selector);
}
