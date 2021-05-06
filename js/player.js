import AnimationUtils from './animationUtils.js';
export default class Player {
    PLAYER_STATES = {
        IDLE: 'IDLE',
        MOVE: 'MOVE',
        KICK: 'KICK',
        HURT: 'HURT',
        SNEAK: 'SNEAK'
    };
    
    PLAYER_ANIMATIONS = {
        IDLE: {
            offset: 0,
            frames: 4,
            speed: 0.5
        },
        MOVE: {
            offset: 96,
            frames: 7,
            speed: 0.3
        },
        KICK: {
            offset: 48,
            frames: 4,
            speed: 0.4
        },
        HURT: {
            offset: 144,
            frames: 4,
            speed: 0.4
        },
        SNEAK: {
            offset: 408,
            frames: 6,
            speed: 0.25
        }
    }

    PLAYER_CHARACTERS = {
        DOUX: {
            tilesetPath: 'assets/dino/sheets/DinoSprites - doux.png'
        },
        MORT: {
            tilesetPath: 'assets/dino/sheets/DinoSprites - mort.png'
        },
        TARD: {
            tilesetPath: 'assets/dino/sheets/DinoSprites - tard.png'
        },
        VITA: {
            tilesetPath: 'assets/dino/sheets/DinoSprites - vita.png'
        }
    }

    constructor(canvas, character = 'VITA', scale = 2.5, state = 'IDLE') {
        this.initialized = false;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 24;
        this.height = 24;
        this.scale = scale;
        this.state = this.PLAYER_STATES[state];
        this.walkSpeed = 120;
        this.runSpeed = 200;
        this.speed = 160;
        this.flipped = false;
        this.animation = {
            currentFrame: 0,
            totalFrames: 4,
            speed: 0.4,
            lastFrameChangeTimestamp: Date.now()
        };
        this.tileset = null;
        this.tilesetPath = this.PLAYER_CHARACTERS[character].tilesetPath;
        this.initialize();
    }

    initialize = function() {
        this.tileset = new Image();
        this.tileset.onload = () => {
            this.initialized = true;
        }
        this.tileset.src = this.tilesetPath;
    }

    draw = function(ctx) {
        if (!this.initialized) return;
        ctx.save();
        let playerX = this.flipped ? -1 * this.x : this.x;
        let playerWidth = this.flipped ? -1 * this.width * this.scale : this.width * this.scale;
        let playerHeight = this.flipped ? -1 * this.height * this.scale : this.height * this.scale;
        let scaleX = this.flipped ? -1 : 1;
        ctx.scale(scaleX, 1);
        ctx.drawImage(this.tileset, this.PLAYER_ANIMATIONS[this.state].offset + this.width * this.animation.currentFrame, 0, this.width, this.width, playerX - playerWidth / 2, this.y - playerHeight / 2, playerWidth, playerHeight);
        AnimationUtils.updateSpriteFrame(this);
        ctx.restore();
    }

    update = function(keysDown, modifier) {
        if ('ArrowUp' in keysDown) { // Player holding up
            this.y -= this.speed * modifier;
        }
        if ('ArrowDown' in keysDown) { // Player holding down
            this.y += this.speed * modifier;
        }
        if ('ArrowLeft' in keysDown) { // Player holding left
            this.x -= this.speed * modifier;
            this.flipped = true;
        }
        if ('ArrowRight' in keysDown) { // Player holding right
            this.x += this.speed * modifier;
            this.flipped = false;
        }
    
        if (this.isPlayerMoving(keysDown)) {
            this.setState(this.PLAYER_STATES.MOVE);
        } else {
            this.setState(this.PLAYER_STATES.IDLE);
        }
        if ('ControlLeft' in keysDown) {
            this.setState(this.PLAYER_STATES.KICK);    }
        if ('ShiftLeft' in keysDown) {
            this.setState(this.PLAYER_STATES.SNEAK);
        }
    }

    setState(newState) {
        this.state = newState;
        if (newState === this.PLAYER_STATES.SNEAK) {
            this.speed = this.runSpeed;
        }
        else {
            this.speed = this.walkSpeed;
        }
        const newAnimation = this.PLAYER_ANIMATIONS[newState];
        this.animation.speed = newAnimation.speed;
        this.animation.totalFrames = newAnimation.frames;
    }

    isPlayerMoving = function(keysDown) {
        const movingKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        return movingKeys.some(el => el in keysDown);
    }
}


