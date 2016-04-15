angular
.module('FB', [])
.directive('fbPage', ['$window', function($window) {
    return {
      restrict: 'A',
      scope: {},
      template: '<div class="fb-page" data-href="{{page}}" data-hide-cover="{{hide}}" data-width="{{width}}" data-show-facepile="{{faces}}" data-height="{{height}}" data-show-posts="{{posts}}"></div>',
      link: function($scope, $element, $attrs) {
        var requested = false;
        
        $scope.height = '550';
        $scope.faces = 'false';
        $scope.posts = 'true';
        $scope.hide = 'false';
        $scope.width = $element.parent().width();
        
        ['page','faces','height','width','hide','posts'].forEach(function(name){
            $attrs.$observe('fb' + name.charAt(0).toUpperCase() + name.slice(1), function(val){
                $scope[name] = val;
            });
        });
        
        function request(){
            if (!requested) {
                requested = true;
                requestAnimationFrame(update);
            }
        }
        
        function update(){
            $scope.$evalAsync(function() {
                $scope.width = $element.parent().width();
                $scope.$applyAsync(function() {
                    FB.XFBML.parse($element[0], function(){
                        requested = false;
                    });
                });
            });
        }

        $window.addEventListener('resize', request);

        //verifica quando muda de rota e executa todo o elemente novamente (readequação conforme muda tamanho de tela)
        //checks when changing route and execute any element again
        $scope.$on('$routeChangeSuccess', function(event, viewConfig){

            //se FB element não for undefined ou Null ele executa a atualização 
            //( resolve problema de primeira entrada na pagina quando diretiva ainda nao esta carregada)
			// If FB element is not undefined or null it performs the update
			// (Solves the problem first entry on the page when policy not yet is loaded)
            if (typeof(FB) != 'undefined' && FB != null ) {
                update();
                $window.addEventListener('resize', request);
            }

        });

      }
    };
}]);

