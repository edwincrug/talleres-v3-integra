var citaUrl = global_settings.urlCORS + '/api/cita/';
var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

    registrationModule.factory('sustitutoRepository', function ($http, $q) {
        var deferred = $q.defer();

        return {
            getMotivo: function () {
                return $http({
                    url: citaUrl + 'motivo/',
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            },
            getSustituto: function (numEconomico, tipo) {
                return $http({
                    url: citaUrl + 'sustituto/',
                    method: "GET",
                    params: {
                        numEconomico: numEconomico,
                        tipo: tipo
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            },
            getValidaOrden: function (numeroTrabajo) {
                return $http({
                    url: citaUrl + 'validaorden/',
                    method: "GET",
                    params: {
                        numeroTrabajo: numeroTrabajo
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            },
            getNotificaciones: function (idTipo, numEconomico, fechaInicio, fechaFin) {
                
                return $http({
                    url: citaUrl + 'notificacionesUnidad/',
                    method: "GET",
                    params: {
                        idTipo: idTipo,
                        numEconomico: numEconomico,
                        fechaInicio:fechaInicio,
                        fechaFin:fechaFin

                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            },
            addUnidadSustituto: function (idUnidad, idSustituto, idMotivo, fechaVinculacion, idUsuario, numeroTrabajo) {
                var msgObj = {
                    idUnidad: idUnidad,
                    idSustituto: idSustituto,
                    idMotivo:idMotivo,
                    fechaVinculacion:fechaVinculacion,
                    idUsuario: idUsuario,
                    numeroTrabajo: numeroTrabajo

                }
                return $http({
                    url: citaUrl + 'addunidadsustituto/',
                    method: "POST",
                    data: msgObj,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            },

            getReporte:function(idMotivo,idEstatus,fechaInicio,fechaFin){
                return $http({
                        url: citaUrl + 'reportesustituto',//va al controller de node
                        method:"GET", 
                    params: {
                        idMotivo: idMotivo,
                        idEstatus:idEstatus,
                        fechaInicio:fechaInicio,
                        fechaFin:fechaFin
                    },                      //el metodo get es porque se realizara una consulta
                        headers:{'Content-Type':'application/json'
                    }
                });
            },
            putUnidadDesvicula:function(idUnidadSustituto){
            var msgObj = {
                idUnidadSustituto: idUnidadSustituto
            };
                return $http({
                    url: citaUrl + 'unidadDesvinculada',
                    method:"PUT",
                    data: msgObj,
                    headers: {
                         'Content-Type': 'application/json'
                    }
                });
            },
        getEvidenciasByUnidad: function (idUnidadSustituto, idTipoUsuario) {
            return $http({
                url: searchUrl + 'evidenciasByUnidad',
                method: "GET",
                params: {
                    idUnidadSustituto: idUnidadSustituto, idTipoUsuario:idTipoUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }


        };
    });

