'use strict';

//集团设置控制器
app.controller('groupSettingsCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'toJoinCoCtrl',
        size: size
      });
    };
}])
;
app.controller('toJoinCoCtrl', ['$scope','$modalInstance', function($scope,$modalInstance){
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.success = false;
    $scope.join =function () {
      $scope.success = true;
    }
}])