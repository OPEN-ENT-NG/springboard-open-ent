if(window.skin){
	window.skin.addDirectives = function(module, done){

		//We have to remove existing directives we want to replace, otherwise it breaks.
		module.config(function($provide){
			$provide.decorator('inputPasswordDirective', ['$delegate', function($delegate) {
				$delegate.shift();
				return $delegate;
			}]);
		});

		module.directive('inputPassword', function(){
			return {
				restrict: 'E',
				replace: false,
				template:
					'<input type="password"/>' +
					'<button type="button" ng-class="{ pushed: toggle }" ng-click="show(!toggle)"></button>',
				scope: true,
				compile: function(element, attributes){
					element.addClass('toggleable-password');
					var passwordInput = element.children('input[type=password]');
					for(var prop in attributes.$attr){
						passwordInput.attr(attributes.$attr[prop], attributes[prop]);
						element.removeAttr(attributes.$attr[prop]);
					}

					return function(scope){
						scope.toggle = false

						scope.show = function(bool){
							scope.toggle = bool
							passwordInput[0].type = bool ? "text" : "password"
						}
					};
				}
			}
		});


		done();
	}
}
