var delta      = 0, //обычныя дельта
    focusDelta = 0; //обновляется если вкладка браузера в фокусе


var b2Vec2 = Box2D.Common.Math.b2Vec2
,	b2BodyDef = Box2D.Dynamics.b2BodyDef
,	b2Body = Box2D.Dynamics.b2Body
,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,	b2Fixture = Box2D.Dynamics.b2Fixture
,	b2World = Box2D.Dynamics.b2World
,	b2MassData = Box2D.Collision.Shapes.b2MassData
,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


var fixDef             = new b2FixtureDef;
    fixDef.density     = 1.0;
    fixDef.friction    = 0.5;
    fixDef.restitution = 0.2;

var bodyDef    = new b2BodyDef;
var world      = new b2World(new b2Vec2(0, 30),true);
var b2listener = new Box2D.Dynamics.b2ContactListener;


var debugDraw;
        

var kerk = new function(){
    this.renderer,this.scene,this.container,this.stats,this.layers;
    
    this.objects      = [];
    this.boxDetect    = [];
    this.box2dObjects = [];
    this.areas        = [];
    this.players      = {};
    this.controllers  = {};
    this.myColler     = {};
    this.focusTab     = 1;
    this.cameraVForce = {};
    this.findCallback = false;
    this.cameraOption = {
        lookAtPosition: false,
        callbackPosition: false,
        overflow: false,
        scale: 1,
        zoom: 1
    }
    
    this.blends = {
        'NORMAL':PIXI.blendModes.NORMAL,
        'ADD':PIXI.blendModes.ADD,
        'MULTIPLY':PIXI.blendModes.MULTIPLY,
        'SCREEN':PIXI.blendModes.SCREEN,
    }
    
    
    this.fpsPrevTime = 0;
    this.fpsFrames   = 0;
    
    /** AUTO UPDATE MODULES **/
    
    this.add = function(a){
        this.objects.push(a);
    }
    
    this.remove = function(a){
        this.objects.splice(this.objects.indexOf(a), 1);
    }
    
    this.destroy = function(){
        this.getObjects(function(a){
            a.destroy();
        })
        
        this.objects = [];
        this.players = {};
        this.controllers = {};
        
        this.domObject.hide();
    }
    
    this.getObjects = function(call){
        for(var i = 0; i < this.objects.length; i++) call(this.objects[i]);
    }
    
    this.fps = function(){
        var time = Date.now();
        
        this.fpsFrames++;
        
        if ( time > this.fpsPrevTime + 1000) {
            
            $('#fps').text(Math.round( ( this.fpsFrames  * 1000 ) / ( time - this.fpsPrevTime ) ));
            
            this.fpsFrames   = 0;
            this.fpsPrevTime = time;
        }
    }
    
    this.update = function(){
        this.getObjects(function(a){
            if(a.getDestroy) a.destroy();
            else{
                a.update();
                
                if(this.findCallback && a.name && a.name == this.findCallback.name) this.findCallback.call(a);
            }
        })
        
        delta      = clock.getDelta();
        focusDelta = this.focusTab ? delta : 0;
        
        TWEEN.update();
        
        this.scriptsSetAction('updateAction',this.globalScripts);
        this.scriptsSetAction('updateAction',this.mapScripts);
        
        world.Step(1/60,10,10);
        
        world.ClearForces();
        
        if(debugDraw) world.DrawDebugData();
        
        this.fps();
        this.game();
        this.findCallback = 0;
    }
    
    this.render = function(){
        this.renderer.render(this.scene);
    }
    
    /** OBJECTS **/
    
    this.addObject = function(object,layer){
        if(!object.userData) object.userData = {};
        
        object.userData.layerUse = layer;
        
        if(layer){
            if(this.layers[layer]) this.layers[layer].addChild(object);
            else{
                /** Указываем на другой слой так как основного нету **/
                object.userData.layerUse = 'other';
                this.layers.other.addChild(object);
            } 
        } 
        else this.scene.addChild(object);
        
        return object;
    }
    
    this.objectBlend = function(object,blendName){
        if(this.blends[blendName]) object.blendMode = this.blends[blendName];
    }
    
    this.createNullObject = function(){
        var object = new PIXI.DisplayObjectContainer();
            object.userData = {};
        
        return object;
    }
    
    this.createSprite = function(option){
        var sprite = new PIXI.Sprite.fromImage(option.img);
            sprite.anchor.x = option.anchorX || 0.5;
            sprite.anchor.y = option.anchorY || 0.5;
        
        return this.addObject(sprite,option.layer || 'players');
    }
    
    this.removeObject = function(object){
        if(object.userData.layerUse){
            if(this.layers[object.userData.layerUse]) this.layers[object.userData.layerUse].removeChild(object);
        } 
        else this.scene.removeChild(object);
    }
    
    this.findObject = function(name,callback){
        this.findCallback = {
            name: name,
            call: callback
        }
    }
    
    this.makeObject = function(option){
        option.unitid = option.myPlayer ? unitid : hash('_ui');
        
        return this.addPlayer(option);
    }
    
    /** SCRIPTS **/
    
    this.scriptsCreate = function(nameScript,object){
        if(attachedScripts[nameScript]){
            
            var createRun = [];
            
            for(var i in attachedScripts[nameScript]){
                var scName = attachedScripts[nameScript][i];
                
                createRun[i] = new scripts[scName](object);
            }
            
            return createRun;
        }
    }
    
    this.scriptsSetAction = function(action,scripts){
        if(scripts){
            for(var i in scripts){
                var script = scripts[i];
                
                if(script[action]) script[action]();
            }
        }
    }

    /** STAGE GAME **/
    
    this.createGame = function(){
        
    	this.scene = new PIXI.Stage(colorToHex('000000'));
    	
    	this.renderer = PIXI.autoDetectRenderer(settings.screen[0], settings.screen[1],null,false);
        
        this.container = document.getElementById(settings.content);
        
        this.container.appendChild(this.renderer.view);
        
        this.layers = null;
        
        /**Mouse move**/
        
        this.domObject = $('#'+settings.content);
        this.myColler  = this.myController();
        this.offsetCon = $('#Game').offset();
        
        var scope = this;
        
        $(document).on('mousemove',function(e){
            scope.myColler.mouse.x = e.pageX - scope.offsetCon.left;
            scope.myColler.mouse.y = e.pageY - scope.offsetCon.top;
            
            scope.myColler.mouse.move = 1;
        }).on('mousedown',function(e){
            scope.myColler.shot = 1;
            e.preventDefault();
        }).on('mouseup',function(){
            scope.myColler.shot = 0;
        })
        
        animate();
        
        b2listener.BeginContact = this.BeginContact;
        b2listener.EndContact   = this.EndContact
        
        world.SetContactListener(b2listener);
        
        if(LoadObj.settings.main.debugDraw){
            debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
            debugDraw.SetDrawScale(10.0);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);  
        }                      
    }
    
    this.BeginContact = function(contact){
        for(var i in kerk.box2dObjects) kerk.box2dObjects[i].BeginContact(contact);
    }
    
    this.EndContact = function(contact){
        for(var i in kerk.box2dObjects) kerk.box2dObjects[i].EndContact(contact);
    }
    
    this.startGame = function(option){
        this.option = option;
        LoadMap     = LoadAllMap[option.map_id];
        
        /** Чистим всякие плееры от реклам **/
        $('object').remove();
        
        var scope   = this;
        
        /** Немного таймера чтобы уж точно все удалилось нахрен)) **/
        setTimeout(function(){
            /** Загрузка слоев **/
            if(scope.layers) scope.scene.removeChild(scope.layers);
        
            scope.layers = new PIXI.Layers();
            
            for(var i in LoadMap.layers){
                scope.layers.addLayer(i);
                scope.layers[i].visible = LoadMap.layers[i].visible;
            } 
            
            /** Создаем дополнительные слои )) **/
            scope.layers.addLayer('other'); //слой на всякий пожарный если основного нету
            scope.layers.addLayer('lens');  //слой обьектив
            
            /** Добовляем слои в сцену **/
            scope.addObject(scope.layers)
            
            /** Загрузка игры **/
            new scope.loading(function(){
                scope.createMap();
                scope.option.load && scope.option.load();
            });
        },500)
    }
    
    this.destroyGame = function(){
        this.getObjects(function(a){
            /** Придварительно говорим что нуно удалить**/
            a.getDestroy = true;
        })
        
        this.scriptsSetAction('destroyAction',this.globalScripts);
        this.scriptsSetAction('destroyAction',this.mapScripts);
        
        this.mapScripts = null;
        this.globalScripts = null;
        
        this.players = {};
    }
    
    this.destroyMyPlayer = function(){
        if(this.players[unitid]){
            this.players[unitid].destroy();
            delete this.players[unitid];
        }
    }
    this.getMyPlayer = function(){
        if(this.players[unitid]) return this.players[unitid];
        else return {};
    }
    
    this.createMap = function(){
        if(LoadObj.settings.main.debugDraw) this.domObject.hide();
        else this.domObject.show();
        
        /** Обновляем soundPack так как в кеше хранится все **/
        dataCache.soundPack = {};
        
        this.globalScripts = this.scriptsCreate('runingGlobal');
        this.mapScripts = this.scriptsCreate(this.option.map_id);
        
        this.scriptsSetAction('startAction',this.globalScripts);
        this.scriptsSetAction('startAction',this.mapScripts);
        
        new this.graphics();
        
        this.cameraOption.overflow = LoadMap.overflow;
        
        world.SetGravity(new b2Vec2(0, LoadMap.gravitation !== undefined ?  LoadMap.gravitation : 30));
    }
    
    this.layerID = function(name){
        for(var i in LoadMap.layers){
            var nameLayer = (LoadMap.layers[i].name || 'none').toLowerCase();
            
            if(nameLayer == name.toLowerCase()) return i;
        }
    }
    
    this.collisionMap = function(position){
        var maxWidth  = LoadMap.w-10;
        var maxHeight = LoadMap.h-10;
        
        position.x = position.x < 10 ? 10 : position.x > maxWidth ? maxWidth : position.x;
        position.y = position.y < 10 ? 10 : position.y > maxHeight ? maxHeight : position.y;
    }
    
    this.intersectPoint = function(point){
        for(var i in this.boxDetect){
            var box = this.boxDetect[i];
            
            if(box.solid && box.intersectPoint(point)){
                return box;
                break;
            }
        }
    }

    this.resizeScreen = function(){
        this.offsetCon = $('#Game').offset();
        this.renderer.resize(settings.screen[0],settings.screen[1]);
        
        if(LoadMap.scale) this.layers.scale = {x:settings.screen[0]/LoadMap.w,y:settings.screen[1]/LoadMap.h}
    }
    
    this.game = function(){
        var player = this.players[unitid];
        
        if(player){
            this.myColler.moveUp     = (keyboard.pressed('w')||keyboard.pressed('up')) && this.myColler.enable ? 1 : 0;
            this.myColler.moveLeft   = (keyboard.pressed('a')||keyboard.pressed('left')) && this.myColler.enable ? 1 : 0;
            this.myColler.moveRight  = (keyboard.pressed('d')||keyboard.pressed('right')) && this.myColler.enable ? 1 : 0;
            this.myColler.moveBottom = (keyboard.pressed('s')||keyboard.pressed('down')) && this.myColler.enable ? 1 : 0;
            this.myColler.jump       = keyboard.pressed('space') && this.myColler.enable ? 1 : 0;
            this.myColler.tab        = keyboard.pressed('tab') && this.myColler.enable ? 1 : 0;
            this.myColler.screen     = settings.screen;
            
            this.cameraPoint(player.object.position.x,player.object.position.y,4);
        }
        
        this.myColler.sight.x = (this.myColler.mouse.x - this.myColler.offsetMouse.x)/this.cameraOption.scale;
        this.myColler.sight.y = (this.myColler.mouse.y - this.myColler.offsetMouse.y)/this.cameraOption.scale;
            
        this.myColler.mouse.move = 0;
    }
    
    /** CAMERA **/
    
    this.cameraLookOn = function(position,smoothPosition){
        this.cameraOption.lookAtPosition = position;
        this.cameraOption.smooth         = smoothPosition || 0.1;
    }
    
    this.cameraCallDistance = function(distance,call){
        this.cameraOption.callbackPosition = call;
        this.cameraOption.callbackPositionDistance = distance || 10;
    }
    
    this.cameraPoint = function(x,y,smo){
        x = x * this.cameraOption.scale;
        y = y * this.cameraOption.scale;
        
        /** Если нужно смотреть куда нуно то **/
        if(this.cameraOption.lookAtPosition){
            x = this.cameraOption.lookAtPosition.x;
            y = this.cameraOption.lookAtPosition.y;
            
            smo = this.cameraOption.smooth;
        }
        
        x = -x + (settings.screen[0] / 2);
        y = -y + (settings.screen[1] / 2);
        
        /** Если есть событие на позицию камеры **/
        if(this.cameraOption.callbackPosition && ToPoint(this.myColler.offsetMouse.x,this.myColler.offsetMouse.y,x,y) <= this.cameraOption.callbackPositionDistance){
            this.cameraOption.callbackPosition();
            this.cameraOption.callbackPosition = false;
        } 
        
        
        /** Сила на камеру, вибрация **/
        if(this.cameraVForce.force > 0){
            x -= variance(this.cameraVForce.force);
            y -= variance(this.cameraVForce.force);
            
            if(this.cameraVForce.type == 'push') this.cameraVForce.force  = 0;
            else                                 this.cameraVForce.force -= 10;
        }
        
        if(smo){
            x = smooth(this.myColler.offsetMouse.x,x,smo,true);
            y = smooth(this.myColler.offsetMouse.y,y,smo,true);
        }
        
        if(this.cameraOption.overflow){
            x = x > 0 ? 0 : x - settings.screen[0] < -LoadMap.w ? -LoadMap.w + settings.screen[0] : x;
            y = y > 0 ? 0 : y - settings.screen[1] < -LoadMap.h ? -LoadMap.h + settings.screen[1] : y;
        }
        
        this.layers.position.x = x;
        this.layers.position.y = y;
        
        for(var i in LoadMap.layers){
            var _layer = LoadMap.layers[i];
            
            if(_layer.noMove){
                this.layers[i].position.x = negativeNamber(x);
                this.layers[i].position.y = negativeNamber(y);
            }
            else if(_layer.parallax){
                var pX = LoadMap.w/2;
                var pY = LoadMap.h/2;
                
                this.layers[i].position.x = this.Fx3D(pX,pY,_layer.parallaxX).x - pX;
                this.layers[i].position.y = this.Fx3D(pX,pY,_layer.parallaxY).y - pY;
            }
        }
        
        this.layers.scale.x = this.layers.scale.y = this.cameraOption.scale;
        
        this.cameraOption.scale = smooth(this.cameraOption.scale,this.cameraOption.zoom,0.9);
        
        this.myColler.offsetMouse = {x:x,y:y};
    }
    
    this.cameraPosition = function(){
        return {
            x: negativeNamber(this.myColler.offsetMouse.x/this.cameraOption.scale)+((settings.screen[0]/2)/this.cameraOption.scale),
            y: negativeNamber(this.myColler.offsetMouse.y/this.cameraOption.scale)+((settings.screen[1]/2)/this.cameraOption.scale),
        }
        
    }
    
    this.cameraZoom = function(zoom){
        this.cameraOption.zoom = zoom;
    }
    
    this.cameraVibration = function(a){
        var cam    = this.cameraPosition();
        var toCam  = ToPointObject(a.position,cam);
        var radius = a.radius || 50;
        var force  = a.force || 20;
        
        if(toCam < radius){
            this.cameraVForce.force = force*(1 - (toCam/radius));
            this.cameraVForce.type  = a.type || 'vibrate';
        } 
    }
    
    this.addPlayer = function(a){
        this.removePlayer(a.unitid);
        this.players[a.unitid] = new kerk.player(a);
        return this.players[a.unitid];
    }
    
    this.removePlayer = function(id){
        if(this.players[id]){
            this.players[id].destroy();
            delete this.players[id];
        }
    }
    
    /** CONTROLLER **/
    
    this.setController = function(id,a){
        this.controllers[id] = a;
    }
    
    this.getController = function(id){
        if(!this.controllers[id]) this.controllers[id] = this.createController();
        
        return this.controllers[id];
    }
    
    this.myController = function(){
        return this.getController(unitid);
    }
    
    this.updateMyController = function(){
        this.myColler = this.myController();
    }
    
    this.enableController = function(enableDisable){
        var coller = this.myController();
            coller.enable = enableDisable;
    }
    
    this.createController = function(){
        return {
            enable: 1,
            moveUp: 0,
            moveLeft: 0,
            moveRight: 0,
            moveBottom: 0,
            tab: 0,
            jump: 0,
            shot: 0,
            sight: {
                x: 0,
                y: 0,
            },
            mouse: {
                x: 0,
                y: 0
            },
            offsetMouse: {
                x: 0,
                y: 0
            },
            screen: settings.screen
        }
    }
    
    /** TOOLS **/
    
    this.Fx3D = function(x,y,floor,factor){
        var cam = this.cameraPosition();
        
        var far = ToPoint(cam.x,cam.y,x,y),
            ang = ToAngle(cam.x,cam.y,x,y),
            del = far*(factor || 0.02)*(floor || 0),
            off = {
                x: x + del * Math.cos(ang),
                y: y + del * Math.sin(ang),
                scale: del
            };
            
        return off;
    }
    
    this.isVisible = function(x,y,w,h){
        var cam = this.cameraPosition();
        
        var zo = (settings.screen[0] / 2)/this.cameraOption.scale,
            zh = (settings.screen[1] / 2)/this.cameraOption.scale,
            lw = [cam.x - zo,cam.x + zo,cam.y - zh,cam.y + zh];
            po = [0,0],
            vi = 1;
                    
            po[0] = x < lw[0]+w ? lw[0]+w : x > lw[1]-w ? lw[1]-w : x;
            po[1] = y < lw[2]+h ? lw[2]+h : y > lw[3]-h ? lw[3]-h : y;
            
            vi = x < lw[0]+w ? 0 : x > lw[1]-w ? 0 : vi;
            vi = y < lw[2]+h ? 0 : y > lw[3]-h ? 0 : vi;
            
            return {
                position: {
                    x: po[0],
                    y: po[1]
                },
                visible: vi
            };
    }
};

function animate(){
    requestAnimationFrame(animate);
    
    kerk.render();
    kerk.update();
}

/** Detecting focus of a browser window **/

function onBlur() {
	kerk.focusTab = 0;
}
function onFocus(){
	kerk.focusTab = 1;
}

if(/*@cc_on!@*/false){ // check for Internet Explorer
	document.onfocusin  = onFocus;
	document.onfocusout = onBlur;
}else{
	window.onfocus = onFocus;
	window.onblur  = onBlur;
}