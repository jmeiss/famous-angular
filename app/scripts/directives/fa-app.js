'use strict';

angular.module('integrationApp')
  .directive('faApp', ["famous", function (famous) {
    return {
      template: '<div style="display: none;" ng-transclude></div>',
      transclude: true,
      restrict: 'EA',
      compile: function(tElement, tAttrs, transclude){
        console.log('compiling app');
        return {
          pre: function(scope, element, attrs){
            var View = famous['famous/core/view'];
            //TODO:  add custom classes from attrs (or just pass through all attrs?) to
            //       the container element.
            element.append('<div class="famous-angular-container"></div>');
            var famousContainer = $(element.find('.famous-angular-container'))[0];
            var Engine = famous['famous/core/engine'];
            scope.context = Engine.createContext(famousContainer);

            function AppView(){
              View.apply(this, arguments);
            }

            AppView.prototype = Object.create(View.prototype);
            AppView.prototype.constructor = AppView;

            scope.view = new AppView();
            scope.context.add(scope.view);

            scope.$on('registerChild', function(evt, data){
              console.log('view', scope.view)
              if(data.mod && data.surf){
                scope.view._add(data.mod).add(data.surf);
              }else if(data.surf){
                scope.view._add(data.surf);
              }
              evt.stopPropagation();
            })
          },
          post: function(scope, element, attrs){
            
          }
        }
      }
    };
  }]);
