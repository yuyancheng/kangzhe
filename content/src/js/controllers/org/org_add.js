'use strict';
app.controller('OrgAdd', ['$scope', '$state', 'uiLoad','JQ_CONFIG',
  function($scope, $state, uiLoad, JQ_CONFIG) {
    uiLoad.load(JQ_CONFIG.dataTable);
    $scope.formData = {};
    $scope.viewData = {};
    var superList = $('#superUnit');
    var chooseBtn = $('#chooseBtn');
    var step, firstTime = true;

    if($scope.ids.length !== 0){
      var type = $scope.details['unitLayerType'];
      if(type){
        if(type['id'] < 3){
          $scope.formData['unitLayerType.id'] = parseInt(type['id']) + 1;
        }else{
          $scope.formData['unitLayerType.id'] = 2;
        }
        $('#orgType').val($scope.formData['unitLayerType.id']);
      }
      $scope.formData.parent = $scope.details['id'];
      $scope.viewData.superName = $scope.details['name'];
      chooseBtn.addClass('disabled');
    }
    // 提交并添加数据
    $scope.submit = function() {
      var url = app.url.org.api.save;
      app.utils.getData(url, $scope.formData, function(dt) {
        //$state.reload('app.org');
        $state.go('app.org.list');
      });
    };
    $scope.choose = function() {
      var url = app.url.orgUnits;
      var data = null;
      step = chooseBtn.data('step') || 0;
      if(step === 0){
        if(firstTime){
          app.utils.getData(url, function callback(dt) {
            data = dt;
            initTable(data);
            superList.removeClass('none');
            chooseBtn.html('取消').data('step', 1);
          });
          firstTime = false;
        }else{
          superList.removeClass('none');
          chooseBtn.html('取消').data('step', 1);
        }
      }else{
        superList.addClass('none');
        chooseBtn.html('选择').data('step', 0);
      }
    };
    // 下拉框 chosen
    $('#orgType').on('change', function(e){
      $scope.formData['unitLayerType.id'] = $(this).val();
    });

    function initTable(data) {
      var dTable = $('#orgAddList').dataTable({
        "data": data,
        "sAjaxDataProp": "dataList",
        "fnCreatedRow": function(nRow, aData, iDataIndex) {
          $(nRow).attr({'data-id': aData['id'], 'data-name': aData['name']});
        },
        "oLanguage": {
          "sLengthMenu": "每页 _MENU_ 条",
          "sZeroRecords": "没有找到符合条件的数据",
          "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
          "sInfo": "共 _TOTAL_ 条",
          "sInfoEmpty": "没有记录",
          "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
          "sSearch": "搜索",
          "oPaginate": {
            "sPrevious": "<",
            "sNext": ">"
          }
        },
        "aoColumns": [{
          "mDataProp": "code"
        }, {
          "mDataProp": "name"
        }]
      });
      dTable.$('tr').dblclick(function(e, settings) {
        //$scope.seeDetails($(this).data('id'));
      }).click(function(e) {
        $scope.formData.parent = $(this).data('id');
        $scope.viewData.superName = $(this).data('name');

        var that = $(this), classname = 'rowSelected';
        var siblings = $(this).siblings();

        var chooseBtn = $('#chooseBtn');
        if(that.hasClass(classname)){
          that.removeClass(classname);
          $('#superName').val('');
          chooseBtn.html('取消').data('step', 1);
          $scope.formData.parent = null;
          $scope.viewData.superName = null;
        }else{
          that.addClass(classname);
          $('#superName').val($scope.viewData.superName);
          chooseBtn.html('确定').data('step', 2);
        }

        siblings.removeClass(classname);
      });
    }
  }
]);