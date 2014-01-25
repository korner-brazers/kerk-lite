kerk.animation = function(option){
    kerk.add(this);
    
    this.object = option.object;
    this.unitid = option.unitid;
    
    this.animationObject = option.animation;
    this.activeAnimate   = '';
    this.selectAnimID    = null;
    this.layers          = {};
    this.curentTime      = 0;
    this.boxSolid        = [];
    
    /** Загрузка слоев **/
    
    if(this.animationObject){
        for(var i in this.animationObject.layers){
            var layer = this.animationObject.layers[i];
            
            if(layer.type == 'img') var sprite = PIXI.Sprite.fromImage(layer.image);
            else                    var sprite = kerk.createNullObject();
            
            sprite = kerk.addObject(sprite,'players');
            
            /** Копируем обьект чтобы не внести изменения в базе **/
            
            sprite.userData.layer = JSON.parse(JSON.stringify(layer));
            
            if(layer.tracer){
                sprite.userData.tracer = new kerk.tracer({
                    id:layer.tracer,
                    unitid:this.unitid,
                    position: sprite.position,
                    atachObject: this.object
                });
            }
            
            if(layer.bullet){
                sprite.userData.bullet = new kerk.shell({
                    id: layer.bullet,
                    unitid:this.unitid,
                    object: sprite,
                    solid: true
                })
            }
            
            if(layer.solid){
                this.boxSolid.push(new kerk.box({
                    object: sprite,
                    unitid: this.unitid,
                    tag: layer.solidTag
                }))
            }
            
            this.layers[i] = sprite;
        }
    }
}
kerk.animation.prototype = {
    getLayer: function(name,call){
        for(var i in this.layers){
            var layer = this.layers[i];
            
            if(layer.layer.name == name){
                if(call) call(layer);
                else return layer;
            } 
        }
    },
    getBox: function(call){
        if(call){
            for(var i in this.boxSolid) call(this.boxSolid[i]);
        }
        else return this.boxSolid;
    },
    setAnimate: function(name,option){
        if(!option) option = {};
        
        if(this.animationObject){
            if(this.activeAnimate !== name){
                this.activeAnimate = false;
                
                for(var i in this.animationObject.animations){
                    var animate = this.animationObject.animations[i];
                    
                    if(name && animate.name == name){
                        this.activeAnimate = name;
                        this.selectAnimID  = animate;
                    } 
                    else if(!name && animate.name.selectdDefault){
                        this.activeAnimate = name;
                        this.selectAnimID  = animate;
                    } 
                }
                
                this.curentTime = option.useAmount && this.selectAnimID ? this.selectAnimID.time * option.useAmount : 0;
            }
            
            if(option.useAmount && this.selectAnimID) this.curentTime = this.selectAnimID.time * option.useAmount;
        }
    },
    setActive: function(a){
        //this.active = a;
        
        //for(var i = 0; i < this.layers.length; i++) this.layers[i].setActive(a);
    },
    valueAnimate: function(id,object){
        if(this.selectAnimID && this.selectAnimID.anim[id]){
            var anim = this.selectAnimID.anim[id];
            
            var i = 0;
        	var n = anim.length;
            
            if(n > 0){
                function setValuesAnim(m){
                    for(var x in anim[m]){
                        if(object[x] !== undefined) object[x] = anim[m][x];
                    }
                }
                
            	while(i < n && this.curentTime > anim[i].time) i++;
                
            	if (i == 0){
            	   setValuesAnim(0)
            	}
            	else if (i == n){
            	   setValuesAnim(n-1)
            	}
                else{
                    var poin = (this.curentTime - anim[i-1].time) / (anim[i].time - anim[i-1].time);

                    var t = this.curentTime - anim[i-1].time;
                    var d = anim[i].time - anim[i-1].time;
                    var c = 1;
                    
                    if(anim[i].typeKey == 'easeIn') poin = c*(t/=d)*t;
                    else if(anim[i].typeKey == 'easeOut') poin = -c *(t/=d)*(t-2);
                    
                    
                    for(var x in anim[i]){
                        if(object[x] !== undefined){
                            object[x] = anim[i-1][x] + poin * (anim[i][x] - anim[i-1][x]);
                        } 
                    }
                }
            }
        }
        
        return object;
    },
    update: function(){
        var controller = kerk.getController(this.unitid);
        
        if(this.activeAnimate){
            this.curentTime += delta;
            this.curentTime = this.curentTime >= this.selectAnimID.time ? (this.selectAnimID.loop ? 0 : this.selectAnimID.time) : this.curentTime;
        }
                    
                    
        for(var i in this.layers){
            var sprite = this.layers[i];
            var object = this.valueAnimate(i,sprite.userData.layer);                    
            var parent = this.layers[object.parent];
            
            if(parent){
                var position = OffsetPoint(
                    parent.position.x,
                    parent.position.y,
                    parent.rotation,
                    object.offsetX,
                    object.offsetY
                )
            }
            else{
                var position = OffsetPoint(
                    this.object.position.x,
                    this.object.position.y,
                    this.object.rotation,
                    object.offsetX,
                    object.offsetY
                )
            }
            
            sprite.position.x = position.x;
            sprite.position.y = position.y;
            
            if(object.type == 'img'){
                sprite.anchor.x = object.anchorX;
                sprite.anchor.y = object.anchorY;
            }
            
            sprite.scale.x = object.scaleX;
            sprite.scale.y = object.scaleY;
            sprite.visible = object.visible;
            sprite.alpha   = object.opacity;
            
            var rotation = object.watchOfCursor ? ToMaxAngle(this.object.rotation,ToAngleObject(this.object,controller.sight),object.maxAngle): parent ? parent.rotation+ToRadian(object.rotation) : ToRadian(object.rotation)+this.object.rotation;
            
            sprite.rotation = object.watchSmooth ? calculateAngle(sprite.rotation,rotation,object.watchSmooth) : rotation;
            
            if(sprite.userData.bullet) sprite.userData.bullet.setActive(controller.shot);
        }
    },
    destroy: function(){
        for(var i in this.boxSolid) this.boxSolid[i].destroy();
        
        for(var i in this.layers){
            var layer = this.layers[i];
            
            if(layer.userData.tracer) layer.userData.tracer.setDead();
            if(layer.userData.bullet) layer.userData.bullet.destroy();
            
            kerk.removeObject(layer);
        }
        
        kerk.remove(this);
    }
}