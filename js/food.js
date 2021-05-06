export default class Food {
    static FOOD_TYPES = {
        STRAWBERRY: {
            offsetX: 16,
            offsetY: 64
        },
        PEACH: {
            offsetX: 32,
            offsetY: 64
        },
        CHEESE: {
            offsetX: 0,
            offsetY: 48
        },
        APPLE: {
            offsetX: 64,
            offsetY: 16
        }
    }
    constructor(x,  y, foodType = this.FOOD_TYPES.STRAWBERRY, scale = 2) {
        this.id = Date.now();
        this.initialized = false;
        this.tileset = null;
        this.x = x;
        this.y = y;
        this.offsetX = foodType.offsetX;
        this.offsetY = foodType.offsetY;
        this.width = 16;
        this.height = 16;
        this.scale = scale;

        this.initialize();
    };

    initialize = function() {
        this.tileset = new Image();
        this.tileset.onload = () => {
            this.initialized = true;
        }
        this.tileset.src = 'assets/Food.png';
    }

     draw = function(ctx) {
        if (!this.initialized) return;
        ctx.drawImage(
            this.tileset, 
            this.offsetX, 
            this.offsetY, 
            this.width, 
            this.height, 
            Math.floor(this.x), 
            Math.floor(this.y), 
            this.width * this.scale, 
            this.height * this.scale
        );
    }
    
}