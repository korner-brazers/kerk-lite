<?php
@error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( "short_open_tag", 1 );

$do  = preg_replace("'[^a-z]'si",'',$_GET['do']);
$do  = $do == '' ? 'getIndex' : $do;

define('DIR',dirname(__FILE__));
define('DATA',DIR.'/data');

include DIR.'/access.php';
include DIR.'/media/db_class.php';

define('DATAKEY',DIR.'/'.$accessKey);

class game extends db{
    var $viewer_id      = 0;
    var $auth_key       = 0;
    var $app_id         = '';
    var $api_secret     = '';
    var $alterTableArr  = [
        'uid'=>['INT',11,0],
        'msg'=>['TEXT NOT NULL',false],
        'settings'=>['TEXT NOT NULL',false],
    ];
    
    var $insertTableArr = ['msg'=>'[]'];
    var $userJsonArr    = ['msg','settings'];
    var $gameVars       = [];
    
    
    function __call($m,$a){
        return [];
    }
    function game(){
        global $accessKey;
        
        $this->viewer_id = $_GET['viewer_id'];
        $this->user_id   = $_GET['user_id'];
        $this->uhash     = $_GET['uhash'];
        $this->auth_key  = $_GET['auth_key'];
        $this->data      = $_POST['data'];
        $this->accessKey = $accessKey;
        $this->dataJson  = json_decode($this->data,true);
        $this->settings  = $this->getData('settings');
        $this->useDb     = $this->settings['server']['useDb'];
        $this->server    = $this->settings['server']['localOn'] ? $this->settings['server']['local'] : $this->settings['server']['node'];
        
        
        $this->vkapp      = $this->settings['main']['vkapp'];
        $this->app_id     = $this->settings['main']['app_id'];
        $this->api_secret = $this->settings['main']['api_secret'];
        
        $this->conf = [
            'user'=>$this->server['dbuser'],
            'pass'=>$this->server['dbpassword'],
            'dbname'=>$this->server['dbname'],
            'ip'=>$this->server['dbhost'].($this->server['dbport'] ? ':'.$this->server['dbport'] : '')
        ];
        
        if($this->useDb) $this->connect();
    }
    private function getAllFile($dir,$p = true){
        if(is_dir($dir)){
            $handle = @opendir( $dir );
            
        	while ( false !== ($file = @readdir( $handle )) ) {
                
        		if( @is_dir( $dir.'/'.$file ) and ($file != "." and $file != "..") ) {
        			  
                    $c_files['dir'][$file] = $p ? $dir : $file;
        			
        		}elseif($file != "." and $file != ".."){
        		    $c_files['file'][$file] = $p ? $dir : $file;
        		}
        	}
           @closedir($handle);
       }
       
       if(count($c_files['dir']) == 0)  $c_files['dir']  = array();
       if(count($c_files['file']) == 0) $c_files['file'] = array();
       
       return $c_files;
    }
    private function getObj(){
        $data = [];
        
        $files = $this->getAllFile(DATAKEY,false);
        
        foreach($files['file'] as $a){
            
            $name = str_replace('.data.json','',$a);
            
            if($name !== 'maps') $data[$name] = $this->getData($name);
        }
        
        /** Удаляем данные о сервере чтоб не светить **/
        unset($data['settings']['server']);
        
        return $data;
    }
    private function getFile($p){
        return json_decode(file_get_contents($p),true);
    }
    private function getData($name){
        return $this->getFile(DATAKEY.'/'.$name.'.data.json');
    }
    private function getMaps($id = false){
        $maps = $this->getData('maps');
        
        return $id ? $maps[$id] : $maps;
    }
    private function createUser(){
        $this->alterTableAdd('users',$this->alterTableArr);

        $user = $this->get_row($this->like('users','uid',$this->viewer_id,1));
        
        if($user) return $this->decodeUserJson($user);
        else{
            $this->insertTableArr['uid'] = $this->viewer_id;
            
            $this->insert('users',$this->insertTableArr);
            
            $user = $this->select('users',$this->insert_id());
            
            return $this->decodeUserJson($user);
        }
    }
    private function checkUser(){
        $user = $this->select('users',$this->user_id);
        
        if($user && $this->checkKey() && md5($this->user_id.'_'.$this->api_secret.'_'.$this->auth_key) == $this->uhash) return $this->decodeUserJson($user);
    }
    private function decodeUserJson($user){
        return $this->decodeJson($user,$this->userJsonArr);
    }
    private function decodeJson($arr,$decodeArr){
        foreach($decodeArr as $name){
            $arr[$name] = json_decode($arr[$name],true);
            
            if(!is_array($arr[$name])) $arr[$name] = [];
        }
        
        return $arr;
    }
    private function checkKey(){
        if(md5($this->app_id."_".$this->viewer_id."_".$this->api_secret) == $this->auth_key) return true;
    }
    function getIndex(){
        if($this->vkapp && !$this->checkKey()) include DIR.'/error.php';
        else{
            $rcache = '?'.rand();
            
            $this->gameVars['maps']       = json_encode($this->getMaps());
            $this->gameVars['viewer_id']  = intval($this->viewer_id);
            $this->gameVars['obj']        = json_encode($this->getObj());
            $this->gameVars['auth_key']   = $this->auth_key;
            $this->gameVars['scripts']    = $this->getScripts();
            $this->gameVars['vkapp']      = intval($this->vkapp);
            
            if($this->vkapp){
                $user   = $this->createUser();
                
                $this->gameVars['user']       = json_encode($user);
                $this->gameVars['user_id']    = intval($user['id']);
                $this->gameVars['uhash']      = md5($user['id'].'_'.$this->api_secret.'_'.$this->auth_key);
            }
            else{
                $this->gameVars['user']       = [];
                $this->gameVars['user_id']    = 0;
            }
            
            $game = $this->gameVars;
            
            include DIR.'/game.php';
        }
        
        return ' ';
    }
    private function scriptToString($name){
        $str = "scripts.".$name." = function (object){\n";
        
        $exists = file_get_contents(DATA.'/scripts/'.$name.'.js');
        
        if($exists) $str .= $exists."\n";
        
        $str .= "}\n";
        
        return $str;
    }
    private function parseScript($object){
        $str = '';
        
        foreach($object as $script){
            $str .= $this->scriptToString($script['name']);
        }
        
        return $str;
    }
    private function getScripts(){
        $load = $this->getFile(DATAKEY.'/scripts.data.json');
        $str  = "var scripts = {};\n";
        
        
        $attachedScripts = [];
        
        foreach($load['object'] as $object){
            foreach($object['objects'] as $atachID=>$atachArr){
                if(!$attachedScripts[$atachID]) $attachedScripts[$atachID] = [];
                
                $attachedScripts[$atachID][] = $object['name'];
            }
        }
        
        foreach($load['maps'] as $mapID=>$map){
            foreach($map as $object){
                if($object['sys']){
                    if(!$attachedScripts[$mapID]) $attachedScripts[$mapID] = [];
                    
                    $attachedScripts[$mapID][] = $object['name'];
                }
                else{
                    foreach($object['objects'] as $atachID=>$atachArr){
                        if(!$attachedScripts[$atachID]) $attachedScripts[$atachID] = [];
                        
                        $attachedScripts[$atachID][] = $object['name'];
                    }
                }
            }
        }
        
        foreach($load['global'] as $object){
            if(!$attachedScripts[$object['name']]) $attachedScripts[$object['name']] = [];
            
            $attachedScripts[$object['name']][] = $object['name'];
            
            if($object['runing']){
                if(!$attachedScripts['runingGlobal']) $attachedScripts['runingGlobal'] = [];
                
                $attachedScripts['runingGlobal'][] = $object['name'];
            } 
        }

        $str .= "var attachedScripts = ".json_encode($attachedScripts).";\n";
        
        $str .= $this->parseScript($load['object']);
        
        foreach($load['maps'] as $objects){
            $str .= $this->parseScript($objects);
        }
        
        foreach($load['global'] as $object){
            $str .= $this->scriptToString($object['name']);
        }
        
        return $str;
    }
    
    private function getError($n){
        return ['error'=>$n];
    }
    function profile(){
        if($this->vkapp){
            $user = $this->checkUser();
            
            if(!$user) return $this->getError(397);
            
            return $user;
        }
        else return [];
    }
    private function ToArray($a){
        $b = [];
        foreach($a as $i=>$m) $b[] = $i;
        return $b;
    }
}

$game = new game();
$data = $game->$do();

if(is_array($data))  echo json_encode($data);
elseif(empty($data)) echo json_encode([]);
else                 echo $data;
?>