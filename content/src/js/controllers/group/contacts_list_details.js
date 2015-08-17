'use strict';

app.controller('ContactsListDetails', function($rootScope, $scope, $state, $timeout, $http, utils) {
  
	var container = $('#dialog_container');
  var dt = null;
  var html = $('html');
  html.css('overflow', 'hidden');
  

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
  // 执行操作
  $scope.apportion = function(id){
    $state.go('app.contacts.list.apportion');
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