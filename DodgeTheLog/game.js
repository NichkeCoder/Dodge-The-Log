// retrieves canvas properties
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const framerate = 60;

// sets canvas properties
canvas.width = 500;
canvas.height = 500;

// stack tile properties
const stackTileWidth = 100;
const stackTileHeight = 50;
const safeAreaWidth = 80;
const logColor = "#FE5F55";
const waterColor = "#F7F7FF";

// list of tiles
let tiles = [];
let tileCount = canvas.height / stackTileHeight;

let score = 0;
let timer = 0;
let keyPressed = false;
let redScreen = false;

// stack tile declaration
class StackTile {
    constructor(side) {
        if (side === 0) {
            this.safeX = 0;
            this.danX = safeAreaWidth;
        }
        else {
            this.safeX = stackTileWidth - safeAreaWidth;
            this.danX = 0;
        }
        this.valid = side; // 0 = left, 1 = right
    }
}

// generates ten tiles on page load
function generateInitialTiles() {
    for (let i = 1; i <= tileCount; i++) {
        let dir = Math.floor(Math.random() * 2);
        let temp = new StackTile(dir);
        tiles.push(temp);
    }
}

// draws rectangle at desired position
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// draws all stack tiles from the list
function drawTiles() {
    for (let i = 1; i <= tileCount; i++) {
        if (tiles[i - 1].danX < tiles[i - 1].safeX) {
            drawRect(canvas.width / 2 - stackTileWidth / 2, canvas.height - i * stackTileHeight, tiles[i - 1].safeX, stackTileHeight, logColor);
            drawRect(canvas.width / 2 - stackTileWidth / 2 + tiles[i - 1].safeX, canvas.height - i * stackTileHeight, stackTileWidth - tiles[i - 1].safeX, stackTileHeight, waterColor);
        }
        else {
            drawRect(canvas.width / 2 - stackTileWidth / 2 + tiles[i - 1].danX, canvas.height - i * stackTileHeight, stackTileWidth - tiles[i - 1].danX, stackTileHeight, logColor);
            drawRect(canvas.width / 2 - stackTileWidth / 2, canvas.height - i * stackTileHeight, tiles[i - 1].danX, stackTileHeight, waterColor);
        }
    }
}

// draws score to screen
function drawScore(color) {
    context.fillStyle = color;
    context.font = "700 10em Poppins";
    context.textBaseline = 'middle';
    context.textAlign = "center"; 
    context.fillText(score, canvas.width / 2, canvas.height / 2 + 20);
}

// generates one tile and shifts other tiles when tile is cleared
function generateNewTile() {
    // shift all tiles by one (illusion of cutting tree)
    for (let i = 0; i < tileCount - 1; i++) {
        tiles[i] = tiles[i + 1];
    }

    // generate new tile
    let dir = Math.floor(Math.random() * 2);
    let temp = new StackTile(dir);
    tiles[tileCount - 1] = temp;
}

// resets stats to initial values
function resetGame() {
    canvas.classList.add("shake-screen");

    score = 0;
    timer = 0;
    keyPressed = false;
    redScreen = true;

    // generate new map
    tiles = [];
    generateInitialTiles();
}

canvas.addEventListener("animationend", (e) => {
    canvas.classList.remove("shake-screen");
    redScreen = false;
})


// checks whether player input is correct
window.addEventListener("keydown", ((evt) => {
    if (!keyPressed) {
        keyPressed = true;
        const key = evt.key.replace("Arrow", "");
        if (playerMove(key)) {
            score++;
            timer =  timer > 5 / 60 / 20 ? timer - 5 / 60 / 20 : 0;
            generateNewTile();
        }
        else
            resetGame();
    }
}));

// prevents multiple moves on single key press
window.addEventListener("keyup", () => {
    keyPressed = false;
})

// validates player input
function playerMove(key) {
    if (tiles[0].valid === 0 && key === "Left") {
        return true;
    }
    if (tiles[0].valid === 1 && key === "Right") {
        return true;
    }
    return false;
}

// draws frames to screen
function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "#73956F");
    drawRect(0, 0, canvas.width * timer, canvas.height, "#95464CCC");
    drawTiles();
    drawScore("#00000050");
    
    if (redScreen)
        drawRect(0, 0, canvas.width, canvas.height, "#95464CCC");
}

// updates timer each frame
function update() {
    if (timer >= 1)
        resetGame();
    timer += 1 / 60 / 20;
}

// repeats draw function every frame
function loop() {
    draw();
    update();
}

window.onload = generateInitialTiles;
setInterval(loop, 1000 / framerate);