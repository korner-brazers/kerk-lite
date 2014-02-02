return {
    startAction: function(){
        
        object.sprite.setInteractive(true);
        
        object.sprite.mousedown = function(mouseData){
            menu.startGame({
                map_id: '0f672fbe3c515cb80d6bb8c7ebfc390d'
            })
        }

        this.tween = TweenSimple([[0,0],[1,1000],[0,2000]],1);
    },
    updateAction: function(){
        object.sprite.alpha = this.tween.delta()
    },
    destroyAction: function(){
        
    }
}