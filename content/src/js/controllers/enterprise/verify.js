'use strict';

// 公司申请控制器
app.controller('FillInfoController',['$scope','$http',
  function($scope,$http) {
    $http.post(app.url.yiliao.verifyEnterprise,{
      access_token:localStorage.getItem('access_token'),
      doctorId:localStorage.getItem('enterprise_id')
    }).
    success(function (data) {
    //console.log(data);
    // if(data.resultCode===1) 
    //   return $state.verifyState = 1;
    if(data.resultCode===0&&data.resultMsg ==='您创建的公司已在审核中！') 
      return $scope.verifyState = 2;
    if(data.resultCode===0)
      return $scope.verifyState = 0; 
    return $scope.authError = data.resultMsg;
    }).
    error(function(data) {
      $scope.authError = data.resultMsg;
    });
  }
]);
