'use strict';

app.controller('GroupManageCtrl', ['$scope', '$http', '$location',
	function($scope, $http, $location) {

		// 虚拟数据

		//这里是虚拟的token
		$scope.access_token=localStorage.getItem('access_token');
		$scope.enterprise_id = localStorage.getItem('enterprise_id');
		console.log($scope.access_token);
		console.log($scope.enterprise_id);
		$scope.companyName = null;
		$scope.groupList = null;
		//验证公司账户
		$http.post(app.urlRoot + '/group-webapi/company/user/verifyByCuser', {
			access_token: $scope.access_token,
			doctorId: $scope.enterprise_id,
			userType: 5
		}).
		success(function(data, status, headers, config) {
			console.log(data);
			$scope.groupList = data.data.groupList.pageData;
		}).
		error(function(data, status, headers, config) {
			console.log(data);
		});

		$scope.linkToInvite = function() {
			$location.url($location.url() + "/enterprise_setting");
		};

		// 这里导航到创建新集团
		$scope.linkToGroup = function() {
			console.log($location.url() + "/groupSetting");
			$location.url($location.url() + "/groupSetting");
		}

	}
]);