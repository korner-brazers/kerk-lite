// jQuery SL Plugin
//
// Version 1.34
//
// Author Korner
// Sl SYSTEM
// 06 June 2012
//
// Visit http://sl-cms.com for more information
//
// Usage: $.sl('method',options)
//
// TERMS OF USE
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2012 Sl SYSTEM, LLC. 

(function($){
    var cursor_point = {x:0,y:0};
    var window_size = {w:0,h:0};
    var m_o = {
            awc: '#all_window_load',
            cn: 'active'
        };
    var gop = {
        theme:'/'
    };
    var lang = [
        'Сохранить',
        'Загрузка',
        'Обновить',
        'Закрыть',
        'Ошибка в скрипте',
        'Всего ошибок',
        'Загрузка страницы',
        'Ошибка сервера',	
        'Да',
        'Вы действительно хотите удалить',
        'Удаление',
        'Не указан адрес запроса для удаления'
    ];
    
    var methods = {
        init : function() {
            
            $(document).on('mousemove',function(e){
                cursor_point.x = e.pageX;
                cursor_point.y = e.pageY;
            });
            
            window_size.w = window.innerWidth;
            window_size.h = window.innerHeight;
            
            $(window).resize(function() {
                
                window_size.w = window.innerWidth;
                window_size.h = window.innerHeight;
                
                var im = $(document).data('top_menu') || false;
                
                $('.shell_window,.shell_window .win_h_size,.shell_window .preload,.win_h_size_shell').each(function(){
                    $(this).css({
                        width: ($(this).hasClass('win_h_size_shell') ? false : window_size.w),
                        height: (im ? window_size.h - im : window_size.h) - $(this).closest('.shell_window').find('.shell_menu').height()
                    })
                    
                    if($(this).attr('minus')) $(this).height($(this).height() - $(this).attr('minus'));
                });
                
                $.sl('update_scroll');
            });
            
            $('.sl_checkbox').live('mousedown',function(){
                $(this).hasClass('active') ? $(this).removeClass('active').find('input').val(0) : $(this).addClass('active').find('input').val(1);
            });
            
            $(".sl_radio label").live('click',function(){
                var parent = $(this).closest('.sl_radio');
                $('label',parent).removeClass('selected');
                $(this).addClass('selected');
            });
            
            $('.bigedit').live('click',function(){
                var parent = $(this).closest('.sl_input,.sl_textarea'),btn = {};
                btn[lang[0]] = function(w,v){
                    $('input,textarea',parent).val(v[0]['value']);
                }
                $.sl('_area',{value:$('input,textarea',parent).val(),btn:btn});
            });
            
            $('.sl_slide ul.title li').live('click',function(){
                var parent = $(this).closest('.sl_slide');
                var p = $(this).attr('rel') * 100;
                $('.title li',parent).removeClass('active');
                $(this).addClass('active');
                $('.page',parent).css({'-webkit-transform': 'translateX(-'+p+'%)','-moz-transform': 'translateX(-'+p+'%)','-o-transform': 'translateX(-'+p+'%)','transform': 'translateX(-'+p+'%)'});
            })
            
            $(document).mousedown(function(){
                $('#sl_select_box').fadeOut(function(){
                    $(this).remove();
                })
            })
            
            $('table tr.sl_add_row').live('click',function(){
                var call = $(this).attr('callback'),
                    url = $(this).attr('url'),
                    top = $(this).attr('top'),
                    _this = $(this),
                    parent = $(this).closest('table'),
                    scroll_p = $(this).closest('.scrollbarInit');
                
                function bi(data,c){
                    top ? parent.find('tr:eq('+top+')').before(data) : _this.before(data);
                    scroll_p.length && scroll_p.tinyscrollbar_update('bottom');
                    c && c();
                }
                
                if(call){
                    if(url){
                        $.sl('load','/ajax/'+call,function(d){
                           bi(d);
                        },{mode:'quiet'});
                    }
                    else window[call](function(data,callback){
                        bi(data,function(){
                            callback && callback();
                        })
                    },_this);
                }
            })
            
            $(".sl_select ._display").live('click',function(){
                var parent = $(this).closest('.sl_select'),
                    data   = $('._data ul',parent).html(),
                    w      = parent.outerWidth(),
                    h      = parent.outerHeight(),
                    of     = parent.offset(),
                    wh     = window.innerHeight,x,y,bh,bh2,overhide,tp,g = 30,v = '',n = '',ml;
                    
                $box = $([
                    '<div id="sl_select_box">',
                        '<div class="scroll"><ul>',
                            data,
                        '</ul></div>',
                    '</div>'
                ].join(''));
                
                bh = $box.hide().appendTo('body').fadeIn().find('ul').height();
                
                x = of.left;
                y = of.top;
                ml = $(document).scrollTop()
                
                
                bh  = bh+g > wh ? wh-g : bh;
                bh2 = bh/2+15;
                
                $box.find('div.scroll').height(bh);
                
                tp = (bh2 > y) ? 15 : y - bh2 + (h/2) + 15;
                
                tp = (y+bh2 > wh+ml) ? y - bh2-(y+bh2 - wh)+ (h/2) + ml: tp;
                
                $box.css({left:x,top:tp,width:w,height:overhide}).find('.scroll').tinyscrollbar();
                
                $box.find('li').click(function(){
                    v = $(this).attr('val');
                    n = $(this).attr('name');
                    $('._data li',parent).removeClass('selected');
                    $('._data li[val='+v+']',parent).eq(0).addClass('selected');
                    $('._display',parent).html(n);
                    $('input',parent).val(v);
                });
            });
            
            
            $('table.sortable').live('mouseenter', function() {
                $(this).die('mouseenter').sortable({
                    distance:15,
                    items:'tr.row_2,tr.row_1', 
                    opacity:0.6,
                    start:function(event,ui){
                        ui.item.addClass('hideTd');
                    },
                    stop:function(event,ui){
                        ui.item.removeClass('hideTd');
                        $.sl('sort_table');
                    },
                    axis:'y'
                });
            });
            
            return this;
        },
        /**
         * Lang Translate
         */
        lang: function(fn,op,st){
            
            var o = '',f,_this,obj;
            this == false ? _this = false : _this = $(this);
            
            o = _this ? _this.text().substr(0,500) : '';

            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (o =  is[n]);
            })
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = is[n];
            })
            
            $.sl('load','/ajax/fn/lang',{data:{lang:JSON.stringify(o)},mode:'hide',ignore:true},function(j){
                if(typeof o == 'object') obj = jQuery.parseJSON(j);
                f && f(obj ? obj : j);
                _this && !obj && _this.text(j);
            });
            
            return this == false ? false : this;
        },
        options: function(options){
            if(typeof options == 'string') return gop[options]; 
            else gop = jQuery.extend(gop, options);
        },
        /**
         * Update Scroll
         */
        update_scroll : function() {
            $('.scrollbarInit').length && $('.scrollbarInit').tinyscrollbar_update('relative');
        },
        /**
         * Resize
         */
        resize : function(fn,op,st) {
            var o = [],f,s,ah = 0,i=0,w=0;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = is[n];
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (s =  is[n]);
            })
            
            function stin(){
                ah = 0,h = window.innerHeight,w = window.innerWidth;
                for(i = 0; i < o.length; i++) ah += $(o[i]).outerHeight();
                s && $(s).height(h-ah);
                f && f(h,h-ah,w);
            }
            
            $(window).resize(function() {
                stin();
            });
            
            stin();
            
            return this == false ? false : this;
        },
        /**
         * Sort Table
         */
        sort_table : function() {
            $('table tr:even').not('tr.header,tr.sl_add_row').removeClass('row_2').addClass('row_1');
            $('table tr:odd').not('tr.header,tr.sl_add_row').removeClass('row_1').addClass('row_2');
            return this == false ? false : this;
        },
        /**
         * Scroll menu
         */
        scroll_menu : function(fn,op,st) {
            if(this == false) return;
            
            var o = {
                menu: [],
                load: false,
            },f,s,btn = '',btns;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (s =  is[n]);
            })
            $.sl('type',[fn,op,st],'number',function(is,n){
                is[n] !== '' && (s =  is[n]);
            })
            
            var _this = $(this),
                w      = _this.outerWidth(),
                h      = _this.outerHeight(),
                of     = _this.offset(),
                wh     = $(window).height(),x,y,bh,bh2,overhide,tp,g = 30,wq = w,ib = 0,ml;
            
            function bin(menu){
                menu && (o.menu = menu);
                
                $.each(o.menu,function(k,v){ btn += '<li'+(k == s ? ' class="selected"' : '')+'><span>'+v+'</span></li>'; });
                    
                $box = $([
                    '<div id="sl_select_box">',
                        '<div class="scroll"><ul>',
                            btn,
                        '</ul></div>',
                    '</div>'
                ].join(''));
                
                bh = $box.hide().appendTo('body').fadeIn().find('ul').height();
                
                w = w < 100 ? 100 : w;
                x = of.left - (w/2) + (wq/2);
                y = of.top;
                ml = $(document).scrollTop()
                
                bh  = bh+g > wh ? wh-g : bh;
                bh2 = bh/2+15;
                
                $box.find('div.scroll').height(bh);
                
                tp = (bh2 > y) ? 15 : y - bh2 + (h/2) + 15;
                
                tp = (y+bh2 > wh+ml) ? y - bh2-(y+bh2 - wh)+ (h/2)+ml: tp;
                
                $box.css({left:x,top:tp,width:w}).find('.scroll').tinyscrollbar();
                
                btns = $box.find('li');
                
                $.each(o.menu,function(nb,obj){
        			btns.eq(ib++).click(function(){
                        if(o.module) $.sl('load',o.module[0],{mode:(o.module[1] || false),data:{0:nb,1:obj}},function(data){
                            f && f.apply(_this,[nb,obj,data]);
                        })
                        else f && f.apply(_this,[nb,obj]);
                        
        			});
        		});
            }
            
            if(o.load){
                $(this).sl('load',(typeof o.load == 'object' ? o.load[0] : o.load),{mode:(typeof o.load == 'object' ? o.load[1] : 'content'),dataType:'json',back:false},function(menu){
                    bin(menu);
                })
            }
            else bin();
        },
        /**
         * BIG Select
         */
        big_select : function(fn,op,st) {
            var o = {
                menu: [],
                load: false,
            },f,s,t,btn = '',btns;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (t =  is[n]);
            })
            $.sl('type',[fn,op,st],'number',function(is,n){
                is[n] !== '' && (s =  is[n]);
            })

            var wh = window_size.h,ww = window_size.w,w,x,y,bh,g = 30,nh = 58,ib = 0;
            
            function bin(menu){
                menu && (o.menu = menu);
                
                $.each(o.menu,function(k,vob){ btn += '<li'+(k == s ? ' class="selected"' : '')+'><h2>'+vob[0]+'</h2><p>'+vob[1]+'</p></li>'; });
                    
                $box = $([
                    '<div id="sl_big_select_box">',
                        '<div class="boxConteiner"><h3><span>',t,'</span></h3>',
                        '<div class="scroll"><ul>',
                            btn,
                        '</ul></div>',
                        '</div>',
                    '</div>'
                ].join(''));
                
                bh = $box.click(function(){ $(this).fadeOut(function(){ $(this).remove() }) }).hide().appendTo('body').fadeIn().find('ul').height();
                
                w = $('.boxConteiner',$box).width();
                w = w < 300 ? 300 : w;
                x = (ww/2) - (w/2);
                
                bh  = bh+g+nh > wh ? wh-g-nh : bh;
                
                $('div.scroll',$box).height(bh);
                
                y = (wh/2)-((bh+nh)/2);
                
                $('.boxConteiner',$box).css({left:x,top:y}).find('.scroll').tinyscrollbar();
                
                btns = $box.find('li');
                
                $.each(o.menu,function(nb,obj){
        			btns.eq(ib++).click(function(){
                        if(o.module) $.sl('load',o.module[0],{mode:(o.module[1] || false),data:{0:nb}},function(data){
                            f && f(nb,data);
                        })
                        else{
                            f && f(nb,obj);
                            obj[2] && obj[2]();
                        } 
        			});
        		});
            }
            
            if(o.load){
                $(this == false ? false : this).sl('load',(typeof o.load == 'object' ? o.load[0] : o.load),{mode:(typeof o.load == 'object' ? o.load[1] : 'content'),dataType:'json',back:false},function(menu){
                    bin(menu);
                })
            }
            else bin();
        },
        /**
         * Small Menu
         */
        menu : function(btn,options) {
            
            var btn = jQuery.extend({}, btn);
            var o = jQuery.extend({
                id: 'sl_menu',
                parent: 'body',
                width: 120,
                offset: 10,
                position: 'auto', // or cursor
                conteiner: document
            }, options);
            
            var ww,wh,r_m = '',mw,mh,l = 0,t = 0,cnt = 0,callb,w,h,_this = this;
            
            o.position == 'cursor' ? (p = {left:cursor_point.x,top:cursor_point.y},w = 0,h = 0) : (p = $(this).offset(),w = $(this).outerWidth(),h = $(this).outerHeight());
            
            ww = $(o.conteiner).width();
            wh = $(o.conteiner).height();
            
            $.each(btn,function(k,v){
                r_m = r_m + '<li'+(typeof v == 'string' ? ' onclick="'+v+'"' : '')+'>'+k+'</li>',cnt += 1;
            })
            
            if(cnt == 0) return this;
            
            if($('#'+o.id).length) $('#'+o.id).fadeOut(function(){ $(this).remove() });
            
            $men = $([
                '<div id="',o.id,'"',(o.zIndex ? ' style="z-index: ' + o.zIndex + '"' : ''),'>',
                    '<div class="m_con" style="width: ',o.width,'px;">',
                        '<ul>',
                            ,r_m,
                        '</ul>',
                        '<div class="l"></div>',
                        '<div class="t"></div>',
                        '<div class="r"></div>',
                        '<div class="b"></div>',
                    '</div>',
                '</div>'
            ].join(''));
            
            $men.hide().appendTo(o.parent).fadeIn();
            
            callb = $('ul li',$men),cnt = 0;
            
            $.each(btn,function(c,v){
                if(typeof v == 'function'){
                    callb.eq(cnt++).click(function(){
                        v && v.apply(_this);
        				return false;
        			});
                }
                else cnt++;
            });
            
            mw = $men.width();
            mh = $men.height();
            
            l = o.position == 'cursor' ? p.left : p.left + (w/2) - (mw/2);
            
            if(p.top + (h/2) + (mh/2) > wh){
                t  = p.top - mh - o.offset,show  = 'b';
                l  = p.left - mw/2;
            }
            else if(p.top + (h/2) - (mh/2) < 0){
                t = p.top + h + o.offset,show  = 't';
                l = p.left - mw/2;
            }
            else{
                if(p.left + w + o.width + o.offset > ww) l = p.left - mw - o.offset,show  = 'r';
                else l = p.left + w + o.offset,show  = 'l';
                t  = p.top + (h/2) - (mh/2);
            }
            
            $men.css({left:l,top:t}).find('.'+show).show();
            
            !$(document).data('menu') && $(document).on('mousedown',function(){ $men.fadeOut(function(){ $(this).remove(); }); }).data('menu',true);
            
            return this;
        },
        /**
         * Tip
         */
        tip : function(options) {
            
            if(this == false)  return;
            
            var on = o = jQuery.extend({
                offset: 10,
                s: false
            }, options);
            
            if(!$(document).data('tip')){
                
                $tip = $([
                    '<div id="tip">',
                        '<div class="m_con">',
                            '<div id="tip_con"></div>',
                            '<div class="l"></div>',
                            '<div class="t"></div>',
                            '<div class="r"></div>',
                            '<div class="b"></div>',
                        '</div>',
                    '</div>'
                ].join(''));
                
                $tip.hide().appendTo('body');
            
                $(this).live('mouseover mouseout',function(event){
                    event.type == 'mouseover' ? (on.s = 'show',$(this).sl('tip',on)) : (on.s = 'hide',$(this).sl('tip',on));
                });
                
                $(document).data('tip',true);
            }
            
            if(!o.s)  return false;
            
            var ww,wh,r_d = '',mw,mh,l = 0,t = 0,$tip = $('#tip'),p,show;
            
            if(o.s == 'hide') { $tip.stop().fadeOut(100); return false; }
            
            p = $(this).offset(),w = $(this).outerWidth(),h = $(this).outerHeight();
                
            ww = $(document).width();
            wh = $(document).height();
            
            $('#tip_con').html($(this).attr('tip')),$tip.find('.l,.t,.r,.b').hide();
            
            mw = $tip.width();
            mh = $tip.height();
            
            l = p.left + (w/2) - (mw/2);
            t  = p.top - mh - o.offset;
            
            if(p.top - (mh/2) - o.offset < 0){
                t = p.top + h + o.offset,show  = 't';
            }
            else{
                if(p.left + w + mw + o.offset > ww) l = p.left - mw - o.offset,show  = 'r',t = p.top + (h/2) - (mh/2);
                else if(p.left + (w/2) - w + o.offset < 0) l = p.left + w + o.offset,show  = 'l',t = p.top + (h/2) - (mh/2);
                else show  = 'b';
            }
            
            o.s == 'show' ? $tip.stop().css({left:l,top:t-1,opacity:1}).fadeIn(100).find('.'+show).show() : $tip.stop().fadeOut(100);
            
            return this;
        },
        /**
         * Top Panel
         */
        top_panel: function(options){
            var o = jQuery.extend({
                id: 'top_panel',
                login: "korner", 
                fun: false,
                logout: false
            }, options);
            
            $tpm = $([
                '<div id="',o.id,'">',
                    '<div class="fn_panel"></div>',
                    '<div class="fn_window"><ul id="all_window_load"></ul></div>',
                    '<div class="fn_logout" onclick="',o.logout,'"></div>',
                    '<div class="fn_login">',o.login,'</div>',
                '</div>'
            ].join(''));  
            
            $('body #'+o.id).length && $('body #'+o.id).remove();
            
            $tpm.find('.fn_panel').on('click',function(){
                if(o.fun) o.fun();
                else $.sl('shell',{name: 'admin_menu'})
            }) 
            
            $tpm.find('.fn_login').on('click',function(){
                if(o.login) o.login();
                else $.sl('load','/ajax/auth/logout',function(){ window.location = document.URL })
            })
                 
            $tpm.css({top:0,opacity: 1}).appendTo(this == false ? 'body' : this)
            
            $(document).data('top_menu',$tpm.height());
            
            return this;
        },
        /**
         * Preload
         */
        preload: function(){
            if(this == false) return false;
            
            var img = $(this).find('img'),
                src = '',i;
            
            var sec = function(_this){
                $(_this).delay(500).animate({opacity:1},function(){
                    $(this).unwrap();
                })
            }
            
            var onl = function(_this,src){
                i = new Image(); 
                i.onload = function(){
                    sec(_this);
                }
                i.onerror = function(){
                    sec(_this);
                }
                i.src = src; 
            }
            
            $.each(img,function(){
                src = $(this).attr('src');
                
                $(this).wrap('<div class="load_img"/>').css({opacity:0});
                
                if(src) onl($(this),src);
                else sec($(this));
                
            })
        }
        ,
        /**
         * Window
         */
        window: function(options,fn_call){
            var o = jQuery.extend({
                w: 300,
                h: 140,
                name: 'default',
                status: 'none',
                panel_height: 32,
                title: 'Window',
                resize: false,
                containment: '#wrap',
                drag: false,
                data: '',
                size: false,
                btn: {},
                autoclose: true,
                bg: true,
                error: false,
                preload: true,
                scroll:0
            }, options);
            
            var win_all = '.sl_window,.shell_window',w_s = $('#'+o.name),ww2,wh2,cor = [100,70],pf,slaw,wt = 0,ws = 0,btn = '',ib = 0,dn,
                w2 = window_size.w/2,
                h2 = window_size.h/2,
                scTp = $(document).scrollTop(),
                sSi = o.status,
                me = ['none','show','hide','show_hide','close','backsize','fullsize','resize','index','data'];
                //     0      1      2      3           4       5          6          7        8       9
            
            o.w = o.w < 100 ? 100 : o.w > window_size.w ? window_size.w : o.w;
            o.h = o.h < 60 ? 60 : o.h > window_size.h ? window_size.h : o.h;
            
            o.status = $.inArray(o.status, me), o.status > 0 ? o.status = me[o.status] : o.status = me[0];
            
            w_s.length && (wt = 1);
            wt && w_s.is(':visible') && (ws = 1)
            
            if(!wt && o.status == 'close'){
                fn_call && fn_call(o.status);
                return;
            } 
            
            !wt && (o.status = me[0]);
            
            if(wt && o.status == me[9]){
                w_s.find('.win_data .overview').html(o.data);
                w_s.find('.scrollbarInit').tinyscrollbar_update(o.scroll == 0 ? 'relative' : o.scroll == 1 ? 'top' : 'bottom');
                o.preload && $(w_s).find('.win_data').sl('preload');
                fn_call && fn_call(o.status);
                return this == false ? false : this;
            } 
            
            wt && ws && !w_s.hasClass('window_stack') && (o.status == me[3] || o.status == me[1] || o.status == me[2]) && (o.status = me[8]);
            
            o.status == me[3] && ( o.status = ws ? o.status = me[2] : o.status = me[1] );
            
            wt && o.status == me[0] && ( o.status = me[1] );
            
            dn = wt ? w_s.data('name') : o.name;
            
            o.status !==  me[0] ? (o.w = w_s.data('size').width,o.h = w_s.data('size').height) : o.status ;
            
            o.status ==  me[7] && (w_s.hasClass(me[6]) ? o.status = me[5] : o.status = me[6]);
            o.status ==  me[1] && (w_s.hasClass(me[6]) ? o.status = me[6] : o.status = me[5]);

            ww2 = o.w / 2;
            wh2 = o.h / 2;
            
            o.status ==  me[8] && w_a_h();
            
            pf = {
                wm:o.w-cor[0],
                hm:o.h-cor[1],
                cw: (cor[0] / 2),
                ch: (cor[1] / 2),
            }
            
            cssStart = {
                width:pf.wm,
                height:pf.hm,
                left:w2-ww2+pf.cw,
                top:h2-wh2+pf.ch+scTp,
                opacity:0
            }
                
            function w_a(obj){
                if(sSi == me[6]){
                    obj.css(cssStart);
                    w_fullSize(true);
                    return;
                }
                obj.css(cssStart).animate({
                    width:o.w,
                    height:o.h,
                    left:w2-ww2,
                    top:h2-wh2+scTp,
                    opacity:1
                },300,function(){
                    w_s_c(obj,o.h);
                    obj.find('.scrollbarInit').tinyscrollbar();
                    fn_call && fn_call(o.status);
                });
            }
            
            function w_s_c(obj,h,callback){
                obj.show().find('.win_h_size').css({height:h-o.panel_height});
                obj.find('.win_conteiner').fadeIn(100,function(){
                    Cufon.replace(".smooth");
                    callback && callback();
                });
                
                $.each($('.win_h_size,.win_h_size_shell',obj),function(){
                    if($(this).attr('minus')) $(this).height($(this).height() - $(this).attr('minus'));
                })
            }
            
            function i_s(obj){
                $.each($('.win_h_size,.win_h_size_shell',obj),function(){
                    if($(this).attr('minus')) $(this).height($(this).height() - $(this).attr('minus'));
                })
            }
            
            function w_h_c(obj,callback){
                obj.show().find('.win_conteiner').fadeOut(100,function(){
                    callback && callback();
                });
            }
            function w_a_h(hi){
                $.sl('win_tab',dn,{prefix:'win',title:o.title,status:(hi && 'hide'),select:'#'+dn,fun:'$.sl(\'window\',{status:\'show_hide\',name:\''+dn+'\'})'});
            }
            function w_h_s(obj,h){
                obj.find('.win_h_size').css({height:h-o.panel_height});
            }
            function w_fullSize(is_new){
                ifmenu = $(document).data('top_menu') || false;
                
                w_h_c(w_s,function(){
                    w_s.resizable("disable").animate({
                        width:window_size.w,
                        height:ifmenu ? window_size.h - ifmenu : window_size.h,
                        left:0,
                        top:ifmenu ? ifmenu : 0,
                        opacity:1
                    },300,function(){
                        w_s.removeClass('border glow');
                        w_s_c(w_s,ifmenu ? window_size.h - ifmenu : window_size.h);
                        is_new ? w_s.find('.scrollbarInit').tinyscrollbar() : w_s.find('.scrollbarInit').tinyscrollbar_update('relative');
                        fn_call && fn_call(o.status);
                    }).addClass(o.status);
                });
                w_s.data('size',{width:o.w,height:o.h});
                is_new && w_s.addClass('fullsize');
            }
            
            function w_backsize(){
                $('.w_b_win_'+dn).fadeIn();
                
                w_h_c(w_s,function(){
                    w_s.resizable("enable").addClass('border glow').animate({
                        width:o.w,
                        height:o.h,
                        left:w_s.data('position').left || w2 - ww2,
                        top:w_s.data('position').top || h2 - wh2,
                        opacity:1
                    },300,function(){
                        w_s_c(w_s,o.h),w_a_h();
                        w_s.find('.scrollbarInit').tinyscrollbar_update('relative');
                        fn_call && fn_call(o.status);
                    }).removeClass(me[6]);
                })
            }
            
            if(!w_s.length){
                
                o.btn[lang[3]] = function(){
                    fn_call && fn_call('close');
                    $.sl('window',{status:'close',name:dn})
                }
                
                $.each(o.btn,function(name,fn){ btn += '<div class="win_btn">'+name+'</div>' });
    
                $win = $([
                    '<div id="',o.name,'" class="sl_window window_layer',(o.error ? ' window_error' : ''),' glow border">',
                        '<div class="win_conteiner" style="display:none">',
                            '<div class="win_panel">',
                                '<div class="t_p_r t_h_i">',
                                    '<div class="title">',o.title,'</div>',
                                    '<div class="win_buttons">',btn,'</div>',
                                '</div>',
                            '</div>',
                            '<div class="win_h_size">',
                                '<div class="win_data win_h_size scrollbarInit">',(this == false ? o.data : $(this).html()),'</div>',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join(''));
                
                o.containment = $(o.containment).length ? o.containment : 'body';
                
                $win.appendTo(o.containment).data('position',{left:w2-ww2,top:h2-wh2}).data('size',{width:o.w,height:o.h}).data('name',dn);
                
                if(o.size){
                    $('.win_panel',$win).dblclick(function(){
                        if(w_s.hasClass(me[6])) o.status = me[5],w_backsize();
                        else o.status = me[6],w_fullSize();
                    })
                }
                
                if(o.bg) {
                    $bg = $('<div class="win_bg window_layer w_b_win_'+dn+'"></div>').hide().fadeIn(function(){
                        w_a($win);
                    });
                    $('#'+o.name).before($bg);
                }
                
                w_s = $win,w_a_h();
                !o.bg && w_a($win);
                o.preload && $(w_s).find('.win_data').sl('preload');
                
                if(o.drag){
                    $win.draggable({
                        containment: 'parent',
                        opacity:'0.7',
                        handle: '.win_panel',
                        stop: function(event, ui){
                            $(this).data('position',{left:ui.offset.left,top:ui.offset.top});
                        }
                    })
                }
                if(o.resize){
                    $win.resizable({
                        containment: 'parent',
                        minWidth: 100,
                        minHeight: 70,
                        resize: function(event, ui){
                            w_h_s($(this),ui.size.height);
                            $(this).find('.scrollbarInit').tinyscrollbar_update('relative');
                        },
                        stop: function(event, ui){
                            $(this).data('size',{width:ui.size.width,height:ui.size.height});
                        }
                    });
                }
                $win.bind('mousedown',function(){
                    w_a_h();
                });
                
                btns = $win.find('.win_panel .win_btn');

        		$.each(o.btn,function(nb,obj){
        		  
        			btns.eq(ib++).click(function(){
                        obj && obj.apply( this,[dn]);
                        o.autoclose && $.sl('window',{status:'close',name:dn});
        				return false;
        			});
        		});
                
                
            }
            else if(o.status == me[4] || o.status == me[2]){
                
                
                w_h_c(w_s,function(){
                    
                    w_s.animate({
                        width:pf.wm,
                        height:pf.hm,
                        left:w_s.data('position').left + pf.cw,
                        top:w_s.data('position').top + pf.ch + scTp,
                        opacity: 0
                    },300,function(){
                        $('.w_b_win_'+dn).fadeOut(function(){
                            if(o.status == me[4]) $(this).remove();
                        });
                        
                        if(o.status == me[4]){
                            $(this).remove();
                            $.sl('win_tab',dn,{status:'close',prefix:'win'});
                        } 
                        else{
                            $(this).hide();
                            
                            !$(document).data('top_menu') && $.sl('top_panel');
                            
                            w_a_h(true);
                        }
                        
                        fn_call && fn_call(o.status);
                    });
                })
            }
            else if(o.status == me[5]){
                
                w_backsize();
            }
            else if(o.status == me[6]){
                w_fullSize();
            }
            

        },
        /**
         * Info
         */
        info : function(string) {
            
            if(!$('#sl_info').length){
                var $info = $([
                    '<div id="sl_info" onclick="$(this).fadeOut()">',
                        '<div class="info_bg"></div>',
                        '<div class="info_text"><div></div></div>',
                    '</div>'
        	    ].join(''));
        
                $info.hide().appendTo('body');
            }
            else $info = $('#sl_info');
    
    
            function sh(){
                $info.fadeIn(300).find('.info_bg').hide().css({opacity:1}).delay(300).fadeIn(300).animate({opacity:0.5},400);
                $info.find('.info_text > div').hide().delay(400).fadeIn(100).html(string);
            }
            
            function sr(){
                $info.find('.info_bg').animate({opacity:1},200).animate({opacity:0.5},400);
                $info.find('.info_text > div').html(string);
            }
            
            $info.is(':visible') ? sr() : sh();
        },
        /**
         * Win Tab
         */
        win_tab: function(name,options){
            var o = $.extend({
                status: 'active',
                addclass: '',
                fun: '',
                prefix: 'win',
                title: 'window',
                select: '.win_default',
                ico: false
            }, options);
            
            var m_o = {
                awc: '#all_window_load',
                cn: 'active',
                alw: '.window_layer',
                ws: 'window_stack'
            };
            var slaw = $(m_o.awc);
            
            if(name == 'hide_all'){
                slaw.find('li').removeClass('active');
            }
            else if(name == 'last'){
                eval(slaw.find('li:last').addClass('active').attr('onclick'));
            }
            else if(o.status == 'active' || o.status == 'hide'){
                slaw.length && slaw.find('li').removeClass(m_o.cn).closest('ul').find('li[name='+o.prefix+'_'+name+']').addClass(o.status == 'active' &&  m_o.cn);

                !slaw.find('li[name='+o.prefix+'_'+name+']').length && $('<li name="'+o.prefix+'_'+name+'" class="active '+o.addclass+'" onclick="'+o.fun+'"><span>'+(o.ico ? '<img src="'+o.ico+'" />' : '')+o.title+'</span></li>').appendTo(slaw);
                
                if(o.status == 'active'){
                    $(m_o.alw).removeClass(m_o.ws);
                    $(o.select).addClass(m_o.ws);
                    $('.w_b_'+o.prefix+'_'+name).addClass(m_o.ws);
                }
            }
            else if(o.status == 'close'){
                slaw.find('li[name='+o.prefix+'_'+name+']').css({width:0});
                setTimeout(function(){
                    slaw.find('li[name='+o.prefix+'_'+name+']').remove();
                },500)
            } 
        },
        /**
         * Shell
         */
        shell: function(fn,op,st){
            var o = {
                name: 'default',
                title: lang[1],
                add_param: '',
                post: false,
                method: false
            },f = function(){};
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (st =  is[n]);
            })
            
            var elem = $('#shell_'+o.name),
                sh = false,
                im,dn,ws,css;
                
            elem.length && (sh = elem);
            
            sh && sh.is(':visible') && (ws = 1);
            
            st == 'hide_all' || st == 'hide_all_not' && $.sl('win_tab','hide_all');
                
            if(st == 'hide_all'){
                $('.shell_window').hide(),f();
                return;
            }
            
            if(st == 'hide_all_not'){
                $('.shell_window').not(sh).hide();
                $.sl('shell',{name:o.name},function(){
                    f();
                });
                return;
            }
            
            im = $(document).data('top_menu') || false;
            dn = sh ? sh.data('name') : o.name;
            
            function w_a_h(hi,ico){
                $.sl('win_tab',dn,{prefix:'shell',status:(hi && 'hide'),title:dn,select:'#shell_'+dn,addclass:'shell',fun:'$.sl(\'shell\',\'hide_all_not\',{name:\''+dn+'\'})',ico:ico});
            }
            
            function l_c(elem,obj){
                var dt = elem.data('jn')['shell'] || 'show';
                    dt = o.method ? o.method : dt;
                if(obj) $(obj).sl('load','/ajax/'+o.name+'/'+dt+'/'+o.add_param,{data:o.post},function(d){
                   elem.find('.win_data').html(d),h_p_l(elem);
                   Cufon.replace(".smooth");
                   f();
                },{back:false,error:function(){
                    $.sl('shell',{name:o.name},'close');
                }});
                else $.sl('load','/ajax/'+o.name+'/'+dt+'/'+o.add_param,{data:o.post},function(d){
                   elem.find('.win_data').html(d),h_p_l(elem);
                   Cufon.replace(".smooth");
                   f();
                },{error:function(){
                    $.sl('shell',{name:o.name},'close');
                }});
            }
            
            function h_p_l(obj){
                i_s(obj);
                var ch_sh = obj.find('.shell_iframe');
                var ch_pr = obj.find('.preload');
                if(ch_sh.length){
                    ch_sh.load(function(){
                        ch_pr.fadeOut(300);
                    })
                }
                else{
                    obj.find('.win_data').removeClass('scrollbarContent').tinyscrollbar().sl('preload');
                    obj.find('.scrollbarInit').tinyscrollbar();
                    ch_pr.fadeOut(300);
                }
            }
            
            function i_s(obj){
                
                obj.find('.win_data,.win_h_size,.shell_iframe').css({
                    width:window_size.w,
                    height:(im ? window_size.h - im : window_size.h) - $('.shell_menu',obj).height()
                });
                
                obj.find('.win_h_size_shell').height((im ? window_size.h - im : window_size.h) - $('.shell_menu',obj).height());
                
                $.each($('.win_h_size,.win_h_size_shell',obj),function(){
                    if($(this).attr('minus')) $(this).height($(this).height() - $(this).attr('minus'));
                })
            }
            
            if(!sh){
                $.sl('load','/ajax/fn/infomod/'+o.name,{dataType:'json'},function(nq){
                    
                    $sh = $([
                        '<div id="shell_',dn,'" class="shell_window window_layer window_stack">',
                            '<div class="win_h_size">',
                                '<div class="win_data win_h_size scrollbarInit ',(nq.style == 'aero' ? 'aero_style_bg' : ''),'"></div>',
                            '</div>',
                            '<div class="preload ',(nq.style == 'aero' ? 'aero_preload' : ''),'"></div>',
                            '<div class="shell_menu ',(nq.style == 'aero' ? 'aero_style_top aero_shadow' : ''),'">',
                                '<div class="pad"><div class="t_left"><span class="bold">',o.name,'</span> - <span class="title">',nq.title,'</span><br /><span>'+nq.style+'</span></div>',
                                '<div class="t_right"><div class="btn" onclick="$(this).sl(\'shell\',{name:\'',o.name,'\'},\'update\')">',lang[2],'</div><div class="btn" onclick="$.sl(\'shell\',{name:\'',o.name,'\'},\'close\')">',lang[3],'</div></div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join(''));
                    
                    nq['shell'] = o.action && o.action !== '' ? o.action : nq['shell'];
                    nq['ico_img'] = nq['ico_img'] ? '/modules/'+o.name+'/ico.png' : false;
                    
                    css = {
                        width:window_size.w,
                        height:im ? window_size.h - im : window_size.h,
                        top:im ? im : 0
                    }
                    
                    $sh.hide().appendTo('body').data('name',o.name).data('jn',nq).css(css).fadeIn(300,function(){
                        w_a_h(true,nq['ico_img']);
                    });
                    $sh.find('.preload').css(css).show();
                    
                    $sh.bind('mousedown',function(){
                        w_a_h();
                    });
                    
                    this == false ? l_c($sh) : l_c($sh,this);
                })
                
            }
            else if(st == 'close'){
                sh.fadeOut(300,function(){
                    sh.remove(),$.sl('win_tab',dn,{status:'close',prefix:'shell'}),f();
                })
            }
            else if(st == 'update'){
                sh.find('.preload').fadeIn(200);
                this == false ? l_c(sh) : l_c(sh,this);
            }
            else if(st == 'hide'){
                 sh.fadeOut(),w_a_h(true),f();
            }
            else if(sh && ws && sh.hasClass('window_stack')){
                sh.fadeOut(),w_a_h(true);
            }
            else if(!ws){
                sh.fadeIn(),w_a_h();
            }
            else{
                w_a_h();
            }
        },
        /**
         * Type
         */
        type: function(agrs,tp,call){
            agrs = $.extend({}, agrs);
            
            $.each(agrs,function(k,v){
                typeof v == tp && (call && call(agrs,k));
            })
        },
        /**
         * Count Array
         */
        count: function(array){
            var cnt=0;
        	for (var i in array) { if (i) cnt++ }
        	return cnt;
        }
        ,
        /**
         * Loading
         */
        loading: function(fn,op,st){
            var f=function(){},o,ob,obo = {p:[],w:0,h:0},s = 'show',q = {},c = 0;
            
            this == false ? ob = false : ob = $(this);
            
            o = {
                zIndex: 'auto',
                mode: 'content',
                name: 'default',
                tip: lang[1]
            };
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (s =  is[n]);
            })
            
            function _lc(){
                
                var elem = $('#lc_'+o.name);
                
                ob && (obo.p = ob.offset(),obo.w = ob.outerWidth(),obo.h = ob.outerHeight());
                
                if(s == 'show' && ob && elem.length) elem.hide().css({left:obo.p.left,top:obo.p.top,width:obo.w,height:obo.h}).fadeIn(function(){
                        f();
                    });
                else if(ob && !elem.length && s == 'show') $('<div class="sl_loading_content" id="lc_'+o.name+'"></div>').hide().css({left:obo.p.left,top:obo.p.top,width:obo.w,height:obo.h}).appendTo('body').fadeIn(function(){
                        f();
                    });
                else if(elem.length) elem.fadeOut(function(){ $(this).remove(),f() });
                else f();
            }

            function _lq(){
                var dg = $(document).data('loading');
                
                dg && (c = $.sl('count',dg.q));
                
                var elem = $('.sl_loading_quiet');
                
                if(!elem.length && s == 'show') $('<div class="sl_loading_quiet">1</div>').hide().appendTo('body').fadeIn(function(){
                        q[o.name]=1,$(document).data('loading',{q:q}),f();
                    });
                else if(elem.is(':visible') && s == 'show') !dg.q[o.name] && (dg.q[o.name] = 1,elem.text(c+1),f());
                else if(elem.is(':hidden') && s == 'show') elem.fadeIn(function(){ f() });
                else if(s == 'hide'){
                    delete dg.q[o.name];
                    c < 2 ? elem.fadeOut().text(1) :  elem.text(c-1);
                } 
            }
            
            function _ls(){
                var elem = $('.sl_loading_show');
                
                if(!elem.length && s == 'show') $('<div class="sl_loading_show"></div>').hide().appendTo('body').fadeIn(function(){
                        f();
                    });
                else if(s == 'hide') elem.fadeOut(function(){ $(this).remove(),f() });
            }
            
            function _ly(){
                if(s == 'show') $('body').addClass('sl_loading_cursor'),f();
                else if(s == 'hide') $('body').removeClass('sl_loading_cursor'),f();
            }
            
            function _lp(){
                
                var elem = $('#lp_'+o.name);
                
                if(s == 'show' && elem.length) elem.hide().css({left:cursor_point.x,top:cursor_point.y}).fadeIn(function(){
                        f();
                    });
                else if(!elem.length && s == 'show') $('<div class="sl_loading_point" id="lp_'+o.name+'"></div>').hide().css({left:cursor_point.x,top:cursor_point.y}).appendTo('body').fadeIn(function(){
                        f();
                    });
                else if(elem.length) elem.fadeOut(function(){ $(this).remove(),f() });
                else f();
            }
            
            o.mode == 'content' ? _lc() : o.mode == 'quiet' ? _lq() : o.mode == 'show' ? _ls() : o.mode == 'cursor' ? _ly() : o.mode == 'point' ? _lp() : f();
            
        },
        /**
         * Operator
         */
        operator: function(data,callback,status,error,ignore){
            if(ignore){
                callback && callback(); return;
            }
            
            var r = '',e,i = 0,h,mas;
            
            function strpos( haystack, needle){
                if(typeof haystack == 'object') return false;
            	return haystack.indexOf( needle ) >= 0 ? true : false;
            }
            
            mas = ['Parse error:','Fatal error:','Warning:','Catchable fatal error:'];
            
            $.each(mas,function(fi,vi){
                if(strpos(data, vi)){
                    var hj = data.match(new RegExp(vi+'(.*?)\n','ig'));
                    
                    if(hj){
                        $.each(hj,function(k,v){
                            r += v+'<div class="t_sep"></div>',i++;
                        })
                    }
                }
            })
            
            r !== '' && ($.sl('window',{name:'error',error:1,title:lang[4],w:400,data:'<div class="t_p_10">'+r+lang[5]+': <b>'+i+'</b></div>'}),e = 1,error && error());
            
            if(strpos(data, '{"error":') && !e){
        
                e = data.match(/\{"error":(.*?)\}\n/g)[0];
                e = JSON.parse(e).error;
                e && ($.sl('info',e),h=1);
                error && error();
            }
            
            callback && status && !e && callback();
            callback && status && !e && h && callback();
        },
        /**
         * Load
         */
        load: function(url,fn,op,st){
            var f = function(){},o,ob,hash,dt;
            
            this == false ? ob = false : ob = $(this);
            
            o = {
                type: 'POST',
                data: ob ? (ob.closest('form').length ? ob.closest('form').serializeArray() : {}): {}, 
                done: function(){},
                mode: 'content',
                back: true,
                win: false,
                form: false,
                shell: false,
                error: function(){},
                ignore: false
            };
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (o.mode =  is[n]);
            })
            
            !ob.length && (o.mode == 'content' || !o.mode) && (o.mode = 'quiet');
            
            hash = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
            
            dt = {name:hash,mode:o.mode,tip:lang[6]+': '+url};
            
            function _getload(){
                $.ajax({
                    type: o.type,
                    url: url,
                    data: o.data,
                    complete:function(){
                        $.sl('loading','hide',dt);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        !o.ignore && $.sl('info',lang[7]+': [Page: <b>'+url+'</b> ] [Error: <b>'+errorThrown+'</b> ]');
                         o.error && o.error();
                    },
                    dataType: o.dataType ? o.dataType : 'html',
                    timeout: o.timeout ? o.timeout * 1000 : false
                }).done(function( d ) {
                    $.sl('operator',d,function(){
                        o.done && o.done(d);
                        ob && o.back && ob.html(d);
                        f && f.apply( ob,[d]);
                        o.win && $.sl('window',$.extend({status:'data',data:d},o.win));
                        o.shell && $.sl('shell',o.shell);
                    },true,function(){
                        o.error && o.error();
                    },o.ignore);
                    
                });
            }
            
            ob ? $(this).sl('loading',dt,function(){ _getload() }) : $.sl('loading',dt,function(){ _getload() });
        },
        /**
         * _PROMT
         */
        _promt: function(options){
            var o = $.extend({
                w: 400,
                h: 60,
                name: 'promt_'+Math.floor(Math.random() * (999 - 100 + 1)) + 100,
                btn: {},
                input: [],
                module: false,
                load: false
            }, options),nbtn = {},data = '',i=0,_this = this,dt;
            
            function bin(inp){
                o.input = inp ? inp : o.input;
                if(inp) o.btn[lang[0]] = function(){}
                inp && (o.autoclose = false);
                
                $.each(o.btn,function(name,fn){
                    nbtn[name] = function(wn){
                        dt = $('#form_'+o.name).serializeArray();
                        
                        if(o.module) $(this).sl('load',o.module[0],{data:dt,mode:(o.module[1] || 'content'),back:false},function(result){
                            
                            $.sl('window',{name:wn,status:'close'},function(){
                                o.module[2] && o.module[2].apply( _this,[dt,result]);
                                fn && fn.apply( _this,[wn,dt,result]);
                            });
                            
                        })
                        else fn && fn.apply( this,[wn,dt]);
                    }
                })
                
                $.each(o.input,function(h,q){
                    q['name'] = (q.name || h);
                    data = data +  $.scin('input',q);
                    i++;
                })
                
                o.data = '<form id="form_'+o.name+'" class="t_p_10" method="POST" action="javascript:this.preventDefault()">'+data+'</form>';
                o.btn = nbtn;
                o.h = o.h + ((i > 5 ? 5 : i) * 29);
                $.sl('window',o)
            }
            
            if(o.load){
                $(this == false ? false : this).sl('load',(typeof o.load == 'object' ? o.load[0] : o.load),{mode:(typeof o.load == 'object' ? o.load[1] : 'content'),dataType:'json',back:false},function(inp){
                    bin(inp);
                })
            }
            else bin();
        },
        /**
         * _AREA
         */
        _area: function(options){
            var o = $.extend({
                w: 500,
                h: 300,
                name: 'area_'+Math.floor(Math.random() * (999 - 100 + 1)) + 100,
                btn: {},
                module: false,
                area_name: 'area'
            }, options),nbtn = {},data = '',i=0,_this = this,dt;
            
            $.each(o.btn,function(name,fn){
                nbtn[name] = function(wn){
                    dt = $('#form_'+o.name).serializeArray();
                    
                    if(o.module) $(this).sl('load',o.module[0],{data:dt,mode:(o.module[1] || 'content'),back:false},function(result){
                        $.sl('window',{name:wn,status:'close'},function(){
                            o.module[2] && o.module[2].apply( _this,[dt,result]);
                            fn && fn.apply( _this,[wn,dt,result]);
                        });
                    })
                    else fn && fn.apply( this,[wn,dt]);
                }
            })
            
            function _show_area(ov){
                data = $.scin('textarea',{name:o.area_name,value:(ov || ''),check:(o.check || false),attr:{style:'margin:0'}});
            
                o.data = '<form id="form_'+o.name+'" class="win_h_size" method="POST" action="javascript:this.preventDefault()">'+data+'</form>';
                o.btn = nbtn;
                $.sl('window',o)
            }
            
            if(typeof o.value === 'object') $(this == false ? false : this).sl('load',o.value[0],{mode:o.value[1],back:false},function(data){ _show_area(data) });
            else _show_area(o.value);
        },
        /**
         * _CONFIRM
         */
        _confirm: function(fn,op,st){            
            var o = {
                w: 400,
                h: 100,
                name: 'confirm_'+Math.floor(Math.random() * (999 - 100 + 1)) + 100,
                btn: {},
                info: ''
            },nbtn = {},f,data = '',i=0;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (o.info =  is[n]);
            })
            
            if($.sl('count',o.btn) >= 0 && f) o.btn[lang[8]] = f;
            
            $.each(o.btn,function(name,fn){
                nbtn[name] = function(wn){
                    fn && fn.apply( this,[wn]);
                }
            })
            
            o.data = '<div class="t_p_10">'+o.info+'</div>';
            o.btn = nbtn;
            $.sl('window',o)
        },
        /**
         * _Table delete tr
         */
        _tbl_del_tr: function(op){
            if(this == false) return;
            
            var _this = $(this),
                parent = $(this).closest('tr'),
                scroll_p = $(this).closest('.scrollbarInit');
            
            function bi(data,c){
                parent.fadeOut(function(){
                    $(this).remove();
                    scroll_p.length && scroll_p.tinyscrollbar_update('bottom');
                    $.sl('sort_table');
                    c && c();
                })
            }
            
            if(typeof op === 'object'){
                $(this == false ? false : this).sl('load',op[0],function(data){
                    bi(data,function(){
                        op[2] && op[2]();
                    });
                },{mode:(op[1]||'content'),back:false});
            }
            else if(op) window[op](function(data,callback){
                bi(data,function(){
                    callback && callback();
                })
            });
            else bi();
        },
        /**
         * _DEL_CONFIRM
         */
        _del_confirm: function(fn,op,st){
            var o = {
                w: 400,
                h: 70,
                name: 'del_confirm_'+Math.floor(Math.random() * (999 - 100 + 1)) + 100,
                btn: {},
                info: lang[9]+'?',
                module: false,
                title: lang[10],
                autoclose: false
            },nbtn = {},data = '',_this = this;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (o.module =  is[n]);
            })
            
            if(!o.module) $.sl('info',lang[11]);
            
            o.btn[lang[8]] = function(wn){
                if(o.module){
                    $(this).sl('load',(typeof o.module == 'object' ? o.module[0] : o.module),{mode:(typeof o.module == 'object' ? o.module[1] : 'content'),back:false},function(data){
                        $.sl('window',{name:wn,status:'close'},function(){
                            f && f.apply( _this,[data]);
                        });
                    })
                }
                else f && f.apply( _this);
            }
            
            $.each(o.btn,function(name,fn){
                nbtn[name] = function(wn){
                    fn && fn.apply( this,[wn]);
                }
            })
            
            o.data = '<div class="t_p_10">'+o.info+'</div>';
            o.btn = nbtn;
            $.sl('window',o)
        },
        /**
         * _WINDOW_SETTING
         */
        _window_setting: function(fn,op,st){
            var o = {
                name: 'window_setting_'+Math.floor(Math.random() * (999 - 100 + 1)) + 100,
                btn: {},
                module: [],
                load: [],
                data: '',
                autoclose: false
            },_this = this;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (o.module =  is[n]);
            })
            
            o.btn[lang[0]] = function(){
                $.sl('load',o.module[0],{mode:o.module[1],data:$('form#form_'+o.name).serializeArray()},function(re){
                    o.module[2] && o.module[2](re);
                    $.sl('window',{name:o.name,status:'close'});
                })
            }
            
            $.sl('load',o.load[0],{mod:o.load[1]},function(data){
                o.data = '<form id="form_'+o.name+'">'+data+'</form>';
                
                $.sl('window',o);
            })
        },
        /**
         * _WINDOW_SETTING
         */
        install: function(fn,op,st){
            var o = {},f,s,css,_this = this;
            
            $.sl('type',[fn,op,st],'object',function(is,n){
                o = $.extend(o, is[n]);
            })
            
            $.sl('type',[fn,op,st],'function',function(is,n){
                f = is[n];
            })
            
            $.sl('type',[fn,op,st],'string',function(is,n){
                is[n] !== '' && (s =  is[n]);
            })
            
            $ins = $(['<div class="sl_install"><div class="t_p_r"><div class="loa"></div></div></div>'].join(''));
            
            function hiins(cl){
                $ins.fadeOut(300,function(){
                    $ins.remove();
                    cl && cl();
                })
            }
            
            $ins.hide().appendTo('body').fadeIn(300,function(){
                if(s){
                    $.sl('load',s,{mode:'hide',data:o,dataType:'json',error:function(){
                        hiins();
                    }},function(data){
                        hiins(function(){
                            f && f(data);
                        });
                    })
                    
                }
                else if(f){
                    f(function(){
                        hiins();
                    })
                }
                else hiins();
            });
        }
    };
    
    $.fn.sl = function( method ) {
    
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          return methods.init.apply( this );
        }   
    
    };
    
    $.sl = function( method ) {
    
        if ( methods[method] ) {
          return methods[ method ].apply( false,Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( false, arguments );
        } else {
          return methods.init();
        }   
    
    };
  

})(jQuery);

$(document).ready(function(){
    $.sl();
})