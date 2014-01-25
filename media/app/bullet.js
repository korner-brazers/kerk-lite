kerk.bullet = function(option){
    kerk.add(this);
    
    this.option    = option;
    this.unitid    = option.unitid;
    this.weapon_id = option.weapon_id;
    this.bullet    = option.bullet;
    
    //this.sprite    = new kerk.sprite(this.bullet.shell);
    
    this.shell     = {
        speed: 0,
        tween_speed: new TweenFn(this.bullet.speed),
        angle: ToAngleObject(this.option.pointStart,this.option.pointEnd),
        distance: ToPointObject(this.option.pointStart,this.option.pointEnd),
        opacity: 1
    }
    
    
    this.position      = new Vector({x:this.option.pointStart.x,y:this.option.pointStart.y});
    this.direcPosition = this.position.clone();
    this.velocity      = new Vector({x:0,y:0});
                
    var addAngle = random(0,this.bullet.stepDeviation,1) * ((this.shell.distance*0.001) * this.bullet.stepDistance);
    
    this.shell.angle += random(0,10) > 5 ? addAngle : -addAngle;
    
    //this.spriteObject = kerk.addObject(this.sprite.object,'players');
    this.sprite = new PIXI.Sprite.fromImage(this.bullet.shell);
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    
    this.spriteObject = kerk.addObject(this.sprite,'players');
    
    
    this.tracer       = new kerk.tracer({
        id: this.bullet.tracer,
        unitid:this.unitid,
        position: this.spriteObject.position
    });
    
    
    this.spriteObject.position.x = this.position.x;
    this.spriteObject.position.y = this.position.y;
    this.spriteObject.rotation   = this.shell.angle;
    
    kerk.objectBlend(this.spriteObject,this.bullet.blend);
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.bullet.prototype = {
    destroyBullet: function(){
        kerk.removeObject(this.sprite);
        //kerk.removeObject(this.spriteObject);
        this.tracer.setDead();
        //this.sprite.destroy();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        this.destroy();
    },
    beforeDestroy: function(otherTag){
        var checkGround = kerk.collisionZone('ground',this.spriteObject.position.x,this.spriteObject.position.y);
        
        var coll = this.bullet.collisionFx;
        
        if(coll){
            var fx = checkGround && coll[checkGround.tag] ? coll[checkGround.tag] : (otherTag && coll[otherTag] ? coll[otherTag] : coll.none);
            
            
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
        
        /** Гравитация и масса **/
        this.velocity.add({x:0,y:(LoadObj.settings.main.gravitation*this.bullet.mass) * delta});
                        
        /** Позиция **/
        this.position.add(this.velocity.clone().offset(this.shell.speed * delta,this.shell.angle));
        
        /** Устанавливаем направление **/
        this.direcPosition.x = smooth(this.direcPosition.x,this.position.x,5);
        this.direcPosition.y = smooth(this.direcPosition.y,this.position.y,5);
        
        /** Устанавливаем позицию **/
        this.spriteObject.position.x = this.position.x;
        this.spriteObject.position.y = this.position.y;
        this.spriteObject.rotation   = ToAngleObject(this.direcPosition,this.position)
        
        var distance = ToPointObject(this.option.pointStart,this.spriteObject);
        
        if(distance > this.bullet.maxDistance){
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