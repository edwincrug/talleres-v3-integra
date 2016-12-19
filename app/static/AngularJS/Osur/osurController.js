// -- ==================================================================================
// -- CREATE AUTH: Uriel Godínez Martínez
// -- CREATE DATE: 07/06/2016
// -- CREATE DESC: Controlador para el mantenimiento de las Osur por TAR
// -- ==================================================================================

registrationModule.controller('osurController', function ($scope, alertFactory, globalFactory, osurRepository, citaRepository) {
    
    $scope.presupuestoTotal=0.00;
    $scope.utilizadoTotal=0.00;
    $scope.saldoTotal=0.00;
    $scope.conTar = false;
    $scope.selectedTar ="";
    $scope.selectedCliente='';

    $scope.init = function () {
        getTARS();
        $scope.getCliente ();
    }

    var getTARS = function () {
        osurRepository.getTars($scope.userData.idUsuario).then(function (tars) {
            if (tars.data.length > 0) {
                $scope.tars = tars.data;
                //alertFactory.success("Trabajos cargados");
            } else {
                alertFactory.info("No se encontro ninguna TAR");
            }
        }, function (error) {
            alertFactory.error("Error al cargar las TAR");
        });
    }

    $scope.getCliente = function () {
        citaRepository.getCliente($scope.userData.idUsuario).then(function (cliente) {
            if (cliente.data.length > 0) {
                $scope.clientes = cliente.data;
                alertFactory.success("Clientes cargados");
            } else {
                alertFactory.info("No se encontraron clientes");
            }
        }, function (error) {
            alertFactory.error("Error al cargar clientes");
        });
    }

    $scope.validateCliente = function (){

        if ($scope.selectedCliente != '' && $scope.selectedCliente != null ) {
            if ($scope.selectedCliente.idCliente == 1) {
                return true;
            }else{
               return false;
            } 
        }else{
            return false;
        }
         
    }

    $scope.changeCliente = function (){
        $scope.presupuestoTotal=0.00;
        $scope.utilizadoTotal=0.00;
        $scope.saldoTotal=0.00;
        $('.dataTableOsur').DataTable().destroy();
        $scope.datosOsur=[];

        if ($scope.selectedCliente.idCliente != 1) {
            $scope.selectedTar='';
            $scope.GetMonto();
        }
    }

    $scope.GetMonto = function () {
        $scope.presupuestoTotal=0.00;
        $scope.utilizadoTotal=0.00;
        $scope.saldoTotal=0.00;

        if ($scope.selectedCliente.idCliente == 1) {
            if ($scope.selectedTar == "") {
                $scope.conTar = false;
                alertFactory.info("Debe seleccionar una TAR");
                
            } else {
                $scope.datos_osur ();
            }
        }else{
            $scope.datos_osur();
        }   
    }


    $scope.datos_osur= function () {

        $scope.conTar = true;
        $('.dataTableOsur').DataTable().destroy();
        osurRepository.getDatosOsur($scope.selectedTar.idTAR, $scope.selectedCliente.idCliente).then(function (result) {
            if (result.data.length > 0) {
                $scope.datosOsur = result.data;
                 
                for(var i=0;i<result.data.length;i++){
                    $scope.presupuestoTotal += parseFloat(result.data[i].presupuesto);
                    $scope.utilizadoTotal += parseFloat(result.data[i].utilizado);
                    $scope.saldoTotal += parseFloat(result.data[i].saldo);
                };

                globalFactory.waitDrawDocument("dataTableOsur", "Utilidad");
            } else {
                $scope.datosOsur = [];
                alertFactory.info("No existe información con los criterios de búsqueda");
            }
        },
        function (error) {
            alertFactory.error("Error al obtener la información");
        });
    }

    $scope.validateTAR = function() {

        if ($scope.selectedCliente != '' && $scope.selectedCliente != null) {
            if ($scope.selectedCliente.idCliente == 1) {
                if ($scope.selectedTar !== "") {
                    return true;
                }else{
                    return false;
                }
            }else{
               return true;
            } 
        }else{
            return false;
        }
        
    }

    //fecha
    $('#fechaFinal .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        format: "dd/mm/yyyy"
    });

    $('#fechaInicial .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        format: "dd/mm/yyyy"
    });

    $scope.change_presupuesto = function (){
        
        $scope.presupuestoSumaTotal= parseFloat($scope.presupuesto) + parseFloat($scope.presupuestoSuma);

    }

    //Ventana Modal
    $scope.nuevaOsur = function () {
        $('#newOsurModal').appendTo('body').modal('show');
        $scope.tarNuevo=$scope.selectedTar.nombreTar;
        $scope.cliente=$scope.selectedCliente.nombre;
        $scope.presupuestoSuma=0;
        $scope.presupuestoSumaTotal=0;
        $scope.presupuesto=0;
        var indice= 0;

        $scope.sumaOsur=[];

                         
        for(var i=0;i<$scope.datosOsur.length;i++){
       
            if ($scope.datosOsur[i].estatus === 'Utilizado'  && $scope.datosOsur[i].idAplicacion === null ) {

                obj = new Object();
                obj.idOsur= $scope.datosOsur[i].idOsur;
                obj.folio = $scope.datosOsur[i].folio;
                obj.saldo = $scope.datosOsur[i].saldo;
                obj.estatus = $scope.datosOsur[i].estatus;
                obj.indice = indice;
                obj.class_suma = 'glyphicon glyphicon-plus';

                $scope.sumaOsur.push(obj);
                indice +=1;
            }
            
        };
    }


    $scope.sumaPresupuesto = function (indice){
        
        if ($scope.sumaOsur[indice].class_suma === 'glyphicon glyphicon-plus') {
            $scope.presupuestoSuma+= $scope.sumaOsur[indice].saldo;
            $scope.sumaOsur[indice].class_suma ='glyphicon glyphicon-minus'
        }else{
            $scope.presupuestoSuma-= $scope.sumaOsur[indice].saldo;
            $scope.sumaOsur[indice].class_suma ='glyphicon glyphicon-plus'
        }

         $scope.presupuestoSumaTotal= parseFloat($scope.presupuesto) + parseFloat($scope.presupuestoSuma);

    }

    $scope.saveOsur = function () {
  
        var valoresInicial = $scope.fechaInicial.split('/');
        var dateStringInicial = valoresInicial[2] + '-' + valoresInicial[1] + '-' + valoresInicial[0];

        var valoresFinal = $scope.fechaFinal.split('/');
        var dateStringFinal = valoresFinal[2] + '-' + valoresFinal[1] + '-' + valoresFinal[0];
         $scope.aplicacion=[];

        for(var i=0;i<$scope.sumaOsur.length;i++){
            if ($scope.sumaOsur[i].class_suma ==='glyphicon glyphicon-minus') {
               
                obj = new Object();
                obj.idAplicacion = $scope.sumaOsur[i].idOsur;
                obj.presupuestoAplicacion =$scope.sumaOsur[i].saldo;
                $scope.aplicacion.push(obj);
                
            };
        };

        osurRepository.putNuevaOsur($scope.presupuestoSumaTotal, $scope.selectedTar.idTAR, $scope.folio, dateStringInicial, dateStringFinal, $scope.solpe, $scope.selectedCliente.idCliente ).then(function (result) {
               
                if (result.data.length>0) {
                    alertFactory.info("Se generó correctamente la Osur");
                    $('#newOsurModal').modal('hide');
                    if ($scope.selectedTar != null) {
                        $scope.GetMonto();
                    }

                        for(var i=0;i<$scope.aplicacion.length;i++){
                            osurRepository.getOsurAplicacion( $scope.selectedTar.idTAR, $scope.aplicacion[i].idAplicacion.toString(), $scope.aplicacion[i].presupuestoAplicacion.toString() ).then(function (result) {
                                if (result.data.length > 0) {
                                    alertFactory.info("Se generó correctamente la Osur");
                                   
                                } 
                            },
                            function (error) {
                                alertFactory.error("Error al procesar la información");
                            });
                        };

                    
                } else {
                    $scope.datosOsur = [];
                    alertFactory.info("No existe información con los criterios de búsqueda");
                }
            },
            function (error) {
                alertFactory.error("Error al procesar la información");
            });
    }

    $scope.verAplicacion = function (info) {
     
        osurRepository.getFondos($scope.selectedTar.idTAR, info.idOsur.toString()).then(function (result) {
            if (result.data.length > 0) {
                
                $scope.fondos=result.data;
                $('#fondosOsurModal').appendTo('body').modal('show');
                
            } else {
                swal({
                    title: "información",
                    text: "No se encuentra ningún  fondo asociado.",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#67BF11",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                });;
            }
        },
        function (error) {
            alertFactory.error("Error al obtener la información");
        });
        
    }

    $scope.activarOsur = function (osur){

        swal({
                title: "Advertencia",
                text: "Se activara la Osur seleccionada y pondrá como pendiente la activa.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#67BF11",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    osurRepository.putEstatusOsurTar(osur.idOsur, osur.idTAR).then(function (result) {;
                        if (result.data[0].ID == 0) {
                            alertFactory.success("Se actualizo el estatus correctamente");
                            $scope.GetMonto();
                        }
                       
                    },
                    function (error) {
                        alertFactory.error("Error al procesar la información");
                    });
                }
            });
         
    }

});




