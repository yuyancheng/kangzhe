'use strict';

app.controller('ContactsListAdd', function($rootScope, $scope, $state, $timeout, $http, utils) {
  
	var container = $('#dialog_container');
  var dt = null;
  $scope.showResult = true;
  $scope.showNoneResult = false;
  $scope.showMsgBox = false;

  // var deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

  // if(!deptId){
  //   return;
  // }

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

      }else{
        var eleStr = '';
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 发起邀请
  $scope.invite = function(id){
    $scope.showResult = false;
    $scope.showNoneResult = true;
  };

  // 开启短信邀请
  $scope.sendMsg = function(){
    $scope.showNoneResult = false;
    $scope.showMsgBox = true;
  };
  // 发送短信
  $scope.doSend = function(){
    $scope.showMsgBox = false;
    $scope.showResult = true;
  };

  // 执行操作
  $scope.query = function(){
    console.log(9999)
    doIt();
  };

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    window.history.back();
    //$state.go('app.contacts.list');
  }; 

});