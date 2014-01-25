/**
 * Детектор поподания в обьект
 */

return {
    startAction: function(){
        var scope = this;
        
        /** Достаем колайдеры **/
        object.animation.getBox(function(box){
            box.addCollision(scope.collision)
        })
    },
    collision: function(bullet){
        
        object.life -= bullet.hp;
        object.life  = object.life < 0 ? 0 : object.life;
        
        if(object.life == 0){
            new kerk.fx({
                position: object.position.clone(),
                id: object.gameObject.fxDie,
            })
            
            var newPosition = {
                x: random(0,LoadMap.w),
                y: random(0,LoadMap.h)
            }
            
            object.life = object.gameObject.health;
            
            object.position.x = newPosition.x;
            object.position.y = newPosition.y;
            
            object.object.position.x = newPosition.x;
            object.object.position.y = newPosition.y;
                
            if(object.unitid !== unitid){
                
                new kerk.fx({
                    position: newPosition,
                    id: object.gameObject.fxStart,
                })
            }
            
        }
    },
    updateAction: function(){
        
    },
    destroyAction: function(){
        
    }
}