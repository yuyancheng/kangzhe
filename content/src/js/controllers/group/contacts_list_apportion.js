'use strict';

app.controller('ContactsListApportion', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.yiliao.getAllData, 
      container = $('#dialog_container'),
      data = null,
      cnt_list = $('#cnt_list_apportion'),
      dt = null,
      html = $('html'),
      list_wrapper = $('#cnt_list_wrapper'),
      list_arr = [],
      deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

  if(!deptId){
    return;
  };

  $scope.formData = {};
  html.css('overflow', 'hidden');

  list_wrapper.html('');

  // 初始化通讯录列表
  var contacts = new Tree('cnt_list_apportion',{
    hasCheck: true,
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
      click: check
    },
    callback: function(){
      var cnt_list = $('#cnt_list_apportion');
    }
  });
  
  function check(id, name){
    if(list_arr.indexOf(id) !== -1) return;
    $scope.formData.id = id;
    $scope.formData.name = name;
    list_arr.push(id);
    var span = $('<span class="label-btn btn-info"></span>');
    var i = $('<i class="fa fa-times"></i>');
    span.html(name).data('id', id).append(i);
    list_wrapper.append(span);
    i.on('click', function(){
      var idx = 0;
      $(this).parent().remove();
      if(idx = list_arr.indexOf(id) !== -1){
        list_arr.splice(idx, 1);
      }
    });
  }

  // 执行操作
  $scope.save = function(){
    $http({
      url: app.url.yiliao.saveDoctor,
      method: 'post',
      data: {
        access_token: 'ad0d05eaa3124d6e93b6ca0603cdde67',
        departmentIds: list_arr,
        doctorId: $scope.details.id
      }
    }).then(function(resp){
      if(resp.data.resultCode === 1){
        console.log("分配成功！");
      }else{
        console.warn("分配失败！");
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    window.history.back();
    //$state.go('app.contacts.list');
    html.css('overflow', 'auto');
  }; 

});