// -- =============================================
// -- Author:      Adolfo Marinez
// -- Create date: 22/08/2016
// -- Description: talleres controller
// -- =============================================
var tallerUrl = global_settings.urlCORS + '/api/taller/';

registrationModule.factory('tallerRepository', function ($http) {
    return {
        getTallerGar: function () {
            return $http({
                url: tallerUrl + 'obtienegar/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTallerTar: function (idZona) {
            return $http({
                url: tallerUrl + 'obtienetar/',
                method: "GET",
                params: {
                    idZona: idZona
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTallerTipoUsuario: function () {
            return $http({
                url: tallerUrl + 'obtienetipopersona/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTallerEstatus: function () {
            return $http({
                url: tallerUrl + 'obtieneestatustaller/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTallerInformation: function () {
            return $http({
                url: tallerUrl + 'obtienetalleres/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putEliminaTaller: function (idTaller, idProveedor) {     
            var objTaller = {        
                idTaller: idTaller,
                idProveedor:idProveedor      
            };

                  
            return $http({        
                url: tallerUrl + 'eliminataller',
                        method: "POST",
                        data: objTaller,
                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            });    
        },
        addTaller: function (taller) {
            return $http({
                url: tallerUrl + 'insertataller/',
                method: "POST",
                data: taller,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getrecuperaTaller: function (idTaller) {
            return $http({
                url: tallerUrl + 'obtienetaller/',
                method: "GET",
                params: {
                    idTaller: idTaller
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateTaller: function (taller) {
            return $http({
                url: tallerUrl + 'actualizataller/',
                method: "POST",
                data: taller,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };

});