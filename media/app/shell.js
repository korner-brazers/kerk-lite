kerk.shell = function(option){
    kerk.add(this);
    
    this.object    = option.object;
    this.active    = false;
    this.exists    = false;
    this.gameObject    = LoadObj.bullet[option.id];
    this.unitid        = option.unitid;
    this.weapon_id     = option.weapon_id;
    this.solid         = option.solid;
    this.gameObject_id = option.id;
    
    this.timer     = this.stop = 0;
    this.sound     = {};
    
    if(this.gameObject){
        this.exists = true;
        
        this.sound.shot = new kerk.sound({
            src: this.gameObject.soundShot,
            id: this.unitid,
            radius: this.gameObject.soundDistance
        })
        
        this.sound.blur = new kerk.sound({
            src: this.gameObject.soundShotBlur,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            radiusBlur: this.gameObject.soundBlurDistance
        })
        
        this.sound.loop = new kerk.sound({
            src: this.gameObject.soundShotLoop,
            id: this.unitid,
            loop: 1,
            position: this.object.position,
            radius: this.gameObject.soundDistance,
        })
        
        this.sound.loopBlur = new kerk.sound({
            src: this.gameObject.soundShotBlurLoop,
            id: this.unitid,
            loop: 1,
            position: this.object.position,
            radius: this.gameObject.soundDistance,
            radiusBlur: this.gameObject.soundBlurDistance
        })
        
        this.sound.end = new kerk.sound({
            src: this.gameObject.soundShotLoopEnd,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            position: this.object.position,
        })
        
        this.sound.endBlur = new kerk.sound({
            src: this.gameObject.soundShotBlurLoopEnd,
            id: this.unitid,
            radius: this.gameObject.soundDistance,
            radiusBlur: this.gameObject.soundBlurDistance,
            position: this.object.position,
        })
    } 
    else console.log('No find shell in data');
    
}
kerk.shell.prototype = {
    addCallback: function(call){
        this.callback = call;
    },
    setActive: function(a){
        this.active = a;
    },
    update: function(){
        if(this.exists){
            this.timer += 1000*delta;
            
            if(this.active && this.timer > this.gameObject.delay){
                
                var coller    = kerk.getController(this.unitid);
                var pointShot = {
                    x: this.object.position.x,
                    y: this.object.position.y
                }
                
                var pointEnd = this.solid ? OffsetPointObject(this.object,100,0) : coller.sight;
                
                new kerk.bullet({
                    pointStart: pointShot,
                    pointEnd: pointEnd,
                    bullet: this.gameObject,
                    unitid: this.unitid,
                    weapon_id: this.weapon_id,
                    id: this.gameObject_id
                })
                
                this.sound.shot.setPosition(pointShot).play(true);
                this.sound.blur.setPosition(pointShot).play(true);
                
                new kerk.fx({
                    id: this.gameObject.shotFx,
                    position: pointShot,
                    angle: ToAngleObject(pointShot,pointEnd),
                    unitid: this.unitid,
                })
                
                this.callback && this.callback();
                
                this.timer = 0;
                this.stop  = 1;
            }
            
            if(this.stop && this.timer < this.gameObject.soundMinTime){
                this.sound.loop.play();
                this.sound.loopBlur.play();
            }
            else if(this.stop && !this.active){
                this.sound.loop.stop().reset();
                this.sound.loopBlur.stop().reset();
                this.sound.end.play(true);
                this.sound.endBlur.play();
                this.stop = false;
            } 
        }
    },
    destroy: function(){
        for(var i in this.sound) this.sound[i].destroy();
        
        kerk.remove(this);
    }
}