kerk.sound = function(a){
    kerk.add(this);
    
    this.option      = a;
    this.isPlay      = 0;
    this.position    = a.position || {x:0,y:0};
    this.id          = a.src + a.id;
    this.maxVolume   = a.maxVolume  || 1;
    this.radius      = a.radius     || 1000;
    this.radiusBlur  = a.radiusBlur || 0;
    this.audio;
    this.background  = a.background;
    this.timerToStop = a.timerToStop || 0;
    this.timerPlay   = 0;
    this.name        = a.src;
    
    this.tweenRadius = new TweenFn(LoadObj.settings.main.gameSoundvolume);
    
    if(!dataCache.sounds) dataCache.sounds = {};
    
	if(!dataCache.sounds[this.id] || a.setNew){
        this.audio = new Audio;
        this.audio.src = a.src;
        this.audio.load();
        
        var scope = this;
        
        this.audio.addEventListener('ended', function(){
            scope.isPlay = 0;
            
            if(scope.ended) scope.ended();
            if(scope.autoDestroy) scope.destroy();
        })
          
        dataCache.sounds[this.id] = this.audio;
    }
    else this.audio = dataCache.sounds[this.id];
    
    this.audio.pause();
    this.audio.duration > 0 && (this.audio.currentTime = 0.0);
    
    this.audio.loop   = a.loop || false;
    this.audio.volume = a.volume || (a.background ? 1 : 0);
    
    return this;
}
kerk.sound.prototype = {
    update: function(){
        if(this.tw_volume) this.maxVolume = this.tw_volume.lerp(this.audio.currentTime * 1000);
        
        if(this.background){
            if(this.isPlay) this.audio.volume = this.maxVolume;
        }
        else{
            var distance = ToPointObject(this.position,kerk.cameraPosition()),
                volume   = 0,
                radius   = this.radiusBlur ? this.radiusBlur : this.radius;
            
    		if(distance <= radius && this.isPlay){
                this.audio.muted  = 0;
                
                
                this.tweenRadius.setTimeDiff(this.radius);
                
                if(this.radiusBlur){
                    if(distance > this.radius) {
                        this.tweenRadius.setTimeDiff(this.radiusBlur - this.radius);
                        volume = this.tweenRadius.lerp(distance-this.radius); 
                    }
                    else volume = this.tweenRadius.lerp(this.radius - distance);
                }
                else volume = this.tweenRadius.lerp(distance); 
                
                volume = volume > 1 ? 1 : volume < 0 ? 0 : volume > this.maxVolume ? this.maxVolume : volume ;
                
                this.audio.volume = volume;
    		}
            else if(this.isPlay) this.audio.muted = 1;
        
        }
        
        this.timerPlay += 1000*delta;
    },
    setPosition: function(position){
        this.position = position;
        return this;
    },
    setMaxVolume: function(max){
        this.maxVolume = max > 1 ? 1 : max < 0 ? 0 : (max || 1);
        return this;
    },
    tweenVolume: function(volume){
        this.tw_volume = new TweenFn(volume);
    },
    play: function(res){
        this.isPlay = 1;
        
        if(res) this.reset();
        
        this.audio.play();
        return this;
    },
    reset: function(){
        this.audio.pause();
        this.audio.duration > 0 && (this.audio.currentTime = 0.0);
        if(this.tw_volume) this.tw_volume.reset();
        return this;
    },
    resetTimer: function(){
        this.timerPlay = 0;
        return this;
    },
    stop: function(){
        if(this.timerPlay >= this.timerToStop){
            this.isPlay = 0;
            this.audio.pause();
        }
        
        return this;
    },
    destroy: function(){
        this.isPlay = 0;
        this.audio.pause();
        kerk.remove(this);
    }
}