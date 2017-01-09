// -- =============================================
// -- Author:      Vladimir Juárez
// -- Create date: 18/03/2016
// -- Description: toastr alerts
// -- Modificó: 
// -- Fecha: 
// -- =============================================
registrationModule.factory('alertFactory', function () {
    return {
        success: function (text) {
            toastr.options = { "positionClass": "toast-top-right", "closeButton": true}
            toastr.success(text, '¡Éxito!');
        },
        successTopFull: function (text) {
            toastr.options = { "positionClass": "toast-top-full-width", "closeButton": true}
            toastr.success(text, '¡Éxito!');
        },
        error: function (text) {
            toastr.options = { "positionClass": "toast-top-right", "closeButton": true}
            toastr.error(text , 'Error');
        },
        info: function (text) {
            toastr.options = { "positionClass": "toast-top-right", "closeButton": true}
            toastr.info(text, 'Información');
        },
        infoTopFull: function (text) {
            toastr.options = { "positionClass": "toast-top-full-width", "closeButton": true}
            toastr.info(text, 'Información'),
                warning = function (text) {}

            toastr.options = { "positionClass": "toast-top-right", "closeButton": true}
            toastr.warning(text, 'Atención');
        },
        notification: function (text) {

            toastr.options = {
              "closeButton": true,
              "debug": false,
              "newestOnTop": true,
              "progressBar": false,
              "positionClass": "toast-top-full-width",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": 0,
              "extendedTimeOut": 0,
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut",
              "tapToDismiss": false
            }

           toastr.info('<br/><a href="/notificaciones" ng-click="alert()">Para más info de click Aqui</a><br/>', text)
        }



    };



});



