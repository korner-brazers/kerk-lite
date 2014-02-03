/**
 * Главное меню игры
 * Автор Korner Brazers
 * http://vk.com/korner_brazers
 */

var menu = new function() {
    this.inFullScreen;
    
    this.start = function(){
        $('.loadingMenuProgress').show();
        
        /** После загрузки шрифтов **/
        font.loading(function(){
            /** И ожеданий грузим меню :D **/
            setTimeout(function(){
        	    menu.toggleGame('mainMenu');
                
                $('.loadingMenuProgress').hide();
                $('.iconsGame').show(); 
        	},1000)
        })
    }
    
    this.testMap = function(option){
        font.loading(function(){
            /** Обновляем на новый unitid **/
            unitid = hash('_un');
            
            /** Обновляем контроллер **/
            kerk.updateMyController();
            
            menu.resizeScrren(true);
            
            kerk.startGame({
                map_id: option.map_id,
                load: function(){
                    
                    menu.toggleGame('game');
                    
        			$('.iconsGame').show();
                }
            })
        })
    }

    /** Событие наступает после загрузки основного меню **/
    this.readyMenu = function(){
        
    }
    
    /** Переключатель меню и игры **/
    this.toggleGame = function(n){
        var load = $('.loadingGameProgress');
        
        /** Показываем загрузку контента **/
        if(n == 'load'){
            kerk.destroyGame();
            menu.toggleCursor();
            load.show();
        }
        /** прячим загрузку **/
        else if(n == 'game'){
            load.hide();
        }
        /** Переключаем на главное меню **/
        else if(n == 'mainMenu'){
            if(LoadObj.settings.main.useMenuGame && LoadAllMap[LoadObj.settings.main.menuOnGame]){
                menu.toggleGame('load');
                kerk.startGame({
                    map_id: LoadObj.settings.main.menuOnGame,
                    load: function(){
                        menu.toggleCursor(1);
                        load.hide();
                        menu.readyMenu();
                    }
                })
            }
            else{
                kerk.destroyGame();
                menu.toggleCursor(1);
            }
        }
    }
    
    /** Показываем или прячем курсор **/
    this.toggleCursor = function(n){
        $('body').css({cursor:n ? 'default' : 'none'});
    }
    
    /** Дополнительные инструменты **/
    this.updateScroll = function(n,p,m){
        var sc = $(n);
        if(sc.hasClass('mCustomScrollbar')){
            sc.mCustomScrollbar("update")
            p && sc.mCustomScrollbar("scrollTo",p)
        }
        else sc.mCustomScrollbar({
            scrollInertia: 200
        });
        
        !$('.mCS_no_scrollbar',sc).length && !m ? sc.css({marginRight:'-20px'}) : sc.css({marginRight:0});
    }
    
    /** Переход в fullscreen и изменение экрана **/
    this.fullscreen = function(){
        if(BigScreen.enabled && !menu.inFullScreen) BigScreen.toggle();
        else{
            dataCache.settings.screen = ++dataCache.settings.screen >= dataCache.screen.length ? 0 : dataCache.settings.screen;
            
            $.cookie('screen', dataCache.settings.screen, { expires: 320, path: '/' });
            
            menu.resizeScrren();
        }
    }
    
    this.resizeScrren = function(out){
        var w = screen.availWidth,
            h = screen.availHeight,
            s = out ? dataCache.screen[0] : dataCache.screen[dataCache.settings.screen],
            fw = s[0] > w ? w : s[0],
            fh = s[1] > h ? h : s[1],
            p  = {width: fw,height: fh};
            
        if(out || menu.inFullScreen){
            
            settings.screen[0] = fw;
            settings.screen[1] = fh;
            
            $('#Game').css(p);
            
            kerk.resizeScreen(out)
        }
    }
    
    /** Запускам нашу игру **/
    
    this.startGame = function(option){
        menu.toggleGame('load');
        
        kerk.startGame({
            map_id: option.map_id,
            load: function(){
                menu.toggleGame('game');
            }
        })
    }
    
    /** Выходим из игры **/
    
    this.stopGame = function(){
        menu.toggleGame('mainMenu');
    }
}