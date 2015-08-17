'use strict';

app.controller('ContactsListAdd', function($rootScope, $scope, $state, $timeout, $http, utils) {
  
	var container = $('#dialog_container');
  var dt = null;
  

  var doIt = function(){
    // 获取医生数据
    $http({
      url: 'src/api/doctors_list.json',
      method: 'get',
      data: null
    }).then(function(resp){
      if(resp.data.data && resp.data.data.length > 0){
        dt = resp.data.data;
        if(dt.length === 0) return;
        var eleStr = '<div class="line line-dashed b-b line-lg pull-in"></div>'+
          '<div class="panel panel-default">'+
            '<div class="panel-heading" style="border-bottom:none">'+
              '<div class="clearfix">'+
                '<a href="" class="pull-left thumb-md avatar b-3x m-r"><img src="'+ dt[0].imgUrl +'" alt="..."></a>'+
                '<div class="clear">'+
                  '<div class="h3 m-t-xs m-b-xs">'+ dt[0].name +'</div>'+
                  '<small class="text-muted">'+ dt[0].title +' / '+ dt[0].department +' / '+ dt[0].hospital +'</small>'+
                '</div></div></div></div>'+
          '<div><button ng-click="doSome('+ dt[0].id +')" class="btn btn-primary btn-addon"><i class="fa fa-plus"></i>邀请加入集团</button></div>';
        $('#searchInfo').html(eleStr);
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 执行操作
  $scope.query = function(){
    doIt();
  };
  // 执行操作
  $scope.doSome = function(id){
    console.log("do something: " + id);
  }

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    window.history.back();
    //$state.go('app.contacts.list');
  }; 

});