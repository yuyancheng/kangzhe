'use strict';

app.controller('CustomerService', ['$scope', '$http', '$state', '$rootScope', 'utils', 'uiLoad', 'JQ_CONFIG', '$compile',
  function($scope, $http, $state, $rootScope, utils, uiLoad, JQ_CONFIG, $compile) {
    $scope.isPass = true;
    uiLoad.load(JQ_CONFIG.dateTimePicker).then(function(){
      $(".form_datetime").datetimepicker({
          format: "yyyy-mm-dd",
          autoclose: true,
          pickerPosition: "bottom-left",
          minView: 2,
          todayBtn: false,
          language: 'zh-CN'
      });
    });
    $scope.authError = null;
    $scope.formData = {};
    $scope.viewData = {};
    var access_level = 0;
    var target = null;

    var id = '';
    if($scope.details){
      id = $scope.details.id;
      if(!utils.localData('idVal', id)){
        console.error('数据未保存！');
      }
    }else{
      id = utils.localData('idVal');
      if(!id) {
        console.error('无有效数据！');
        return;
      }
    }

    // 获取要审核的医生数据
    $http({
      url: app.url.admin.check.getDoctor,
      data: {
        id: id,
        access_token: app.url.access_token
      },
      method: 'POST'
    }).then(function(dt) {
      dt = dt.data.data;
      if(dt.resultMsg === 1){
        $scope.authError = '当前医生正在被其它人审核！';
      }
      $scope.formData = {
        userId: dt.userId,
        departments: dt.departments,
        hospital: dt.hospital,
        title: dt.title
      };
      $scope.viewData = {
        name: dt.name || ' ',
        telephone: dt.telephone || ' '
      };
    });

    // 获取要医生证件图片
    $http.get(app.url.upload.getCertPath + '?' + $.param({
        userId: id,
        access_token: app.url.access_token
      })
    ).then(function(dt) {
      dt = dt.data.data;
      if(dt && dt.length > 0){
        $scope.imgs = dt;
      }else{
        $scope.imgs = false;
      }
    });

    var key = null;
    function createList(param){
      $http({
        url: param.url,
        data: param.data,
        method: param.method
      }).then(function(dt){
        var route = $('#list_route');
        var panel = $('#eara_panel');
        if(dt.data.resultCode !== 1) {
          var lnks = route.find('a');
          var w = 0;
          for(var i=0; i<lnks.length; i++){
            w += lnks.eq(i).width();
          }
          if(w > route.width() ){
            route.animate({"scrollLeft": w - route.width() + 50}, 500);
          }
          return;
        }else{
          if(dt.data.data.length === 0){
            target.find('i').css('visibility', 'hidden');
            container.find('button[type=submit]').removeClass('disabled');
            return;
          }
        }

        var data = dt.data.data;
        var len = data.length;
        var ul = $('<ul class="eara-list"></ul>');

        if(access_level % 2 === 0){
          ul.addClass('bg-even');
        }else{
          ul.addClass('bg-odd');
        }
        ul.data('level', access_level);
        //ul.className = 'eara-list';
        for(var i=0; i<len; i++){
          var li = $('<li></li>');
          li.data(param.key, data[i][param.key]);
          li.data('name', data[i]['name']);

          li.click(function(){
            
            $(this).parent().nextAll().remove();
            access_level = $(this).parent().data('level');
            if(key) {
              key = 'code';
            }

            // (Link) 选择到的区域路线
            var link = $('#link_' + access_level);
            if(link.length > 0){
              link.nextAll().remove();
            }else{
              link = $('<a href class="route-link"></a>');
              link.attr('id', 'link_' + access_level);
            }
            link.html($(this).data('name'));
            route.removeClass('none').append(link);
            // (End Link)

            var data_key = $(this).data(param.key);
            if(access_level % 2 === 0){
              $(this).siblings().removeClass('item-odd');
              $(this).addClass('item-odd');
            }else{
              $(this).siblings().removeClass('item-even');
              $(this).addClass('item-even');
            }
            
            // (Path) 设置API
            if(access_level === 3){
              var url = app.url.admin.check.getHospitals;
              key = 'id';
            }else{
              var url = param.url;
              key = null;
            }
            // (End Path)

            // 最终的目标标签
            if((access_level === 4) ||
            (param.key !== 'code' && access_level === 2)){
              container.find('button[type=submit]').removeClass('disabled');
            }else{
              container.find('button[type=submit]').addClass('disabled');
            }

            target = $(this); // 保存当前被点击的对象

            if(data_key){
              createList({
                url: url,
                data: {
                  id: data_key,
                  access_token: app.url.access_token
                },
                method: 'POST',
                key: key || param.key
              });
            }
          });

          var str = '<a href class="auto">'+ 
                      ((access_level === 4) ||
                      (param.key !== 'code' && access_level === 2) ? '' :
                      '<span class="pull-right text-muted">'+
                        '<i class="fa fa-fw fa-angle-right text"></i>'+
                      '</span>') +
                      '<span>'+ data[i]['name'] +'</span>'+
                    '</a>';
          li.html(str);
          ul.append(li);
        }
        panel.append(ul);

        var uls = panel.find('.eara-list');
        var links = route.find('a');
        var w1 =0, w2 = 0;
        for(var i=0; i<uls.length; i++){
          w1 += uls.eq(i).width();
        }
        for(var i=0; i<links.length; i++){
          w2 += links.eq(i).width();
        }
        if(w1 > panel.width()){
          panel.animate({"scrollTop": 0, "scrollLeft": w1 - panel.width() + 25}, 500);
        }
        if(w2 > panel.width()){
          route.animate({"scrollLeft": w2 - panel.width() + 50}, 500);
        }
        console.log(panel.width() + ', ' + w2);
      });

      access_level++;
    }

    var chooseBtn = $('#chooseBtn');
    var step, firstTime = true;

    // 提交并更新数据
    $scope.submit = function() {
      var chk_pass = $('#pass');
      var chk_nopass = $('#nopass');
      var formParam = {}

      var remark = $('.check-items input:checked').siblings('span');
      if(remark.length > 0){
        $scope.formData.remark = remark.html();
      }else{
        $scope.formData.remark = $scope.viewData.remarkNopass;
      }
      $scope.formData.access_token = app.url.access_token;

      if(chk_pass.prop('checked')){
        var url = app.url.admin.check.checked;
        formParam = {
          userId: $scope.formData.userId,
          title: $scope.formData.title,
          hospitalId: $scope.formData.hospitalId,
          hospital: $scope.formData.hospital,
          departments: $scope.formData.departments,
          licenseExpire: $scope.formData.licenseExpire,
          licenseNum: $scope.formData.licenseNum,
          access_token: app.url.access_token
        };
      }else{
        var url = app.url.admin.check.fail;
        formParam = {
          userId: $scope.formData.userId,

          title: $scope.formData.title,
          hospitalId: $scope.formData.hospitalId,
          hospital: $scope.formData.hospital,
          departments: $scope.formData.departments,

          remark: $scope.formData.remark,
          access_token: app.url.access_token
        };
      }

      $http.post(url, formParam).then(function(resp) {
        if (resp.data.resultCode === 1) {
          $state.go('app.check_list_undone');  
        } else {
          $scope.authError = resp.data.resultMsg;
        }
      }, function(x) {
        $scope.authError = '服务器错误！';
      });
    };

    var mask = $('<div class="mask"></div>');
    var container = $('#dialog-container');
    var doIt = function(){};

    // 执行操作
    $rootScope.do = function(){
      doIt();
    };

    // 不操作返回
    $scope.return = function(){
      $rootScope.ids = [];
      window.history.back();
    }; 

    $scope.choose = function(idx, txt) {
      var route = $('<div id="list_route" class="none"></div>');
      var panel = $('<div id="eara_panel"></div>');
      access_level = 0;
      container.find('button[type=submit]').addClass('disabled');
      mask.insertBefore(container);
      container.find('.form-content').addClass('def-border').html('').append(route).append(panel);

      // (Url) 根据不同的API做不同的操作
      if(txt === 'hospital'){
        var url = app.url.admin.check.getArea;
        var _key = 'code';
        $rootScope.pop_title = '选择医疗机构';
      }else{
        var url = app.url.admin.check.getDepts;
        var _key = 'id';
        $rootScope.pop_title = '选择科室';
      }
      var param = {
        url: url,
        data: {
          access_token: app.url.access_token
        },
        method: 'POST',
        key: _key
      };
      createList(param);
      // (End Url)

      container.removeClass('none');
      
      doIt = function(){
        if(access_level === 5){
          $scope.formData.hospitalId = target.data('id');
          $scope.formData.hospital = target.data('name');
        }else if(access_level === 3 || access_level === 2){
          $scope.formData.departments = target.data('name');         
        }
        access_level = 0;
        mask.remove();
        container.addClass('none');
      };
    };

    // 模态框退出
    $rootScope.cancel = function(){
      mask.remove();
      container.addClass('none');
    };  

    $http.post(app.url.admin.check.getTitles,{
      access_token: app.url.access_token
    }).then(function(resp) {
      var dt = resp.data.data;
      if (dt.length > 0) {
        initChosen(dt);
      } else {
        $scope.authError = '数据有误！';
      }
    }, function(x) {
      $scope.authError = '服务器错误！';
    });

    // 下拉框 chosen
    function initChosen(dt){
      var select = $('#doctor_title');
      var len = dt.length;
      var tmp = $('<select></select>');
      for(var i=0; i<len; i++){
        var opt = $('<option>'+ dt[i]['name'] +'</option>');
        tmp.append(opt);
      }
      select.html(tmp.html());
      select.on('change', function(e){
        $scope.formData['title'] = $(this).val();
      });
      select.val($scope.formData.title);
      //$scope.formData['title'] = select.val();
    }

    setTimeout(function(){
      var preview = $('#gl_preview img');
      var points = $('#gl_point a');
      preview.attr('src', points.eq(0).find('img').addClass('cur-img').attr('src'));
      points.click(function(){
        var _img = $(this).find('img');
        preview.attr('src', _img.attr('src'));
        _img.addClass('cur-img');
        $(this).siblings().find('img').removeClass('cur-img');
      });

      var chk_pass = $('#pass');
      var chk_nopass = $('#nopass');
      var is = $('.required-items i');
      var ipts = $('.required-items input');
      var btn = $('form button[type=submit]');
      var other = $('#other_remark');
      var txtr = $('#remarkNopass');
      chk_nopass.change(function(){
        var timer_a, timer_b;
        if($(this).prop('checked')){
          is.addClass('none');
          ipts.removeAttr('required');
          if(!other.prop('checked')){
            btn.removeAttr('disabled');
          }
          
          timer_a = setInterval(function(){
            if(/\S/g.test(txtr.val())){
              btn.removeAttr('disabled');
            }else{
              btn.attr('disabled', true);
            }
            console.log(123213143432);
          },1000);

          other.click(function(){
            console.log(3442);
            if(other[0].checked){
              if(/\S/g.test(txtr.val())){
                btn.removeAttr('disabled');
              }else{
                btn.attr('disabled', true);
                clearInterval(timer);
                timer = setInterval(function(){
                  if(/\S/g.test(txtr.val())){
                    btn.removeAttr('disabled');
                  }else{
                    btn.attr('disabled', true);
                  }
                  console.log(123213143432);
                },1000);
              }
            }
          });
          other.blur(function(){
            clearInterval(timer);
            btn.removeAttr('disabled');
          });
        }
      });      
      chk_pass.change(function(){
        if($(this).prop('checked')){
          is.removeClass('none');
          ipts.attr('required', true);
          btn.attr('disabled', true);
        }
      });
    }, 500);

  }
]);