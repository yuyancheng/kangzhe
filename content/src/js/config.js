// config
var app = angular.module('app').config(
  ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider',
    function($controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider) {
      // lazy controller, directive and service
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      app.constant = $provide.constant;
      app.value = $provide.value;

      // API路径集合
      //app.urlRoot = '/kangzhe/';
      app.urlRoot = 'http://192.168.3.7:8091/';
      app.urlFile = '/upload/'
      //app.urlFile = 'http://192.168.3.7:9000/';
      //app.urlRoot = 'http://localhost:8070/kangzhe/{_proxy}/';
      var common = {
        list: 'list.iv',
        save: 'save.iv',
        edit: 'edit.iv',
        modify: 'modify.iv',
        //delete: 'delete.iv',
        delete: 'batchDelete.iv',
        find: 'findByIds.iv',
        view: 'view.iv'
      };

      function getApi(name, common) {
        var apis = {};
        for (var n in common) {
          apis[n] = app.urlRoot + name + '/' + common[n];
        }
        return apis;
      }
      app.url = {
        access_token: 'a6ca04531c9945bc9d68ba05ea5c747d',

        login:  app.urlRoot + 'user/login',
        logout: app.urlRoot + 'user/logout',
        admin: {
          check: {
            getDoctors:   app.urlRoot + 'admin/check/getDoctors',
            getDoctor:    app.urlRoot + 'admin/check/getDoctor',
            getArea:      app.urlRoot + 'admin/check/getArea',
            getHospitals: app.urlRoot + 'admin/check/getHospitals',
            getDepts:     app.urlRoot + 'admin/check/getDepts',
            getTitles:    app.urlRoot + 'admin/check/getTitles',
            checked:      app.urlRoot + 'admin/check/checked',
            fail:         app.urlRoot + 'admin/check/fail'
          }
        },
        feedback: {
          query: app.urlRoot + 'feedback/query',
          get: app.urlRoot + 'feedback/get'
        },
        upload: {
          getCertPath: app.urlFile + 'getCertPath'
        },

        currentUser:  app.urlRoot + 'user/currentUserInfo.iv',
        menus:        app.urlRoot + 'mainMenuItem/list.iv',
        orgUnits:     app.urlRoot + 'adminOrgUnit/allAdminOrgUnits.iv',
        orgTypes:     app.urlRoot + 'orgUnitLayerType/allAdminOrgUnits.iv',
        org: {
          api:      getApi('adminOrgUnit', common),
          freeze:   app.urlRoot + 'adminOrgUnit/freeze.iv',
          allUnits: app.urlRoot + 'adminOrgUnit/allAdminOrgUnits.iv',
          subUnits: app.urlRoot + 'adminOrgUnit/directSubAdminOrgUnits.iv'
        },        
        orgLayer: {
          api: getApi('orgUnitLayer', common)
        },        
        employee: {
          api: getApi('person', common)
        },        
        position: {
          api: getApi('position', common)
        },
        //orgLayer: app.urlRoot + 'orgUnitLayer/list.iv',
        orgSave:  app.urlRoot + 'adminOrgUnit/save.iv',
        orgEdit:  app.urlRoot + 'adminOrgUnit/modify.iv',
        position: app.urlRoot + 'position/list.iv',
        employee: app.urlRoot + 'person/list.iv',
        signup:   app.urlRoot + 'person/save.iv',
        system:   app.urlRoot + 'param/list.iv'
      };
      app.lang = {
        datatables: {
          translation: {
            "sLengthMenu": "每页 _MENU_ 条",
            "sZeroRecords": "没有找到符合条件的数据",
            "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
            "sInfo": "当前第 _START_ - _END_ 条，共 _TOTAL_ 条",
            "sInfoEmpty": "没有记录",
            "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
            "sSearch": "搜索",
            "oPaginate": {
              "sFirst": "<<",
              "sPrevious": "<",
              "sNext": ">",
              "sLast": ">>"
            }
          }
        }
      }
    }
  ]).config(['$translateProvider',
  function($translateProvider) {
    // 注册一个静态文件加载器，模块会在指定的url中查找翻译词典
    // url结构为 [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'src/l10n/',
      suffix: '.js'
    });
    // 设置默认语言
    $translateProvider.preferredLanguage('en');
    // 存储默认语言(本地)
    $translateProvider.useLocalStorage();
  }
]).factory('authorityInterceptor', [
  function() {

    var authorityInterceptor = {
      response: function(response) {
        if ('no permission' == response.data) {
          app.controller('Interceptor', ['$state',
            function($state) {
              app.state.go('access.404');
            }
          ]);
        }
        if ("no login" == response.data) {
          app.state.go('access.signin');
        }
        return response;
      }
    };
    return authorityInterceptor;
  }
]).config(
  ['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('authorityInterceptor');
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.transformRequest = [

        function(data) {
          return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data,true) : data;
        }
      ];
    }
  ]);