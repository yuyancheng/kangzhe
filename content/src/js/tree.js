(function(window, undefined){
	var Tree = function(id, settings){
		this.tree = $('#' + id);
		this.data = null;
		this.settings = settings;
		this.init(this.settings);
	};

	Tree.prototype = {
		init: function(set){
			var dt = this.getData(set.dataUrl);
		},

		getData: function(url){
			var _this = this;
			$.ajax({
				url: url,
				type: 'get',
				dataType: 'json',
				data: _this.settings.data,
				success: function(resp){
					console.log(resp);
					_this.setTree(resp.data);
				}
			});
		},

		setTree: function(dt){
	    var _this = this
	    		data = dt,
	    		len = data.length,
	        dt = null,
	        dd = null,
	        dl = null,
	        iArrow = null,
	        iCheck = null,
	        iIcon = null,
	        span = null,
	        subs = null,
	        ln = 0,
	        hasSub = false,
	        siblings = null;
			
			this.tree.html('');

			for(var i=0; i<len; i++){
				dl = $('<dl class="cnt-list-warp"></dl>');
				dt = $('<dt></dt>');
	      iOpr = $('<i></i>');
	      iIcon = $('<i></i>');
	      span = $('<span></span>');

				span.html(data[i].name);
				dt.data('id', data[i].id).data('name', data[i].name);

				subs = data[i][_this.settings.datakey.sub];

	      // 含下一级科室
	      if(subs && (ln = subs.length) > 0){
	      	iOpr.addClass('fa fa-caret-down');
	      	iIcon.addClass('fa fa-stethoscope');
	      	dt.append(iOpr).append(iIcon).append(span);
	      	dl.append(dt);
	      	if(!this.settings.async){
						var objs = this.setBranch(subs);			// 创建下一分支
						for(var j=0; j<objs.length; j++){
							dl.append(objs[j]);
						}
	      	}
	      }else{  // 不含下一级科室
	        hasSub = false;
	        if(_this.settings.hasCheck){
	        	iOpr.addClass('fa fa-check un-check');
	        	dt.append(iOpr);
	        }
	        dt.append(iIcon).append(span);
	        dl.append(dt);
	        iIcon.addClass('fa fa-user-md');
	      }

	      this.tree.append(dl);

	      // 定义列表行的点击事件
	      dt.on('click', hasSub, function(){
	      	_this.settings.events.click.call(null, $(this).data('id'), $(this).data('name'));
	      });

	      // 鼠标停留时
	      dt.hover(function(e){}, function(){});
			}

			// 结束之后调用回调方法
			this.settings.callback();
		},

		setBranch: function(data){
			
	    var _this = this,
	    		len = data.length,
	        item = null,
	        dt = null,
	        dd = null,
	        dl = null,
	        iArrow = null,
	        iCheck = null,
	        iIcon = null,
	        span = null,
	        subs = null,
	        ln = 0,
	        hasSub = false,
	        siblings = null,
	        objArr = [];

	    // 遍历每一个二级科室并生成相应的子列表
	    for(var i=0; i<len; i++){
        dd = $('<dd></dd>');
        dl = $('<dl></dl>');
        dt = $('<dt></dt>');
        iOpr = $('<i></i>');
	      iIcon = $('<i></i>');
        span = $('<span></span>');

				span.html(data[i].name);
				dt.data('id', data[i].id).data('name', data[i].name);

        subs = data[i][_this.settings.datakey.sub];

        // 含下一级科室
        if(subs && (ln = subs.length) > 0){
      		hasSub = true;
					iOpr.addClass('fa fa-caret-down');
        	iIcon.addClass('fa fa-h-square');
					dt.append(iOpr).append(iIcon).append(span);
        	dl.append(dt);
        	dd.append(dl);

	        if(!this.settings.async){
						var objs = this.setBranch(subs);			// 创建下一分支
						for(var j=0; j<objs.length; j++){
							dl.append(objs[j]);
						}
	      	}

        }else{  // 不含下一级科室
	        hasSub = false;
	        if(_this.settings.hasCheck){
	        	iOpr.addClass('fa fa-check un-check');
	        	dt.append(iOpr);
	        }
	        dt.append(iIcon).append(span);
	        dl.append(dt);
        	dd.append(dl);
	        iIcon.addClass('fa fa-user-md');
        }

        objArr.push(dd);		
        
	      // 定义列表行的点击事件
	      dt.on('click', hasSub, function(){
	      	_this.settings.events.click.call(null, $(this).data('id'), $(this).data('name'));
	      });

	      // 鼠标停留时
	      dt.hover(function(e){}, function(){});
	    }

	    return objArr;

		}

	};

	window.Tree = Tree;
})(window);