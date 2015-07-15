'use strict';

app.controller('FeedbackView', ['$scope', '$http', '$state', '$rootScope', 'utils', 
  function($scope, $http, $state, $rootScope, utils) {
    $scope.authError = null;
    $scope.viewData = {};
    var id = '';
    if($scope.details){
      id = $scope.details.id;
      if(!utils.localData('idVal', id)){
        console.error('数据未保存！');
      }
    }else{
      id = utils.localData('idVal');
      if(!id) {
        console.error('无有效数据！');
        return;
      }
    }

    // 获取要审核的医生数据
    $http({
      url: app.url.feedback.get,
      data: {
        id: id,
        access_token: app.url.access_token
      },
      method: 'POST'
    }).then(function(dt) {
      if(dt.data.resultCode !== 1){
        $scope.authError = '获取数据失败！';
        return;
      }
      dt = dt.data.data;
      $scope.viewData = {
        userId: dt.userId || '--',
        userName: dt.userName || '--',
        clientVersion: dt.clientVersion || '--',
        phoneSystem: dt.phoneSystem || '--',
        content: dt.content || '--',
        phoneModel: dt.phoneModel || '--',
        createTime: new Date(dt.createTime).toLocaleString().replace(/\//g,'-') || '--'
      }
    });

    // 不操作返回
    $scope.return = function(){
      $rootScope.ids = [];
      window.history.back();
    }; 
  }
]);