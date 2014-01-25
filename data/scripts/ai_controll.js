/**
 * Контроллер AI ботов
 */
  
return {
    startAction: function(){
        
    },
    updateAction: function(){
        var myPlayer = kerk.getMyPlayer();
        
        /** Вычисляем в какую сторону поварачивать **/
        var curs = turnLeftOrRight(
            object.object.rotation, //врашение обьекта в радианах
            /** Функци вычесления врашения по двум точкам **/
            ToAngleObject(
                object.object,  // Где находится этот обьект
                myPlayer.object // Где находится обьект игрока
            ));
        
        /** Устанавливаем что вы не нажали клавиши **/
        object.controller.moveRight = object.controller.moveLeft = 0;
        
        /** Поворачиваем по задоному курсу **/
        if(curs > 0) object.controller.moveRight = 1;
        if(curs < 0) object.controller.moveLeft  = 1;
        
        //object.object.rotation = ToAngleObject(object.object,myPlayer.object);
        
        /** Всегда движемся вперед **/
        object.controller.moveUp = 1;
        
        /** Вычислеям дистанцию **/
        
        var distance = ToPointObject(object.object,myPlayer.object);
        
        /** Таже функция для разварота но теперь если обьект находится в зоне цели то начинаем стрелять **/
        var ifShot = turnLeftOrRight(
            object.object.rotation,
            ToAngleObject(
                object.object, 
                myPlayer.object
            ),
                0.5 // если эта та самая хона в пределах 0.5 радиан
            );
            
        object.controller.shot = distance < 400 && ifShot == 0 ? 1 : 0;
    },
    destroyAction: function(){
        
    }
}