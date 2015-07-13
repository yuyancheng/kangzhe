'use strict';

app.controller('CheckListPass', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.admin.check.getDoctors; // 后台API路径
  var data = null;

  // 从后台获取数据
/*  $http.post(url,{
    status: 1,
    access_token: app.url.access_token
  }).then(function(resp) {
    if (resp.data.resultCode === 1) {
      data = resp.data.data;

      utils.localData('check_pass', data.length);
      $scope.datas.check_pass = data.length;

      if(dTable){
        dTable.fnDestroy();
        initTable();
      }else{
        initTable();
      }
      $scope.loading = false;
    } else {
      console.warn(resp.statusText);
    }
  }, function(err) {
    console.error(err.statusText);
  });*/

  // 查看某一审核信息
  $scope.checkIt = function(){
    if($rootScope.obj['userId']){
      $rootScope.details = $rootScope.obj;
      $state.go('app.check_pass_view');
    }
  };

  ////////////////////////////////////////////////////////////

  var id_key = null;
  $rootScope.init = function(){
    id_key = {
      "parent": $scope.item_id
    };
    utils.getData(url, id_key, function callback(dt){
      data = dt;
      if(dTable){
        dTable.fnDestroy();
        initTable();
      }else{
        initTable();
      }
    });
  };

  $rootScope.ids = [];

  function clicked(that){
    $rootScope.details = $rootScope.obj = utils.getDataByKey(data, 'userId', that.data('id'));
    var id = $rootScope.obj['id'];
    $rootScope.ids.push(id);
    $scope.checkIt();
  }

  // 初始化表格 jQuery datatable
  var doctorList, dTable;
  function initTable() {
    doctorList = $('#doctorList_pass');
    //utils.extendHash(data, ["doctorNum","title","hospital","name","telephone"]);
    dTable = doctorList.dataTable({
      //"serverSide": true,
      "ajax": {
        url: url,
        type: 'post',
        data: {
          pageIndex: 2,
          pageSize: 8,
          status: 1,
          access_token: app.url.access_token
        }
      },
      "search": null,
      "language": app.lang.datatables.translation,
      "createdRow": function(nRow, aData, iDataIndex){
        utils.extendHash(aData, ["doctorNum","title","hospital","name","telephone"]);
        $(nRow).attr('data-id', aData['userId']);
      },
      "columns": [{
        "data": "doctorNum"
      }, {
        "data": "title"
      }, {
        "data": "hospital"
      }, {
        "data": "name"
      }, {
        "data": "telephone"
      }]
    });

    // 表格行事件
    dTable.$('tr').click(function(e) {
      clicked($(this));
    });
  }

  initTable();

});