registrationModule.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined || inputValue=="") inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});

registrationModule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

registrationModule.directive('addressNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).bind('keypress', function (event) {
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                var keyCode = !event.charCode ? event.which : event.charCode;
                if (keyCode === 32 || keyCode === 0 || keyCode === 8 || keyCode === 9) {
                    return true;
                }
                if (!isValidNumExtInt(key)) {
                    event.preventDefault();
                    return false;
                }
            });
        }
    };
});

registrationModule.directive('onlyletters', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).bind('keypress', function (event) {
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                var keyCode = !event.charCode ? event.which : event.charCode;
                if (keyCode === 32 || keyCode === 0 || keyCode === 8 || keyCode === 9) {
                    return true;
                }
                if (!isValidName(key)) {
                    event.preventDefault();
                    return false;
                }
            });
        }
    };
});

registrationModule.directive('onlynumletter', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).bind('keypress', function (event) {
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                var keyCode = !event.charCode ? event.which : event.charCode;
                if (keyCode === 32 || keyCode === 0 || keyCode === 8 || keyCode === 9) {
                    return true;
                }
                if (!isValidNumLetters(key)) {
                    event.preventDefault();
                    return false;
                }
            });
        }
    };
});

registrationModule.directive('numberguion', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).bind('keypress', function (event) {
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                var keyCode = !event.charCode ? event.which : event.charCode;
                if (keyCode === 32 || keyCode === 0 || keyCode === 8 || keyCode === 9) {
                    return true;
                }
                if (!isValidNumSolicitud(key)) {
                    event.preventDefault();
                    return false;
                }
            });
        }
    };
});

registrationModule.directive('onlynumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).bind('keypress', function (event) {
                var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                var keyCode = !event.charCode ? event.which : event.charCode;
                if (keyCode === 32 || keyCode === 0 || keyCode === 8 || keyCode === 9) {
                    return true;
                }
                if (!isValidNumber(key)) {
                    event.preventDefault();
                    return false;
                }
            });
        }
    };
});

registrationModule.directive('calendar', function () {


    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
              keyboardNavigation: false,
              forceParse: false,
              autoclose: true
          });
        }
    };

});

function isValidName(strToEvaluate) {
    var onlyLetters = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]*$/;
    return onlyLetters.test(strToEvaluate);
}

function isValidNumExtInt(strToEvaluate) {
    var letNumPunGuiEspMas = /^[a-zA-Z0-9\#\-\s\+ñÑáéíóúÁÉÍÓÚüÜ]*$/;
    return letNumPunGuiEspMas.test(strToEvaluate);
}

function isValidNumLetters(strToEvaluate) {
    var letrasNumerosRegex = /^[a-zA-Z0-9]*$/;
    return letrasNumerosRegex.test(strToEvaluate);
}

function isValidNumSolicitud(strToEvaluate) {
    var polizaField = /^[0-9\-]*$/;
    return polizaField.test(strToEvaluate);
}

function isValidNumber(strToEvaluate) {
    var polizaField = /^[0-9]*$/;
    return polizaField.test(strToEvaluate);
}