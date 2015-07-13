'use strict';
app.controller('FeedbackUndone', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.feedback.query; // 后台API路径
  var data = null;
  // 从后台获取数据
  $http.post(url, {
    access_token: app.url.access_token
  }).then(function(resp) {
    if (resp.data.resultCode === 1) {
      data = resp.data.data.pageData;
      utils.localData('feedback_undo', data.length);
      $scope.datas.feedback_undo = data.length;
      if (dTable) {
        dTable.fnDestroy();
        initTable();
      } else {
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
  $scope.checkIt = function() {
    if ($rootScope.obj['userId']) {
      $rootScope.details = $rootScope.obj;
      $state.go('app.feedback_view');
    }
  };
  ////////////////////////////////////////////////////////////
  var id_key = null;
  $rootScope.init = function() {
    id_key = {
      "parent": $scope.item_id
    };
    utils.getData(url, id_key, function callback(dt) {
      data = dt;
      if (dTable) {
        dTable.fnDestroy();
        initTable();
      } else {
        initTable();
      }
    });
  };
  $rootScope.ids = [];

  function clicked(that) {
    $rootScope.details = $rootScope.obj = utils.getDataByKey(data, '_id', that.data('id'));
    var id = $rootScope.obj['id'];
    $rootScope.ids.push(id);
    $scope.checkIt();
  }
  // 初始化表格 jQuery datatable
  var doctorList, dTable;

  function initTable() {
    doctorList = $('#feedbackList');
    utils.extendHash(data, ["userId", "userName", "clientVersion", "content", "phoneSystem", "phoneModel", "createTime"]);
    dTable = doctorList.dataTable({
      //"serverSide": true,
      "sEcho": 'pageIndex',
      //"aaData": 'pageData',
      "iTotalRecords": 'total',
      "sLengthSelect": 'pageSize',
      "bServerSide": true, 
      "sAjaxSource": url,  
      "fnServerData": function(sSource, aoData, fnCallback) {
        //aoData.push({"name": "pageIndex", "value": aoData[0]['value']});
        //aoData.push({"name": "pageSize", "value": aoData[4]['value']});
        $.ajax({
          "type": "post",
          "url": sSource,
          "dataType": "json",
          "data": {
            status: 1,
            //pageIndex: aoData[0]['value'],
            //pageSize: aoData[4]['value'],
            access_token: app.url.access_token,
            aoData: JSON.stringify(aoData)
          }, // 以json格式传递  
          "success": function(resp) {
            resp.draw = resp.data.pageIndex + 1;
            resp.recordsTotal = resp.data.total;
            resp.recordsFiltered = resp.data.total;
            resp.length = resp.data.pageSize;
            resp.data = resp.data.pageData;
            fnCallback(resp);
          }
        });
      },
      // "ajax": {
      //   url: url,
      //   type: 'post',
      //   data: {
      //     status: 1,
      //     pageIndex: access_token: app.url.access_token
      //   }
      // },
      "language": app.lang.datatables.translation,
      "fnCreatedRow": function(nRow, aData, iDataIndex) {
        $(nRow).attr('data-id', aData['_id']);
      },
      "columns": [{
        "data": "userName"
      }, {
        "data": "userId"
      }, {
        "data": "clientVersion"
      }, {
        "data": "content"
      }, {
        "data": "createTime",
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

//[{"name":"sEcho","value":1},{"name":"iColumns","value":5},{"name":"sColumns","value":",,,,"},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":10},{"name":"mDataProp_0","value":"userName"},{"name":"sSearch_0","value":""},{"name":"bRegex_0","value":false},{"name":"bSearchable_0","value":true},{"name":"bSortable_0","value":true},{"name":"mDataProp_1","value":"userId"},{"name":"sSearch_1","value":""},{"name":"bRegex_1","value":false},{"name":"bSearchable_1","value":true},{"name":"bSortable_1","value":true},{"name":"mDataProp_2","value":"clientVersion"},{"name":"sSearch_2","value":""},{"name":"bRegex_2","value":false},{"name":"bSearchable_2","value":true},{"name":"bSortable_2","value":true},{"name":"mDataProp_3","value":"content"},{"name":"sSearch_3","value":""},{"name":"bRegex_3","value":false},{"name":"bSearchable_3","value":true},{"name":"bSortable_3","value":true},{"name":"mDataProp_4","value":"createTime"},{"name":"sSearch_4","value":""},{"name":"bRegex_4","value":false},{"name":"bSearchable_4","value":true},{"name":"bSortable_4","value":true},{"name":"sSearch","value":""},{"name":"bRegex","value":false},{"name":"iSortCol_0","value":0},{"name":"sSortDir_0","value":"asc"},{"name":"iSortingCols","value":1}]