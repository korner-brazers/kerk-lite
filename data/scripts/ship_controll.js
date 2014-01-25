/**
 * Контроллер управление космическим караблем
 */
  
return {
    startAction: function(){
        this.speed        = 0;
        this.direction    = 0;
        this.addDirection = 0;
        
        this.soundEngine = new kerk.sound({
            src: object.gameObject.soundMove,
            id: object.unitid,
            radius: object.gameObject.soundDistance,
            position: object.position,
            loop: true,
        })
        
        this.soundEngine.play()
    },
    updateAction: function(){
        this.speed += object.controller.moveUp && this.speed < object.gameObject.speed ? object.gameObject.acceleration : -object.gameObject.acceleration;
        
        this.speed = this.speed < 0 ? 0 : this.speed;
        
        this.addDirection -= this.addDirection >= object.gameObject.speedAngle && !object.controller.moveRight ? object.gameObject.speedAngle : 0;
        this.addDirection += this.addDirection <= -object.gameObject.speedAngle && !object.controller.moveLeft ? object.gameObject.speedAngle : 0;
        
        
        this.addDirection += object.controller.moveRight && this.addDirection < object.gameObject.maxAngle ? object.gameObject.speedAngle : 0; 
        this.addDirection += object.controller.moveLeft && this.addDirection > -object.gameObject.maxAngle ? -object.gameObject.speedAngle : 0; 
        
        this.direction += this.addDirection;
        
        object.position.offset(this.speed,this.direction);
        
        
        object.object.rotation   = this.direction;
        object.object.position.x = smooth(object.object.position.x,object.position.x,object.gameObject.smoothMove || 9,true);
        object.object.position.y = smooth(object.object.position.y,object.position.y,object.gameObject.smoothMove || 9,true);
        
        var addAcceleration = object.gameObject.acceleration*6;
        
        this.speed = this.speed < addAcceleration ? addAcceleration : this.speed;
        
        var timeAnim = Math.abs(this.addDirection) / object.gameObject.maxAngle;
        
        if(this.addDirection > 0) object.animation.setAnimate('TurnRight',{useAmount:timeAnim});
        else if(this.addDirection < 0) object.animation.setAnimate('TurnLeft',{useAmount:timeAnim});
        else object.animation.setAnimate('idle');
        
        this.soundEngine.setMaxVolume(this.speed/object.gameObject.speed);
    },
    destroyAction: function(){
        
    }
}