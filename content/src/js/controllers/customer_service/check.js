'use strict';

app.controller('CustomerService', ['$scope', '$http', '$state',  'uiLoad', 'JQ_CONFIG', 'utils',
  function($scope, $http, $state, uiLoad, JQ_CONFIG, utils) {
    uiLoad.load(JQ_CONFIG.dataTable);
    var dt = $scope.details;
    var id = '';
    if(dt){
      id = dt.id;
      if(!utils.localData('idVal', dt.id)){
        console.error('数据未保存！');
      }
    }else{
      id = utils.localData('idVal');
      if(!id) {
        console.error('无有效数据！');
        return;
      }
    }

    $scope.viewData = {};
    var superList = $('#superUnit');
    var chooseBtn = $('#chooseBtn');
    var step, firstTime = true;
    
    // 获取要被编辑组织的数据
    $http({
      url: app.url.org.api.edit,
      data: {
        id: id
      },
      method: 'POST'
    }).then(function(dt) {
      dt = dt.data.editData;
      $scope.formData = {
        id: dt.id,
        code: dt.code,
        name: dt.name,
        simpleName: dt.simpleName,
        phoneNumber: dt.phoneNumber,
        fax: dt.fax,
        adminAddress: dt.adminAddress
      };
      if(dt.unitLayerType){
        $scope.formData['unitLayerType.id'] = dt.unitLayerType.id;
        $scope.viewData.unitType = dt.unitLayerType.name;
      }

      // 下拉框
      initChosen(dt);

      var params = {
        "pager.currentPage": 1,
        "pager.pageSize": 100,
        "items[0].value": $scope.details['id'],
        "items[0].name": 'id',
        "items[0].type": 'String',
        "items[0].compareType": 'eq'
      };

      utils.getData(app.url.org.api.list, params, function(dt){
        $scope.viewData.superName = dt['name'];
        $scope.formData.parent = $scope.details['id'];
      });
      
      //chooseBtn.addClass('disabled');
    });
    // 提交并更新数据
    $scope.submit = function() {
      var url = app.url.org.api.save;
      utils.getData(url, $scope.formData, function(dt) {
        $state.go('app.org.list');
      });
    };
    $scope.choose = function() {
      var url = app.url.orgUnits;
      var data = null;
      step = chooseBtn.data('step') || 0;
      if(step === 0){
        if(firstTime){
          utils.getData(url, function callback(dt) {
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
    function initChosen(dt){
      var orgTypeChosen = $('#orgType');
      orgTypeChosen.on('change', function(e){
        $scope.formData['unitLayerType.id'] = $(this).val();
      });
      if(dt.unitLayerType){
        orgTypeChosen.val(dt.unitLayerType.id);
      }
      
/*      orgTypeChosen.chosen({
        placeholder_text_single: '选择集团/公司/部门',
        disable_search: true
      }).ready(function(evt, params) {
        if(dt.unitLayerType){
          orgTypeChosen.siblings('.chosen-container').find('.chosen-default span').html(dt.unitLayerType.name);
        }
        console.log(params);
      }).on('change', function(evt, params) {
        $scope.formData['unitLayerType.id'] = params.selected;
        console.log(params.selected);
      });*/
    }

    function initTable(data) {
      var dTable = $('#orgAddList').dataTable({
        "data": data,
        "sAjaxDataProp": "dataList",
        "fnCreatedRow": function(nRow, aData, iDataIndex) {
          $(nRow).attr({'data-id': aData['id'], 'data-name': aData['name']});
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