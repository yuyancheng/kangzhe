'use strict';
app.controller('FeedbackUndone', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.feedback.query; // 后台API路径
  var data = null;

  if($rootScope.pageName !== 'feedback'){
    utils.localData('page_index', null);
    utils.localData('page_start', null);
    utils.localData('page_length', null);
    $rootScope.pageName = 'feedback';
  }

  // 编辑某一组织（工具栏按钮）
  $scope.seeDetails = function(id) {
    if (id) {
      $rootScope.details = {};
      $rootScope.details.id = id;
      $state.go('app.feedback_view');
    }
  };
  ////////////////////////////////////////////////////////////

  // 初始化表格
  var doctorList, dTable;

  function initTable() {
    var doctorList, 
      dTable, 
      index = utils.localData('page_index') * 1 || 1, 
      start = utils.localData('page_start') * 1 || 0, 
      length = utils.localData('page_length') * 1 || 15;

    var setTable = function(){
      doctorList = $('#feedbackList');
      dTable = doctorList.dataTable({
        "draw": index,
        "displayStart": start,
        "lengthMenu": [5,10,15,20,30,40,50,100],
        "pageLength": length,
        "bServerSide": true, 
        "sAjaxSource": url,  
        "fnServerData": function(sSource, aoData, fnCallback) {
          $.ajax({
            "type": "post",
            "url": sSource,
            "dataType": "json",
            "data": {
              //aoData: JSON.stringify(aoData),
              pageIndex: index - 1,
              pageSize: aoData[4]['value'],
              access_token: app.url.access_token
            }, 
            "success": function(resp) {
              $scope.datas.feedback_undo = resp.data.total;
              utils.localData('feedback_undo', resp.data.total);
              index = aoData[0]['value'];
              utils.extendHash(resp.data.pageData, ["userId", "userName", "clientVersion", "content", "phoneSystem", "phoneModel", "createTime"]);
              resp.start = resp.data.start;
              resp.recordsTotal = resp.data.total;
              resp.recordsFiltered = resp.data.total;
              resp.length = resp.data.pageSize;
              resp.data = resp.data.pageData;
              fnCallback(resp);
            }
          });
        },
        "search": null,
        "language": app.lang.datatables.translation,
        "createdRow": function(nRow, aData, iDataIndex) {
          $(nRow).attr('data-id', aData['_id']).click(aData['_id'], function(param, e) {
            $scope.seeDetails(param.data);
          });
        },
        "columns": [{
          "data": "userName"
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

      dTable.off().on('length.dt', function(e, settings, len){
        index = 1;
        start = 0;
        length = len;
        dTable.fnDestroy();
        setTable();
        utils.localData('page_length', length);
      }).on('page.dt', function(e, settings){
        index = settings._iDisplayStart / length + 1;
        start = length * (index - 1);
        dTable.fnDestroy();
        setTable();
        utils.localData('page_index', index);
        utils.localData('page_start', start);
      });
    };
    
    setTable();

  }

  initTable();

});

//[{"name":"sEcho","value":1},{"name":"iColumns","value":5},{"name":"sColumns","value":",,,,"},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":10},{"name":"mDataProp_0","value":"userName"},{"name":"sSearch_0","value":""},{"name":"bRegex_0","value":false},{"name":"bSearchable_0","value":true},{"name":"bSortable_0","value":true},{"name":"mDataProp_1","value":"userId"},{"name":"sSearch_1","value":""},{"name":"bRegex_1","value":false},{"name":"bSearchable_1","value":true},{"name":"bSortable_1","value":true},{"name":"mDataProp_2","value":"clientVersion"},{"name":"sSearch_2","value":""},{"name":"bRegex_2","value":false},{"name":"bSearchable_2","value":true},{"name":"bSortable_2","value":true},{"name":"mDataProp_3","value":"content"},{"name":"sSearch_3","value":""},{"name":"bRegex_3","value":false},{"name":"bSearchable_3","value":true},{"name":"bSortable_3","value":true},{"name":"mDataProp_4","value":"createTime"},{"name":"sSearch_4","value":""},{"name":"bRegex_4","value":false},{"name":"bSearchable_4","value":true},{"name":"bSortable_4","value":true},{"name":"sSearch","value":""},{"name":"bRegex","value":false},{"name":"iSortCol_0","value":0},{"name":"sSortDir_0","value":"asc"},{"name":"iSortingCols","value":1}]