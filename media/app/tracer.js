kerk.tracer = function(option){
    kerk.add(this);
    
    this.tracer       = LoadObj.tracers[option.id];
    this.position     = option.position || {x:0,y:0};
    this.lastPosition = false;
    this.tracers      = [];
    this.unitid       = option.unitid;
    this.dead         = false;
    
    if(this.tracer){
        if(this.tracer.useFx){
            this.useFx = new kerk.fx({
                id: this.tracer.useFx,
                unitid: this.unitid,
                position: this.position,
                angle: 0
            })
            
            this.exists = false;
        }
        else this.exists = true;
    }  
}
kerk.tracer.prototype = {
    setPoint: function(position){
        this.position = position;
    },
    setDead: function(){
        this.dead = true;
    },
    update: function(){
        if(!this.lastPosition){
            this.lastPosition = {
                x: this.position.x,
                y: this.position.y
            }
        }
        
        if(this.exists && this.lastPosition){
            var distance = ToPointObject(this.lastPosition,this.position);
            
            if(distance >= this.tracer.density){
                
                var tracer = new PIXI.Sprite.fromImage(this.tracer.image);
                    tracer.position.x = this.tracer.stretch ? this.lastPosition.x : this.position.x;
                    tracer.position.y = this.tracer.stretch ? this.lastPosition.y : this.position.y;
                    tracer.anchor.x   = this.tracer.stretch ? 0 : 0.5;
                    tracer.anchor.y   = 0.5;
                    
                    tracer.userData = {};
                    
                    tracer.userData.tween_scale    = new TweenFn(this.tracer.scale);
                    tracer.userData.tween_opacity  = new TweenFn(this.tracer.opacity);
                    tracer.userData.tween_rotation = new TweenFn(this.tracer.rotation);
                    
                    tracer.userData.tween_scale.setTimeDiff(this.tracer.timelive);
                    tracer.userData.tween_opacity.setTimeDiff(this.tracer.timelive);
                    tracer.userData.tween_rotation.setTimeDiff(this.tracer.timelive);
                    
                    tracer.userData.age = 0;
                    tracer.userData.stretch = this.tracer.stretch;
                    
                    var scale = tracer.userData.tween_scale.lerp(0);
                    
                    tracer.scale.x  = this.tracer.stretch ? distance / tracer.width : scale;
                    tracer.scale.y  = this.tracer.stretch ? 1 : scale;
                    tracer.alpha    = tracer.userData.tween_opacity.lerp(0);
                    tracer.rotation = this.tracer.stretch ? ToAngleObject(this.lastPosition,this.position) : ToAngleObject(this.position,this.lastPosition);
                    
                    kerk.objectBlend(tracer,this.tracer.blend);
                    
                this.tracers.push(tracer);
                
                kerk.addObject(tracer,'players');

                this.lastPosition.x = this.position.x;
                this.lastPosition.y = this.position.y;
            }
            
            for(var i in this.tracers){
                var trac = this.tracers[i];
                    trac.alpha = trac.userData.tween_opacity.addDelta(focusDelta);
                    
                    if(!trac.userData.stretch){
                        var scale = trac.userData.tween_scale.addDelta(focusDelta);
                        
                        trac.scale.x = scale;
                        trac.scale.y = scale;
                        
                        /* Пока подумаем */
                        //trac.rotation = trac.userData.tween_rotation.addDelta(delta);
                    }
                    
                    trac.userData.age += focusDelta*1000;
                    
                    if(trac.userData.age >= this.tracer.timelive){
                        kerk.removeObject(trac);
                        removeArray(this.tracers,trac);
                    } 
            }
        }
        
        if(this.dead && this.tracers.length == 0) this.destroy();
    },
    destroy: function(){
        for(var i in this.tracers) kerk.removeObject(this.tracers[i]);
        
        if(this.useFx) this.useFx.setDie();
        
        kerk.remove(this);
    }
}