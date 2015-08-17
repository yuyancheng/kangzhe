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
      app.urlRoot = '/kangzhe/';
      app.urlFile = '/upload/';
      app.yiliao = '/yiliao/';
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
        access_token: localStorage.getItem('access_token'),

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
        signup:app.urlRoot + 'user/register',
        yiliao: {
          signup: app.yiliao + 'signup',
          login: app.yiliao + 'login',
          fillInfo: app.yiliao + 'group-webapi/company/regCompany'
        }

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