'use strict';

app.controller('CheckListPass', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.admin.check.getDoctors; // 后台API路径
  var data = null;

  if($rootScope.pageName !== 'list_pass'){
    utils.localData('page_index', null);
    utils.localData('page_start', null);
    //utils.localData('page_length', null);
    $rootScope.pageName = 'list_pass';
  }

  // 查看某一审核信息
  $scope.seeDetails = function(id) {
    if (id) {
      $rootScope.details = {};
      $rootScope.details.id = id;
      $state.go('app.check_pass_view');
    }
  };

  ////////////////////////////////////////////////////////////

  // 初始化表格
  var doctorList, dTable;

  function initTable() {
    var doctorList, 
      dTable, 
      name,
      _index,
      _start,
      isSearch = false,
      searchTimes = 0,
      index = utils.localData('page_index') * 1 || 1, 
      start = utils.localData('page_start') * 1 || 0, 
      length = utils.localData('page_length') * 1 || 10;

    var setTable = function(){
      doctorList = $('#doctorList_pass');
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
              status: 1,
              name: name,
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
              setTimeout(function(){
                $('#check_pass').html(resp.recordsTotal);
                utils.localData('check_pass', resp.recordsTotal);
              }, 500);
            }
          });
        },
        //"searching": false,
        "language": app.lang.datatables.translation,
        "createdRow": function(nRow, aData, iDataIndex){
          $(nRow).attr('data-id', aData['userId']).click(aData['userId'], function(param, e) {
            $scope.seeDetails(param.data);
          });
        },
        "columns": [{
          "data": "name",
          "orderable": false
        }, {
          "data": "hospital",
          "orderable": false,
          "searchable": false
        }, {
          "data": "departments",
          "orderable": false,
          "searchable": false
        }, {
          "data": "title",
          "orderable": false,
          "searchable": false
        }, {
          "data": "telephone",
          "orderable": false,
          "searchable": false
        }]
      });

      dTable.off().on('length.dt', function(e, settings, len){
        index = 1;
        start = 0;
        length = len;
        dTable.fnDestroy();
        setTable();
        utils.localData('page_length', len);
      }).on('page.dt', function(e, settings){
        index = settings._iDisplayStart / length + 1;
        start = length * (index - 1);
        dTable.fnDestroy();
        setTable();
        utils.localData('page_index', index);
        utils.localData('page_start', start);
      }).on('search.dt', function(e, settings){
        if(settings.oPreviousSearch.sSearch){
          isSearch = true;
          searchTimes ++;
          _index = settings._iDisplayStart / settings._iDisplayLength + 1;
          _start = settings._iDisplayStart;
          name = settings.oPreviousSearch.sSearch;
        }else{
          isSearch = false;
          name = null;
        }
        if(isSearch){
          index = 1;
          start = 0;
        }else{
          if(searchTimes > 0){
            searchTimes = 0;
            index = _index;
            start = _start;
            dTable.fnDestroy();
            setTable();
          }
        }
      });
    };
    
    setTable();

  }

  initTable();

});