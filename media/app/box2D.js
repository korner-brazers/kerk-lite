kerk.box2D = function(option){
    
    this.gameObject = option;
    //console.log('dddd')
    if(option.dynamic) bodyDef.type = b2Body.b2_dynamicBody;
    else               bodyDef.type = b2Body.b2_staticBody;
    
    bodyDef.position.x = option.position.x/30;
    bodyDef.position.y = option.position.y/30;
    
    fixDef.density     = option.density !== undefined ? option.density : 1.0;
    fixDef.friction    = option.friction !== undefined ? option.friction : 0.5;
    fixDef.restitution = option.restitution !== undefined ? option.restitution : 0.2;
    
    switch(option.type){
        case 'box': 
            var width  = option.width || 10;
            var height = option.height || 10;
            
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(width/2/30, height/2/30);
        break;
        
        case 'polygon':
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsArray(option.points,option.points.length);
        break
    }
    
    
    fixDef.isSensor = option.isSensor || false;
    
    this.box  = world.CreateBody(bodyDef).CreateFixture(fixDef);
    this.body = this.box.GetBody();
    
    this.body.SetUserData(option.userData);
    
    /** Ключик для сверки что это именно я столкнлся с чемто а не кто та там левый :D **/
    this.body.hash = hash('_');
    
    kerk.box2dObjects.push(this);
}
kerk.box2D.prototype = {
    BeginContact: function(contact){
        if(this.gameObject.BeginContact){
            var bodyA = contact.GetFixtureA().GetBody();
            
            if(bodyA.hash == this.body.hash) this.gameObject.BeginContact(contact);
        }
    },
    EndContact: function(contact){
        if(this.gameObject.EndContact){
            var bodyA = contact.GetFixtureA().GetBody();
            
            if(bodyA.hash == this.body.hash) this.gameObject.EndContact(contact);
        }
    },
    ToPixel: function(position){
        var newPosition = {
            x: position.x * 30,
            y: position.y * 30
        }
        
        return newPosition;
    },
    ToPosition: function(position){
        var newPosition = {
            x: position.x / 30,
            y: position.y / 30
        }
        
        return newPosition;
    },
    GetPosition: function(){
        return this.ToPixel(this.body.GetPosition());
    },
    SetPosition: function(position){
        this.body.SetPosition(this.ToPosition(position))
    },
    GetAngle: function(){
        return this.body.GetAngle();
    },
    SetAngle: function(radian){
        this.body.SetAngle(radian)
    },
    GetMove: function(){
       return this.body.GetLinearVelocity(); 
    },
    SetMove: function(x,y){
        var vel = this.GetMove();
        
        if(x !== null) vel.x = x;
        if(y !== null) vel.y = y;
          
        this.body.SetLinearVelocity( vel );
    },
    ApplyImpulse: function(x,y,useMass){
        this.body.ApplyImpulse(new b2Vec2(useMass ? x * this.body.GetMass() : x, useMass ? y * this.body.GetMass() : y),this.body.GetWorldCenter());
    },
    WakeUp: function(){
        this.body.SetAwake(true);
    },
    destroy: function(){
        world.DestroyBody(this.body);
        kerk.box2dObjects.splice(kerk.box2dObjects.indexOf(this), 1);
        this.body = null;
    }
}