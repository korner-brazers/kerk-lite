kerk.object3D = function(option){
    kerk.add(this);
    
    this.name       = option.name;
    this.option     = option;
    this.gameObject = LoadObj.object3D[option.object];
    this.add3D      = [];
            
    if(this.gameObject){
        for(var f = 0; f < this.gameObject.frames.length; f++){
            for(g = 0; g < this.gameObject.frames[f].floors; g++){
                var sprite  = new PIXI.Sprite.fromImage(this.gameObject.frames[f].img);
                var frame   = this.gameObject.frames[f];
            
                sprite.anchor.x = option.anchorX;
                sprite.anchor.y = option.anchorY;
                
                sprite.userData = {
                    floor: frame.floor + g,
                    x: option.x,
                    y: option.y,
                    factor: this.gameObject.factor,
                    lens: this.gameObject.lens
                };
                
                sprite.alpha    = frame.opacity;
                sprite.scale    = {
                    x: frame.scaleX + (frame.scaleX - option.scaleX) + ((frame.floor + g)*(frame.scaleFactor || 0)),
                    y: frame.scaleY + (frame.scaleY - option.scaleY) + ((frame.floor + g)*(frame.scaleFactor || 0))
                };
                sprite.rotation = option.rotation + frame.rotation;
                
                sprite.position.x = 60;
                sprite.position.y = 60;
                
                kerk.objectBlend(sprite,frame.blend);
                
                kerk.addObject(sprite,option.parentLayer || 'other');
                
                this.add3D.push(sprite)
            }
        }
    }
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.object3D.prototype = {
    update: function(){
        for(var i = this.add3D.length; i--;){
            var sprite  = this.add3D[i],
                layer   = kerk.layers[sprite.userData.layerUse],
                x       = sprite.userData.x + layer.position.x,
                y       = sprite.userData.y + layer.position.y,
                fx3D    = kerk.Fx3D(x,y,sprite.userData.floor,sprite.userData.factor);
                
                sprite.position.x = fx3D.x - layer.position.x;
                sprite.position.y = fx3D.y - layer.position.y;
                
                if(sprite.userData.lens) sprite.visible = kerk.isVisible(x,y,0,0).visible;
        }
        
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        for(var i = this.add3D.length; i--;) kerk.removeObject(this.add3D[i]);
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}