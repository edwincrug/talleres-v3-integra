registrationModule.controller('asignacionSustitutoController', function (MarkerCreatorService, $scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository, uploadRepository, citaRepository, commonService, ordenAnticipoRepository, trabajoRepository, uploadRepository) {
	
	$scope.motivos= [];
    $scope.address = '';
    $scope.show_mapSustituto = false;
    $scope.select_sustituto = ''; 
    $scope.select_unidad = '';
    $scope.selectedMotivo = '';
    $scope.dataSustituto = '';
    $scope.datoUnidad = '';
    $scope.show_orden=false;
    $scope.numOrden = '';
    $scope.show_sustituto=false;
    $scope.fechaSustituto = '';
    $scope.horaSustituto = '';
        

	$scope.init_asignacion = function (){
        $('.clockpicker').clockpicker();
            $('#calendar .input-group.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: true,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true
            });
         $scope.getMotivo();

         $scope.map = {
                        center: {
                            latitude: '',
                            longitude: ''
                        },
                        zoom: 12,
                        markers: [],
                        control: {},
                        options: {
                            scrollwheel: false
                        }
                    }
        Dropzone.autoDiscover = false;
        $scope.dzOptionsServicio = uploadRepository.getDzOptions("image/*,application/pdf,.mp4,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,.docX,.DOCX,.ppt,.PPT",20);
	}


    $scope.getMotivo = function () {
        sustitutoRepository.getMotivo().then(function (motivo) {
            if (motivo.data.length > 0) {
                $scope.motivos = motivo.data;
                
                alertFactory.success("Motivos cargados");
            } else {
                alertFactory.info("No se encontraron motivos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar motivos");
        });
    }

    $scope.validaMotivo = function (motivo){
        if ($scope.motivos != '') {
            if (motivo.idMotivo == 1 ) {
                $scope.show_orden=true;
            }else{
                $scope.show_orden=false;
            }
        }

    }
  

    $scope.getUnidad = function (datoUnidad) {

        if ($scope.datoUnidad != '' ) {

            $('#btnBuscar').button('Buscando...');
           // $scope.promise = citaRepository.getUnidadInformation(datoUnidad, $scope.userData.idUsuario).then(function (unidadInfo) {
            sustitutoRepository.getSustituto(datoUnidad, 0).then(function (unidadInfo) {
                $('.dataTableUnidad').DataTable().destroy();
                $scope.unidades = unidadInfo.data;
                if (unidadInfo.data.length > 0) {
                    globalFactory.waitDrawDocumentLength("dataTableUnidad", "Unidad", 5);
                    alertFactory.success('Datos encontrados');
                    $('#btnBuscar').button('reset');
                } else {
                    alertFactory.info('No se encontraron datos');
                    $('#btnBuscar').button('reset');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
                $('#btnBuscar').button('reset');
            });
        }else{

            alertFactory.info('Debe llenar todos los campos');
        }
    }

    $scope.getSustituto = function (dataSustituto) {

        if ($scope.dataSustituto != '' ) {;
            $('#btnSustituto').button('Buscando...');
            sustitutoRepository.getSustituto(dataSustituto, 1).then(function (Info) {
                $('.dataTableSustituto').DataTable().destroy();
                $scope.sustitutos = Info.data;
                if (Info.data.length > 0) {
                    globalFactory.waitDrawDocumentLength("dataTableSustituto", "Sustituto", 5);
                    alertFactory.success('Datos encontrados');
                    $('#btnSustituto').button('reset');
                } else {
                    alertFactory.info('No se encontraron datos');
                    $('#btnSustituto').button('reset');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
                $('#btnSustituto').button('reset');
            });
        }else{

            alertFactory.info('Debe llenar todos los campos');
        }
    }


    $scope.selUnidad = function (unidad) {
        $scope.map.markers=[];
         $scope.show_mapSustituto = true;
         $scope.select_unidad=unidad.idUnidad;
         $scope.obtieneUbicacionUnidad ($scope.select_unidad, 'Unidad');

         
         $('#modal_sustituto').appendTo("body").modal('show');


    }

    $scope.selsustituto = function (sustituto) {
        $scope.show_mapSustituto = true;
        $scope.select_sustituto=sustituto.idUnidad;
        $scope.obtieneUbicacionUnidad ($scope.select_sustituto, 'Sustituto');

    }
    

    // OBTENEMOS LA UBICACION ACTUAL DE LA UNIDAD Y DE NO TENERLA MANDAMOS UN ALERTA EN BOOTSTRAP
    $scope.obtieneUbicacionUnidad = function (idUnidad, tipo) {
        citaRepository.ubicaUnidad(idUnidad).then(function (result) {  
             if (result.data.length > 0) {
               alertFactory.info('La unidad ha sido ubicada exitosamente');
               $scope.latitud = result.data[0].lat;
               $scope.longitud = result.data[0].long;
               $scope.direccion = result.data[0].direccion;
               $scope.bandera = 0;

                MarkerCreatorService.createByCoords(parseFloat($scope.latitud), parseFloat($scope.longitud), function (marker) {
                    marker.options.labelContent = $scope.direccion + ' - ' + tipo;
                    if (tipo=='Unidad') {
                        marker.options.icon=  $rootScope.vIpServer + '/image/green-dot.png';
                    };
                    $scope.autentiaMarker = marker;

                });


             
                $scope.map.center.latitude=$scope.autentiaMarker.latitude;
                $scope.map.center.longitude=$scope.autentiaMarker.longitude;
                $scope.map.markers.push($scope.autentiaMarker);  
                

            }else{
                alertFactory.info('La unidad aun no tiene ubicacion GPS');
                $scope.bandera = 1
            }
        }, function (error) {
            alertFactory.error('No se encontro la ubicacion de la Unidad');
       });
    }
 

    $scope.validateSustituto = function (){

        //$scope.select_sustituto != '' &&

        if ($scope.select_unidad != '' && $scope.selectedMotivo != '') {

            if ($scope.selectedMotivo.idMotivo == 1 ) {

                if ($scope.numOrden != '') {
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

    $scope.addUnidadSusituto = function () {
    if( $scope.fechaSustituto != '' && $scope.horaSustituto != ''){
        if ($scope.selectedMotivo.idMotivo == 1) {

            sustitutoRepository.getValidaOrden($scope.numOrden).then(function (result) {
               
                if (result.data.length > 0) {

                    if (result.data[0].estatus == 0) {
                         alertFactory.error("No es válido el número de orden");
                    }else if (result.data[0].estatus == 1) {  
                        alertFactory.success("Número de orden válido");
                        $scope.unidadSustito();
                    }else if (result.data[0].estatus == 2) {
                         alertFactory.error("El estatus del número de orden no es válido");
                    } 
                    
                } else {
                    alertFactory.info("No se encontraron datos");
                }
            }, function (error) {
                alertFactory.error("Error al validar orden");
            });

        }else{
            $scope.unidadSustito();
        }
    }else{
      alertFactory.info("Porfavor seleccione una fecha y/o hora");  
    }
    }

    $scope.unidadSustito = function (){

         $('#btnLigar').button('Buscando...');
         var orden = 0
         var sustituto= $scope.select_sustituto;
         if ($scope.selectedMotivo.idMotivo == 1) {
            orden = $scope.numOrden;
         }
         
         if ($scope.select_sustituto == '') {
            sustituto = 0;
         }
        $scope.fechahora = $scope.fechaSustituto + ' ' + $scope.horaSustituto;
        sustitutoRepository.addUnidadSustituto($scope.select_unidad, sustituto, $scope.selectedMotivo.idMotivo, $scope.fechahora, $scope.userData.idUsuario, orden).then(function (result) {
           if (result.data.length > 0) {
               alertFactory.info('Las unidades fueron asociadas correctamente'); 
                $scope.dataSustituto = '';
                $scope.datoUnidad = '';
                $scope.numOrden = '';
                $scope.sustitutos = [];
                $scope.unidades = [];
                $scope.show_orden= false;
                $scope.select_sustituto = '';  
                $scope.select_unidad = ''; 
                $scope.selectedMotivo = '';
                $scope.fechaSustituto = '';
                $scope.horaSustituto = '';
                $('.dataTableSustituto').DataTable().destroy();
                $('.dataTableUnidad').DataTable().destroy();
                $scope.show_mapSustituto = false;
                $scope.show_sustituto=false;
                $scope.sustitutoUploadFile=result.data[0].ID;
                    if ($scope.dzMethods.getAllFiles().length == 0) {
                                    alertFactory.info("No se subio evidencia");   
                            } else {
                                     $scope.dzMethods.processQueue();
                            }
 
               $('#btnLigar').button('reset');
            }else{
               alertFactory.error("Error al asociar las unidades"); 
               $('#btnLigar').button('reset');
            }   
        }, function (error) {
            alertFactory.error("Error al asociar las unidades");
            $('#btnLigar').button('reset');
        });

    }

   $scope.adjuntarEvidencia = function () {
        $('#cotizacionDetalle').appendTo('body').modal('show');
    }

        //call backs of drop zone
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            $scope.newFile = file;
        },
        'sending': function(file, xhr, formData){
            formData.append('idTrabajo', $scope.sustitutoUploadFile);
            formData.append('idCotizacion', 0);
            formData.append('idCategoria', 4);
            formData.append('idNombreEspecial', 0);//evidenciaTrabajo
        },
        'completemultiple': function (file, xhr) {
            var checkErrorFile = file.some(checkExistsError);
            if (!checkErrorFile) {
                var allSuccess = file.every(checkAllSuccess);
                if (allSuccess) {
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles(true);
                    }, 1000);
                }
            }
        },
        'error': function (file, xhr) {
            if (!file.accepted) {
                $scope.dzMethods.removeFile(file);
            } else {
                $scope.dzMethods.removeAllFiles(true);
                alertFactory.info("No se pudieron subir los archivos");
            }
        },
    };

    //valida si todos son success
    function checkAllSuccess(file, index, array) {
        return file.status === 'success';
    }
    //valida si existe algún error
    function checkExistsError(file) {
        return file.status === 'error';
    }

});