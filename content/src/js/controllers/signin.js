'use strict';

// 登录控制器
app.controller('SigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils',
  function($scope, $http, $state, $cookieStore, utils) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      $http.post(app.url.login, {
        telephone: $scope.user.telephone,
        password: $scope.user.password,
        userType: 2,
        access_token: app.url.access_token
      }).then(function(response) {
        if (response.data.resultCode === 1) {
          var _name = response.data.data.user.name;
          var _type = $scope.userType['type_' + response.data.data.user.userType];
          $scope.datas.user_name = _name;
          $scope.datas.user_type = _type;
          utils.localData('user_name', _name);
          utils.localData('user_type', _type);
          var days = 1;
          var exp = new Date();
          exp.setTime(exp.getTime() + 30 * 1000);
          $cookieStore.put('username', escape($scope.user.name) + ';expires=' + exp.toGMTString());
          $state.go('app.home');
        } else {
          $scope.authError = '用户名或密码错误';
        }
      }, function(x) {
        $scope.authError = '服务器错误';
      });
    };
  }
]);