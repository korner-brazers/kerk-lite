return {
    startAction: function(){
        this.box = new kerk.box({
            object: object.spriteObject,
            width:  object.bullet.boxCollisionWidth, 
            height: object.bullet.boxCollisionHeight,
            solid: false
        })
        
        this.box.addCallback(function(box){
            if(box.option.unitid !== object.unitid){
                box.runCollision({
                    hp: object.bullet.stepDegree
                })
                
                object.beforeDestroy(box.option.tag);
            }
        })
    },
    updateAction: function(){
        
    },
    destroyAction: function(){
        this.box.destroy();
    }
}