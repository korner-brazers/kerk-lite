/**
 * Контроллер управление космическим караблем
 */
  
return {
    startAction: function(){
        this.speed        = 0;
        this.maxSpeed     = <@maxSpeed:number:'Скорость'> || 5;
        this.speedAngle   = <@speedAngle:number:'Угол поворота'> || 0.0012;
        this.maxAngle     = <@maxAngle:number:'Мак. угол'> || 0.022;
        this.acceleration = <@acceleration:number:'Разгон'> || 0.05;
        this.direction    = 0;
        this.addDirection = 0;
        this.soundUrl     = <@soundEngine:sound:'Звук двигателя'>;
        
        this.animIdle     = <@animIdle:input:'Анимация на месте'>;
        this.animLeft     = <@animLeft:input:'Анимация влево'>;
        this.animRight    = <@animRight:input:'Анимация вправо'>;
        
        this.soundEngine = new kerk.sound({
            src: this.soundUrl,
            id: object.unitid,
            radius: object.gameObject.soundDistance,
            position: object.position,
            loop: true,
        })
        
        this.soundEngine.play()
    },
    updateAction: function(){
        this.speed += object.controller.moveUp && this.speed < this.maxSpeed ? this.acceleration : -this.acceleration;
        
        this.speed = this.speed < 0 ? 0 : this.speed;
        
        this.addDirection -= this.addDirection >= this.speedAngle && !object.controller.moveRight ? this.speedAngle : 0;
        this.addDirection += this.addDirection <= -this.speedAngle && !object.controller.moveLeft ? this.speedAngle : 0;
        
        
        this.addDirection += object.controller.moveRight && this.addDirection < this.maxAngle ? this.speedAngle : 0; 
        this.addDirection += object.controller.moveLeft && this.addDirection > -this.maxAngle ? -this.speedAngle : 0; 
        
        this.direction += this.addDirection;
        
        object.position.offset(this.speed,this.direction);
        
        
        object.object.rotation   = this.direction;
        object.object.position.x = smooth(object.object.position.x,object.position.x,object.gameObject.smoothMove || 9,true);
        object.object.position.y = smooth(object.object.position.y,object.position.y,object.gameObject.smoothMove || 9,true);
        
        var addAcceleration = this.acceleration*6;
        
        this.speed = this.speed < addAcceleration ? addAcceleration : this.speed;
        
        var timeAnim = Math.abs(this.addDirection) / this.maxAngle;
        
        if(this.addDirection > 0) object.animation.setAnimate(this.animRight,{useAmount:timeAnim});
        else if(this.addDirection < 0) object.animation.setAnimate(this.animLeft,{useAmount:timeAnim});
        else object.animation.setAnimate(this.animIdle);
        
        this.soundEngine.setMaxVolume(this.speed/this.maxSpeed);
    },
    destroyAction: function(){
        
    }
}