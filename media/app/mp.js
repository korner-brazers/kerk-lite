kerk.mp = function(object,id){
    kerk.add(this);
    
    this.mpTimer = 0;
    
    this.testPing = 1;
    this.ping = 0;
}
kerk.mp.prototype = {
    update: function(){
        if(this.testPing && dataCache.testPing){
            this.testPing = 0;
            this.ping = new Date().getTime() - dataCache.testPing;
        }
        else if(!dataCache.testPing && !this.testPing){
            this.testPing = new Date().getTime();
        }
        
        if(kerk.players[unitid] && this.mpTimer > 1){
            var json = JSON.stringify({
                controller: kerk.myController(),
                position: kerk.players[unitid].position,
                ping: this.ping,
                testPing: this.testPing
            })
            
            mp.send(json);
            
            this.mpTimer = 0;
        }
        else this.mpTimer++;
    },
    destroy: function(){
        kerk.remove(this);
    }
}