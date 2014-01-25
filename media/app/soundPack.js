kerk.soundPack = function(option){
    this.option    = option;
    this.soundPack = LoadObj.soundPack[option.id];
    
    if(!dataCache.soundPack) dataCache.soundPack = {};
    
    if(this.soundPack){
        if(dataCache.soundPack[option.id]) this.play();
        else{
            dataCache.soundPack[option.id] = [];
            this.createSound();
            this.play();
        }
    }
}
kerk.soundPack.prototype = {
    createSound: function(){
        for(var i in this.soundPack.sounds) this.addSound(this.soundPack.sounds[i]);
    },
    play: function(){
        if(this.soundPack.selectOnce) this.playSound(random(0,this.soundPack.sounds.length));
        else{
            for(var i in this.soundPack.sounds){
                if(!this.soundPack.sounds[i].rand || !random(0,2)) this.playSound(i);
            }
        }
    },
    playSound: function(i){
        var sounds = dataCache.soundPack[this.option.id],
            sound  = this.soundPack.sounds[i];
        
        if(!sound.once) sounds[i].setPosition(this.option.position).reset().play();
        else sounds[i].setPosition(this.option.position).play();
    },
    addSound: function(a){
        var sound = new kerk.sound({
            id: this.option.unitid,
            src: a.sound,
            position: this.option.position,
            radius: a.distance,
            background: this.option.background,
            loop: a.loop
        })
        
        sound.tweenVolume(a.volume);
        dataCache.soundPack[this.option.id].push(sound);
    }
}