kerk.fx = function(option){
    kerk.add(this);
    
    this.option      = option;
    this.gameObject  = LoadObj.fx[option.id];
    this.position    = option.position;
    this.particles   = [];
    this.autoDestroy = option.autoDestroy !== undefined ? option.autoDestroy : true;
    this.layer     = option.layer || 'players';
    this.angle     = option.angle;
    this.xVelocity = option.xVelocity;
    this.yVelocity = option.yVelocity;
    this.xVariance = option.xVariance/2;
    this.yVariance = option.yVariance/2;

    
    if(this.gameObject){
        this.exists = this.active = true;
        
        for(var i in this.gameObject.particles) this.addParticles(this.gameObject.particles[i]);
        
        new kerk.soundPack({
            id: this.gameObject.soundPack,
            position: this.position,
            unitid: option.unitid
        })
        
        kerk.cameraVibration({
            position: this.position,
            radius: this.gameObject.camRadius,
            force: this.gameObject.camForce
        })
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.fx.prototype = {
    setDie: function(){
        for(var i in this.particles) this.particles[i].setDie();
    },
    addParticles: function(a){
        var scope = this;
        var particles = new Particles({
                options: a,
                angle: this.angle,
                position: this.position,
                xVelocity: this.xVelocity,
                yVelocity: this.yVelocity,
                xVariance: this.xVariance,
                yVariance: this.yVariance,
                x: this.position.x,
                y: this.position.y,
                windForce: LoadMap.windForce,
                windDirection: LoadMap.windDirection,
                atachToCam: this.option.atachToCam
            });
            
            particles.onNew = function(particle){
                particle.obj = new PIXI.Sprite.fromImage(a.img);
                particle.obj.anchor.x = a.anchorX;
                particle.obj.anchor.y = a.anchorY;
                particle.obj.alpha = particle.opacity;
                particle.obj.rotation = particle.rotation;
                particle.obj.scale.x = particle.obj.scale.y = particle.scale;
                particle.obj.position.x = particle.position.x;
                particle.obj.position.y = particle.position.y;
                
                kerk.objectBlend(particle.obj,a.blend);
                
                kerk.addObject(particle.obj,a.lens ? 'lens' : scope.layer);
            }
            particles.onDraw = function(particle){
                var position = kerk.Fx3D(particle.position.x,particle.position.y,particle.height);
                
                particle.obj.position.x = position.x;
                particle.obj.position.y = position.y;
                
                particle.obj.scale.x  = particle.obj.scale.y = particle.scale+(particle.height*(a.scaleFactor || 0.05));
                particle.obj.alpha    = particle.opacity;
                particle.obj.rotation = particle.rotation;
            }
            particles.onDie = function(particle){
                kerk.removeObject(particle.obj)
            }
            particles.onDead = function(){
                removeArray(scope.particles,particles);
            }
            
            this.particles.push(particles);
    },
    update: function(){
        if(this.exists && this.active){
            for(var i in this.particles) this.particles[i].update(delta);
            
            if(this.particles.length == 0 && this.active){
                this.active = false;
                if(this.autoDestroy) this.destroy();
            }
        }
        else if(this.autoDestroy) this.destroy();
        
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        for(var i in this.particles) this.particles[i].destroy();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}