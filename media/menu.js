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
    
    /** Связь с сервером для BK **/
    this.serverString = function(s){
        return '/index.php?auth_key='+auth_key+'&user_id='+user_id+'&viewer_id='+viewer_id+'&uhash='+uhash+'&do='+s;
    }
    
    this.serverLoadData = function(ac,data,fn,error){
        $.post(menu.serverString(ac),{data:data||0},function(j){
            if(!error && menu.serverCheckError(j)) return;
            
            fn && fn(j);
        },'json');
    }
    
    this.serverCheckError = function(j){
        if(j.error) return menu.error(j.error);
    }
    
    /** Наши настройки **/
    this.show_Settings = function(){
        var box = $('#scrollSettingsData').empty();
        
        var addSimple = function(name,option,call){
            $('<li class="t_clearfix"><b>'+name+'</b><div class="t_right dic t_point cl"><div>'+option+'</div></div></li>').appendTo(box).find('.cl div').on('click',function(){
                call && call($(this)); 
            });
        };
        
        var YesNo = function(value){
            return value ? 'да' : 'нет';
        }
        
        addSimple('Максимальное разрешение экрана',dataCache.screen[dataCache.settings.screen][0]+'x'+dataCache.screen[dataCache.settings.screen][1],function(btn){
            dataCache.settings.screen = ++dataCache.settings.screen >= dataCache.screen.length ? 0 : dataCache.settings.screen;
            btn.text(dataCache.screen[dataCache.settings.screen][0]+'x'+dataCache.screen[dataCache.settings.screen][1])
            menu.resizeScrren();
        })
        
        addSimple('Прыжок',dataCache.settings.move)
        addSimple('Движение влево',dataCache.settings.left)
        addSimple('Движение вправо',dataCache.settings.right)
        addSimple('Сменить оружие',dataCache.settings.weapons)
        addSimple('Написать в чате',dataCache.settings.chat)
        
        addSimple('Показывать эффекты',YesNo(dataCache.settings.fx),function(btn){
            dataCache.settings.fx = dataCache.settings.fx ? 0 : 1;
            btn.text(YesNo(dataCache.settings.fx));
        })
                
        addSimple('Показывать трейсеры',YesNo(dataCache.settings.tracer),function(btn){
            dataCache.settings.tracer = dataCache.settings.tracer ? 0 : 1;
            btn.text(YesNo(dataCache.settings.tracer));
        })
		
		addSimple('Музыка',YesNo(dataCache.settings.sound),function(btn){
            dataCache.settings.sound = dataCache.settings.sound ? 0 : 1;
            btn.text(YesNo(dataCache.settings.sound));
        })
        
        $('#userSettingsBtn').unbind('click').on('click',function(){
            menu.serverLoadData('saveSettings',JSON.stringify(dataCache.settings));
            if(dataCache.show_userMenu) menu.show('gameMenu');
            else menu.show_Main();
        })
        
        menu.show('settings')
        menu.updateScroll('#scrollSettingsBlock');
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