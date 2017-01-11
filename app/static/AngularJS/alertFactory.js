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

            /*toastr.options = {
              "closeButton": true,
              "debug": false,
              "newestOnTop": true,
              "progressBar": false,
              "positionClass": "toast-top-full-width",
              "preventDuplicates": false,
              "onclick": null,

              //"showDuration": "300",
              //"hideDuration": "1000",
              "timeOut": 15000,
              "extendedTimeOut": 0
              //"showEasing": "swing",
              //"hideEasing": "linear",
              //"showMethod": "fadeIn",
              //"hideMethod": "fadeOut",
              //"tapToDismiss": false
            }

            toastr.options = {
             "closeButton": true,
             "debug": false,
             "newestOnTop": true,
             "progressBar": true,
             "timeOut": 95000,
             "positionClass": "toast-top-full-width",
             "preventDuplicates": false,
             "onclick": null
            }*/ 

            toastr.options = {
             "closeButton": true,
             "debug": false,
             "newestOnTop": true,
             "progressBar": true,
             "positionClass": "toast-top-full-width",
             "preventDuplicates": false,
             "onclick": null,
             "timeOut": "25000",
             "extendedTimeOut": "22000"
            }

           toastr.info('</br><div class="info"><a href="/notificaciones">Para más info. de click Aqui</a></div>', '<div class="titleInfo">'+text+'</div>')
            
           toastr.clear();
           openedToast = null;

      
        }



    };



});



