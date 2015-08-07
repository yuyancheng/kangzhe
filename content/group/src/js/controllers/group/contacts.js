'use strict';

app.controller('Contacts', function($rootScope, $scope, $state, $http) {
  //var url = app.url.contacts.getContacts; // 后台API路径
  var data = null;
  var cnt_list = $('#cnt_list');
  var items = cnt_list.find('.list-group-item');
  var dt = null;

  $http({
    url: 'src/api/contacts_list.json',
    method: 'get',
    data: null
  }).then(function(resp){
    if(resp.data.data && resp.data.data.length > 0){
      dt = resp.data;
      initList();
    }
  }, function(msg){
    console.log(msg);
  });


  function initList(){
    cnt_list.html('');
    var len = dt.length,
        items = [],
        item = null,
        ul = null,
        li = null,
        i = null,
        span = null,
        subs = null,
        ln = 0,
        hasSub = false;
    for(var i=0; i<len; i++){
      item = $('<div class="list-group-item"></div>'); 
      items.push(item);
      subs = dt[i].sub;
      if(subs && (ln = subs.length) > 0){
        hasSub = true;
        i = $('<i class="fa fa-chevron-right text-muted"><i>');
        ul = $('<ul class="dept-list none"></ul>');
        for(var j=0; j<ln; j++){
          li = $('<li class="dept-list"></li>');
          span = $('<span class="badge bg-default"></span>');
          li.html(subs[j].name).prepend(span);
          ul.append(li);
        }
        item.html(dt[i].name).prepend(i).append(ul);
      }else{
        hasSub = false;
        span = $('<span class="badge bg-default"></span>');
        item.html(dt[i].name).prepend(span);
      }
      cnt_list.append(item);
      item.on('click', function(){
        if(!hasSub && !$(this).hasClass('cur-li')){
          $(this).addClass('cur-li').siblings('.cur-li').removeClass('cur-li');
        }else{
          $(this).find('.dept-list').removeClass('none');
        }
        
      });
    }
  }

  // items.eq(0).off().on('click', function(){
  //   $state.go('app.contacts.list');
  // });

  // 添加组织（工具栏按钮）
  $scope.addUnit = function(){
    if($rootScope.ids.length === 0){
      $rootScope.details = {};
    }
    setStatus(status_false);
    $state.go('app.org.add');
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

});