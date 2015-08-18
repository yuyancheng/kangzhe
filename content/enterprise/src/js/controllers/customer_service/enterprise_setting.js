app.controller('SettingCtrl', ['$scope','$modal','$log', function($scope,$modal,$log) {
    $scope.invite = function(row) {
    var inviteModal = $modal.open({
      templateUrl: 'inviteDocCreateGroupModalContent.html',
      controller: 'inviteDocCreateGroupModalCtrl'
    });

    inviteModal.result.then(function(status) {
      if (status == 'ok') {
        console.log('invite');
      }
    }, function() {
      $log.info('inviteModal dismissed at: ' + new Date());
    });
  };
}]);


app.controller('inviteDocCreateGroupModalCtrl', ['$scope', '$modalInstance','$http', function($scope, $modalInstance,$http) {
  $scope.isCollapsed = true;
  $scope.searchDoc=function(){
    $scope.isCollapsed=!$scope.isCollapsed;
  }

  $scope.inviteDoc=function(){
    $modalInstance.dismiss('cancel');

  }


  $scope.ok = function() {
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);