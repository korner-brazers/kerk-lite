<?
/**
 * @db
 * @author korner
 * @copyright SL-SYSTEM 2012
 */
 
class db{
    var $db_id           = false;
	var $connected       = false;
    var $conf            = [];
    var $dynamic         = true;
    var $query_id        = false;
    var $query_num       = 0;
    var $last_tbl_name   = false;
    var $error           = false;
    var $stopConnected   = false;
    

    function prefix($tbl){
        return $this->conf['prefix'] != '' ? $this->conf['prefix'].'_'.$tbl : $tbl;
    }
   	function connect($show_error = true){
   	    if($this->connected) return true;
        
        if($this->stopConnected){
            if($show_error) $this->errors(@mysqli_connect_error(),0,'',true); return false;
        }
        
        if(!function_exists('mysqli_connect')) return false;
        
        if(empty($this->conf['user']) || empty($this->conf['dbname'])){
            $this->stopConnected = true;
            return false;
        } 
        
	    $db_ip = explode(":", $this->conf['ip']);
        
        if(!empty($db_ip[0])){
            if(isset($db_ip[1])) $this->db_id = @mysqli_connect($db_ip[0], $this->conf['user'], $this->conf['pass'], $this->conf['dbname'], $db_ip[1]);
            else $this->db_id = @mysqli_connect($db_ip[0], $this->conf['user'], $this->conf['pass'], $this->conf['dbname']);
        }
        
		if(!$this->db_id) {
            $this->stopConnected = true;
            
			if($show_error) $this->errors(@mysqli_connect_error(),0,'',true);
			
            return false;
		}
        else $this->connected = true;

		$this->mysql_version = @mysqli_get_server_info($this->db_id);

		@mysqli_query($this->db_id, "SET NAMES 'utf8'");

		return true;
	}
    function query($query,$show_error = true){
        if(!$this->connected) $this->connect($show_error);
        
        if($this->stopConnected) return;
        
		if(!($this->query_id = mysqli_query($this->db_id, $query) )) {
            if($show_error) $this->errors(mysqli_error($this->db_id), mysqli_errno($this->db_id), $query);
		}

        $this->query_num ++;
        
		return $this->query_id;
	}
    function select($tbl,$str = false,$show_error = true){

        $tbl = $this->prefix($tbl);
        
        if($this->dynamic) $this->createTable($tbl);
        
        $this->last_tbl_name = $tbl;
        
        if(!$str && !is_numeric($str)){
            $query = $this->query("SELECT * FROM ".$tbl);
        }
        elseif(is_numeric($str)){
            $query = $this->get_row($this->query("SELECT * FROM ".$tbl." WHERE id='".$str."'",$show_error));
        }
        elseif(is_array($str)){
            $sql = array_merge(['SELECT'=>'*'],$str);
            
            $where = ($sql['WHERE'] == '') ? ''  : " WHERE ".$sql['WHERE'];
    		$order = ($sql['ORDER'] == '') ? ''  : " ORDER BY ".$sql['ORDER'];
            $group = ($sql['GROUP'] == '') ? ''  : " GROUP BY ".$sql['GROUP'];
    		$limit = is_array($sql['LIMIT']) ? ' LIMIT '.ceil(((intval($sql['LIMIT'][0]) < 1 ? : intval($sql['LIMIT'][0]))-1) * intval($sql['LIMIT'][1])).','.intval($sql['LIMIT'][1]) : ($sql['LIMIT'] == '' ? ''  : " LIMIT ".intval($sql['LIMIT']));
            
            $where = ($sql['LIKE'] == '') ? $where  : (is_array($sql['LIKE']) ? " WHERE ".$sql['LIKE'][0]." LIKE '%".$this->escape($sql['LIKE'][1])."%'": $where);
            
    		$query = $this->query("SELECT ".$sql['SELECT']." FROM ".$tbl.$where.$order.$group.$limit,$show_error);
        }
        else{
            $query = $this->query("SELECT * FROM ".$tbl.($str !== '' ? ' WHERE '.$str : ''),$show_error);
        }
        return $query;
	}
    function insert($tbl,$sql,$show_error = true){
        $tbl_n = $tbl;
        $tbl   = $this->prefix($tbl);
        
        foreach($sql as $key=>$val){
            if($key == 'date' && empty($val)) $val = date( "Y-m-d H:i:s");
            $keys[] = '`'.$key.'`';
            $values[] = "'".$this->escape($val)."'";
            $addRow[$key] = ['VARCHAR',250];
        }
        
        if($this->dynamic) $this->alterTableAdd($tbl_n,$addRow);

	    return $this->query("INSERT INTO ".$tbl." (".implode(',',$keys).") values (".implode(',',$values).")",$show_error);
	}
    function update($tbl,$sql,$where,$quote = true,$show_error = true){
        $tbl_n = $tbl;
        $tbl = $this->prefix($tbl);
        
        foreach($sql as $key=>$val){
            if($key == 'date' && empty($val)) $val = date( "Y-m-d H:i:s");
            if($quote) $values[] .= '`'.$key.'`=\''.$this->escape($val).'\'';
			else $values[] .= '`'.$key.'`='.$this->escape($val);
            $addRow[$key] = ['VARCHAR',250];
        }
        
        if($this->dynamic) $this->alterTableAdd($tbl_n,$addRow);
        
		return $this->query("UPDATE ".$tbl." set ".implode(',',$values)." WHERE ".(is_numeric($where) ? "id='$where'" : $where),$show_error);
	}
    function delete($table,$where = false,$show_error = true){
		$this->query("DELETE FROM ".$this->prefix($table)." WHERE ".(is_numeric($where) ? "id='$where'" : ($where ? (is_array($where) ? "id IN (".implode(',',$where).")" : $where) : "id=".intval($this->insert_id()))),$show_error);
	}
    function count($tbl,$where = false){
        $where = is_array($where) ? array_merge(['SELECT'=>'COUNT(id) as count'],$where) : ['SELECT'=>'COUNT(id) as count','WHERE'=>$where];
        return intval($this->get_row($this->select($tbl,$where))['count']);
    }
    private function createTable($tblName){
        return $this->query("CREATE TABLE IF NOT EXISTS `".$tblName."`(id INT NOT NULL AUTO_INCREMENT,cid INT NOT NULL default '0',PRIMARY KEY(id)) ENGINE=InnoDB");
    }
    function alterTableAdd($tblName,$row){
        $tblName = $this->prefix($tblName);
        
        if($this->dynamic) $this->createTable($tblName);
        
        if(is_array($row)){
            foreach($row as $name=>$arr){
                $this->query("ALTER TABLE `$tblName` ADD `$name` $arr[0]".($arr[1] ? "($arr[1])" : '')." default '$arr[2]'",false);
            }
        }
    }
    function checkTable($tblName){
        $tblName = $this->prefix($tblName);
        
        return $this->query("SHOW TABLES LIKE '".$tblName."'",false);
    }
    function alterTableOnDelete($customers,$orders){
        if($customers == '' || $orders == '') return;
        
        $customers = $this->prefix($customers);
        $orders = $this->prefix($orders);
        
        if($this->dynamic){
            $this->createTable($customers);
            $this->createTable($orders);
        } 
        
        $this->query("ALTER TABLE $orders ADD FOREIGN KEY (cid) REFERENCES $customers(id) ON DELETE CASCADE",false);
    }
    function get_while($callback,$query_id = false){
        if(@get_class($query_id) == 'mysqli_result') {}
        elseif(is_array($query_id)) $query_id = $this->select($query_id[0],$query_id[1]);
        elseif($query_id) $query_id = $this->select($query_id);
        
        while($row = $this->get_row($query_id)){
            if(is_callable($callback)) $callback($row);
        }
    }
    function like($tbl,$row,$like,$lim = []){
        return $this->select($tbl,['WHERE'=>$row." LIKE '%".$this->escape($like)."%'",'LIMIT'=>$lim]);
    }
    function show_field($tbl){
        $this->query('SHOW COLUMNS FROM '.$this->prefix($tbl),false);
        
        while($row = $this->get_row()){
            $arr[] = $row['Field'];
        }
        
        return $arr ? $arr : [];
    }
    function get_row($query_id = false){
		return @mysqli_fetch_assoc($query_id ? $query_id : $this->query_id);
	}
	function get_array($query_id = false){
        return @mysqli_fetch_array($query_id ? $query_id : $this->query_id);
	}
    function num_rows($query_id = false){
        return @mysqli_num_rows($query_id ? $query_id : $this->query_id);
	}
    function insert_id(){
        return @mysqli_insert_id($this->db_id);
	}
    function escape($string){
        if(!$this->connected) $this->connect();
		return mysqli_real_escape_string ($this->db_id, $string);
	}
    function free($query_id = false){
        @mysqli_free_result($query_id ? $query_id : $this->query_id);
	}
    function close(){
		@mysqli_close($this->db_id);
	}
    function errors($error, $error_num, $query = false, $connect = false){
        
		if($query) $query = preg_replace("/([0-9a-f]){32}/", "********************************", $query);


        if(!$this->connected) $this->error = 'Не настроено соединение с базой данных';
        else                  $this->error = 'MYSQL: '.$error.' QUERY['.$error_num.']: '.$query;
    }
}

/********************************/

/*
$db = new db();

$db->dynamic = true;

$db->conf = [
    'user'=>'root',
    'pass'=>'',
    'dbname'=>'frostbattle',
    'ip'=>'127.0.0.1:3307'
];

$db->connect();
*/
/********************************/
/*
$db->alterTableAdd('maps',[
    'map_id'=>['VARCHAR',100],
    'max_pl'=>['TINYINT',1,0],
    'players'=>['TINYINT',1,0],
    'mode'=>['TINYINT',1,0],
    'vehicle'=>['TINYINT',1,0],
    'ifs'=>['TINYINT',1,0],
    'premium'=>['TINYINT',1,0],
    'time_last'=>['DECIMAL',10,0],
    'tiket'=>['DECIMAL',10,0],
]);

$db->alterTableAdd('niknames',[
    'uid'=>['INT',11,0],
    'nik'=>['VARCHAR',100],
    'time_pay'=>['DECIMAL',10,0],
    'score'=>['DECIMAL',10,0],
    'die'=>['DECIMAL',10,0],
    'kill'=>['DECIMAL',10,0],
    'po'=>['TEXT NOT NULL',false]
]);
*/
?>