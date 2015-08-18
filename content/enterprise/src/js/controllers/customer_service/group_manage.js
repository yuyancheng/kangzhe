'use strict';

app.controller('GroupManageCtrl', ['$scope', '$http', '$location',
	function($scope, $http, $location) {

		// 虚拟数据

		//这里是虚拟的token
		$scope.companyName = null;
		$scope.groupList = null;
		//验证公司账户
		$http.post(app.urlRoot + '/group-webapi/company/user/verifyByCuser', {
			access_token: app.access_token,
			doctorId: 9,
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


		$scope.linkToGroup = function() {
			console.log($location.host() + ':' + $location.port() + '/group/#/app/groupSettings');
			window.location.href = $location.host() + ':' + $location.port() + '/group/#/app/groupSettings';
		}

	}
]);