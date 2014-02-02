/**
 * Детектор поподания в обьект
 */

return {
    startAction: function(){
        this.fxDie = <@fxDie:fx:'Fx Смерти'>;
        
        var scope  = this;
        
        /** Достаем колайдеры из анимациий **/
        object.animation.getBox(function(box){
            box.addCollision(scope.collision)
        })
    },
    collision: function(target){
        
        /** Если это не пуля то пропускаем **/
        if(!target.bullet) return;
        
        /** Высчитываем жизнь **/
        object.life -= target.bullet;
        object.life  = object.life < 0 ? 0 : object.life;
        
        /** Ну как ясно мы умерли **/
        if(object.life == 0){
            
            /** Создаем FX **/
            new kerk.fx({
                position: object.position.clone(),
                id: object.gameObject.fxDie,
            })
            
            /** Новая позиция **/
            var newPosition = {
                x: random(0,LoadMap.w),
                y: random(0,LoadMap.h)
            }
            
            /** Обновляем позицию и жизнь **/
            object.life = object.gameObject.health;
            
            object.position.x = newPosition.x;
            object.position.y = newPosition.y;
            
            /** Обновляем позицию обьекта **/
            object.object.position.x = newPosition.x;
            object.object.position.y = newPosition.y;
            
        }
    },
    updateAction: function(){
        
    },
    destroyAction: function(){
        
    }
}