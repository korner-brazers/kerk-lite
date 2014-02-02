return {
    startAction: function(){
        /** Создаем детектор **/
        this.box = new kerk.box({
            object: object.spriteObject,
            width:  object.gameObject.boxCollisionWidth, 
            height: object.gameObject.boxCollisionHeight,
            solid: false
        })
        
        /** Добовляем  Callback **/
        this.box.addCallback(function(box){
            if(box.option.unitid !== object.unitid){
                
                /** Вызываем обратный Callback **/
                box.runCollision({
                    bullet: object.gameObject.stepDegree
                })
                
                /** Уничтожаем пулю **/
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