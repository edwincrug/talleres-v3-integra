// -- =============================================
// -- Author:      Adolfo Marinez
// -- Create date: 22/08/2016
// -- Description: talleres controller
// -- =============================================
registrationModule.controller('tallerController', function ($scope, alertFactory, tallerRepository, localStorageService) {
    //this is the first method executed in the view
    $scope.actualizarTaller = '';


    $scope.initTaller = function () {
        $scope.getTaller();
    }
    $scope.initAdministracion = function () {
        $scope.limpiaCasillasTaller();
        $scope.getrecuperaGAR();
        $scope.getrecuperaTipoUsuario();
        $scope.getrecuperaEstatus();
        $scope.edicionTalleres();
    }

    $scope.getrecuperaGAR = function () {
        $scope.promise = tallerRepository.getTallerGar().then(function (gar) {
            $scope.tipoGar = gar.data;
        }, function (error) {
            alertFactory.error('Error al obtener los datos GAR');
        });
    }
    $scope.obtieneZona = function (idZona) {
        $scope.getrecuperaTAR($scope.idZona);
    }
    $scope.getrecuperaTAR = function () {
        tallerRepository.getTallerTar($scope.idZona).then(function (tar) {
            $scope.tipoTar = tar.data;

        }, function (error) {
            alertFactory.error('Error al obtener los datos TAR');
        });
    }
    $scope.getrecuperaTipoUsuario = function () {
        $scope.promise = tallerRepository.getTallerTipoUsuario().then(function (tipoUsuario) {
            $scope.tipoUsuario = tipoUsuario.data;
        }, function (error) {
            alertFactory.error('Error al obtener los datos Usuario');
        });
    }
    $scope.getrecuperaEstatus = function () {
        $scope.promise = tallerRepository.getTallerEstatus().then(function (estatus) {
            $scope.estatus = estatus.data;
        }, function (error) {
            alertFactory.error('Error al obtener los datos Estatus');
        });
    }

    $scope.getTaller = function () {
        $scope.promise = tallerRepository.getTallerInformation().then(function (tallerInfo) {
            $scope.talleres = tallerInfo.data;
            setTimeout(function () {
                $('.dataTableTaller').DataTable({
                    dom: '<"html5buttons"B>lTfgitp',
                    buttons: [
                        {
                            extend: 'excel',
                            title: 'ReporteTalleres'
                                    },

                        {
                            extend: 'print',
                            customize: function (win) {
                                $(win.document.body).addClass('white-bg');
                                $(win.document.body).css('font-size', '10px');

                                $(win.document.body).find('table')
                                    .addClass('compact')
                                    .css('font-size', 'inherit');
                            }
                            }
                        ]
                });
            }, 1000);
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    $scope.editaTaller = function (idTaller) {
        localStorageService.set('idDeTaller', idTaller);
        localStorageService.set('actualizarTaller', 1);
        location.href = '/administraciontaller';
    }

    $scope.edicionTalleres = function () {
        var idTallerEdicion = localStorageService.get('idDeTaller');
        $scope.actualizarTaller = localStorageService.get('actualizarTaller');
        localStorageService.remove('actualizarTaller');
        tallerRepository.getrecuperaTaller(idTallerEdicion).then(function (taller) {
            var tallerInfo = taller.data[0];
            $scope.idZona = tallerInfo.idZona;
            $scope.calle = tallerInfo.PER_CALLE1;
            $scope.codigoPostal = tallerInfo.PER_CODPOS;
            $scope.colonia = tallerInfo.PER_COLONIA;
            $scope.claveUsuario = tallerInfo.PER_CVEUSU;
            $scope.delegacion = tallerInfo.PER_DELEGAC;
            $scope.email = tallerInfo.PER_EMAIL;
            $scope.estado = tallerInfo.PER_ESTADO;
            $scope.lada = tallerInfo.PER_LADA;
            $scope.numeroExterior = tallerInfo.PER_NUMEXTER;
            $scope.pais = tallerInfo.PER_PAIS;
            $scope.rfc = tallerInfo.PER_RFC;
            $scope.idStatusTaller = tallerInfo.PER_STATUS;
            $scope.telefono = tallerInfo.PER_TELEFONO1;
            $scope.idTipoPersona = tallerInfo.PER_TIPO;
            $scope.nombreTar = tallerInfo.TAD;
            $scope.ciudad = tallerInfo.ciudad;
            $scope.encargado = tallerInfo.encargado;
            $scope.idProveedor = tallerInfo.idProveedor;
            $scope.idTAR = tallerInfo.idTAR;
            $scope.idelTaller = tallerInfo.idTaller;
            $scope.razonSocial = tallerInfo.razonSocial;
            $scope.obtieneZona($scope.idZona);
            localStorageService.remove('idDeTaller');
        }, function (error) {
            alertFactory.error("Error al insertar el taller");
        });
    }

    $scope.nuevoTaller = function () {
        location.href = '/administraciontaller';
    }

    $('.clockpicker').clockpicker();

    $('#fechaTrabajo .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    $scope.insertaTaller = function () {
       if (($scope.idStatusTaller != '' && $scope.idStatusTaller != null) && ($scope.idTipoPersona != '' && $scope.idTipoPersona != null) && $scope.ciudad != '' && $scope.razonSocial != '' && $scope.rfc != '' && $scope.telefono != '' && $scope.pais != '' && $scope.estado != '' && $scope.delegacion != '' && $scope.colonia != '' && $scope.calle != '' && $scope.numeroExterior != '' && $scope.codigoPostal != '' && $scope.claveUsuario != '' && $scope.lada != '') {
           var insertTaller = {};
           insertTaller.idZona = $scope.idZona;
           insertTaller.idTad = $scope.idTAR;
           insertTaller.ciudad = $scope.ciudad;
           insertTaller.razonSocial = $scope.razonSocial;
           insertTaller.encargado = $scope.encargado;
           insertTaller.rfc = $scope.rfc;
           insertTaller.tipo = $scope.idTipoPersona;
           insertTaller.telefono = $scope.telefono;
           insertTaller.email = $scope.email;
           insertTaller.pais = $scope.pais;
           insertTaller.estado = $scope.estado;
           insertTaller.delegacion = $scope.delegacion;
           insertTaller.colonia = $scope.colonia;
           insertTaller.calle = $scope.calle;
           insertTaller.numeroExt = $scope.numeroExterior;
           insertTaller.codPostal = $scope.codigoPostal;
           insertTaller.cveusu = $scope.claveUsuario;
           insertTaller.status = $scope.idStatusTaller;
           insertTaller.lada = $scope.lada;
           insertTaller.idTar = $scope.idTAR;
           $scope.idProveedor == '' ? $scope.idProveedor = 0 : $scope.idProveedor;
           insertTaller.idProveedor = $scope.idProveedor;
           if (insertTaller.idProveedor == 0) {
               $('.btnidProveedor').ready(function () {     
                   swal({          
                       title: "¿Esta seguro que desea Guardar sin especificar el idProveedor esto generara un nuevo registro en BPRO?",
                                  /*text: "Se cambiará el estatus a 'Cita Cancelada'",*/           type: "warning",
                                 showCancelButton: true,
                                 confirmButtonColor: "#65BD10 ",
                                 confirmButtonText: "Si",
                                 cancelButtonText: "No",
                                 closeOnConfirm: false,
                                 closeOnCancel: false        
                   },         function (isConfirm) {          
                       if (isConfirm) {            
                          tallerRepository.addTaller(insertTaller).then(function (taller) {
                               if (taller.data[0].id > 0) {
                                   alertFactory.success("Taller insertado satisfactoriamente");
                                   setTimeout(function () {
                                       location.href = '/acciontaller'
                                   }, 1000);
                               }
                           }, function (error) {
                               alertFactory.error("Error al insertar el taller");
                           });
                           swal("Taller registrado correctamente!"); 
                       } else {            
                           swal("Proceso cancelado", "", "error");                     
                       }        
                   });    
               });
           } else {
               $('.btnidProveedor').ready(function () {     
                   swal({          
                       title: "¿Esta seguro que desea Guardar este idProveedor se enlazara dentro de BPRO?",
                                  /*text: "Se cambiará el estatus a 'Cita Cancelada'",*/           type: "warning",
                                 showCancelButton: true,
                                 confirmButtonColor: "#65BD10 ",
                                 confirmButtonText: "Si",
                                 cancelButtonText: "No",
                                 closeOnConfirm: false,
                                 closeOnCancel: false        
                   },         function (isConfirm) {          
                       if (isConfirm) {  
                       tallerRepository.addTaller(insertTaller).then(function (taller) {
                               if (taller.data[0].id > 0) {
                                   alertFactory.success("Taller insertado satisfactoriamente");
                                   setTimeout(function () {
                                       location.href = '/acciontaller'
                                   }, 1000);
                               }
                           }, function (error) {
                               alertFactory.error("Error al insertar el taller");
                           }); 
                           swal("Taller registrado correctamente!"); 
                       } else {            
                           swal("Proceso cancelado", "", "error");                     
                       }        
                   });    
               });
           }
       } else {
           alertFactory.info('Debe llenar los campos requeridos');
       }
   }

    $scope.limpiaCasillasTaller = function () {
        $scope.idZona = '';
        $scope.idTAR = '';
        $scope.ciudad = '';
        $scope.razonSocial = '';
        $scope.encargado = '';
        $scope.rfc = '';
        $scope.idTipoPersona = '';
        $scope.telefono = '';
        $scope.email = '';
        $scope.pais = '';
        $scope.estado = '';
        $scope.delegacion = '';
        $scope.colonia = '';
        $scope.calle = '';
        $scope.numeroExterior = '';
        $scope.codigoPostal = '';
        $scope.claveUsuario = '';
        $scope.idStatusTaller = '';
        $scope.lada = '';
        $scope.idTar = '';
        $scope.idProveedor = '';
    }

    $scope.openEliminaTallerModal = function (idTaller, idProveedor) {
        $('.btnEliminarTaller').ready(function () {     
            swal({          
                title: "¿Esta seguro que desea eliminar el taller?",
                           /*text: "Se cambiará el estatus a 'Cita Cancelada'",*/           type: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#65BD10 ",
                          confirmButtonText: "Si",
                          cancelButtonText: "No",
                          closeOnConfirm: false,
                          closeOnCancel: false        
            },         function (isConfirm) {          
                if (isConfirm) {            
                    tallerRepository.putEliminaTaller(idTaller,idProveedor).then(function (result) {              
                        if (result.data.lenght > 0) {                
                            swal("Taller eliminado!");         
                        }            
                    }, function (error) {              
                        swal("No se pudo eliminar el taller", "error");            
                    });            
                    swal("Taller eliminado!"); 
                    location.href = '/acciontaller';           
                } else {            
                    swal("Acción cancelada", "", "error");            
                    $('#openEliminaTallerModal').modal('hide');          
                }        
            });    
        });
    }

    $scope.actualizaTaller = function () {
    if (($scope.idStatusTaller != '' && $scope.idStatusTaller != null) && ($scope.idTipoPersona != '' && $scope.idTipoPersona != null) && $scope.ciudad != '' && $scope.razonSocial != '' && $scope.rfc != '' && $scope.telefono != '' && $scope.pais != '' && $scope.estado != '' && $scope.delegacion != '' && $scope.colonia != '' && $scope.calle != '' && $scope.numeroExterior != '' && $scope.codigoPostal != '' && $scope.claveUsuario != '' && $scope.lada != '') {
        var insertTallerUpdate = {};
        insertTallerUpdate.idTaller = $scope.idelTaller
        insertTallerUpdate.idZona = $scope.idZona;
        insertTallerUpdate.idTad = $scope.idTAR;
        insertTallerUpdate.ciudad = $scope.ciudad;
        insertTallerUpdate.razonSocial = $scope.razonSocial;
        insertTallerUpdate.encargado = $scope.encargado;
        insertTallerUpdate.rfc = $scope.rfc;
        insertTallerUpdate.tipo = $scope.idTipoPersona;
        insertTallerUpdate.telefono = $scope.telefono;
        insertTallerUpdate.email = $scope.email;
        insertTallerUpdate.pais = $scope.pais;
        insertTallerUpdate.estado = $scope.estado;
        insertTallerUpdate.delegacion = $scope.delegacion;
        insertTallerUpdate.colonia = $scope.colonia;
        insertTallerUpdate.calle = $scope.calle;
        insertTallerUpdate.numeroExt = $scope.numeroExterior;
        insertTallerUpdate.codPostal = $scope.codigoPostal;
        insertTallerUpdate.cveusu = $scope.claveUsuario;
        insertTallerUpdate.status = $scope.idStatusTaller;
        insertTallerUpdate.lada = $scope.lada;
        insertTallerUpdate.idTar = $scope.idTAR;
        $scope.idProveedor == '' || $scope.idProveedor == null ? $scope.idProveedor = 0 : $scope.idProveedor;
        insertTallerUpdate.idProveedor = $scope.idProveedor
        if (insertTallerUpdate.idProveedor == 0) {
            $('.btnidProveedor').ready(function () {     
                swal({          
                    title: "¿Esta seguro que desea Guardar sin especificar el idProveedor esto generara un nuevo registro en BPRO?",
                               /*text: "Se cambiará el estatus a 'Cita Cancelada'",*/           type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#65BD10 ",
                              confirmButtonText: "Si",
                              cancelButtonText: "No",
                              closeOnConfirm: false,
                              closeOnCancel: false        
                },         function (isConfirm) {          
                    if (isConfirm) {  
                       tallerRepository.updateTaller(insertTallerUpdate).then(function (taller) {
                            if (taller.data[0].id > 0) {
                                alertFactory.success("Taller actualizado satisfactoriamente");
                                setTimeout(function () {
                                    location.href = '/acciontaller'
                                }, 1000);
                            }
                        }, function (error) {
                            alertFactory.error("Error al insertar el taller");
                        });         
                        swal("Actualización Correcta!"); 
                    } else {            
                        swal("Proceso cancelado", "", "error");                     
                    }        
                });    
            });
        } else {
            $('.btnidProveedor').ready(function () {     
                swal({          
                    title: "¿Esta seguro que desea Guardar este idProveedor se enlazara dentro de BPRO?",
                               /*text: "Se cambiará el estatus a 'Cita Cancelada'",*/           type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#65BD10 ",
                              confirmButtonText: "Si",
                              cancelButtonText: "No",
                              closeOnConfirm: false,
                              closeOnCancel: false        
                },         function (isConfirm) {          
                    if (isConfirm) { 
                        tallerRepository.updateTaller(insertTallerUpdate).then(function (taller) {
                            if (taller.data[0].id > 0) {
                                alertFactory.success("Taller actualizado satisfactoriamente");
                                setTimeout(function () {
                                    location.href = '/acciontaller'
                                }, 1000);
                            }
                        }, function (error) {
                            alertFactory.error("Error al insertar el taller");
                        }); 
                        swal("Actualización Correcta!"); 
                    } else {            
                        swal("Proceso cancelado", "", "error");                     
                    }        
                });    
            });
        }
    } else {
        alertFactory.info('Debe llenar los campos requeridos');
    }

}

});