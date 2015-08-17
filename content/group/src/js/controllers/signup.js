'use strict';

// 公司注册控制器
app.controller('SignupFormController', ['$scope', '$http', '$state','utils',
  function($scope, $http, $state, utils) {
    $scope.signup =  function() {
        $http.post(app.url.signup,{
            telephone:$scope.userPhone,
            password:$scope.userPwd,
            userType:5
        }).
        success(function (data,status,headers,confug) {
            data.resultCode ===1 ? signin() : $scope.authError = data.resultMsg;
        }).
        error(function(data, status, headers, config) {
            $scope.authError = data.resultMsg;
        });
    };
    function signin() {
        $http.post(app.url.login,{
            telephone:$scope.userPhone,
            password:$scope.userPwd,
            userType:5
        }).
        success(function (data,status,headers,confug) {
            if(data.resultCode === 1){
                utils.localData('user_ID', data.data.userId);
                utils.localData('user_name', data.data.user.name);
                utils.localData('user_type', data.data.user.userType);
                utils.localData('user_remember', null);
                utils.localData('user_telephone', data.data.user.telephone);
                utils.localData('user_password', null);
                utils.localData('access_token', data.data.access_token);
                $state.go('access.Fill_Info');
            }else{
                console.log(data.resultMsg);
            }
            
        }).
        error(function(data, status, headers, config) {
            console.log(data.resultMsg);
        });
    }
  }
]);