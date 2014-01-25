// jQuery Scin Plugin
//
// Version 1.03
//
// Author Korner
// Sl SYSTEM
// 06 June 2012
//
// Visit http://sl-cms.com for more information
//
// Usage: $.scin('method',options)
//
// TERMS OF USE
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2012 Sl SYSTEM, LLC. 
 
(function($){
    
    var methods = {
        init : function() {
            return this;
        },
        /**
         * _INPUT
         */
        input: function(n){
            if(typeof n === 'string') n = {name:n};
            
            if(arguments.length > 1){
                n = {name:n.name,value:arguments[1]};
                if(typeof arguments[2] === 'object') n = $.extend(n,arguments[2]);
            }
            
            n = $.extend({
                name: 'none',
                value: '',
                holder: '',
                type: 'input',
                attr: {}
            }, n),data = '',o = [];
            
            n['attr']['class'] = n['attr']['class'] ? n['attr']['class']+' sl_input'+(n['invisible'] ? ' invisible' : '') : 'sl_input'+(n['invisible'] ? ' invisible' : '');
            $.each(n['attr'],function(j,v){
                o[o.length] = j+'="'+v+'"';   
            });
            data = '<div '+o.join(' ')+'><div><input type="'+(n.type == 'password' ? 'password' : 'input')+'" value="'+n.value+'" name="'+n.name+'" placeholder="'+n.holder+'"'+(n.max ? ' maxlength="'+n.max+'"' : '')+' spellcheck="'+(n.check ? 'true' : 'false')+'"'+(n.regex ? ' onkeyup="this.value = this.value.replace(/'+n.regex+'/gi,\'\');"' : '')+' /></div>'+(n.bigedit ? '<div class="bigedit"></div>' : '')+'</div>';
            
            if(this == false) return data;
            else $(this).html(data);
        },
        /**
         * _AREA
         */
        textarea: function(n){
            if(typeof n === 'string') n = {name:n};
            
            if(arguments.length > 1){
                n = {name:n.name,value:arguments[1]};
                if(typeof arguments[2] === 'object') n = $.extend(n,arguments[2]);
            }
            
            n = $.extend({
                name: 'none',
                value: '',
                attr: {}
            }, n),data = '',o = [];
            
            n['attr']['class'] = n['attr']['class'] ? n['attr']['class']+' sl_textarea'+(n['invisible'] ? ' invisible' : '') : 'sl_textarea'+(n['invisible'] ? ' invisible' : '');
            n['attr']['style'] = n['attr']['style'] ? 'width:100%; height:inherit;'+n['attr']['style'] : 'width:100%; height:inherit;';
            $.each(n['attr'],function(j,v){
                o[o.length] = j+'="'+v+'"';   
            });
            
            data = '<div '+o.join(' ')+'><div><textarea name="'+n.name+'" spellcheck="'+(n.check ? 'true' : 'false')+'">'+n.value+'</textarea></div>'+(n.bigedit ? '<div class="bigedit"></div>' : '')+'</div>';
            
            if(this == false) return data;
            else $(this).html(data);
        },
        /**
         * _BTN
         */
        btn: function(n){
            if(typeof n === 'string') n = {name:n};
            
            if(arguments.length > 1){
                if(typeof arguments[1] === 'object') n = $.extend(n,arguments[1]);
                else n['callback'] = arguments[1]
            }
            
            n = $.extend({
                name: 'none',
                callback: '',
                attr: {}
            }, n),data = '',o = [];
            
            n['attr']['class'] = n['attr']['class'] ? n['attr']['class']+' sl_btn' : 'sl_btn';
            n['attr']['onclick'] = n['callback'] ?  n['callback']+"('"+n.name+"');"+(n['attr']['onclick'] || '') : (n['attr']['onclick'] || '');
            $.each(n['attr'],function(j,v){
                o[o.length] = j+'="'+v+'"';   
            });
            data = '<div '+o.join(' ')+'>'+n.name+'</div>';
            
            if(this == false) return data;
            else $(this).html(data);
        },
        /**
         * _RADIO
         */
        radio: function(n){
            if(typeof n === 'string') n = {name:n};
            
            if(arguments.length > 1){
                n = {name:n.name,val:arguments[1],value:arguments[2]}
                if(typeof arguments[3] === 'object') n = $.extend(n,arguments[3]);
                else n['callback'] = arguments[3]
            }
            
            n = $.extend({
                name: 'none',
                value: 'on',
                val: ['on','off'],
                type: 'line',
                callback: '',
                attr: {}
            }, n),data = '',o = [],s = [],r = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
            
            $.each(n['val'],function(c,v){
                s = n['value'] == v ? [' checked','cb-enable selected'] : ['','cb-disable'];
                data += '<input type="radio" name="'+n.name+'" value="'+v+'" id="radio_'+r+'_'+c+'"'+s[0]+' /><label'+(n['callback'] ? ' onclick="'+n['callback']+'(\''+v+'\','+c+')"' : '')+' for="radio_'+r+'" class="'+s[1]+'"><span>'+v+'</span></label>';
            })
        
            n['attr']['class'] = n['attr']['class'] ? n['attr']['class']+' sl_radio '+n['type'] : 'sl_radio '+n['type'];
            $.each(n['attr'],function(j,v){
                o[o.length] = j+'="'+v+'"';   
            });
            data = '<div '+o.join(' ')+'>'+data+'</div>';
            
            if(this == false) return data;
            else $(this).html(data);
        },
        /**
         * _CHECKBOX
         */
        checkbox: function(n){
            if(typeof n === 'string') n = {name:n};
            
            if(arguments.length > 1){
                n = {name:n.name,value:arguments[1]}
                if(typeof arguments[2] === 'object') n = $.extend(n,arguments[2]);
                else n['callback'] = arguments[2]
            }
            
            n = $.extend({
                name: 'none',
                value: '0',
                callback: '',
                attr: {}
            }, n),data = '',o = [];
        
            n['attr']['class'] = n['attr']['class'] ? n['attr']['class']+' sl_checkbox' : 'sl_checkbox';
            n['attr']['class'] += n['value'] > 0 ? ' active': '';
            n['attr']['onclick'] = n['callback'] ?  n['callback']+"('"+n.name+"',$(this).find('input').val());"+(n['attr']['onclick'] || '') : (n['attr']['onclick'] || '');
            $.each(n['attr'],function(j,v){
                o[o.length] = j+'="'+v+'"';   
            });
            data = '<div '+o.join(' ')+'><input type="hidden" name="'+n.name+'" value="'+n.value+'" /></div>';
            
            if(this == false) return data;
            else $(this).html(data);
        },
        /**
         * _SELECT
         */
        select: function(n){
            if(typeof n === 'string') n = {name:n};
            
            if(arguments.length > 1){
                n = {name:n.name,val:arguments[1],value:arguments[2]}
                if(typeof arguments[3] === 'object') n = $.extend(n,arguments[3]);
                else n['callback'] = arguments[3]
            }
            
            n = $.extend({
                name: 'none',
                value: 'on',
                val: ['on','off'],
                callback: '',
                attr: {}
            }, n),data = '',o = [],d = [],ih = false;
            
            function array_all( input ) {	
            	var a = [[],[]];
            
            	for ( key in input ){
            		a[0][a[0].length] = input[key];
                    a[1][a[1].length] = key;
            	}
            	return a;
            }
    
            d = array_all(n.val);
            
            if(typeof n.callback === 'object'){
                var callName = n.callback[0];
                n.callback.shift();
            }
            else var callName = n.callback[0];
            
            $.each(n.val,function(c,v){
                data += '<li'+(n.callback ? ' onclick="'+(typeof n.callback === 'object' ? callName : n.callback)+'(\''+c+'\''+(typeof n.callback === 'object' ? ','+n.callback.join(',') : '')+')"' : '')+' val="'+c+'" name="'+v+'"'+(c == n.value ? ' class="selected"' : '')+'><span>'+v+'</span></li>';
            })
        
            n['attr']['class']= n['attr']['class'] ? n['attr']['class']+' sl_select' : 'sl_select';
            $.each(n['attr'],function(j,v){
                o[o.length] = j+'="'+v+'"';   
            });
            
            data = '<div '+o.join(' ')+'><input type="hidden" name="'+n.name+'" value="'+(n.value ? n.value : d[1][0])+'" /><div class="_data"><ul>'+data+'</ul></div><div class="_display">'+(n['val'][n['value']] ? n['val'][n['value']] : d[0][0])+'</div></div>';

            if(this == false) return data;
            else $(this).html(data);
        },
        /**
         * _SLIDE
         */
        slide: function(n){
            if(typeof n === 'string') n = [n];
            
            var j = 0,i = t= '',cnt = 0;

            for (var b in n) b && cnt++;

            $.each(n,function(c,v){
                i += '<div class="page win_h_size scrollbarInit" style="left:'+(j*100)+'%"><div class="s_data">'+v+'</div></div>';
                t += '<li style="width:'+(100 / cnt)+'%" rel="'+j+'"'+(j == 0 ? ' class="active"' : '')+'>'+c+'</li>';
                j++;
            })
            
            return '<div class="sl_slide win_h_size">'+i+'<ul class="title">'+t+'</ul></div>';
        }
    
    };
    
    $.fn.scin = function( method ) {
    
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( this, arguments );
        } else {
          return methods.init.apply( this );
        }   
    
    };
    
    $.scin = function( method ) {
    
        if ( methods[method] ) {
          return methods[ method ].apply( false,Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return methods.init.apply( false, arguments );
        } else {
          return methods.init();
        }   
    
    };
  

})(jQuery);