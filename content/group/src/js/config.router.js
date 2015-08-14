'use strict';

angular.module('app').run(
  ['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]).config(
  ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
    function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
      //$urlRouterProvider.when('/app/home');
      //$urlRouterProvider.otherwise('/app/customer_service');
      $urlRouterProvider.otherwise('/app/home');
      $stateProvider.state('app', {
        abstract: true,
        url: '/app',
        //templateUrl: 'src/tpl/app.html',
        views: {
          '': {
            templateUrl: 'src/tpl/app.html'
          },
          'footer': {
            template: '<div id="dialog-container" ui-view></div>'
          }
        }
      }).state('app.home', {
        url: '/home',
        templateUrl: 'src/tpl/home.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load(['src/js/controllers/home.js']);
            }
          ]
        }
      }).state('app.contacts', {
        url: '/contacts',
        templateUrl: 'src/tpl/group/contacts.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/contacts.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
            }
          ]
        }
      }).state('app.contacts.list', {
        url: '/list',
        templateUrl: 'src/tpl/group/contacts_list.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/contacts_list.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
            }
          ]
        }
      }).state('app.contacts.list.details', {
        url: '/details',
        views: {
          "dialogView@app": {
            templateUrl: 'src/tpl/group/contacts_list_details.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/contacts_list_details.js');
            }
          ]
        }
      }).state('app.contacts.list.add', {
        url: '/add',
        views: {
          "modalDialog@app": {
            templateUrl: 'src/tpl/group/contacts_list_add.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/contacts_list_add.js');
            }
          ]
        }
      }).state('app.contacts.list.apportion', {
        url: '/apportion',
        views: {
          "dialogView@app": {
            templateUrl: 'src/tpl/group/contacts_list_apportion.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/contacts_list_apportion.js');
            }
          ]
        }
      }).state('app.check_pass_view', {
        url: '/check_pass_view',
        templateUrl: 'src/tpl/customer_service/check_pass_view.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/check_pass_view.js');
            }
          ]
        }
      }).state('app.schedule', {
        url: '/schedule',
        templateUrl: 'src/tpl/customer_service/schedule.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/schedule.js');
              }
          ]
        }
      })
      .state('app.groupSettings', {
        url: '/groupSettings',
        templateUrl: 'src/tpl/customer_service/groupSettings.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/groupSettings.js');
              }
          ]
        }
      })
      // others
      .state('lockme', {
        url: '/lockme',
        templateUrl: 'src/tpl/lockme.html'
      }).state('access', {
        url: '/access',
        template: '<div ui-view class="fade-in-right-big smooth"></div>'
      }).state('access.signin', {
        url: '/signin',
        templateUrl: 'src/tpl/signin.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/signin.js']);
            }
          ]
        }
      }).state('access.signup', {
        url: '/signup',
        templateUrl: 'src/tpl/signup.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/signup.js']);
            }
          ]
        }
      }).state('access.Fill_Info', {
        url: '/Fill_Info',
        templateUrl: 'src/tpl/Fill_Info.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad,uiLoad) {
              return $ocLazyLoad.load('ngFileUpload').then(function(){
                return uiLoad.load(['src/js/controllers/Fill_Info.js']);
              });
            }
          ]
        }
      }).state('access.signup_success', {
        url: '/signup_success',
        templateUrl: 'src/tpl/signup_success.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/signup_success.js']);
            }
          ]
        }
      }).state('access.forgotpwd', {
        url: '/forgotpwd',
        templateUrl: 'src/tpl/forgotpwd.html'
      }).state('access.404', {
        url: '/404',
        templateUrl: 'src/tpl/404.html'
      })
    }
  ]);