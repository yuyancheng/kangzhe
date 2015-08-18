app.config(['ngClipProvider', function(ngClipProvider) {
  ngClipProvider.setPath("/zeroclipboard-2.2.0/dist/ZeroClipboard.swf");
}]);
app.controller('AdminCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
  $scope.adminstrators = [{
    firstName: 'Laurent',
    lastName: '13923052142',
    birthDate: new Date('1987-05-21'),
    balance: 102,
    email: 'whatever@gmail.com'
  }, {
    firstName: 'Blandine',
    lastName: 'Faivre',
    birthDate: new Date('1987-04-25'),
    balance: -2323.22,
    email: 'oufblandou@gmail.com'
  }, {
    firstName: 'Francoise',
    lastName: 'Frere',
    birthDate: new Date('1955-08-27'),
    balance: 42343,
    email: 'raymondef@gmail.com'
  }];

  $scope.removeRow = function(row) {
    var removeModal = $modal.open({
      templateUrl: 'removeModalContent.html',
      controller: 'removeModalInstanceCtrl',
      size: 'sm',
      resolve: {
        item: function() {
          return row;
        }
      }
    });

    removeModal.result.then(function(status) {
      if (status == 'ok') {
        console.log('dfdfdfdfdf');
        var index = $scope.adminstrators.indexOf(row);
        if (index !== -1) {
          $scope.adminstrators.splice(index, 1);
        }
      }
    }, function() {
      $log.info('removeModal dismissed at: ' + new Date());
    });

    // var index = $scope.adminstrators.indexOf(row);
    // if (index !== -1) {
    //   $scope.adminstrators.splice(index, 1);
    // }
  };

  $scope.invite = function() {
    var inviteModal = $modal.open({
      templateUrl: 'inviteDocToManageModalContent.html',
      controller: 'inviteDocToManageModalCtrl'
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


app.controller('removeModalInstanceCtrl', ['$scope', '$modalInstance', 'item', function($scope, $modalInstance, item) {
  $scope.item = item;
  $scope.ok = function() {
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);

app.controller('inviteDocToManageModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {

  $scope.isCollapsed = true;
  $scope.searchDoc = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
  }

  $scope.inviteDoc = function() {
    $modalInstance.dismiss('cancel');

  }

  $scope.ok = function() {
    $modalInstance.close('ok');
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);