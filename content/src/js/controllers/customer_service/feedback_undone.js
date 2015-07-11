'use strict';

app.controller('FeedbackUndone', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.feedback.query; // 后台API路径
  var data = null;

  // 从后台获取数据
  $http.post(url,{
    access_token: app.url.access_token
  }).then(function(resp) {
    if (resp.data.resultCode === 1) {
      data = resp.data.data.pageData;

      utils.localData('feedback_undo', data.length);
      $scope.datas.feedback_undo = data.length;

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
  });

  // 编辑某一组织（工具栏按钮）
  $scope.checkIt = function(){
    if($rootScope.obj['userId']){
      $rootScope.details = $rootScope.obj;
      $state.go('app.feedback_view');
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
    $rootScope.details = $rootScope.obj = utils.getDataByKey(data, '_id', that.data('id'));
    var id = $rootScope.obj['id'];
    $rootScope.ids.push(id);
    $scope.checkIt();
  }

  // 初始化表格 jQuery datatable
  var doctorList, dTable;
  function initTable() {
    doctorList = $('#feedbackList');
    utils.extendHash(data, ["userId","userName","clientVersion","content","phoneSystem","phoneModel","createTime"]);
    dTable = doctorList.dataTable({
      "search": null,
      "data": data,
      //"oLanguage": app.lang.datatables.translation,
      "fnCreatedRow": function(nRow, aData, iDataIndex){
        $(nRow).attr('data-id', aData['_id']);
      },
      "aoColumns": [{
        "mDataProp": "userId"
      }, {
        "mDataProp": "userName"
      }, {
        "mDataProp": "clientVersion"
      }, {
        "mDataProp": "content"
      }, {
        "mDataProp": "createTime",
        "render": function(o) {
          return DataRender.DateTime(o);
        }
      }]
    });

    // 表格行事件
    dTable.$('tr').click(function(e) {
      clicked($(this));
    });
  }

});