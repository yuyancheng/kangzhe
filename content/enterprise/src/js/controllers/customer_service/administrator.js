app.controller('AdminCtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
  $scope.adminstrators = [{
    firstName: 'Laurent',
    lastName: '13923052142',
    email: 'whatever@gmail.com'
  }, {
    firstName: 'Blandine',
    lastName: 'Faivre',
    email: 'oufblandou@gmail.com'
  }, {
    firstName: 'Francoise',
    lastName: 'Frere',
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


app.controller('removeModalInstanceCtrl', ['$scope', '$modalInstance', 'item','$http', function($scope, $modalInstance, item,$http) {
  console.log(item);
  $scope.item = item;
  $scope.ok = function() {
      $http.post(app.urlRoot + '/group-webapi/company/user/deleteByCompanyUser', {access_token:app.access_token,ids:item.id}).
    success(function(data, status, headers, config) {
        console.log(data);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });
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