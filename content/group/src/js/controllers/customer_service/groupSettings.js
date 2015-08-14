'use strict';

//集团设置控制器
app.controller('groupSettingsCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'toJoinCoCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
}])
;
app.controller('toJoinCoCtrl', ['$scope','$modalInstance', function($scope,$modalInstance){
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.success = true;
    $scope.join =function () {
      $scope.success = false;
    }
}])