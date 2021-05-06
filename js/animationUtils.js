export default class AnimationUtils {
    static shouldSpriteFrameChange = function(animation) {
        const currentTimestamp = Date.now();
        const millisecondsPerFrame = (animation.speed / animation.totalFrames) * 1000;
        return animation.lastFrameChangeTimestamp + millisecondsPerFrame < currentTimestamp
    }
    
    static updateSpriteFrame = function(character) {
        if (this.shouldSpriteFrameChange(character.animation)) {
                character.animation.currentFrame = (character.animation.currentFrame + 1) % character.animation.totalFrames;
                character.animation.lastFrameChangeTimestamp = Date.now();
        }
    }
}