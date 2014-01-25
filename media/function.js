/**
 * Basic Math Vector 
 * Used for vector calculations
 */
 
var Vector = function(p) {
    this.x = p.x;
    this.y = p.y;
    
    return this;
};

Vector.prototype = {
    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },
    
    set: function(pos){
        this.x = pos.x;
        this.y = pos.y;
        return this;
    },
    
    clone: function() {
        return new Vector({x: this.x, y: this.y});
    },
    
    distance: function(v) {
        var x = this.x - v.x,
            y = this.y - v.y;
        return Math.sqrt(x * x + y * y);
    },

    offset: function(v,a){
        this.x = this.x + v * Math.cos(a);
        this.y = this.y + v * Math.sin(a);
        return this;
    },
    
    rotate: function(rad) {
        var cos = Math.cos(rad), sin = Math.sin(rad), x = this.x, y = this.y;
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    },
    
    subtract: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
};

/**
 * Базовые функции
 * Используются в игре и в редакторе
 */
 
function randomColor() {
    var letters = '0123456789ABCDEF'.split(''),color = '';
    
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function restore_in_a(arr,reverse){
    var re = [];
    
    $.each(arr,function(i,a){
        re[re.length] = reverse ? a : i;
    })
    
    return re;
}

function removeArray(a,b){
    a.splice( a.indexOf( b ), 1 );
}

function remove_index_arr(arr,index,str){
    var n_ar = str ? {} : [];
    
    $.each(arr,function(i,obj){
        if(i !== index)  n_ar[i] = obj;
    })
    
    arr = n_ar;
    
    return n_ar;
}

function stepLoad(a,fn,done){
    var i = 0;
    var go = function(){
        
        if(a.length > i){
            if(fn){
                /** Фиксим чуваки, кеш на стока быстр что аш падает в цикл **/
                var b = i;
                setTimeout(function(){
                    fn(b,go);
                },10)
            }
        } 
        else if(done) done();
        i++;
    }
    
    go();
}

function loadImg(src,defSrc,callback){
    if(!dataCache.loadImages) dataCache.loadImages = {};
    
    var imageCache = dataCache.loadImages[src];
    
    if(imageCache){
        callback && callback(imageCache,imageCache.width,imageCache.height);
        
        return imageCache;
    } 
    
    var imageObj = new Image();
        imageObj.onload = function() {
            dataCache.loadImages[src] = imageObj;
            
            callback && callback(this,imageObj.width,imageObj.height);
        };
        imageObj.onerror = function() {
            loadImg(defSrc,'',function(img,w,h){
                callback && callback(img,w,h);
            })
        };
        imageObj.src = src ? src : defSrc ? defSrc : 'media/img/sprite.png';
}

function checkObject(obj,toArray){
    var type = Object.prototype.toString.call(obj).match(/(\w+)\]/)[1];
    var a = toArray ? 'Array' : 'Object';
    
    if(type === a) return obj;
    else return toArray ? [] : {};
}

function hash(addSimbol){
    return new Date().getTime()+(addSimbol || '');
}

function addDelta(a,c){
    return a * (c ? focusDelta : delta);
}

function negativeNamber(num){
    var abs = Math.abs(num);
    
    return num < 0 ? abs : -abs;
}

function fixDigit(str){
           str = str + '';
    return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
}

function smooth(a,b,s,c){
    return a + ((b - a) * (s*(c ? focusDelta : delta)));
}

function random(min,max,floor){
    var ron = Math.random() * (max - min) + min; return floor ? ron : Math.floor(ron);
}

function variance(val){
    return Math.random() * (-val - val) + val
}

function colorToHex(hex){
    return parseInt(hex,16);
}
function hexGrb(h){
    var r = parseInt((h).substring(0,2),16),
        g = parseInt((h).substring(2,4),16),
        b = parseInt((h).substring(4,6),16);
        
    return r+g+b;
}

function leadZero(number, length) {
    while(number.toString().length < length){
        number = '0' + number;
    }
    return number;
}

function timeEnd(nowTime,endTime,countTime){
    var dd    = countTime ? countTime : endTime - nowTime;
    var dhour = leadZero(Math.floor((dd%(60*60*1000*24))/(60*60*1000)*1), 2)
    var dmin  = leadZero(Math.floor(((dd%(60*60*1000*24))%(60*60*1000))/(60*1000)*1), 2)
    var dsec  = leadZero(Math.floor((((dd%(60*60*1000*24))%(60*60*1000))%(60*1000))/1000*1), 2)
    
    return [dhour,dmin,dsec];
}

function turnLeftOrRight(Angle,toAngle,max){
    var cof = Angle - toAngle,
        ger = 0,
        max = max || 0

    if(cof > Math.PI)  cof -= 2 * Math.PI;
    if(cof <- Math.PI) cof += 2 * Math.PI;
    
    if(cof > max) ger=-1;
    else if(cof <- max) ger=1;
    
    return ger;
}

function calculateAngle(Angle,toAngle,smoothVar){
    var cof = Angle - toAngle,
        ger = 0,
        del = addDelta(smoothVar);

    if(cof > Math.PI)  cof -= 2 * Math.PI;
    if(cof <- Math.PI) cof += 2 * Math.PI;
    
    if(cof > del) ger=+del;
    else if(cof <- del) ger=-del;
    else ger = Angle - toAngle;
    
    return Angle - ger; 
}

function To360(radians){
    var degrees = radians * (180/Math.PI);
    
    if(degrees < 0) return 360 + degrees;
    else return degrees;
}

function ToRadian(degrees){
    var radians = degrees * (Math.PI/180);
    
    if(radians > Math.PI) return -(Math.PI*2 - radians);
    else return radians;
}

function ToPoint(x,y,x2,y2){
    return Math.sqrt(Math.pow(x-x2,2) + Math.pow(y-y2,2))
}

function ToPointObject(object1,object2){
    
    var point1 = object1.position ? object1.position : object1;
    var point2 = object2.position ? object2.position : object2;
    
    return Math.sqrt(Math.pow(point1.x-point2.x,2) + Math.pow(point1.y-point2.y,2))
}

function ToAngle(x,y,x2,y2){
    return Math.atan2(y2 - y,x2 - x);
}

function ToAngleObject(object1,object2){
 
    var point1 = object1.position ? object1.position : object1;
    var point2 = object2.position ? object2.position : object2;
    
    return Math.atan2(point2.y - point1.y,point2.x - point1.x);
}
function ToPointDetect(x,y,w,h,dotX,dotY){
    if(dotX > x && dotX < x+w && dotY > y && dotY < y+h) return true;
}

function intersectRect(r1, r2) {
    return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function OffsetPoint(x,y,a,offsetX,offsetY){
    return {
        x: x + Math.cos(a)*offsetX - Math.sin(a)*offsetY,
        y: y + Math.sin(a)*offsetX + Math.cos(a)*offsetY
    };
}

function OffsetPointObject(object,offsetX,offsetY){
    return {
        x: object.position.x + Math.cos(object.rotation)*offsetX - Math.sin(object.rotation)*offsetY,
        y: object.position.y + Math.sin(object.rotation)*offsetX + Math.cos(object.rotation)*offsetY
    };
}

function corAngle(a,c){
    var cof = a - c;

    if(cof > Math.PI)  cof -= 2 * Math.PI;
    if(cof <- Math.PI) cof += 2 * Math.PI;
    
    return a - cof;
}

function ToMaxAngle(a,c,max){
    var cof = a - c;
    
    if(cof > Math.PI)  cof -= 2 * Math.PI;
    if(cof <- Math.PI) cof += 2 * Math.PI;

    if(cof > max || cof <- max) return cof > max ? c+(cof-max) : c+(cof+max);
    else return c;
}

/**
 * TWEEN FUNCTION
 * Просчет по кривой 
 */

function TweenFn(object){
    this.object  = object ? object : {};
    this.origval = this.object.values ? this.object.values : [{time:0,value:0},{time:300,value:1}];
    this.object.variance = this.object.variance || 0;
    this.values  = []
    this.timer   = 0;
    this.totalTime = (this.object.time || 1) * 1000;
    this.timeDiff  = 1;
    
    for(var i in this.origval){
        this.values[i] = {
            time: this.origval[i].time,
            value: this.random(this.origval[i].value), 
        }
    }
}
TweenFn.prototype.setTimeDiff = function(time){
    this.timeDiff = this.totalTime / time;
}
TweenFn.prototype.correctTime = function(i){
    return this.values[i].time / this.timeDiff;
}
TweenFn.prototype.random = function(value){
    var variance = Math.random() * (-this.object.variance - this.object.variance) + this.object.variance;
    var ammout   = value * variance;
    
    return value + ammout;
}
TweenFn.prototype.updateVariance = function(timeDelta){
    for(var i in this.origval) this.values[i].value = this.random(this.origval[i].value);
    
    return this.addDelta(timeDelta);
}
TweenFn.prototype.variance = function(timeDelta){
    return this.random(this.addDelta(timeDelta));
}
TweenFn.prototype.getValue = function(t){
    var i = 0;
	var n = this.values.length;
    
	while(i < n && t > this.correctTime(i)) i++;
    
    if (this.object.repeat && i == n && t > this.correctTime(n-1)) this.timer = 0;
    
	if (i == 0) return this.values[0].value;
	if (i == n)	return this.values[n-1].value;
    
	var poin = (t - this.correctTime(i-1)) / (this.correctTime(i) - this.correctTime(i-1));
	
    return this.values[i-1].value + poin * (this.values[i].value - this.values[i-1].value);
}
TweenFn.prototype.addDelta = function(timeDelta){
    return this.getValue(this.timer += 1000*timeDelta);
}
TweenFn.prototype.delta = function(){
    return this.getValue(this.timer += 1000*delta);
}
TweenFn.prototype.lerp = function(time){
    this.timer = time;
	return this.getValue(time);
}
TweenFn.prototype.reset = function(){
	this.timer = 0;
    return this;
}

/**
 * TWEEN FUNCTION
 * Просчет по кривой 
 */

function TweenSimple(times,repeat){
    var object = {
        time: 0,
        variance: 0,
        values: [],
        repeat: repeat
    }
    
    for(var i in times){
        object.values.push({
            time: times[i][1],
            value: times[i][0]
        })
        object.time += times[i][1] - object.time;
    }
    
    return new TweenFn(object);
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
function boxIntersect(a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = null;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (minA == null || projected < minA) {
                    minA = projected;
                }
                if (maxA == null || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = null;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB == null || projected < minB) {
                    minB = projected;
                }
                if (maxB == null || projected > maxB) {
                    maxB = projected;
                }
            }
            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            
            if (maxA < minB || maxB < minA) return false;
        }
    }
    return true;
};


/**
 * CANVAS
 * Конвертация изображений
 *
 * convertImgToData(img) конвертирует обьект new Image в data{} обьект
 * resizeImg(img,w,h) изменяет размер картинки
 * convertCanvasToImage(canvas) конвертирует холс в картинку toDataURL
 * converBaseToImage(base) конверт base64 в Image()
 */
 

function convertImgToData(img){
    var canvas = document.createElement("canvas"),
        /** Фиксим баг для фокса и других говно браузеров **/
        width  = img.width || 10,
        height = img.height || 10;
        
        canvas.width  = width;
        canvas.height = height;
        
    var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
       
    return  ctx.getImageData(0, 0, width, height);
}
function resizeImg(img,w,h,toSrc){
    var canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
    
    var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0,w,h);
    
    if(toSrc) return canvas.toDataURL("image/png");
    else return convertCanvasToImage(canvas);
}

function convertCanvasToImage(canvas) {
	var image     = new Image();
	    image.src = canvas.toDataURL("image/png");
	return image;
}

function converBaseToImage(base){
    var image = new Image();
        image.src = base;
    return image;
}

/**
 * Создание отрезка картинки из основной картинки 
 * image, points array[]
 * return ob:(toDataURL),x,y,width,height
 */

function createImgOnArea(img,points){
    var x1 = y1 = x2 = y2 = w = h = 0;
    
    for(var i = points.length;i--;){
        if(!x1) x1 = points[i][0];
        if(!y1) y1 = points[i][1];
        
        x1 = Math.min(points[i][0],x1);
        y1 = Math.min(points[i][1],y1);
        
        x2 = Math.max(points[i][0],x2);
        y2 = Math.max(points[i][1],y2);
    }
    
    w = x2 - x1;
    h = y2 - y1;
    
    var canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
    
    var shape  = canvas.getContext("2d");
    var patern = shape.createPattern(img, 'no-repeat');
    
    shape.beginPath();
    
    for(var i = 0; i < points.length;i++) shape.lineTo(points[i][0]-x1,points[i][1]-y1);
    
    shape.translate(-x1, -y1);
    shape.fillStyle = patern;
    shape.fill();
    shape.closePath(); 
    
    return {ob:convertCanvasToImage(canvas),x:x1,y:y1,width:w,height:h};
}