// utils
'use strict';

app.factory('utils', ['$http', function($http) {
	return {
		getData: function(u, d, m, h) {
      var args = arguments;
      $http({
        url: u,
        data: typeof d !== 'function' ? d || {} : {},
        method: typeof m !== 'function' ? m || 'POST' : 'POST',
        headers: typeof h !== 'function' ? h || {} : {}
      }).then(function(dt) {
        if ((dt.data.dataList && dt.data.dataList.length !== 0) || dt.data.code == 1) {
          for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === 'function') {
              args[i].call(null, dt.data.dataList);
            };
          }
        } else {
          console.warn(dt.statusText);
        }
      }, function(x) {
        console.error(x.statusText);
      });
    },
    getDataByKey: function(data, key, val){
      var len = data.length;
      for(var i=0; i<len; i++){
        if(data[i][key] === val){
          return data[i];
        }
      }
    },
    localData: function(key, val){
      if(window.localStorage){
        if(val){
          localStorage.setItem(key, val);
          return true;
        }else if(val === null){
          localStorage.removeItem(key)  
        }else{
          var dt = localStorage.getItem(key);
          if(dt){
            return dt;
          }else{
            return null;
          }
        }
      }else{
        return false;
      }
    },
    extendHash: function(dt, keys){
    	if(!dt) {
    		console.warn("数据无效！ In function 'extendHash'.");
    		return;
    	}
    	if(dt.constructor === Array){
    		var len = dt.length;
	    	for(var i=0; i<len; i++){
	  			var l = keys.length;
	  			for(var n=0; n<l; n++){
	  				if(!dt[i][keys[n]]) {
	  					dt[i][keys[n]] = '';
	  				}	
	  			}
	    	}
    	}else{
				var len = keys.length;
  			for(var i=0; i<len; i++){
  				if(!dt[keys[i]]) {
  					dt[keys[i]] = '';
  				}	
  			}
    	}
    }
	};
}]);

Date.prototype.format = function(format) {
	if (!format) {
		format = 'yyyy-MM-dd'
	}
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
Date.prototype.formatTime=function(format){
	if (!format) {
		format = 'yyyy-MM-dd hh:mm:ss';
	}
	return this.format(format);
};

/**
 * for jquery datatable render (渲染器)
 */
var DataRender={};
/**
 * 时间渲染器
 */
DataRender.DateTime=function (o){
	//var str="";
	if(o){
		o=new Date(o).formatTime();
	}
	return o;

};
/**
 * 日期渲染器
 */
DataRender.Date=function(o){
	if(o){
		o=new Date(o).format();
	}
	return o;
};
/**
 * 性别渲染器
 */
DataRender.Gender=function(o){
	if(o){
		if(1==o){
			o='男';
		}
		if(2==o){
			o='女';
		}
	}
	return o;
};
/**
 * 状态渲染器
 */
DataRender.State=function(o){
	if(o){
		if(1==o){
			o='已审核';
		}
		if(0==o){
			o='未审核';
		}
	}
	return o;
};