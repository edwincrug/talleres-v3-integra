var osurUrl = global_settings.urlCORS + '/api/osur/';

registrationModule.factory('osurRepository', function ($http) {
    return {
        getTars: function (idUsuario) {
            return $http({
                url: osurUrl + 'tars',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
            });
        },
        getDatosOsur: function (idTAR, idCliente) {
            return $http({
                url: osurUrl + 'datosOsur',
                method: "GET",
                params: {
                    idTAR: idTAR,
                    idCliente: idCliente
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putEstatusOsurTar: function (idOsur, idTAR) {            
            return $http({        
                url: osurUrl + 'estatusOsurTar',
                        method: "POST",
                         data: {
                           idOsur: idOsur,
                           idTAR: idTAR
                        },

                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            });    
        },
        putNuevaOsur: function (presupuesto,idTAR,folio,fechaInicial,fechaFinal,solpe,idCliente) {             
            return $http({        
                url: osurUrl + 'nuevaosur',
                        method: "POST",
                         data: {
                           presupuesto: presupuesto,
                           idTAR: idTAR,
                           folio: folio,
                           fechaInicial: fechaInicial,
                           fechaFinal: fechaFinal,
                           solpe: solpe,
                           idCliente: idCliente
                        },

                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            });    
        },
        getOsurAplicacion: function (idTAR,idOsur,monto) {             
            return $http({        
                url: osurUrl + 'osuraplicacion',
                        method: "POST",
                         data: {
                           idTAR: idTAR,
                           idOsur: idOsur,
                           monto: monto
                        },

                        headers: {          
                    'Content-Type': 'application/json'        
                }      
            });    
        },
        getFondos: function (idTAR, idOsur) {
          
            return $http({
                url: osurUrl + 'fondos',
                method: "GET",
                params: {
                    idTAR: idTAR,
                    idOsur: idOsur
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});