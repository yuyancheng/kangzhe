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
      }).state('access.enterprise_signin', {
        url: '/enterprise_signin',
        templateUrl: 'src/tpl/enterprise/signin.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/enterprise/signin.js']);
            }
          ]
        }
      }).state('access.signup', {
        url: '/signup',
        templateUrl: 'src/tpl/enterprise/signup.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/enterprise/signup.js']);
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
                return uiLoad.load(JQ_CONFIG.tree);
              });
            }
          ]
        }
      }).state('app.contacts.list', {
        url: '/list/{id}',
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
      }).state('app.contacts.list.quit', {
        url: '/quit',
        views: {
          "modalDialog@app": {
            templateUrl: 'src/tpl/group/contacts_list_quit.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/contacts_list_quit.js');
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
      }).state('app.groupSettings', {
        url: '/groupSettings',
        templateUrl: 'src/tpl/group/groupSettings.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/groupSettings.js');
              }
          ]
        }
      })
      //值班表
      .state('app.schedule', {
        url: '/schedule',
        templateUrl: 'src/tpl/group/schedule.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/group/schedule.js');
              }
          ]
        }
      })

      //集团
      .state('app.group_manage', {
        url: '/group_manage',
        templateUrl: 'src/tpl/enterprise/group_manage.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/enterprise/group_manage.js');
            }
          ]
        }
      }).state('app.group_manage.enterprise_setting', {
        url: '/enterprise_setting',
        views: {
          "@app": {
            templateUrl: 'src/tpl/enterprise/enterprise_setting.html'
          }
        },
        //templateUrl: 'src/tpl/enterprise/enterprise_setting.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/enterprise/enterprise_setting.js');
            }
          ]
        }
      }).state('app.administrator', {
        url: '/administrator',
        templateUrl: 'src/tpl/enterprise/administrator.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/enterprise/administrator.js');
            }
          ]
        }
      })

      .state('access.Fill_Info', {
        url: '/Fill_Info',
        templateUrl: 'src/tpl/enterprise/Fill_Info.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad,uiLoad) {
              return $ocLazyLoad.load('ngFileUpload').then(function(){
                return uiLoad.load(['src/js/controllers/enterprise/Fill_Info.js']);
              });
            }
          ]
        }
      }).state('access.signup_success', {
        url: '/signup_success',
        templateUrl: 'src/tpl/enterprise/signup_success.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/enterprise/signup_success.js']);
            }
          ]
        }
      }).state('access.enterprise_verify', {
        url: '/verify',
        templateUrl: 'src/tpl/enterprise/verify.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/enterprise/verify.js']);
            }
          ]
        }
      })

      // 认证审核
      .state('app.check_list_undone', {
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
      }).state('access.forgotpwd', {
        url: '/forgotpwd',
        templateUrl: 'src/tpl/forgotpwd.html'
      }).state('access.404', {
        url: '/404',
        templateUrl: 'src/tpl/404.html'
      }).state('app.mail.list', {
        url: '/inbox/{fold}',
        templateUrl: 'src/tpl/mail.list.html'
      }).state('app.mail.detail', {
        abstract: true,
        url: '/{mailId:[0-9]{1,4}}',
        templateUrl: 'src/tpl/mail.detail.html'
      })
    }
  ]);