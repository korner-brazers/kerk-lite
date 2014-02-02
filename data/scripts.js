var scripts = {};
var attachedScripts = {"1390134327079_a":["ai_controll","ship_controll","collision"],"1388133208745_a":["ship_controll","collision"],"1387889799183_a":["bullet"],"1387889459023_a":["bullet"],"1391264345660_a":["platform_players"],"1390159372203_img":["click_play"]};
scripts.ai_controll = function (object){
/**
 * Контроллер AI ботов
 */
  
return {
    startAction: function(){
        this.distance = object.gameObject.viewDistance || 400;
    },
    updateAction: function(){
        var myPlayer = kerk.getMyPlayer();
        
        /** Вычисляем в какую сторону поварачивать **/
        var curs = turnLeftOrRight(
            object.object.rotation, //врашение обьекта в радианах
            /** Функци вычесления врашения по двум точкам **/
            ToAngleObject(
                object.object,  // Где находится этот обьект
                myPlayer.object // Где находится обьект игрока
            ));
        
        /** Устанавливаем что вы не нажали клавиши **/
        object.controller.moveRight = object.controller.moveLeft = 0;
        
        /** Поворачиваем по задоному курсу **/
        if(curs > 0) object.controller.moveRight = 1;
        if(curs < 0) object.controller.moveLeft  = 1;
        
        //object.object.rotation = ToAngleObject(object.object,myPlayer.object);
        
        /** Всегда движемся вперед **/
        object.controller.moveUp = 1;
        
        /** Вычислеям дистанцию **/
        
        var distance = ToPointObject(object.object,myPlayer.object);
        
        /** Таже функция для разварота но теперь если обьект находится в зоне цели то начинаем стрелять **/
        var ifShot = turnLeftOrRight(
            object.object.rotation,
            ToAngleObject(
                object.object, 
                myPlayer.object
            ),
                0.5 // если эта та самая зона в пределах 0.5 радиан
            );
            
        object.controller.shot = distance < this.distance && ifShot == 0 ? 1 : 0;
    },
    destroyAction: function(){
        
    }
}
}
scripts.ship_controll = function (object){
/**
 * Контроллер управление космическим караблем
 */
  
return {
    startAction: function(){
        this.speed        = 0;
        this.maxSpeed     = object.gameObject.maxSpeed || 5;
        this.speedAngle   = object.gameObject.speedAngle || 0.0012;
        this.maxAngle     = object.gameObject.maxAngle || 0.022;
        this.acceleration = object.gameObject.acceleration || 0.05;
        this.direction    = 0;
        this.addDirection = 0;
        this.soundUrl     = object.gameObject.soundEngine;
        
        this.animIdle     = object.gameObject.animIdle;
        this.animLeft     = object.gameObject.animLeft;
        this.animRight    = object.gameObject.animRight;
        
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
}
scripts.collision = function (object){
/**
 * Детектор поподания в обьект
 */

return {
    startAction: function(){
        this.fxDie = object.gameObject.fxDie;
        
        var scope  = this;
        
        /** Достаем колайдеры из анимациий **/
        object.animation.getBox(function(box){
            box.addCollision(scope.collision)
        })
    },
    collision: function(target){
        
        /** Если это не пуля то пропускаем **/
        if(!target.bullet) return;
        
        /** Высчитываем жизнь **/
        object.life -= target.bullet;
        object.life  = object.life < 0 ? 0 : object.life;
        
        /** Ну как ясно мы умерли **/
        if(object.life == 0){
            
            /** Создаем FX **/
            new kerk.fx({
                position: object.position.clone(),
                id: object.gameObject.fxDie,
            })
            
            /** Новая позиция **/
            var newPosition = {
                x: random(0,LoadMap.w),
                y: random(0,LoadMap.h)
            }
            
            /** Обновляем позицию и жизнь **/
            object.life = object.gameObject.health;
            
            object.position.x = newPosition.x;
            object.position.y = newPosition.y;
            
            /** Обновляем позицию обьекта **/
            object.object.position.x = newPosition.x;
            object.object.position.y = newPosition.y;
            
        }
    },
    updateAction: function(){
        
    },
    destroyAction: function(){
        
    }
}
}
scripts.bullet = function (object){
return {
    startAction: function(){
        /** Создаем детектор **/
        this.box = new kerk.box({
            object: object.spriteObject,
            width:  object.gameObject.boxCollisionWidth, 
            height: object.gameObject.boxCollisionHeight,
            solid: false
        })
        
        /** Добовляем  Callback **/
        this.box.addCallback(function(box){
            if(box.option.unitid !== object.unitid){
                
                /** Вызываем обратный Callback **/
                box.runCollision({
                    bullet: object.gameObject.stepDegree
                })
                
                /** Уничтожаем пулю **/
                object.beforeDestroy(box.option.tag);
            }
        })
    },
    updateAction: function(){
        
    },
    destroyAction: function(){
        this.box.destroy();
    }
}
}
scripts.platform_players = function (object){
return {
    startAction: function(){
        this.speed        = object.gameObject.speed;
        this.boxWidth     = object.gameObject.boxWidth;
        this.boxHeight    = object.gameObject.boxHeight;
        this.impulse      = object.gameObject.impulseJump;
        this.jumpTimer    = 200;
        this.contact      = 0;
        
        var scope = this;
        
        this.body = new kerk.box2D({
            type: 'box',
            position: object.position,
            width: this.boxWidth,
            height: this.boxHeight,
            dynamic: 1,
            restitution: 0,
            BeginContact: function(contact){
                scope.contact = 1;
            }
        })
        
        this.body.body.SetSleepingAllowed(false);
        
        object.animation.setAnimate('idle');
    },
    updateAction: function(){
        
        this.body.SetAngle(0);
        
        object.position.set(this.body.GetPosition());
        
        object.object.rotation = this.body.GetAngle();
        
        object.object.position.x = smooth(object.object.position.x,object.position.x,object.gameObject.smoothMove || 9,true);
        object.object.position.y = smooth(object.object.position.y,object.position.y,object.gameObject.smoothMove || 9,true);
        
        if(object.controller.moveRight)     this.body.SetMove(this.speed,null)
        else if(object.controller.moveLeft) this.body.SetMove(-this.speed,null)
        else                                this.body.SetMove(0,null)
        
        if(object.controller.moveUp && this.contact && this.jumpTimer > 60){
            this.jumpTimer = this.contact = 0;
            this.body.ApplyImpulse(0,-this.impulse,true);
        } 
        
        this.jumpTimer++;
    },
    destroyAction: function(){
        this.body.destroy()
    }
}
}
scripts.click_play = function (object){
return {
    startAction: function(){
        
        object.sprite.setInteractive(true);
        
        object.sprite.mousedown = function(mouseData){
            menu.startGame({
                map_id: '0f672fbe3c515cb80d6bb8c7ebfc390d'
            })
        }

        this.tween = TweenSimple([[0,0],[1,1000],[0,2000]],1);
    },
    updateAction: function(){
        object.sprite.alpha = this.tween.delta()
    },
    destroyAction: function(){
        
    }
}
}
