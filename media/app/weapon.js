kerk.weapon = function(object,id,slot){
    kerk.add(this);
    
    this.active = true;
    this.slot   = slot;
    this.exists = false;
    this.weapon   = LoadObj.weapons[id];
    this.unitid   = object.userData.unitid;
    this.id       = id;
    
    this.ammo           = this.weapon.ammo;
    this.magazine       = this.weapon.magazine;
    this.magazine_add   = 0;
    this.timerReloadAdd = 0;
    this.timerReload    = 0;
    this.reload         = 0;
    this.shellPoint     = [];
    
    if(this.weapon){
        this.layers = new kerk.layer({
            object: object,
            layers: this.weapon.layers
        });
        
        var scope = this;
        
        for(var i = 0; i < this.layers.points.length; i++){
            this.layers.points[i].object.userData.weapon_id = this.id;
            
            this.shellPoint[i] = new kerk.shell(this.layers.points[i],this.weapon.bullet);
            
            this.shellPoint[i].addCallback(function(){
                scope.magazine = --scope.magazine < 0 ? 0 : scope.magazine;
            })
        }
        
        this.soundReload = new kerk.sound({
            src: this.weapon.soundReload,
            id: this.unitid,
            radius: 180,
            position: object.position
        })
        
        /** Прокачка пушки **/
        
        kerk.getAppgrade({
            unitid: this.unitid,
            weapon_id: id,
            call: function(addon){
                scope.ammo += addon.ammo;
                scope.magazine += addon.magazine;
                scope.magazine_add += addon.magazine;
                scope.timerReloadAdd += addon.timerReload;
            }
        })
        
        this.setActiveShell(false);
        
        this.exists = true;
    }
    else console.log('No find weapon in data');
}
kerk.weapon.prototype = {
    setActive: function(a){
        this.active = a;
        this.layers.setActive(a);
    },
    setActiveShell: function(a){
        for(var i = 0; i < this.shellPoint.length; i++) this.shellPoint[i].setActive(a);
    },
    update: function(){
        if(this.exists && this.active){
            var controller = kerk.getController(this.unitid);
            
            if(controller.getReload && this.magazine < (this.weapon.magazine + this.magazine_add)) this.reload = 1;
            
            if((this.magazine <= 0 && this.ammo > 0) || this.reload){
                if(this.timerReload > 200 && this.timerReload < 300) this.soundReload.play();
                
                this.timerReload += 1000*delta;
                
                if(this.timerReload >= this.weapon.timerReload + this.timerReloadAdd){
                    var magazine = this.weapon.magazine + this.magazine_add,
                        aiPlayer = kerk.players[this.unitid].ai;
                    
                    this.magazine    = this.ammo > magazine ? magazine : this.ammo;
                    this.ammo        = aiPlayer ? 999 : ( (this.ammo-= magazine) < 0 ? 0 : this.ammo );
                    this.timerReload = this.reload = 0;
                }
            }
                
            if(controller.shot && this.magazine > 0) this.setActiveShell(true);
            else this.setActiveShell(false);
        }
    },
    destroy: function(){
        for(var i in this.shellPoint) this.shellPoint[i].destroy();
        this.layers.destroy();
        kerk.remove(this);
    }
}