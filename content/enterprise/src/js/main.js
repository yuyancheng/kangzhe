'use strict';
/* Controllers */
angular.module('app').controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$http', '$state','$cookieStore', 'utils',
  function($scope, $translate, $localStorage, $window, $http, $state,$cookieStore,utils) {
    // add 'ie' classes to html
    var isIE = !! navigator.userAgent.match(/MSIE/i);
    isIE && angular.element($window.document.body).addClass('ie');
    isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
    app.state = $state;
    // config
    $scope.app = {
      token:'3fa603629d3d4b5f9c6557554fbc5422',
      name: '健康伽平台',
      version: '1.0.0',
      // for chart colors
      color: {
        primary: '#7266ba',
        info: '#23b7e5',
        success: '#27c24c',
        warning: '#fad733',
        danger: '#f05050',
        light: '#e8eff0',
        dark: '#3a3f51',
        black: '#1c2b36'
      },
      settings: {
        themeID: 8,
        navbarHeaderColor: 'bg-black',
        navbarCollapseColor: 'bg-white-only',
        asideColor: 'bg-black',
        headerFixed: true,
        asideFixed: true,
        asideFolded: false,
        asideDock: false,
        container: false
      }
    }

    //这里是虚拟的token
    $scope.access_token = '3fa603629d3d4b5f9c6557554fbc5422';
    $scope.companyName = null;
    //验证公司账户
    $http.post(app.urlRoot + '/group-webapi/company/user/verifyByCuser', {
      access_token: $scope.access_token,
      doctorId: 9,
      userType: 5
    }).
    success(function(data, status, headers, config) {
        console.log(data);
        var companyId = data.data.groupList.pageData[0].companyId;
        $http.post(app.urlRoot+'/group-webapi/company/getCompanyById',{
          id:companyId,
          access_token:$scope.access_token
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.companyName=data.data.bankAccount;
          }).
          error(function(data, status, headers, config) {
            console.log(data);
          })
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });

    // save settings to local storage
    if (angular.isDefined($localStorage.settings)) {
      $scope.app.settings = $localStorage.settings;
    } else {
      $localStorage.settings = $scope.app.settings;
    }
    $scope.$watch('app.settings', function() {
      if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
        // aside dock and fixed must set the header fixed.
        $scope.app.settings.headerFixed = true;
      }
      // save to local storage
      $localStorage.settings = $scope.app.settings;
    }, true);
    // angular translate
    $scope.lang = {
      isopen: false
    };
    $scope.langs = {
      //en: 'English',
      zh_CN: '中文（简体）'
    };
    $scope.userType = {
      type_1: '患者',
      type_2: '医助',
      type_3: '医生',
      type_4: '客服'
    };
    $scope.datas = {
      user_name: utils.localData('user_name') || ' ',
      user_type: utils.localData('user_type') || ' ',
      check_undo: utils.localData('check_undo') || 0,
      check_pass: utils.localData('check_pass') || 0,
      check_nopass: utils.localData('check_nopass') || 0,
      feedback_undo: utils.localData('feedback_undo') || 0
    };
    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文（简体）";
    $scope.setLang = function(langKey, $event) {
      // set the current lang
      $scope.selectLang = $scope.langs[langKey];
      // You can change the language during runtime
      $translate.use(langKey);
      $scope.lang.isopen = !$scope.lang.isopen;
    };

    // 设置默认语言为中文
    $scope.selectLang = $scope.langs['zh_CN'];
    $translate.use('zh_CN');
    $scope.app.ui = {};
    var uiInit = $scope.app.ui.init = function() {
      $http.get('src/api/nav_items').then(function(resp) {
        if (resp.data.datalist) {
          $scope.app.ui.items = resp.data.datalist;
        };
      });
    };
    //uiInit();

    // 用户退出
    $scope.logout = function(){
      $http.get(app.url.logout + '?' + $.param({
        access_token: app.url.access_token
      })).then(function(response) {
        if (response.statusText === 'OK') {
          $cookieStore.remove('username');
          $state.go('access.signin');
        } else {
          console.log("Logout: " + response.statusText);
        }
      }, function(x) {
        console.log("Logout: " + x.statusText);
      });
    };

    function isSmartDevice($window) {
      // Adapted from http://www.detectmobilebrowsers.com
      var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
      // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
      return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

  }
]);