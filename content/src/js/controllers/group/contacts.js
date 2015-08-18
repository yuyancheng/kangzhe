'use strict';

app.controller('Contacts', function($rootScope, $scope, $state, $http, $compile, utils) {
  var url = app.url.yiliao.getAllData; // 后台API路径
  var data = null;
  var cnt_list = $('#cnt_list');
  var items = cnt_list.find('.list-group-item');
  var dt = null;

  // 获取通讯录列表数据
/*  $http({
    url: 'src/api/contacts_list.json',
    method: 'get',
    data: null
  }).then(function(resp){
    if(resp.data.data && resp.data.data.length > 0){
      dt = resp.data.data;
      //initList();
    }
  }, function(x) {
    console.error(x.statusText);
  });*/

  // 创建通讯录列表数据
  var contacts = new Tree('cnt_list',{
    hasCheck: false,
    dataUrl: url,
    data: {
      access_token: 'ad0d05eaa3124d6e93b6ca0603cdde67',
      groupId: '55d01bdc4f13030a489463c8'
    },
    async: false,
    icons: {
      arrow: 'fa fa-caret-right/fa fa-caret-down',
      check: 'fa fa-check',
      hospital: 'fa fa-hospital-o',
      department: 'fa fa-h-square',
      section: 'fa fa-user-md'
    },
    datakey: {
      id: 'id',
      name: 'name',
      sub: 'subList'
    },
    events: {
      click: forward
    },
    callback: function(){
      var cnt_list = $('#cnt_list');
      var n = 3;
      while(n--){
        var dl = $('<dl class="cnt-list-warp"></dl>');
        var dt = $('<dt></dt>');
        var iIcon = $('<i class="fa-fw m-r-xs"></i>');
        var span = $('<span></span>');
        var num = $('<span class="badge"></span>');
        if(n === 1){
          iIcon.addClass('fa fa-bookmark');
          span.html('未分配');
          num.html('1087');
          num.addClass('bg-warning');
        }else if(n === 2){
          iIcon.addClass('fa fa-bell');
          span.html('待审核');
          num.html('1925');
          num.addClass('bg-info');
        }else{
          iIcon.addClass('fa fa-clock-o');
          span.html('已离职');
          num.html('623');
          num.addClass('bg-danger');
        }

        dt.append(num).append(iIcon).append(span);
        dl.append(dt);
        cnt_list.append(dl);

        dt.bind('click', 'id_' + n, function(e){
          $state.go('app.contacts.list', {id:e.data}, {reload:false})
        });
      }
      
      var curDepartment = cnt_list.find('.cnt-list-warp').first();
      curDepartment.find('dt').first().addClass('cur-line').trigger('click');
    }
  });

  function forward(id){
    utils.localData('curDepartmentId', id);
    $state.go('app.contacts.list',{id: id}, {reload: false});
    $scope.curDepartmentId = id;
  }

  $scope.check = function(){
    alert('checked');
  };

  // 添加（工具栏按钮）
  $scope.addUnit = function(){
    console.log($scope.curDepartmentId);
    $state.go('app.contacts.list.add');
  };

  // 编辑某一组织（工具栏按钮）
  $scope.editIt = function(){
    if($rootScope.obj['id']){
      $rootScope.details = $rootScope.obj;
      setStatus(status_false);
      $state.go('app.org.edit');
    }
  };   

  var mask = $('<div class="mask"></div>');
  var container = $('#dialog-container');
  var dialog = $('#dialog');
  var doIt = function(){};

  // 执行操作
  $rootScope.do = function(){
    doIt();
  };

  // 模态框退出
  $rootScope.cancel = function(){
    mask.remove();
    container.addClass('none');
  };  

  // 不操作返回
  $scope.return = function(){
    $rootScope.ids = [];
    setStatus(status);
    window.history.back();
  };  

  // 操作
  $scope.forward = function(id){
    console.log(id);
    if(id==='001')
    $state.go('app.contacts.list');
    else
    $state.go('app.contacts.list.add');
  };  

});
