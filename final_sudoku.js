const easy=[
"6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345----290",
"685329174971485326234761859362574981549618732718293465823946517197852643456137290"
];
const medium=[
"6-------------5-2------1----62----81--96-----7---9-4-5-2---651---78----345----290",
"685329174971485326234761859362574981549618732718293465823946517197852643456137290"
];
const hard=[
"6------7------5-2------1---362----81--96-------------------651---78----345----290",
"685329174971485326234761859362574981549618732718293465823946517197852643456137290"
];
//create variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function() {
    id("start-btn").addEventListener("click", startGame);
    for (let i = 0; i < document.querySelector("#number-container").children.length; i++) {
        document.querySelector("#number-container").children[i].addEventListener("click", function() {
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    for (let i = 0; i < 9; i++) {
                        document.querySelector("#number-container").children[i].classList.remove("selected");
                    }
                }
                this.classList.add("selected");
                selectedNum = this;
                updateMove();
            }
        });
    }
}


function startGame(){
	let board;
	if(id("diff-1").checked)board = easy[0];
	else if(id("diff-2").checked)board = medium[0];
	else board =hard[0];
	
	lives = 3;
	disableSelect = false;
	id("lives").textcontent = "Lives Remaining: 3";
	generateBoard(board);
	
	startTimer();
	if(id("theme-1").checked){
		qs("body").classList.remove("dark");
	}
	else{
		qs("body").classList.add("dark");
	}
	id("number-container").classList.remove("hidden");
}

function startTimer(){
	if (id("time-1").checked) timeRemaining=300;
	else if(id("time-2").checked) timeRemaining=600;
	else timeRemaining=900;
	id("timer").textContent = timeConversion(timeRemaining);
	timer = setInterval(function()
	{
		timeRemaining--;
		if(timeRemaining === 0) endGame();
		id("timer").textContent = timeConversion(timeRemaining);
	},1000)
}

function timeConversion(time){
	let minutes =Math.floor(time/60);
	if (minutes < 10)minutes = "0" + minutes;
	let seconds = time % 60;
	if (seconds < 10) seconds = "0" +seconds;
	return minutes + ":" + seconds;
}

function generateBoard(board) {
    clearPrevious();
    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        if (board[i] !== "-") {
            tile.textContent = board.charAt(i);
        } else {
            tile.addEventListener("click", function () {
                if (!disableSelect) {
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
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
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6) {
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
}


function updateMove(){
	if(selectedTile && selectedNum){
		selectedTile.textContent = selectedNum.textContent;
		if(checkCorrect(selectedTile)){
			selectedTile.classList.remove("selected");
			selectedNum.classList.remove("selected");
			selectedNum=null;
			selectedTile=null;
		}
		
		if(checkDone()){
			endGame();
		}
		
		else{
			
			disableSelect=true;
			selectedTile.classList.add("incorrect");
			setTime(function(){
				lives--;
				if(lives ===0) {
					endGame();
				}
				else {
					id("lives").textContent = "Lives Remaining: " + lives;
					disableSelect = false;
				}
					selectedTile.classList.remove("incorrect");
					selectedTile.classList.remove("selected");
					selectedNum.classList.remove("selected");
					selectedTile.textContent = "";
					selectedTile = null;
					selectedNum = null;
			},1000);
		}
	}
}

function checkDone(){
	let tiles = qsa(".tile");
	for (let i=0;i<tiles.lenght;i++){
		if(tile[i].textContent ==="") return false;
	}
	return true;
	
}

function endGame() {
    disableSelect = true;
    clearTimeout(timer);
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
	if(solution.chartAt(tile.id)==tile.textContent)  return true;
	else return false;
	
}
function clearPrevious(){
	let tiles = qsa(".tile");
	for(let i = 0 ; i< tiles.length; i++)
	{
		tiles[i].remove();
	}
	if(timer)clearTimeout(timer);
	for(let i = 0;i < id("number-container").children.length;i++){
		id("number-container").children[i].classList.remove("selected");
	}
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






