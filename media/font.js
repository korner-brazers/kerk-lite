function Font(a){
    this.fonts = {};
    this.space = a.space || 0;
    this.chars = a.chars || {};
    this.image;
    this.canvas = document.createElement("canvas");
    this.ctx;
    this.sims = [];
    
    this.setCanvas(font.imagesLoad[this.chars.img]);
}
Font.prototype.setCanvas = function(imageObj){
    this.image = imageObj;
    
    this.canvas.width  = imageObj.width;
    this.canvas.height = imageObj.height;
    
    this.ctx = this.canvas.getContext("2d");
}
Font.prototype.searchSim = function(s){
    for(var i = 0; i < this.chars.chars.length; i++){
        if(this.chars.chars[i].s == s){
            this.sims.push(this.chars.chars[i]);
            break;
        }
    }
}
Font.prototype.create = function(txt,size){
    var image     = new Image();
    
    var size = size || 1;
    
    if(this.fonts[txt+size]){
        image.src = this.fonts[txt+size];
        
        return image;
    } 
    
    this.sims = [];
    
    var h = 0,w = 0,draw = [];
    
    txt = !txt ? '' : txt;
    
    var s = txt.split('');
    
    for(var i = 0; i < s.length; i++) this.searchSim(s[i]);
    
    for(var i = 0; i < this.sims.length; i++){
        var ch = this.sims[i];
        
        //w += (ch.w + this.space)*size;
        w += ch.w*size;
        h = Math.max(h,ch.h)*size;
        
        draw.push(ch);
    }
    
    w = Math.round(w+((draw.length-1)*this.space*size));
    //w = Math.round(w);
    h = Math.round(h);
    
    w = w < 5 ? 5 : w;
    h = h < 5 ? 5 : h;
    
    this.canvas.width  = w;
    this.canvas.height = h;
    
    w = 0;
    
    for(var i = 0; i < draw.length; i++){
        var ch = draw[i];
        
        this.ctx.drawImage(this.image, ch.x, ch.y, ch.w, ch.h, w*size, 0, ch.w*size, ch.h*size);
        
        w += ch.w + this.space;
    }
    
    image.src = this.canvas.toDataURL("image/png");
    
    /*
    this.canvas.width  = image.width*size;
    this.canvas.height = image.height*size;
    
    this.ctx.drawImage(image, 0, 0,image.width*size,image.height*size);
    
    image.src = this.canvas.toDataURL("image/png");
    */
    
    //image.src = resizeImg(image,Math.round(w*size),Math.round(h*size),true);
    
    this.fonts[txt+size] = image.src;
    
    return image;
}


var font = new function(){
    this.allFont    = {};
    this.imagesLoad = {};
    
    this.add = function(a){
        this.allFont[a.name] = new Font({
            space: a.space,
            chars: a
        });
    }
    this.create = function(name,text,size){
        if(this.allFont[name]) return this.allFont[name].create(text,size);
        else return new Image();
    }
    this.loading = function(callback){
        var scope = this;
        
        if(!LoadObj.font) LoadObj.font = {};
        
        $.each(LoadObj.font,function(i,a){
            scope.imagesLoad[a.img] = a.img;
        })
        
        var a = restore_in_a(scope.imagesLoad);
                
        stepLoad(a,function(i,next){
            loadImg(scope.imagesLoad[a[i]],false,function(imgObj,w,h){
                scope.imagesLoad[a[i]] = imgObj;
                next && next();
            })
        },function(){
            $.each(LoadObj.font,function(i,a){
                font.add(a);
            })
            
            callback && callback()
        })
    }
}