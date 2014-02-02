kerk.weapon = function(option){
    kerk.add(this);
    
    this.option = option;
    this.active = true;
    this.exists = false;
    
    this.gameObject = LoadObj.weapons[option.id];
    this.unitid     = option.unitid;
    this.object     = option.object;
    this.id         = option.id;
    
    this.ammo           = this.gameObject.ammo;
    this.magazine       = this.gameObject.magazine;
    this.timerReload    = 0;
    this.reload         = 0;
    this.shellPoint     = [];
    
    if(this.gameObject){
        this.animation = new kerk.animation({
            object:    this.object,
            animation: this.gameObject.animation,
            unitid:    this.unitid
        })
        
        var scope = this;
        
        this.animation.getPoints(function(point){
            var shell = new kerk.shell({
                id: scope.weapon.bullet,
                unitid: scope.unitid,
                object: point,
                solid: true
            })
            
            shell.addCallback(function(){
                scope.magazine = --scope.magazine < 0 ? 0 : scope.magazine;
            })
            
            shellPoint.push(shell);
        })
        
        
        this.soundReload = new kerk.sound({
            src: this.gameObject.soundReload,
            id: this.unitid,
            radius: 180,
            position: object.position
        })
        
        this.setActiveShell(false);
        
        this.exists = true;
    }
    else console.log('No find weapon in data');
    
    this.scripts = kerk.scriptsCreate(option.id,this);
    
    kerk.scriptsSetAction('startAction',this.scripts);
}
kerk.weapon.prototype = {
    setActive: function(a){
        this.active = a;
        this.animation.setActive(a);
    },
    setActiveShell: function(a){
        for(var i = 0; i < this.shellPoint.length; i++) this.shellPoint[i].setActive(a);
    },
    update: function(){
        if(this.exists && this.active){
            var controller = kerk.getController(this.unitid);
            
            if(controller.getReload && this.magazine < this.gameObject.magazine) this.reload = 1;
            
            if((this.magazine <= 0 && this.ammo > 0) || this.reload){
                if(this.timerReload > 200 && this.timerReload < 300) this.soundReload.play();
                
                this.timerReload += 1000*delta;
                
                if(this.timerReload >= this.gameObject.timerReload){
                    var magazine = this.gameObject.magazine,
                        aiPlayer = kerk.players[this.unitid].ai;
                    
                    this.magazine    = this.ammo > magazine ? magazine : this.ammo;
                    this.ammo        = (this.ammo-= magazine) < 0 ? 0 : this.ammo;
                    this.timerReload = this.reload = 0;
                }
            }
                
            if(controller.shot && this.magazine > 0) this.setActiveShell(true);
            else this.setActiveShell(false);
        }
        
        kerk.scriptsSetAction('updateAction',this.scripts)
    },
    destroy: function(){
        for(var i in this.shellPoint) this.shellPoint[i].destroy();
        this.animation.destroy();
        kerk.scriptsSetAction('destroyAction',this.scripts)
        kerk.remove(this);
    }
}