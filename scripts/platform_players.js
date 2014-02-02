return {
    startAction: function(){
        this.speed        = <@speed:number:'Скорость'>;
        this.boxWidth     = <@boxWidth:number:'Ширина бокса'>;
        this.boxHeight    = <@boxHeight:number:'Высота бокса'>;
        this.impulse      = <@impulseJump:number:'Импульс прыжка'>;
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