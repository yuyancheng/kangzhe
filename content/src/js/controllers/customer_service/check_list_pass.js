'use strict';

app.controller('CheckListPass', function($rootScope, $scope, $state, $timeout, $http, utils) {
  var url = app.url.admin.check.getDoctors; // 后台API路径
  var data = null;

  // 从后台获取数据
  $http.post(url,{
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
  });

  // 初始化表格 jQuery datatable
  var doctorList, dTable;
  function initTable() {
    doctorList = $('#doctorList_pass');
    utils.extendHash(data, ["doctorNum","title","hospital","name","telephone"]);
    dTable = doctorList.dataTable({
      "search": null,
      "data": data,
      "sAjaxDataProp": "dataList",
      "oLanguage": app.lang.datatables.translation,
      "aoColumns": [{
        "mDataProp": "doctorNum"
      }, {
        "mDataProp": "title"
      }, {
        "mDataProp": "hospital"
      }, {
        "mDataProp": "name"
      }, {
        "mDataProp": "telephone"
      }]
    });
  }

});