/*!
 * Tiny Scrollbar 1.66
 * http://www.baijs.nl/tinyscrollbar/
 *
 * Copyright 2010, Maarten Baijs
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * Date: 13 / 11 / 2011
 * Depends on library: jQuery
 * 
 * Мodified Korner
 */

(function($){
	$.tiny = $.tiny || { };
	
    var winSize = [
        $(window).width(),
        $(window).height()
    ];
    
	$.tiny.scrollbar = {
		options: {	
			axis: 'y', // vertical or horizontal scrollbar? ( x || y ).
			wheel: 40,  //how many pixels must the mouswheel scroll at a time.
			scroll: true, //enable or disable the mousewheel;
			size: 'auto', //set the size of the scrollbar to auto or a fixed number.
			sizethumb: 'auto' //set the size of the thumb to auto or a fixed number.
		}
	};
	
	$.fn.tinyscrollbar = function(options) {
        init.apply(this,[options]); return this;
	};
	$.fn.tinyscrollbar_update = function(sScroll) {
	   init.apply(this,[{},sScroll]); return this;
    };
    $.fn.tinyscrollbar_remove = function() {
       this.each(function(){ $(this).removeClass('scrollbarContent').removeData()}); return this;
    };
	
    function init(options,sScroll){
        var options = $.extend({}, $.tiny.scrollbar.options, options),
            viewport = '.viewport:eq(0)',
            overview = '.overview:eq(0)';
        
        $(this).each(function(){
            var _this = $(this);
            
            !_this.hasClass('scrollbarContent') && _this.addClass('scrollbarContent').wrapInner('<div class="viewport"><div class="overview">').append('<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>');
            
            if(_this.is(':visible')){
                $(viewport,_this).height(_this.outerHeight(true));
                $(overview+','+viewport,_this).width(_this.outerWidth(true));
            } 
            
            if(_this.data('tsb')){
                var isHide = _this.is(':hidden') ? 1 : 0;
                
                if(isHide){
                    sScroll = 'relative';
                    $(viewport,_this).height(_this.outerHeight(true)).unbind('mouseenter').bind('mouseenter',function(){
                        _this.data('tsb').update(sScroll);
                        $(this).unbind('mouseenter');
                    });
                }
                _this.data('tsb').update(sScroll,isHide);
            } 
            else _this.data('tsb', new Scrollbar(_this, options));
        });
    }
    
        
	function Scrollbar(root, options){
		var oSelf = this;
		var oWrapper = root;
		var NameVar,oViewport,oContent,oScrollbar,oTrack,oThumb;
		var sAxis = options.axis == 'x', sDirection = sAxis ? 'left' : 'top', sSize = sAxis ? 'Width' : 'Height';
		var iScroll, iPosition = { start: 0, now: 0 }, iMouse = {};

		function initialize() {
			oSelf.update();
			setEvents();
			return oSelf;
		}
        function initVar(){
            oViewport = { obj: $('.viewport', root) };
    		oContent = { obj: $('.overview', root) };
    		oScrollbar = { obj: $('.scrollbar', root) };
    		oTrack = { obj: $('.track', oScrollbar.obj) };
    		oThumb = { obj: $('.thumb', oScrollbar.obj) };
        }
        
		this.update = function(sScroll,isHide){
            initVar();
            
            oViewport[options.axis] = sAxis ? $('.viewport', root).width() : $('.viewport', root).height();
            
            oContent[options.axis] = isHide ? $('.overview', root).data('h')[options.axis] : (sAxis ? $('.overview', root).width() : $('.overview', root).height());
            
            !isHide && $('.overview', root).data('h',{x:$('.overview', root).outerWidth(true),y:$('.overview', root).outerHeight(true)});
            
			oContent.ratio = oViewport[options.axis] / oContent[options.axis];
            
			oScrollbar.obj.toggleClass('disable', oContent.ratio >= 1);
			oTrack[options.axis] = options.size == 'auto' ? oViewport[options.axis] : options.size;
			oThumb[options.axis] = Math.min(oTrack[options.axis], Math.max(0, ( options.sizethumb == 'auto' ? (oTrack[options.axis] * oContent.ratio) : options.sizethumb )));
			oScrollbar.ratio = options.sizethumb == 'auto' ? (oContent[options.axis] / oTrack[options.axis]) : (oContent[options.axis] - oViewport[options.axis]) / (oTrack[options.axis] - oThumb[options.axis]);
            
			iScroll = (sScroll == 'relative' && oContent.ratio <= 1) ? Math.min((oContent[options.axis] - oViewport[options.axis]), Math.max(0, iScroll)) : 0;
			iScroll = (sScroll == 'bottom' && oContent.ratio <= 1) ? (oContent[options.axis] - oViewport[options.axis]) : isNaN(parseInt(sScroll)) ? iScroll : parseInt(sScroll);
			setSize();
		};
		function setSize(){
			oThumb.obj.css(sDirection, iScroll / oScrollbar.ratio);
			oContent.obj.css(sDirection, -iScroll);
			iMouse['start'] = oThumb.obj.offset()[sDirection];
			var sCssSize = sSize.toLowerCase(); 
			oScrollbar.obj.css(sCssSize, oTrack[options.axis]);
			oTrack.obj.css(sCssSize, oTrack[options.axis]);
			oThumb.obj.css(sCssSize, oThumb[options.axis]);		
		};		
		function setEvents(){
			oThumb.obj.bind('mousedown', start);
            
			oContent.obj[0].ontouchstart = function(oEvent){
				//oEvent.preventDefault();
				oThumb.obj.unbind('mousedown');
				start(oEvent.touches[0]);
				
			};
            
            
			oTrack.obj.bind('mouseup', drag);
			if(options.scroll && this.addEventListener){
				oWrapper[0].addEventListener('DOMMouseScroll', wheel, false);
				oWrapper[0].addEventListener('mousewheel', wheel, false );
			}
			else if(options.scroll){oWrapper[0].onmousewheel = wheel;}
		};
		function start(oEvent){
			iMouse.start = sAxis ? oEvent.pageX : oEvent.pageY;
			var oThumbDir = parseInt(oThumb.obj.css(sDirection));
			iPosition.start = oThumbDir == 'auto' ? 0 : oThumbDir;
			$(document).bind('mousemove', drag);
            
			oViewport.obj[0].ontouchmove = function(oEvent){
				$(document).unbind('mousemove');
				drag(oEvent.touches[0],true);
			};
            
			$(document).bind('mouseup', end);
			oThumb.obj.bind('mouseup', end);
			oContent.obj[0].ontouchend = document.ontouchend = function(oEvent){
				$(document).unbind('mouseup');
				oThumb.obj.unbind('mouseup');
				end(oEvent.touches[0]);
			};
			return false;
		};		
		function wheel(oEvent){
			if(!(oContent.ratio >= 1)){
				var oEvent = oEvent || window.event;
				var iDelta = oEvent.wheelDelta ? oEvent.wheelDelta/120 : -oEvent.detail/3;
				iScroll -= iDelta * options.wheel;
				iScroll = Math.min((oContent[options.axis] - oViewport[options.axis]), Math.max(0, iScroll));
				oThumb.obj.css(sDirection, iScroll / oScrollbar.ratio);
				oContent.obj.css(sDirection, -iScroll);
				
				oEvent = $.event.fix(oEvent);
				oEvent.preventDefault();
			};
		};
		function end(oEvent){
			$(document).unbind('mousemove', drag);
			$(document).unbind('mouseup', end);
			oThumb.obj.unbind('mouseup', end);
			document.ontouchmove = oThumb.obj[0].ontouchend = document.ontouchend = null;
			return false;
		};
		function drag(oEvent,touch){
			if(!(oContent.ratio >= 1)){
                iPosition.now = Math.min((oTrack[options.axis] - oThumb[options.axis]), Math.max(0, (touch ? (iPosition.start - (((sAxis ? oEvent.pageX : oEvent.pageY) - iMouse.start) / oScrollbar.ratio) ) : (iPosition.start + ((sAxis ? oEvent.pageX : oEvent.pageY) - iMouse.start)) ) ));

				iScroll = iPosition.now * oScrollbar.ratio;
				oContent.obj.css(sDirection, -iScroll);
				oThumb.obj.css(sDirection, iPosition.now);
			}
			return false;
		};
		
		return initialize();
	};
})(jQuery);