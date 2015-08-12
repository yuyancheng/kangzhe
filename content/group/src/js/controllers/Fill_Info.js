'use strict';

// 公司申请控制器
app.controller('FillInfoController',['$scope','$http','$timeout','$compile','Upload',
  function($scope,$http,$timeout,$compile,Upload) {
    $scope.submit = function() {
      alert('成功提交');
    };
    $scope.$watch('licPic', function (files) {
        goUpload (files);
    });
    $scope.$watch('ctrlPic',function (files) {
        goUpload (files);
    });
    function goUpload (files) {
        if (files != null) {
            if (!angular.isArray(files)) {
                files = [files];
            }
            for (var i = 0; i < files.length; i++) {
                $scope.errorMsg = null;
                (function (f) {
                    upload(f);
                })(files[i]);
            }
        }
    };
    function upload (file) {
        //console.log(file);
        file.upload = Upload.upload({
            url:'https://angular-file-upload-cors-srv.appspot.com/upload',
            file:file,
            fileName:['文件名']
        });
        file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        file.upload.success(function (response) {
            //console.log(response.result);
            file.result = '上传成功！';
        });
        file.upload.error(function (response) {
            console.log(response.status);
        });
    };
  }
]);
