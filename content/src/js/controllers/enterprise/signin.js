'use strict';

// 登录控制器
app.controller('SigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils',
  function($scope, $http, $state, $cookieStore, utils) {
    $scope.user = {};
    $scope.authError = null;
    var _remember = $('#rememberInfo');
    var _isRemembered = utils.localData('user_remember');
    var _telephone = utils.localData('user_telephone');
    var _password = utils.localData('user_password');
    //alert(_isRemembered)
    if(_isRemembered){
      _remember.attr('checked', true);
      if(_isRemembered && _telephone && _password){
        $scope.user.telephone = _telephone;
        $scope.user.password = _password;
      }
    } 
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

          if(_remember.prop("checked")){
            utils.localData('user_remember', true);
            utils.localData('user_telephone', $scope.user.telephone);
            utils.localData('user_password', $scope.user.password);
          }else{
            utils.localData('user_remember', null);
            utils.localData('user_telephone', null);
            utils.localData('user_password', null);
          }

          app.url.access_token = response.data.data.access_token;
          utils.localData('access_token', app.url.access_token);

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