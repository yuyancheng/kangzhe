'use strict';

app.controller('ContactsListAdd', function($rootScope, $scope, $state, $timeout, $http, utils) {
  
	var container = $('#dialog_container');
  var dt = null;

  var deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

  if(!deptId){
    return;
  }

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
                '</div></div></div></div>';
        if(dt.length !== 0){
          eleStr += '<div><button onClick="doSome('+ dt[0].id +')" class="btn btn-primary btn-addon"><i class="fa fa-plus"></i>邀请加入集团</button></div>';
        }else{
          eleStr += '<div><button onClick="doSome('+ dt[0].id +')" class="btn btn-primary btn-addon"><i class="fa fa-plus"></i>发送短信邀请</button></div>';
        }  
        
        //$('#searchInfo').html(eleStr);
        function doSome(id){
          var str = '<div class="form-group">'+
                      '<div class="col-md-12">'+
                        '<textarea class="w100 form-control"></textarea>'+
                      '</div>'+
                    '</div>'+
                    '<div class="form-group">'+
                      '<div class="pull-right col-md-3">'+
                        '<button type="button" onClick="doSend('+ dt[0].id +')" class="w100 btn btn-success">发 送</button>'+
                      '</div>'+
                    '</div>';

          //$('#searchInfo').html(str);          
        }
      }else{
        var eleStr = '';
      }
    }, function(x) {
      console.error(x.statusText);
    });
  };

  // 发起邀请
  $scope.invite = function(id){
    console.log(id);
    $scope.sendMsg = true;
    $scope.gotResult = false;
    
  };

  // 开启短信邀请
  $scope.sendMsg = function(){
    $scope.send = true;
    $scope.sendMsg = false;
    
  };
  // 发送短信
  $scope.doSend = function(){
    $scope.send = false;
  };

  // 执行操作
  $scope.query = function(){
    doIt();
  };

  // 模态框退出
  $scope.cancel = function(){
    container.prev().remove();
    container.remove();
    window.history.back();
    //$state.go('app.contacts.list');
  }; 

});