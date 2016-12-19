var ordenUrl = global_settings.urlCORS + '/api/orden/';

registrationModule.factory('ordenPorCobrarRepository', function ($http) {
    return {
        getOrdenesPorCobrar: function (monto) {
            var objTrabajo = {
                monto: monto
            };
            return $http({
                url: ordenUrl + 'ordenesporcobrar',
                method: "GET",
                params: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putTrabajoCobrado: function (idTrabajo, idDatosCopade) {
            var objTrabajo = {
                idTrabajo: idTrabajo,
                idDatosCopade: idDatosCopade
            };

            return $http({
                url: ordenUrl + 'trabajocobrado',
                method: "POST",
                data: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPreFacturas: function (idUsuario) {
            return $http({
                url: ordenUrl + 'prefacturas',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getGeneraTXT: function (idTrabajo) {
            var objTrabajo = {
                idTrabajo: idTrabajo
            };
            return $http({
                url: ordenUrl + 'generaTxtFactura',
                method: "GET",
                params: objTrabajo,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCopades: function () {
            return $http({
                url: ordenUrl + 'copades',
                method: "GET"
            });
        },
        putGeneraDatosCopade: function (archivos, fechaRecepcionCopade) {
            var objArchivos = {
                archivos: archivos,
                fechaRecepcionCopade: fechaRecepcionCopade
            };

            return $http({
                url: ordenUrl + 'generaDatosCopade',
                method: "POST",
                data: objArchivos,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getMejorCoincidencia: function (folio, monto) {
            return $http({
                url: ordenUrl + 'getCoincidenciaMejor',
                method: "GET",
                params: {
                    folio: folio,
                    monto: monto
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putInsertaDatosCopade: function (copades) {     
            var objCopades = copades;

                  
            return $http({        
                url: ordenUrl + 'insertaDatosCopade',
                        method: "POST",
                        data: objCopades,
                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            });    
        },
        putRenombraCopade: function (nombre, idCopade) {
            var objRenombre = {
                nombreCopade: nombre,
                idCopade: idCopade
            };

            return $http({        
                url: ordenUrl + 'cambiaNombreCopade',
                        method: "POST",
                        data: objRenombre,
                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            }); 
        },
        putMueveCopade: function (idTrabajo, idDatosCopade) {     
            var objArchivo = {
                idTrabajo: idTrabajo,
                idDatosCopade: idDatosCopade
            };      
            return $http({        
                url: ordenUrl + 'mueveCopade',
                        method: "POST",
                        data: objArchivo,
                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            });    
        },
        getOrdenesVerificadas: function (idUsuario) {
            return $http({
                url: ordenUrl + 'ordenesverificadas',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTrbajoCobrado: function (idDatosCopade) {
            return $http({
                url: ordenUrl + 'trbajoCobrado',
                method: "GET",
                params: {
                    idDatosCopade: idDatosCopade
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getFacturados: function (idUsuario) {
            return $http({
                url: ordenUrl + 'facturados',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});