kerk.loading = function(callback){
    this.callback = callback;
    
    dataCache.loadingAssets = [];
    
    this.parseAssets();
}
kerk.loading.prototype = {
    parseAssets: function(a){
        for(var i in LoadObj.tracers) dataCache.loadingAssets.push(LoadObj.tracers[i].image);
        
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
    }
}