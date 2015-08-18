'use strict';

// 公司注册控制器
app.controller('SignupFormController', ['$scope', '$http', '$state','utils',
  function($scope, $http, $state, utils) {
    $scope.getSmsBT = "获取验证码";
    $scope.getSmsBTState = false;
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
    $scope.getSMS = function () {
        $scope.getSmsBTState = true;
        $http.post(app.url.getSMS,{
            telephone:$scope.userPhone,
            templateId:25118
        }).
        success(function (data,status,headers,confug) {
            if(true){
                $scope.getSmsBT = 10;
                var getSms = setInterval(function () {
                    $scope.$apply(function () {
                        $scope.getSmsBT -- ;
                        if($scope.getSmsBT==0){
                            $scope.getSmsBT='获取验证码';
                            $scope.getSmsBTState = false;
                            clearInterval(getSms);
                        }
                    });
                },1000)
            }else{
                $scope.authError = data.resultMsg
            }
        })
    };
    $scope.$watch('smsCode',function(newValue,oldValue,scope){
        $scope.smsCodeResult = false;
        if(!$scope.userPhone||!$scope.smsCode||$scope.smsCode.length<4){
            return;
        }
        $http.post(app.url.verifySMS,{
            telephone:$scope.userPhone,
            randcode:$scope.smsCode,
            templateId:25118
        }).
        success(function (data,status,headers,confug) {
            if(data.resultCode==1){
                $scope.smsCodeResult = true;
            }else{
                $scope.authError = data.resultMsg;
            }
        })
    });
    function signin() {
        $http.post(app.url.login,{
            telephone:$scope.userPhone,
            password:$scope.userPwd,
            userType:5
        }).
        success(function (data,status,headers,confug) {
            if(data.resultCode === 1){
                utils.localData('enterprise_id', data.data.userId);
                utils.localData('enterprise_name', data.data.user.name);
                utils.localData('enterprise_type', data.data.user.userType);
                utils.localData('enterprise_remember', null);
                utils.localData('enterprise_telephone', data.data.user.telephone);
                utils.localData('enterprise_password', null);
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