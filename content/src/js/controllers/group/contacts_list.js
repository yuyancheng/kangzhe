'use strict';

app.controller('ContactsList', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.yiliao.getDoctors, // 后台API路径
      data = null,
      html = $('html'),
      body = $('body'),
      deptId = $scope.curDepartmentId || utils.localData('curDepartmentId');

  if(!deptId){
    return;
  }

  if($rootScope.pageName !== 'list_pass'){
    utils.localData('page_index', null);
    utils.localData('page_start', null);
    //utils.localData('page_length', null);
    $rootScope.pageName = 'list_pass';
    $rootScope.scrollTop = 0;
  }

  // 查看某一信息
  $scope.seeDetails = function(id) {
    $rootScope.scrollTop = body.scrollTop() || html.scrollTop();
    if (id) {
      $rootScope.details = {};
      $rootScope.details.id = id;
      $state.go('app.contacts.list.details');
    }
  };

  ////////////////////////////////////////////////////////////

  // 初始化表格
  var doctorList, dTable;

  function initTable() {
    var name,
      _index,
      _start,
      isSearch = false,
      searchTimes = 0,
      index = utils.localData('page_index') * 1 || 1, 
      start = utils.localData('page_start') * 1 || 0, 
      length = utils.localData('page_length') * 1 || 50;

    var setTable = function(){
      doctorList = $('#contactsList');
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
              departmentId: deptId,
              pageIndex: index - 1,
              pageSize: aoData[4]['value'],
              access_token: 'ad0d05eaa3124d6e93b6ca0603cdde67'
              //access_token: app.url.access_token
            }, 
            "success": function(resp) {
              index = aoData[0]['value'];
              for(var i=0; i<resp.data.pageData.length; i++){
                utils.extendHash(resp.data.pageData[i].doctor, ["name","position","doctorNum","skill","introduction"]);
              }
              resp.start = resp.data.start;
              resp.recordsTotal = resp.data.total;
              resp.recordsFiltered = resp.data.total;
              resp.length = resp.data.pageSize;
              resp.data = resp.data.pageData;
              fnCallback(resp);
            }
          });
        },
        //"searching": false,
        "language": app.lang.datatables.translation,
        "createdRow": function(nRow, aData, iDataIndex){
          $(nRow).attr('data-id', aData['doctorId']).click(aData['doctorId'], function(param, e) {
            $scope.seeDetails(param.data);
            $('.currentRow').removeClass('currentRow');
            $rootScope.curRowId = $(this).data('id');
          });
        },
        "columns": [{
          "data": "doctor.name",
          "orderable": false
        }, {
          "data": "doctor.doctorNum",
          "orderable": false,
          "searchable": false
        }, {
          "data": "doctor.position",
          "orderable": false,
          "searchable": false
        }, {
          "data": "doctor.skill",
          "orderable": false,
          "searchable": false
        }, {
          "data": "doctor.introduction",
          "orderable": false,
          "searchable": false
        }]
      });

      // 表格事件处理,init-初始化完成,length-改变每页长度,page-翻页,search-搜索
      dTable.off().on('init.dt', function(){
        html.scrollTop($rootScope.scrollTop);
        body.scrollTop($rootScope.scrollTop);
        doctorList.find('tr[data-id=' + $rootScope.curRowId + ']').addClass('currentRow');
      }).on('length.dt', function(e, settings, len){
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
        $rootScope.scrollTop = html.scrollTop() ? 103 : 152;
        utils.localData('page_index', index);
        utils.localData('page_start', start);
        setTable();
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