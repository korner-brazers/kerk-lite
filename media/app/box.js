kerk.box = function(option){
    kerk.add(this);
    
    this.option    = option;
    this.object    = option.object;
    this.points    = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
    this.staticBox = option.staticBox;
    this.callback  = false;
    this.collision = false;
    this.solid     = option.solid !== undefined ? option.solid : true;
    this.showBox   = option.showBox;
    
    kerk.boxDetect.push(this);
    
    /** Показываем бокс **/
    this.boxImg  = [];
    
    if(this.showBox){
        for(var i in this.points){
            this.boxImg[i] = kerk.addObject(PIXI.Sprite.fromImage('/images/fx/pr.png'),'players');
            this.boxImg[i].anchor.x = this.boxImg[i].anchor.y = 0.5;
        }
    }
}
kerk.box.prototype = {
    addCallback: function(call){
        this.callback = call;
    },
    addCollision: function(call){
        this.collision = call;
    },
    runCallback: function(call){
        if(this.callback) this.callback(call);
    },
    runCollision: function(call){
        if(this.collision) this.collision(call);
    },
    anchor: function(anchor,value){
        return value - (anchor*value) - value/2;
    },
    getBox: function(){
        return this.points;
    },
    update: function(){
        var width  = this.option.width  || this.object.width;
        var height = this.option.height || this.object.height;
        
        var width2  = width/2;
        var height2 = height/2;
        
        var anchorWidth = this.anchor(this.object.anchor ? this.object.anchor.x : 0.5,width);
        var anchorHeigh = this.anchor(this.object.anchor ? this.object.anchor.y : 0.5,height);
        
        var anchorWLeft = anchorWidth-width2;
        var anchorWRght = anchorWidth+width2;
        var anchorHTop  = anchorHeigh-height2;
        var anchorWBot  = anchorHeigh+height2;
        
        this.points[0] = OffsetPointObject(this.object,anchorWLeft,anchorHTop);
        this.points[1] = OffsetPointObject(this.object,anchorWRght,anchorHTop);
        this.points[2] = OffsetPointObject(this.object,anchorWRght,anchorWBot);
        this.points[3] = OffsetPointObject(this.object,anchorWLeft,anchorWBot);
        
        if(this.showBox){
            for(var i in this.boxImg){
                this.boxImg[i].position.x = this.points[i].x;
                this.boxImg[i].position.y = this.points[i].y;
            }
        }
        
        if(this.callback){
            var index = kerk.boxDetect.indexOf(this);
            
            for(var i in kerk.boxDetect){
                var box = kerk.boxDetect[i];
                
                if(box.solid && boxIntersect(this.points,box.points)){
                    this.callback(box);
                    break;
                }
            }
            
        }
    },
    destroy: function(){
        if(this.showBox){
            for(var i in this.boxImg) kerk.removeObject(this.boxImg[i]);
        }
        
        removeArray(kerk.boxDetect,this);
        
        kerk.remove(this);
    }
}