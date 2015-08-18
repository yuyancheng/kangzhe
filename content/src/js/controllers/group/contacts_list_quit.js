'use strict';

app.controller('ContactsListAdd', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.yiliao.deleteDoctor;
	var container = $('#dialog_container');
  var dt = null;

  var deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

  if(!deptId){
    return;
  }

  var doIt = function(){
    // 获取医生数据
    $http({
      url: url,
      method: 'get',
      data: null
    }).then(function(resp){
      if(resp.data.data && resp.data.data.length > 0){
        dt = resp.data.data;
        
      }else{
        var eleStr = '';
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 执行操作
  $scope.do = function(){
    doIt();
  };

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    //window.history.back();
    $state.go('app.contacts.list.details',{},{reload:false});
  }; 

});