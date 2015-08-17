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
				data: {
					access_token: '',
					groupId: ''
				},
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
				dt.data('id', data[i].id);
				dt.append(iOpr).append(iIcon).append(span);
	      dl.append(dt);

				subs = data[i].sub;

	      // 含下一级科室
	      if(subs && (ln = subs.length) > 0){
	      	iOpr.addClass('fa fa-caret-right');
	      	iIcon.addClass('fa fa-stethoscope');
	      	if(!this.settings.async){
						var objs = this.setBranch(subs);			// 创建下一分支

						for(var j=0; j<objs.length; j++){
							dl.append(objs[j]);
						}
	      	}
	      }else{  // 不含下一级科室
	        hasSub = false;
	        iOpr.addClass('fa fa-check');
	        iIcon.addClass('fa fa-user-md');
	      }

	      this.tree.append(dl);

	      // 定义列表行的点击事件
	      dt.on('click', hasSub, function(st){});

	      // 鼠标停留时
	      dt.hover(function(e){}, function(){});
			}

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
				dt.data('id', data[i].id);
        dt.append(iOpr).append(iIcon).append(span);
        dl.append(dt);
        dd.append(dl);

        subs = data[i].sub;

        // 含下一级科室
        if(subs && (ln = subs.length) > 0){
      		hasSub = true;
					iOpr.addClass('fa fa-caret-right');
        	iIcon.addClass('fa fa-h-square');

	        if(!this.settings.async){
						var objs = this.setBranch(subs);			// 创建下一分支

						for(var j=0; j<objs.length; j++){
							dl.append(objs[j]);
						}
	      	}

        }else{  // 不含下一级科室
	        hasSub = false;
	        iOpr.addClass('fa fa-check');
	        iIcon.addClass('fa fa-user-md');
        }

        objArr.push(dd);		
        
	      // 定义列表行的点击事件
	      dt.on('click', hasSub, function(st){
	      	_this.settings.events.clicked();
	      });

	      // 鼠标停留时
	      dt.hover(function(e){}, function(){});
	    }

	    return objArr;

		}

	};

	window.Tree = Tree;
})(window);