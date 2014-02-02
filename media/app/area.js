kerk.area = function(option){
    if(option.solid){
        var newPoints = [];
        
        for(var i in option.points){
            newPoints.push({
                x: option.points[i][0]/30,
                y: option.points[i][1]/30
            })
        }
        
        this.body = new kerk.box2D({
            type: 'polygon',
            points: newPoints,
            position: {
                x: 0,
                y: 0
            },
            dynamic: option.dynamic
        })
    }
}
kerk.area.prototype = {
    destroy: function(){
        if(this.body) this.body.destroy();
    }
}