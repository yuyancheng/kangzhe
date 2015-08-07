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
      }).state('app.check_list_undone', {
        url: '/check_list_undone',
        templateUrl: 'src/tpl/customer_service/check_list_undone.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_undone.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
            }
          ]
        }
      }).state('app.check_list_pass', {
        url: '/check_list_pass',
        templateUrl: 'src/tpl/customer_service/check_list_pass.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_pass.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
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
      }).state('app.check_list_nopass', {
        url: '/check_list_nopass',
        templateUrl: 'src/tpl/customer_service/check_list_nopass.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/check_list_nopass.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
            }
          ]
        }
      }).state('app.check_nopass_view', {
        url: '/check_nopass_view',
        templateUrl: 'src/tpl/customer_service/check_nopass_view.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/check_nopass_view.js');
            }
          ]
        }
      }).state('app.check_edit', {
        url: '/check_edit',
        templateUrl: 'src/tpl/customer_service/check_edit.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/check_edit.js');
            }
          ]
        }
      }).state('app.feedback_undone', {
        url: '/feedback_undone',
        templateUrl: 'src/tpl/customer_service/feedback_undone.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_undone.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
            }
          ]
        }
      }).state('app.feedback_view', {
        url: '/feedback_view',
        templateUrl: 'src/tpl/customer_service/feedback_view.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/customer_service/feedback_view.js');
            }
          ]
        }
      })
      // pages
      .state('app.page', {
        url: '/page',
        template: '<div ui-view class="fade-in-down"></div>'
      }).state('app.page.profile', {
        url: '/profile',
        templateUrl: 'src/tpl/temp/page_profile.html'
      }).state('app.docs', {
        url: '/docs',
        templateUrl: 'src/tpl/temp/docs.html'
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
      }).state('access.forgotpwd', {
        url: '/forgotpwd',
        templateUrl: 'src/tpl/forgotpwd.html'
      }).state('access.404', {
        url: '/404',
        templateUrl: 'src/tpl/404.html'
      }).state('app.mail', {
        abstract: true,
        url: '/mail',
        templateUrl: 'src/tpl/mail.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/app/mail/mail.js', 'src/js/app/mail/mail-service.js',
                JQ_CONFIG.moment
              ]);
            }
          ]
        }
      }).state('app.mail.list', {
        url: '/inbox/{fold}',
        templateUrl: 'src/tpl/mail.list.html'
      }).state('app.mail.detail', {
        url: '/{mailId:[0-9]{1,4}}',
        templateUrl: 'src/tpl/mail.detail.html'
      }).state('layout.mobile', {
        url: '/mobile',
        views: {
          '': {
            templateUrl: 'src/tpl/layout_mobile.html'
          },
          'footer': {
            templateUrl: 'src/tpl/layout_footer_mobile.html'
          }
        }
      }).state('app.todo.list', {
        url: '/{fold}'
      })
    }
  ]);