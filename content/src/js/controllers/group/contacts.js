'use strict';

app.controller('Contacts', function($rootScope, $scope, $state, $http, $compile) {
  //var url = app.url.contacts.getContacts; // 后台API路径
  var data = null;
  var cnt_list = $('#cnt_list');
  var items = cnt_list.find('.list-group-item');
  var dt = null;

  // 获取通讯录列表数据
/*  $http({
    url: 'src/api/contacts_list.json',
    method: 'get',
    data: null
  }).then(function(resp){
    if(resp.data.data && resp.data.data.length > 0){
      dt = resp.data.data;
      //initList();
    }
  }, function(x) {
    console.error(x.statusText);
  });*/

  var contacts = new Tree('cnt_list',{
    hasCheck: true,
    dataUrl: 'src/api/contacts_list.json',
    async: false,
    icons: {
      arrow: 'fa fa-caret-right/fa fa-caret-down',
      check: 'fa fa-check',
      hospital: 'fa fa-hospital-o',
      department: 'fa fa-h-square',
      section: 'fa fa-user-md'
    },
    datakey: {
      id: 'id',
      name: 'name',
      sub: 'sub'
    },
    events: {
      checked: $scope.check,
      clicked: function(){
        alert('clicked');
      }
    }
  });

  $scope.check = function(){
    alert('checked');
  };

  // 初始化通讯录列表
  function initList(){
    cnt_list.html('');
    var len = dt.length,
        items = [],
        item = null,
        ul = null,
        li = null,
        ie = null,
        span = null,
        subs = null,
        ln = 0,
        hasSub = false,
        siblings = null;
    for(var i=0; i<len; i++){
      item = $('<div class="list-group-item"></div>'); 
      items.push(item);
      subs = dt[i].sub;
      // 含二级科室
      if(subs && (ln = subs.length) > 0){
        hasSub = true;
        ie = $('<i class="fa fa-chevron-right text-muted"><i>');
        ul = $('<ul class="dept-list none"></ul>');
        // 遍历每一个二级科室并生成相应的子列表
        for(var j=0; j<ln; j++){
          li = $('<li></li>');
          li.data('id',subs[j].id);
          span = $('<span class="badge bg-default"></span>');
          span.html(Math.floor(Math.random() * 1000));
          li.html(subs[j].name).prepend(span);

          li.on('click', function(e){
            var evt = e || window.event;
            evt.stopPropagation();

            $scope.forward($(this).data('id')); // 跳转到相应的页面

            siblings = $(this).siblings();
            if(!$(this).hasClass('cur-li')){
              cnt_list.find('.cur-li').removeClass('cur-li');
              $(this).addClass('cur-li');  
            }
          });

          li.hover(function(){
            var that = $(this);
            var hBtn = $('<button type="button" class="btn btn-default" dropdown-toggle aria-haspopup="true" aria-expanded="false"><span></span></button>');
            var menu = $('<ul class="dropdown-menu"><li><a ng-href>添加</a></li><li><a ng-href ng-click="remove()">删除</a></li></ul>');
            $(this).append(hBtn).append(menu);
            hBtn.on('click', function(e){
              var evt = e || window.event;
              evt.stopPropagation();  // 阻止事件冒泡
              showMenu(that);
            });
            var b = $(this).parent().siblings('.btn-default');
            var m = $(this).parent().siblings('.dropdown-menu');
            if(b.length > 0){
              b.remove();
              m.remove();
            }
          }, function(){
            $(this).find('.dropdown-menu').remove();
            $(this).find('.btn-default').remove();
          });
          ul.append(li);
        }
        item.html(dt[i].name).prepend(ie).append(ul);
      }else{  // 不含二级科室
        hasSub = false;
        item.data('id', dt[i].id);
        span = $('<span class="badge bg-primary"></span>');
        span.html(Math.floor(Math.random() * 1000));
        item.html(dt[i].name).prepend(span);
      }
      cnt_list.append(item);
      // 定义列表行的点击事件
      item.on('click', hasSub, function(st){
        siblings = $(this).siblings();
        if(!st.data){
          if(!$(this).hasClass('cur-li')){
            cnt_list.find('.cur-li').removeClass('cur-li');
            $(this).addClass('cur-li');  
          }
        }else{
          var list = $(this).find('.dept-list');
          if(list.hasClass('none')){
            list.removeClass('none');
            $(this).find('.fa-chevron-right').addClass('fa-chevron-down').removeClass('fa-chevron-right');
          }else{
            list.addClass('none');
            $(this).find('.fa-chevron-down').addClass('fa-chevron-right').removeClass('fa-chevron-down');
          }
        }
        if($(this).data('id')){
          $scope.forward($(this).data('id')); // 跳转到相应的页面
        }
      });

      // 鼠标停留时显示操作菜单热点
      item.hover(function(e){
        var evt = e || window.event;
        var target = evt.target || evt.srcElement;
        if(target.nodeName !== 'DIV' || $(this).find('.dept-list').length > 0) {
          return;
        }
        var that = $(this);
        var hBtn = $('<button type="button" class="btn btn-default" dropdown-toggle aria-haspopup="true" aria-expanded="false"><span></span></button>');
        var menu = $('<ul class="dropdown-menu"><li><a ng-href>添加</a></li><li><a ng-href ng-click="remove()">删除</a></li></ul>');
        $(this).append(hBtn).append(menu);
        hBtn.on('click', function(e){
          var evt = e || window.event;
          evt.stopPropagation();
          showMenu(that);
        });
      }, function(){
        $(this).find('.dropdown-menu').remove();
        $(this).find('.btn-default').remove();
      });
    }

    function showMenu(obj){
      var menu = obj.find('.dropdown-menu');
      cnt_list.find('.dropdown-menu').css('display', 'none');
      var lis = menu.css('display', 'block').find('li');
      lis.on('click', function(e){
        var evt = e || window.event;
        evt.stopPropagation();
        //showMenu(that);
      });
    }

    // 初始存在的三个列表单元
    var links = [];
    var unassigned = $('<div class="list-group-item" data-id="123"><span class="badge bg-warning">624</span><i class="fa fa-bookmark fa-fw m-r-xs"></i>未分配</div>');
    var uncheck = $('<div class="list-group-item" data-id="234"><span class="badge bg-info">19</span><i class="fa fa-clock-o fa-fw m-r-xs"></i>邀请待通过</div>');
    var dimission = $('<div class="list-group-item" data-id="345"><span class="badge bg-danger">6</span><i class="fa fa-bell fa-fw m-r-xs"></i>已离职</div>');
    cnt_list.append(unassigned).append(uncheck).append(dimission);
    links.push(unassigned,uncheck,dimission);
    var len = links.length;
    while(len--){
      links[len].on('click', function(e){
        var evt = e || window.event;
        evt.stopPropagation();

        $scope.forward($(this).data('id')); // 跳转到相应的页面

        siblings = $(this).siblings();
        if(!$(this).hasClass('cur-li')){
          cnt_list.find('.cur-li').removeClass('cur-li');
          $(this).addClass('cur-li');  
        }
      });
    }
  }

  // items.eq(0).off().on('click', function(){
  //   $state.go('app.contacts.list');
  // });

  // 添加（工具栏按钮）
  $scope.addUnit = function(){
    $state.go('app.contacts.list.add');
  };

  // 编辑某一组织（工具栏按钮）
  $scope.editIt = function(){
    if($rootScope.obj['id']){
      $rootScope.details = $rootScope.obj;
      setStatus(status_false);
      $state.go('app.org.edit');
    }
  };   

  var mask = $('<div class="mask"></div>');
  var container = $('#dialog-container');
  var dialog = $('#dialog');
  var doIt = function(){};

  // 执行操作
  $rootScope.do = function(){
    doIt();
  };

  // 模态框退出
  $rootScope.cancel = function(){
    mask.remove();
    container.addClass('none');
  };  

  // 不操作返回
  $scope.return = function(){
    $rootScope.ids = [];
    setStatus(status);
    window.history.back();
  };  

  // 操作
  $scope.forward = function(id){
    console.log(id);
    if(id==='001')
    $state.go('app.contacts.list');
    else
    $state.go('app.contacts.list.add');
  };  

});
