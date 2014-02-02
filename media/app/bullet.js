kerk.bullet = function(option){
    kerk.add(this);
    
    this.option     = option;
    this.unitid     = option.unitid;
    this.weapon_id  = option.weapon_id;
    this.gameObject = option.bullet;
    
    this.shell     = {
        speed: 0,
        tween_speed: new TweenFn(this.gameObject.speed),
        angle: ToAngleObject(this.option.pointStart,this.option.pointEnd),
        distance: ToPointObject(this.option.pointStart,this.option.pointEnd),
        opacity: 1
    }
    
    this.position      = new Vector({x:this.option.pointStart.x,y:this.option.pointStart.y});
    this.direcPosition = this.position.clone();
    this.velocity      = new Vector({x:0,y:0});
                
    var addAngle = random(0,this.gameObject.stepDeviation,1) * ((this.shell.distance*0.001) * this.gameObject.stepDistance);
    
    this.shell.angle += random(0,10) > 5 ? addAngle : -addAngle;
    
    this.spriteObject = kerk.createSprite({
        img: this.gameObject.shell
    })
        
    if(this.gameObject.tracer){
        this.tracer       = new kerk.tracer({
            id: this.gameObject.tracer,
            unitid:this.unitid,
            position: this.spriteObject.position
        });
    }
    
    this.spriteObject.position.x = this.position.x;
    this.spriteObject.position.y = this.position.y;
    this.spriteObject.rotation   = this.shell.angle;
    
    kerk.objectBlend(this.spriteObject,this.gameObject.blend);
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
    
}
kerk.bullet.prototype = {
    destroyBullet: function(){
        kerk.removeObject(this.spriteObject);
        if(this.tracer) this.tracer.setDead();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        this.destroy();
    },
    beforeDestroy: function(otherTag){
        var coll = this.gameObject.collisionFx;
        
        if(coll){
            var fx = otherTag && coll[otherTag] ? coll[otherTag] : coll.none;
            
            
            new kerk.fx({
                id: fx,
                position: this.spriteObject.position,
                angle: this.shell.angle - Math.PI
            })
            
        }
        
        this.destroyBullet()
    },
    update: function(){
        /** Скорость **/
        this.shell.speed = this.shell.tween_speed.addDelta(delta);
        
        if(!this.gameObject.customUpdate){
            /** Гравитация и масса **/
            this.velocity.add({x:0,y:(LoadObj.settings.main.gravitation*this.gameObject.mass) * delta});
                            
            /** Позиция **/
            this.position.add(this.velocity.clone().offset(this.shell.speed * delta,this.shell.angle));
            
            /** Устанавливаем направление **/
            this.direcPosition.x = smooth(this.direcPosition.x,this.position.x,5);
            this.direcPosition.y = smooth(this.direcPosition.y,this.position.y,5);
        }
        
        /** Устанавливаем позицию **/
        this.spriteObject.position.x = this.position.x;
        this.spriteObject.position.y = this.position.y;
        
        if(!this.gameObject.customUpdate) this.spriteObject.rotation = ToAngleObject(this.direcPosition,this.position)
        
        var distance = ToPointObject(this.option.pointStart,this.spriteObject);
        
        if(distance > this.gameObject.maxDistance){
            this.shell.opacity -= .05;
            this.spriteObject.alpha = this.shell.opacity;
            
            if(this.shell.opacity < 0) return this.beforeDestroy();
        }
        
        
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        kerk.remove(this);
    }
}