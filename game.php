<!DOCTYPE HTML>
<html>
<head>
<title><?=$title?></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<?if($_GET['api_id']){?><script type="text/javascript" src="//vk.com/js/api/xd_connection.js?2"></script><?}?>
<script type="text/javascript" src="/plugins/js/jquery.js"></script>
<script type="text/javascript" src="/media/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/media/js/jquery.easing.min.js"></script>
<script type="text/javascript" src="/media/scroll/jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="/media/scroll/jquery.mCustomScrollbar.min.js"></script>
<script type="text/javascript" src="/media/js/Box2dWeb-2.1.a.3.min.js"></script>
<script type="text/javascript" src="/media/tween.js"></script>

<script src="/media/pixi/pixi.dev.js"></script>
<script src="/media/pixi/layers.js"></script>

<script src="/media/js/libs/stats.min.js"></script>
<script src="/media/js/Keyboard.js"></script>
<script src="/media/js/Clock.js"></script>

<script type="text/javascript" src="/media/BigScreen.js"></script>
<script type="text/javascript" src="/media/font.js<?=$rcache?>"></script>
<script type="text/javascript" src="/media/particles.js<?=$rcache?>"></script>

<script src="/media/app/app.js<?=$rcache?>"></script>
<script src="/media/app/loading.js<?=$rcache?>"></script>
<script src="/media/app/player.js<?=$rcache?>"></script>
<script src="/media/app/animation.js<?=$rcache?>"></script>
<script src="/media/app/animationObject.js<?=$rcache?>"></script>
<script src="/media/app/box.js<?=$rcache?>"></script>
<script src="/media/app/box2D.js<?=$rcache?>"></script>
<script src="/media/app/area.js<?=$rcache?>"></script>
<script src="/media/app/sprite.js<?=$rcache?>"></script>
<script src="/media/app/weapon.js<?=$rcache?>"></script>
<script src="/media/app/shell.js<?=$rcache?>"></script>
<script src="/media/app/bullet.js<?=$rcache?>"></script>
<script src="/media/app/graphics.js<?=$rcache?>"></script>
<script src="/media/app/image.js<?=$rcache?>"></script>
<script src="/media/app/object3D.js<?=$rcache?>"></script>
<script src="/media/app/point.js<?=$rcache?>"></script>
<script src="/media/app/emiter.js<?=$rcache?>"></script>
<script src="/media/app/mapBox.js<?=$rcache?>"></script>
<script src="/media/app/tracer.js<?=$rcache?>"></script>
<script src="/media/app/fx.js<?=$rcache?>"></script>
<script src="/media/app/sound.js<?=$rcache?>"></script>
<script src="/media/app/soundPack.js<?=$rcache?>"></script>
<script src="/media/app/font.js<?=$rcache?>"></script>

<link rel="stylesheet" href="/plugins/css/tools.css" type="text/css" />
<link rel="stylesheet" href="/media/menu.css<?=$rcache?>" type="text/css" />
<link rel="stylesheet" href="/media/scroll/jquery.mCustomScrollbar.css" type="text/css" />


<script src="/data/data.js<?=$rcache?>"></script>
<script src="/data/scripts.js<?=$rcache?>"></script>

<script>
/** Наши данные **/
var unitid     = <?=$game['viewer_id']?>; //so.io id
var viewer_id  = <?=$game['viewer_id']?>; //vk viewer_id
var user_id    = <?=$game['user_id']?>;   //db user id
var Profile    = <?=$game['user']?>;
var LoadMap    = {};
var auth_key   = '<?=$game['auth_key']?>';
var uhash      = '<?=$game['uhash']?>';
var LoadAllMap = LoadObj.maps;
var getTestMap = '<?=$_GET['map']?>';

/** Основные настройки **/
var settings = {
    content: 'Pixi',
    screen: [LoadObj.settings.main.screenWidth,LoadObj.settings.main.screenHeight]
}

/** Глобальная переменная **/
var dataCache = {
    screen: [
        [LoadObj.settings.main.screenWidth,LoadObj.settings.main.screenHeight],
        //[1366,768],
        [1024,768],
        [1280,1024],
        [1366,768],
        [1400,1050],
        [1600,1080],
        [1680,1050],
        [1920,1080]
    ],
    settings: {
        screen: parseInt($.cookie('screen')) || 0,
    }
};

/** Часики и клава **/
var keyboard   = new THREEx.KeyboardState();
var clock      = new Clock();
</script>

</head>

<body class="t_body t_over" style="background: #000;">
    <div class="conteiner t_p_r" id="Game" style="width: 800px; margin: 0 auto; height: 500px;">
        <!--<img src="/images/game/distore_1.jpg" id="bgMenu" class="t_p_a t_width t_height t_top t_left" style="display: none;" />-->
        <div id="Pixi" class="t_p_a t_left t_top" style="display: none;"></div>
        <canvas id="canvas" width="800" height="500"></canvas>
        
        <div id="fullscreen" class="t_p_a iconsGame" onclick="menu.fullscreen()"></div>
        <div id="fps" class="t_p_a iconsGame"></div>
        
        <div class="t_p_a LoadingGameIcon"></div>
        <div class="copyr loadingMenuProgress"></div>
        <div class="menuLoad loadingMenuProgress"></div>
        <div class="loadingGameProgress"></div>
        
    </div>
    
<script type="text/javascript" src="media/function.js<?=$rcache?>"></script>
<script type="text/javascript" src="media/menu.js<?=$rcache?>"></script>

<script type="text/javascript">

if(window.location.protocol.substr(0, 4) === "file"){
	alert("Игра не будет работать, пока вы не загрузите их на сайт!");
}
else{
    /** Создаем нашу игру **/
    kerk.createGame();
    
    /** Если эта тестовая карта **/
    if(getTestMap){
        menu.testMap({
            map_id: getTestMap
        })
    }
    else menu.start();
}


/***///FULLSCREEN MODE///***/
/** Отслеживаем изменения экрана **/

BigScreen.onenter = function(){
    menu.inFullScreen = 1;
    menu.resizeScrren();
}

BigScreen.onexit = function(){
    menu.inFullScreen = 0;
    menu.resizeScrren(true);
}

/***///SCRIPTS///***/
/** Дополнительные скрипты для обьектов **/

</script>
</body>
</html>