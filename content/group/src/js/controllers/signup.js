'use strict';

// 公司注册控制器
app.controller('SignupFormController', ['$scope', '$http', '$state','utils',
  function($scope, $http, $state, utils) {
    // $scope.user = {};
    // $scope.authError = null;
    // $scope.signup = function() {
    //   $http.post(app.url.signup, {
    //     number: $scope.user.name,
    //     password: $scope.user.password
    //   }).then(function(response) {
    //     if (response.data.code == 1) {
    //       $state.go('access.signin');
    //     } else {
    //       $scope.authError = '注册失败！';
    //     }
    //   }, function(x) {
    //     $scope.authError = '服务器错误！';
    //   });
    // };
    $scope.signup =  function() {
        $http.post(app.url.signup,{
            userName:$scope.userName,
            password:$scope.userPwd,
            userPhone:$scope.userPhone,
            smsCode:$scope.smsCode
        }).
        success(function (data,status,headers,confug) {
            // body...
            console.log(data);
        }).
        error(function(data, status, headers, config) {
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });
      //$state.go('access.Fill_Info');
    }
  }
]);