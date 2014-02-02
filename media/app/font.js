kerk.font = function(option){
    kerk.add(this);
    
    this.size      = option.size || 1;
    this.fontName  = option.fontName;
    this.len    = option.text.length;
    this.conteiner = option.conteiner || kerk.addObject(kerk.createNullObject());
    this.thisConteiner = option.conteiner ? 1 : 0;
    this.chars     = [];
    this.space     = option.space || -5;
    this.position  = option.position || {x:0,y:0};
    this.sprite    = [];
    this.textures  = [];

    var widthChar  = 0;
    
    for(var i = 0; i < this.len; i++){
        var sprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(font.create(this.fontName,option.text[i],this.size))));
            sprite.position.x = widthChar+this.position.x;
            sprite.position.y = this.position.y;
            
        widthChar += sprite.width+this.space;
        
        this.sprite[i] = sprite;
        this.chars[i]  = option.text[i];
        
        this.conteiner.addChild(sprite)
    }
}
kerk.font.prototype = {
    setText:function(txt){
        txt = txt.toString().toLowerCase()
        
        for(var i = 0; i < this.len; i++){
            if(this.chars[i] !== txt[i]){
                
                if(this.textures[txt[i]]) var texture = this.textures[txt[i]];
                else{
                    var texture = new PIXI.Texture(new PIXI.BaseTexture(font.create(this.fontName,txt[i],this.size)));
                    
                    this.textures[txt[i]] = texture;
                }
                
                this.sprite[i].setTexture(texture);
                this.chars[i] = txt[i];
            }
            
        }
    },
    setPosition: function(position){
        var widthChar = 0;
        
        for(var c in this.sprite){
            var sprite = this.sprite[c];
            
            sprite.position.x = widthChar+position.x;
            sprite.position.y = position.y;
            
            widthChar += sprite.width+this.space;
        }
    },
    update: function(){
        
    },
    destroy: function(){
        for(var i in this.sprite) this.conteiner.removeChild(this.sprite[i]);
        
        if(this.thisConteiner) kerk.removeObject(this.conteiner);
        
        kerk.remove(this);
    }
}