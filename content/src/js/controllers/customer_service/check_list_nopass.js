'use strict';

app.controller('CheckListNopass', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.admin.check.getDoctors; // 后台API路径
  var data = null;

  if($rootScope.pageName !== 'list_nopass'){
    utils.localData('page_index', null);
    utils.localData('page_start', null);
    utils.localData('page_length', null);
    $rootScope.pageName = 'list_nopass';
  }

  // 查看某一审核信息
  $scope.seeDetails = function(id) {
    if (id) {
      $rootScope.details = {};
      $rootScope.details.id = id;
      $state.go('app.check_nopass_view');
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
      doctorList = $('#doctorList_nopass');
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
              status: 3,
              pageIndex: index - 1,
              pageSize: aoData[4]['value'],
              access_token: app.url.access_token
            }, 
            "success": function(resp) {
              index = aoData[0]['value'];
              utils.extendHash(resp.data.pageData, ["doctorNum","title","hospital","name","telephone","remark","licenseExpire","licenseNum","userId","departments"]);
              resp.start = resp.data.start;
              resp.recordsTotal = resp.data.total;
              resp.recordsFiltered = resp.data.total;
              resp.length = resp.data.pageSize;
              resp.data = resp.data.pageData;
              fnCallback(resp);
              $scope.datas.check_nopass = resp.recordsTotal;
              utils.localData('check_nopass', resp.recordsTotal);
            }
          });
        },
        //"search": null,
        "language": app.lang.datatables.translation,
        "createdRow": function(nRow, aData, iDataIndex){
          $(nRow).attr('data-id', aData['userId']).click(aData['userId'], function(param, e) {
            $scope.seeDetails(param.data);
          });
        },
        "columns": [{
          "data": "name"
        }, {
          "data": "hospital"
        }, {
          "data": "departments"
        }, {
          "data": "title"
        }, {
          "data": "telephone"
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