'use strict';

app.directive('slideBar', function() {
  return {
    link: function(scope, element, attrs) {
      function expand() {
        element.removeClass('sch-slide-bar-hide').
        addClass('sch-slide-bar-show');
      }

      function collapse() {
        element.removeClass('sch-slide-bar-show').
        addClass('sch-slide-bar-hide');
      }


      scope.$watch(attrs.collapse, function(shouldCollapse) {
        if (shouldCollapse) {
          collapse();
        } else {
          expand();
        }
      });
    }
  }
});



app.controller('ScheduleCtrl', ['$scope', '$http','$log',
  function($scope, $http,$log) {
    $scope.weekdays=['星期一','星期二','星期三','星期四','星期五','星期六','星期天'];
    $scope.dataStages = ['上午','下午','晚上'];
    // 右侧滑动框的状态
    $scope.isCollapsed = true;
    $scope.tdClick = function(weekday,stage) {
      $log.log(weekday+stage);
      $scope.currentWeekday = weekday;
      $scope.currentStage = stage;

      if(stage=='上午'){
          $scope.startTime = new Date();
          $scope.startTime.setHours(9);
          $scope.startTime.setMinutes(0);

          $scope.endTime = new Date();
          $scope.endTime.setHours(12);
          $scope.endTime.setMinutes(0);

          $scope.minTime = $scope.startTime;
          $scope.maxTime = $scope.endTime;
      }
      else if(state=='下午'){
          $scope.startTime = new Date();
          $scope.startTime.setHours(9);
          $scope.startTime.setMinutes(0);

          $scope.endTime = new Date();
          $scope.endTime.setHours(12);
          $scope.endTime.setMinutes(0);

          $scope.minTime = $scope.startTime;
          $scope.maxTime = $scope.endTime;
      }

      $scope.isCollapsed = !$scope.isCollapsed;
    }

    //初始化时间
    $scope.initTime = function(){

    }

    //timepicker
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 10;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changed = function () {
      $log.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };


    $scope.showCloseBtn = function(index){
        
    }





  }
]);