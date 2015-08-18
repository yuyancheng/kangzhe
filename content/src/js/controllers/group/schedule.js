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



app.controller('ScheduleCtrl', ['$scope', '$http', '$log',
  function($scope, $http, $log) {
    $scope.weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
    $scope.dataStages = ['上午', '下午', '晚上'];
    // 右侧滑动框的状态
    $scope.isCollapsed = true;
    $scope.collapse = function() {
      $scope.isCollapsed = true;
    }


    $scope.startTime = null;
    $scope.endTime = null;
    $scope.minTime = null;
    $scope.maxTime = null;
    $scope.tdClick = function($event, weekday, stage) {
      if ($event.currentTarget == $event.target) {
        if ($scope.isCollapsed == false) {
          $scope.isCollapsed = true;
        } else {
          $log.log(weekday + stage);
          $scope.currentWeekday = weekday;
          $scope.currentStage = stage;

          if (stage == '上午') {
            $scope.startTime = new Date();
            $scope.startTime.setHours(9);
            $scope.startTime.setMinutes(0);
            $scope.startTime.setMilliseconds(0);

            $scope.endTime = new Date();
            $scope.endTime.setHours(12);
            $scope.endTime.setMinutes(0);
            $scope.endTime.setMilliseconds(0);

            $scope.minTime = $scope.startTime;
            $log.log($scope.startTime);
            $scope.maxTime = $scope.endTime;
          } else if (stage == '下午') {
            $scope.startTime = new Date();
            $scope.startTime.setHours(12);
            $scope.startTime.setMinutes(0);
            $scope.startTime.setMilliseconds(0);

            $scope.endTime = new Date();
            $scope.endTime.setHours(19);
            $scope.endTime.setMinutes(0);
            $scope.endTime.setMilliseconds(0);

            $scope.minTime = $scope.startTime;
            $scope.maxTime = $scope.endTime;
          } else if (stage == '晚上') {
            $scope.startTime = new Date();
            $scope.startTime.setHours(19);
            $scope.startTime.setMinutes(0);
            $scope.startTime.setMilliseconds(0);

            $scope.endTime = new Date();
            $scope.endTime.setHours(24);
            $scope.endTime.setMinutes(0);
            $scope.endTime.setMilliseconds(0);

            $scope.minTime = $scope.startTime;
            $scope.maxTime = $scope.endTime;
          }


          $scope.isCollapsed = false;
        }
        $event.stopPropagation();
      }


    }

    //初始化时间
    $scope.initTime = function() {

    }

    //timepicker
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 10;

    $scope.changed = function() {
      $log.log('Time changed to: ' + $scope.mytime);
    };

    $scope.closeTab = function($event, parm1) {
      if ($event.currentTarget == $event.target) {
        $log.log(parm1);
      }
      $event.stopPropagation();
    }

  }
]);