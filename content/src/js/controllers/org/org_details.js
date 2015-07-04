'use strict';

app.controller('OrgDetails', function($http, $rootScope, $scope, $state) {
	var dt = $rootScope.details;
  var id = '';
  //$scope.setStatus($scope.status_false);
  if(dt){
  	$scope.details = dt;
    id = dt.id;
    if(!app.utils.localData('idVal', dt.id)){
      console.error('数据未保存！');
    }
  }else{
    id = app.utils.localData('idVal');
    if(!id) {
      console.error('无有效数据！');
      return;
    }else{
	    $http({
	      url: app.url.org.api.edit,
	      data: {
	        id: id
	      },
	      method: 'POST'
	    }).then(function(dt) {
	      $scope.details = dt.data.editData;
	    });
    }
  }
});