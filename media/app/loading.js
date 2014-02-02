kerk.loading = function(callback){
    this.callback = callback;
    
    dataCache.loadingAssets = [];
    
    this.parseAssets();
}
kerk.loading.prototype = {
    parseAssets: function(a){
        for(var i in LoadObj.sprite){
            for(var s in LoadObj.sprite[i].frames) dataCache.loadingAssets.push(LoadObj.sprite[i].frames[s]);
        } 
        
        if(LoadMap.object3D){
            for(var i in LoadMap.object3D){
                var map = LoadMap.object3D[i],
                    obj = LoadObj.object3D[map.object];
                
                if(obj){
                    for(var f in obj.frames) dataCache.loadingAssets.push(obj.frames[f].img);
                }
            }
        }
        
        for(var i in LoadMap.graphics) dataCache.loadingAssets.push(LoadMap.graphics[i].src);
		
		for(var i in LoadObj.fx){
			var fx = LoadObj.fx[i];
			
			for(var l in fx.particles) dataCache.loadingAssets.push(fx.particles[l].img);
		}
        
        this.loadingAssets();
    },
    loadingAssets: function(){
        var scope  = this;
        var loader = new PIXI.AssetLoader(dataCache.loadingAssets);
            
            loader.onProgress = function(){
                
            }
            
            loader.onComplete = function(){
                scope.callback();
            }
            
            loader.load()
    },
    loadingZone: function(){
        /** Пустой бейсик 100px на 100px если вдруг не сгенерирована карта **/
        var base = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABZUlEQVR4Xu3TQREAAAiEQK9/aWvsAxMw4O06ysAommCuINgTFKQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LQQL8oTPAGUY76lBAAAAAElFTkSuQmCC';
        
        dataCache.zoneLoading = {
            wallGenerate: base,
            groundGenerate: base,
        };
        
        var scope = this;
        
        $.get( '/data/map/zone/'+kerk.option.map_id+'.base?'+random(9999,99999), function(j) {
            try{
                dataCache.zoneLoading = JSON.parse(j);
            }
            catch(e){
                
            }
            
            scope.callback();
        }).fail(function() {
            scope.callback();
        })
    }
}