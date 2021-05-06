import Player from './player.js';
import Food from './food.js';
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled= false;
let score = 0;
const foodsAvailable = Object.keys(Food.FOOD_TYPES);
// import background tileset
let bgReady = false;
const bgTileset = new Image();
bgTileset.onload = () => {
    bgReady = true;
}
bgTileset.src = 'assets/map/32x32/pipo-map001.png';

// import player
const player = new Player(canvas,'VITA');

// import foods
let foods = [];

// handle player input 
let keysDown = {};
window.addEventListener("keydown", function (e) {
	keysDown[e.code] = true;
    console.log(keysDown);
}, false);

window.addEventListener("keyup", function (e) {
	delete keysDown[e.code];
    console.log(keysDown);
}, false);

function drawBackground() {
    for (let c = 0; c < Math.ceil(canvas.width / 32); c++) {
        for (let r = 0; r < Math.ceil(canvas.height / 32); r++) {
            ctx.drawImage(bgTileset, 0, 0, 32, 32, c * 32, r*32, 64, 64);
        }
    }
}

function drawScore(score) {
    ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText(score, canvas.width - 32, 32);
}

function render() {
    bgReady ? drawBackground() : null;
    player.draw(ctx);
    foods.map(food => food.draw(ctx));
    drawScore(score);
}

var newFood = function () {
    foods.pop();
    const randomFoodType = Math.floor(Math.random() * foodsAvailable.length);
    const newFoodType = foodsAvailable[randomFoodType];
    foods.push(new Food(
        32 + Math.random() * (canvas.width - 64),
        32 + Math.random() * (canvas.height - 64),
        Food.FOOD_TYPES[newFoodType])
    );
};

// Update game objects
var update = function (modifier) {
    player.update(keysDown, modifier);
	
	// Are they touching?
    foods.some(food => {
        if (
            player.x <= (food.x + food.width * food.scale / 2 + player.width * player.scale / 2)
            && food.x <= (player.x + food.width * food.scale / 2 + player.width * player.scale / 2)
            && player.y <= (food.y + food.height * food.scale / 2 + player.height * player.scale / 2)
            && food.y <= (player.y + food.height * food.scale / 2 + player.height * player.scale / 2)
        ) {
            ++score;
            newFood();
        }
    })
	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	requestAnimationFrame(main);
};

var then = Date.now();
newFood();
main();