'use strict';

// 公司申请控制器
app.controller('FillInfoController',['$scope','$http','$timeout','$state','$compile','Upload',
  function($scope,$http,$timeout,$state,$compile,Upload) {
    $scope.submitInfo = function() {
        $http.post(app.url.yiliao.fillInfo,{
            access_token:localStorage.getItem('access_token'),
            name:$scope.coName,
            description:$scope.coInfo,
            corporation:$scope.ctrlName,
            license:$scope.licNum
        }).
        success(function (data) {
            if(data.resultCode===1)
                return $state.go('access.enterprise_verify');
            return $scope.authError = data.resultMsg;
        }).
        error(function(data) {
            $scope.authError = data.resultMsg;
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
                'userId': localStorage.getItem('enterprise_id'),
                'access_token':localStorage.getItem('access_token'),
                'certType':'enterpriseImg',
                'fileName':fileName
            }
        });
        file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        file.upload.success(function (response) {
            file.result = '上传成功！';
        });
        file.upload.error(function (response) {
            $scope.authError = '上传失败！';
        });

    };
  }
]);
