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
      alert(9999)
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
      
    }

    function initTable(data) {

    }
  }
]);