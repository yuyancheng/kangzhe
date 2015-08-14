'use strict';

app.controller('ContactsListApportion', function($rootScope, $scope, $state, $timeout, $http, utils) {
  //var url = app.url.contacts.getContacts; // 后台API路径
	var container = $('#dialog_container');
  var data = null;
  var cnt_list = $('#cnt_list_apportion');
  var items = cnt_list.find('.list-group-item');
  var dt = null;
  var html = $('html');
  html.css('overflow', 'hidden');

  // 获取通讯录列表数据
  $http({
    url: 'src/api/contacts_list.json',
    method: 'get',
    data: null
  }).then(function(resp){
    if(resp.data.data && resp.data.data.length > 0){
      dt = resp.data.data;
      initList();
    }
  }, function(x) {
    console.error(x.statusText);
  });

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
          li.html(subs[j].name);

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

          ul.append(li);
        }
        item.html(dt[i].name).prepend(ie).append(ul);
      }else{  // 不含二级科室
        hasSub = false;
        item.data('id', dt[i].id);
        item.html(dt[i].name);
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
    }
  }
  

  var doIt = function(){
    // 获取医生数据
    $http({
      url: 'src/api/doctors_list.json',
      method: 'get',
      data: null
    }).then(function(resp){
      if(resp.data.data && resp.data.data.length > 0){
        dt = resp.data.data;
        if(dt.length === 0) return;
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 执行操作
  $scope.query = function(){
    doIt();
  };
  // 执行操作
  $scope.doSome = function(id){
    console.log("do something: " + id);
  }

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    window.history.back();
    //$state.go('app.contacts.list');
    html.css('overflow', 'auto');
  }; 

});