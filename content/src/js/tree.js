(function(window, undefined){
	var Tree = function(id, settings){
		this.tree = $('#' + id);
		this.settings = settings;
		this.init(this.settings);
	};

	Tree.prototype = {
		init: function(set){
			var dt = this.getData(set.dataUrl);

		},

		getData: function(url){
			$.ajax({
				url: url,
				type: 'get',
				dataType: 'json',
				data: {
					access_token: '',
					groupId: ''
				},
				sucess: function(resp){
					console.log(resp);
					this.setTree(resp.data.data);
				}
			});
		},

		setTree: function(dt){

			this.tree.html('');
	    var len = dt.length,
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
	        siblings = null;
	    //var wrapper = $('<dl class="cnt-list-warp"></dl>');
	    for(var i=0; i<len; i++){
	      item = $('<dl class="cnt-list-warp"></dl>');

	      subs = dt[i].sub;
	      // 含二级科室
	      if(subs && (ln = subs.length) > 0){
	        hasSub = true;
	        dt = $('<dt></dt>');
	        dd = $('<dd></dd>');
	        iArrow = '<i class="fa fa-caret-right">';
	        iIcon = '<i class="fa fa-h-square"></i>';
	        dl = $('<dl></dl>');
	        // 遍历每一个二级科室并生成相应的子列表
	        for(var j=0; j<ln; j++){
	          var dt = $('<dt></dt>');
	          var dd = $('<dd></dd>');

	          span = $('<span></span>');
	          span.html(subs[j].name);

	          li.on('click', function(e){});

	          li.hover(function(){}, function(){});

	          ul.append(li);
	        }
	        
	        item.html(dt[i].name).prepend(ie).append(ul);

	      }else{  // 不含二级科室
	        hasSub = false;
	        iCheck = '<i class="fa fa-check">';
	        iIcon = '<i class="fa fa-user-md"></i>';
	        item.data('id', dt[i].id);
	        span = $('<span></span>');
	        span.html(dt[i].name);
	        item.append(span);
	      }
	      this.tree.append(item);
	      // 定义列表行的点击事件
	      item.on('click', hasSub, function(st){});

	      // 鼠标停留时显示操作菜单热点
	      item.hover(function(e){}, function(){});
	    }

	    function showMenu(obj){
	      var menu = obj.find('.dropdown-menu');
	      this.tree.find('.dropdown-menu').css('display', 'none');
	      var lis = menu.css('display', 'block').find('li');
	      lis.on('click', function(e){
	        var evt = e || window.event;
	        evt.stopPropagation();
	        //showMenu(that);
	      });
	    }



		}

	};

	window.Tree = Tree;
})(window);