kerk.graphics = function(){
    kerk.add(this);
    
    /** Загрузка графики на карте, звуков и тд **/
    
    if(LoadMap.graphics){
        for(var i in LoadMap.graphics){
            LoadMap.graphics[i].id = i;
            new kerk.image(LoadMap.graphics[i]);
        }
    }
    
    if(LoadMap.object3D){
        for(var i in LoadMap.object3D){
            LoadMap.object3D[i].id = i;
            new kerk.object3D(LoadMap.object3D[i]);
        }
    }
    
    
    if(LoadMap.point){
        for(var i in LoadMap.point){
            LoadMap.point[i].id = i;
            new kerk.point(LoadMap.point[i]);
        }
    }
    
    if(LoadMap.emiter){
        for(var i in LoadMap.emiter){
            LoadMap.emiter[i].id = i;
            new kerk.emiter(LoadMap.emiter[i]);
        }
    }
    
    if(LoadMap.box){
        for(var i in LoadMap.box){
            LoadMap.box[i].id = i;
            new kerk.mapBox(LoadMap.box[i]);
        }
    }
    
    if(LoadMap.music && dataCache.settings.sound){
        new kerk.soundPack({
            id: LoadMap.music,
            unitid: unitid,
            background: true
        })
    }
    
    if(LoadMap.object){
        for(var i in LoadMap.object){
            LoadMap.object[i].id = i;
            
            var obj = LoadMap.object[i];
            
            kerk.makeObject({
                position: {x:obj.x,y:obj.y},
                object_id: obj.objectCreate
            })
        }
    }
    
    if(LoadMap.sound){
        for(var i in LoadMap.sound){
            var sound = LoadMap.sound[i];
            
            if(sound.active){
                var aud = new kerk.sound({
                    src: sound.sound,
                    setNew: 1,
                    id: unitid,
                    radius: sound.distance,
                    position: {
                        x: sound.x,
                        y: sound.y
                    },
                    loop: 1,
                    maxVolume: sound.volume
                })
                
                aud.play();
            }
        }
    }
}
kerk.graphics.prototype = {
    update: function(){
    },
    destroy: function(){
        kerk.remove(this);
    }
}