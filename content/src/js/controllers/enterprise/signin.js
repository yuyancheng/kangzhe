'use strict';

// 登录控制器
app.controller('SigninFormController', ['$scope', '$http', '$state', '$cookieStore', 'utils',
  function($scope, $http, $state, $cookieStore, utils) {
    $scope.enterprise = {};
    $scope.authError = null;
    var _remember = $('#rememberInfo');
    var _isRemembered = utils.localData('enterprise_remember');
    var _telephone = utils.localData('enterprise_telephone');
    var _password = utils.localData('enterprise_password');
    //alert(_isRemembered)
    if(_isRemembered){
      _remember.attr('checked', true);
      if(_isRemembered && _telephone && _password){
        $scope.enterprise.telephone = _telephone;
        $scope.enterprise.password = _password;
      }
    } 
    $scope.login = function() {
      $scope.authError = null;
      $http.post(app.url.yiliao.login, {
        telephone: $scope.enterprise.telephone,
        password: $scope.enterprise.password,
        userType: 5,
        access_token: app.url.access_token
      }).then(function(response) {
        if (response.data.resultCode === 1) {
          var _name = response.data.data.user.name;
          var _type = $scope.userType['type_' + response.data.data.user.userType];
          var _id = response.data.data.userId;
          $scope.datas.user_name = _name;
          $scope.datas.user_type = _type;
          utils.localData('enterprise_name', _name);
          utils.localData('enterprise_type', _type);
          utils.localData('enterprise_id', _id);

          if(_remember.prop("checked")){
            utils.localData('enterprise_remember', true);
            utils.localData('enterprise_telephone', $scope.enterprise.telephone);
            utils.localData('enterprise_password', $scope.enterprise.password);
          }else{
            utils.localData('enterprise_remember', null);
            utils.localData('enterprise_telephone', null);
            utils.localData('enterprise_password', null);
          }

          app.url.access_token = response.data.data.access_token;
          utils.localData('access_token', app.url.access_token);

          var days = 1;
          var exp = new Date();
          exp.setTime(exp.getTime() + 30 * 1000);
          $cookieStore.put('enterprisename', escape($scope.enterprise.name) + ';expires=' + exp.toGMTString());
          verifyEnterprise(response.data.data);
        } else {
          $scope.authError = '用户名或密码错误';
        }
      }, function(x) {
        $scope.authError = '服务器错误';
      });
    };
    function verifyEnterprise (enterprise) {
      console.log(localStorage.getItem('access_token'));
      console.log(enterprise.userId);
      $http.post(app.url.yiliao.verifyEnterprise,{
          access_token:localStorage.getItem('access_token'),
          doctorId:enterprise.userId,
          userType:5
      }).
      success(function (data) {
        console.log(data);
        if(data.resultCode===1) 
          return $state.go('app.group_manage');
        if(data.resultCode===0&&data.resultMsg ==='您创建的公司已在审核中！') 
          return $state.go('access.enterprise_verify');
        if(data.resultCode===0) 
          return $state.go('access.Fill_Info'); 
        return $scope.authError = data.resultMsg;
      }).
      error(function(data) {
          $scope.authError = data.resultMsg;
      });
    }
  }
]);