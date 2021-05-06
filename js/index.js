const PLAYER_STATES = {
    IDLE: 'IDLE',
    MOVE: 'MOVE',
    KICK: 'KICK',
    HURT: 'HURT',
    SNEAK: 'SNEAK'
};

const PLAYER_ANIMATION_OFFSETS = {
    'IDLE': 0,
    'MOVE': 96,
    'KICK': 48,
    'HURT': 144,
    'SNEAK': 408
}

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled= false
let score = 0;

// import tileset
let tilesetReady = false;
const tileset = new Image();
tileset.onload = () => {
    tilesetReady = true;
}
tileset.src = 'assets/map/32x32/pipo-map001.png';

// import player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 24,
    height: 24,
    scale: 2.5,
    state: PLAYER_STATES.MOVE,
    walkSpeed: 120,
    runSpeed: 200,
    speed: 160,
    flipped: false,
    animation: {
        currentFrame: 0,
        totalFrames: 4,
        speed: 0.4,
        lastFrameChangeTimestamp: Date.now()
    }
};
let playerTileReady = false;
const playerTile = new Image();
playerTile.onload = () => {
    playerTileReady = true;
}
playerTile.src = 'assets/dino/sheets/DinoSprites - vita.png';

// import fruits
const fruit = {
    x: 0,
    y: 0,
    offsetX: 16,
    offsetY: 64,
    width: 16,
    height: 16,
    scale: 2
};
let fruitTilesReady = false;
const fruitTiles = new Image();
fruitTiles.onload = () => {
    fruitTilesReady = true;
}
fruitTiles.src = 'assets/Food.png';

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
            ctx.drawImage(tileset, 0, 0, 32, 32, c * 32, r*32, 64, 64);
        }
    }
}

function drawPlayer(player) {
    ctx.save();
    let playerX = player.flipped ? -1 * player.x : player.x;
    let playerWidth = player.flipped ? -1 * player.width * player.scale : player.width * player.scale;
    let playerHeight = player.flipped ? -1 * player.height * player.scale : player.height * player.scale;
    let scaleX = player.flipped ? -1 : 1;
    ctx.scale(scaleX, 1);
    ctx.drawImage(playerTile, PLAYER_ANIMATION_OFFSETS[player.state] + player.width * player.animation.currentFrame, 0, player.width, player.width, playerX - playerWidth / 2, player.y - playerHeight / 2, playerWidth, playerHeight);
    updateSpriteFrame(player);
    ctx.restore();
}

function drawFruit(fruit) {
    ctx.drawImage(
        fruitTiles, 
        fruit.offsetX, 
        fruit.offsetY, 
        fruit.width, 
        fruit.height, 
        Math.floor(fruit.x), 
        Math.floor(fruit.y), 
        fruit.width * fruit.scale, 
        fruit.height * fruit.scale
    );
}

function drawScore(score) {
    ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText(score, canvas.width - 32, 32);
}

function render() {
    tilesetReady ? drawBackground() : null;
    playerTileReady ? drawPlayer(player) : null;
    fruitTilesReady ? drawFruit(fruit) : null;
    drawScore(score);
}

function shouldSpriteFrameChange(animation) {
    const currentTimestamp = Date.now();
    const millisecondsPerFrame = (animation.speed / animation.totalFrames) * 1000;
    return animation.lastFrameChangeTimestamp + millisecondsPerFrame < currentTimestamp
}

function updateSpriteFrame(character) {
    if (shouldSpriteFrameChange(character.animation)) {
            character.animation.currentFrame = (character.animation.currentFrame + 1) % character.animation.totalFrames;
            character.animation.lastFrameChangeTimestamp = Date.now();
    }
}

function isPlayerMoving(keysDown) {
    const movingKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    return movingKeys.some(el => el in keysDown);
}

// Reset the game when the player catches a monster
var reset = function () {

	// Throw the monster somewhere on the screen randomly
	fruit.x = 32 + (Math.random() * (canvas.width - 64));
	fruit.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if ('ArrowUp' in keysDown) { // Player holding up
		player.y -= player.speed * modifier;
	}
	if ('ArrowDown' in keysDown) { // Player holding down
		player.y += player.speed * modifier;
	}
	if ('ArrowLeft' in keysDown) { // Player holding left
		player.x -= player.speed * modifier;
        player.flipped = true;
	}
	if ('ArrowRight' in keysDown) { // Player holding right
		player.x += player.speed * modifier;
        player.flipped = false;
	}

    if (isPlayerMoving(keysDown)) {
        player.state = PLAYER_STATES.MOVE;
        player.speed = player.walkSpeed;
    } else {
        player.state = PLAYER_STATES.IDLE;
    }
    if ('ControlLeft' in keysDown) {
        player.state = PLAYER_STATES.KICK;
    }
    if ('ShiftLeft' in keysDown) {
        player.speed = player.runSpeed;
        player.state = PLAYER_STATES.SNEAK;
    }
	// Are they touching?
	if (
		player.x <= (fruit.x + fruit.width * fruit.scale / 2 + player.width * player.scale / 2)
		&& fruit.x <= (player.x + fruit.width * fruit.scale / 2 + player.width * player.scale / 2)
		&& player.y <= (fruit.y + fruit.height * fruit.scale / 2 + player.height * player.scale / 2)
		&& fruit.y <= (player.y + fruit.height * fruit.scale / 2 + player.height * player.scale / 2)
	) {
		++score;
		reset();
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

var then = Date.now();
reset();
main();