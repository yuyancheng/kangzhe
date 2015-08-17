'use strict';

// 公司申请控制器
app.controller('FillInfoController',['$scope','$http','$timeout','$compile','Upload',
  function($scope,$http,$timeout,$compile,Upload) {
    $scope.submitInfo = function() {
        console.log(app.url.yiliao.fillInfo);
        console.log('access_token:'+localStorage.getItem('access_token'))
        console.log('name:'+$scope.coName)
        console.log('description:'+$scope.coInfo)
        console.log('corporation:'+$scope.ctrlName)
        console.log('license:'+$scope.licNum)
        $http.post(app.url.yiliao.fillInfo,{
            access_token:localStorage.getItem('access_token'),
            name:$scope.coName,
            description:$scope.coInfo,
            corporation:$scope.ctrlName,
            license:$scope.licNum
        }).
        success(function (data,status,headers,confug) {
            //console.log(data);
            if(data.resultCode===1){
                $state.go(app.groupSettings);
            }
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        });
    };
    $scope.$watch('licPic', function (files) {
        goUpload (files,'licPic');
    });
    $scope.$watch('ctrlPic',function (files) {
        goUpload (files,'ctrlPic');
    });
    function goUpload (files,fileName) {
        if (files != null) {
            if (!angular.isArray(files)) {
                files = [files];
            }
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (f,fileName) {
                    upload(f,fileName);
                })(files[i],fileName);
            }
        }
    };
    function upload (file,fileName) {
        file.upload = Upload.upload({
            url:app.urlFile + '/cert',
            file:file,
            fileName:fileName,
            fields: {
                'userId': localStorage.getItem('user_ID'),
                'access_token':localStorage.getItem('access_token'),
                'certType':'enterpriseImg',
                'fileName':fileName
            }
        });
        file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        file.upload.success(function (response) {
            console.log(response);
            file.result = '上传成功！';
        });
        file.upload.error(function (response) {
            console.log(response);
        });

    };
    $scope.go = function () {
        $http.post(app.url.login,{
            telephone:13286572869,
            password:123456,
            userType:5
        }).
        success(function (data,status,headers,confug) {
            if(data.resultCode===1){
                console.log(data);                
            }
        })    
    }
  }
]);
