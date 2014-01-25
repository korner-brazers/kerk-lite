/*
 * Javascript/HTML5 Particle Generator v1.0
 * 
 * Copyright (c) 2014 Qwarp, http://sl-cms.com
 * 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
 
var Particle = function(emiter){
    this.position    = emiter.position;
    this.life        = emiter.life;
    this.velocity    = emiter.velocity;
    
    this.direction   = emiter.direction;
    this.lifeOfDead  = variance(emiter.options.particleLifeOfDead) || 0;
    this.gravityVector = new Vector({x:0,y:0});
    this.gravity     = emiter.options.mass || 0;
    
    this.tween_opacity  = new TweenFn(emiter.options.opacity);
    this.tween_scale    = new TweenFn(emiter.options.scale);
    this.tween_rotation = new TweenFn(emiter.options.rotation);
    this.tween_speed    = new TweenFn(emiter.options.speed);
    this.tween_height    = new TweenFn(emiter.options.height);
    
    this.tween_opacity.setTimeDiff(this.life);
    this.tween_scale.setTimeDiff(this.life);
    this.tween_rotation.setTimeDiff(this.life);
    this.tween_speed.setTimeDiff(this.life);
    this.tween_height.setTimeDiff(this.life);
    
    this.opacity   = this.tween_opacity.lerp(0);
    this.scale     = this.tween_scale.lerp(0);
    this.rotation  = this.tween_rotation.lerp(0);
    this.speed     = this.tween_speed.lerp(0);
    this.height    = this.tween_height.lerp(0);
    
    this.useHeightStep = emiter.options.heightStep;
    this.active = true;
    this.age    = 0;
}

Particle.prototype.update = function(timeDelta){
    if(this.age >= this.life+this.lifeOfDead) this.active = false;
    
    if(this.age < this.life){
        this.speed    = this.tween_speed.variance(timeDelta);
        this.opacity  = this.tween_opacity.addDelta(timeDelta);
        this.scale    = this.tween_scale.addDelta(timeDelta);
        
        if(this.useHeightStep) this.height   = this.tween_height.addDelta(timeDelta);
        
        this.rotation = this.tween_rotation.addDelta(timeDelta) + this.direction;
        
        this.gravityVector.y = this.gravity * timeDelta;
        
        this.velocity.add(this.gravityVector)
        this.position.add(this.velocity.clone().offset(this.speed,this.direction));
    }
    
    this.age += 1000*timeDelta;
}


/**
 * Particles Class
 */
 
var Particles = function(object) {
    this.object    = object;
    this.options   = object.options;
    this.position  = new Vector({x:object.x || 0,y:object.y || 0});
    this.velocity  = new Vector({x:object.xVelocity || 0,y:object.yVelocity || 0});
    
    /** Добавим силу ветра **/
    this.velocity.offset(object.windForce || 0,object.windDirection || 0)
    
    this.emiterLife   = object.options.emiterLife || 5000;
    this.angle        = object.angle || 0;
    this.unlimited    = object.options.emiterLife;
    this.generatedCount = 0;
    
    this.tween_life      = new TweenFn(object.options.life);
    this.tween_generate  = new TweenFn(object.options.generate);
    
    this.tween_xVariance = new TweenFn(object.options.xVariance);
    this.tween_yVariance = new TweenFn(object.options.yVariance);
    this.tween_direction = new TweenFn(object.options.direction);
    
    this.generate  = this.tween_generate.lerp(0);
    this.life      = this.tween_life.lerp(0);
    this.xVariance = object.xVariance ? variance(object.xVariance) : this.tween_xVariance.lerp(0);
    this.yVariance = object.yVariance ? variance(object.yVariance) : this.tween_yVariance.lerp(0);
    this.direction = this.tween_direction.lerp(0);
    
    this.age       = this.nextPatricle = 0;
    this.active    = true;
    this.particles = [];
    
    return this;  
};

Particles.prototype = {
    update: function(timeDelta) {
        this.generate  = this.tween_generate.variance(timeDelta);
        this.xVariance = this.object.atachToCam ? variance((settings.screen[0]/2)/kerk.cameraOption.scale) : this.object.xVariance ? variance(this.object.xVariance) : this.tween_xVariance.variance(timeDelta);
        this.yVariance = this.object.atachToCam ? variance((settings.screen[1]/2)/kerk.cameraOption.scale) : this.object.yVariance ? variance(this.object.yVariance) : this.tween_yVariance.variance(timeDelta);
        this.life      = this.tween_life.variance(timeDelta);
        this.direction = this.tween_direction.updateVariance(timeDelta);
        
        if(this.age > this.emiterLife && this.unlimited) this.emiterDead = true;
        
        this.age += 1000*timeDelta;
		this.nextPatricle += 1000*timeDelta;
        
        for(var i in this.particles){
            var particle = this.particles[i];
            
            if(particle.active === false){
                if(this.onDie) this.onDie(particle);
                
                this.particles.splice(i,1); 
            } 
            else {
                particle.update(timeDelta);
                
                if(this.onDraw) this.onDraw(particle);
            }
        }
        
        if(this.checkActive()){
            if(this.object.atachToCam) this.position.set(kerk.cameraPosition());
            else if(this.object.position) this.position.set(this.object.position);
            
            var particle = new Particle({
                position: this.position.clone().add(new Vector({x:this.xVariance,y:this.yVariance})),
                velocity: this.velocity.clone(),
                direction: this.angle + this.direction,
                life: this.life,
                options: this.options,
            })
            
            this.particles.push(particle);
            this.generatedCount++;
            
            if(this.onNew) this.onNew(particle);
        } 
    },
    checkActive: function(){
        var maxParicles  = this.options.maxParticles && this.generatedCount >= this.options.maxParticles ? true : false;
		var nextParticle = false;
		
		if(this.options.nextMs){
			if(this.nextPatricle > this.options.nextMs){
				this.nextPatricle = nextParticle = 0;
			}
			else nextParticle = 1;
		}
		
        if(this.particles.length >= this.generate || this.emiterDead || maxParicles || nextParticle){
            if(this.particles.length == 0 && this.active && !nextParticle){
                if(this.onDead) this.onDead();
                this.active = false;
            }
        }
        else return true;
    },
    setDie: function(){
        this.emiterDead = true;
    },
    destroy: function(){
        for(var i in this.particles){
            if(this.onDie) this.onDie(this.particles[i]);  
        }
    }
};