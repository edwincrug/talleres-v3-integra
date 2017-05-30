registrationModule.controller('ReporteSustitutoController', function (MarkerCreatorService, citaRepository,$scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository,ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
 $scope.userData = localStorageService.get('userData');
 $scope.sustitutoUploadFile = localStorageService.get('unidadsustituto');

    $scope.init = function (){
        Dropzone.autoDiscover = false;
        $scope.dzOptionsServicio = uploadRepository.getDzOptions("image/*,application/pdf,.mp4,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,.docX,.DOCX,.ppt,.PPT",20);
        $scope.getReporteSustituto();
        $scope.getMotivo();
    }


    $scope.initEvidencia = function (){
        Dropzone.autoDiscover = false;
        $scope.cargaEvidencias();
        $scope.dzOptionsServicio = uploadRepository.getDzOptions("image/*,application/pdf,.mp4,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,.docX,.DOCX,.ppt,.PPT",20);
    }
       
    $scope.posicionUnidad = function (idUnidad){
        modal_detalle_ubicacion($scope, $modal, idUnidad, '', '');
    }

    $scope.Desvinculacion=function (idUnidadSustituto) {
        swal({
            title: "Advertencia",
            text: "¿Está seguro que desea liberar la Unidad?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#67BF11",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: true,
            closeOnCancel: true
            },
        function (isConfirm) {
            if (isConfirm){
                sustitutoRepository.putUnidadDesvicula(idUnidadSustituto).then(function (unidadSustituto) {//va a mi repository y entra a function getReporte [.then(function (reporte)  es para que devuelva repuesta]
                    if (unidadSustituto.data.length > 0) { //valida que tenga una caden amayor de cero sino es porque no tiene registros 
                        swal("Exito", " La unidad a sido Desvinculada", "success");
                        $scope.getReporteSustituto();
                    } else {
                        alertFactory.info("Fallo el Proceso de desvincular");
                    }
                }, function (error) {
                    alertFactory.error("Error al desvincular la unidad");
                });
                    } else {
                        swal("Proceso Cancelado", "Unidad no Desvinculada");
                    } 
                });
            }

        $scope.validaMotivo = function (motivo){
            if(motivo != null){
                $scope.idMotivoUnidad=motivo.idMotivo;
            }else{
                 $scope.idMotivoUnidad=null;
            }  
             //$scope.getReporteSustituto();
        }
        $scope.buscaFiltros = function (){
          $scope.getReporteSustituto();
        }
            //crea funcion getReporteSustituto
    $scope.getReporteSustituto = function () {
        $('.dataTableReporteSustituto').DataTable().destroy();
        $scope.reporteSustituto=[];
        $scope.idEstatus == "" ? $scope.idEstatus = undefined : $scope.idEstatus;
        $scope.fechaInicio == "" ? $scope.fechaInicio = undefined : $scope.fechaInicio;
        $scope.fechaFin == "" ? $scope.fechaFin = undefined : $scope.fechaFin;
                sustitutoRepository.getReporte($scope.idMotivoUnidad,$scope.idEstatus,$scope.fechaInicio,$scope.fechaFin).then(function (reporte) {//va a mi repository y entra a function getReporte [.then(function (reporte)  es para que devuelva repuesta]
                    if (reporte.data.length > 0) { //valida que tenga una caden amayor de cero sino es porque no tiene registros
                        $scope.reporteSustituto = reporte.data;
                        // globalFactory.waitDrawDocument("dataTableReporteSustituto", "ReporteSustituto");
                        var dataTableSustituto = 'dataTableReporteSustituto';
                           setTimeout(function () {  
                               var indicePorOrdenar = 7;
                               $('.' + dataTableSustituto).DataTable({
                                   order: [[indicePorOrdenar, 'desc']],
                                   dom: '<"html5buttons"B>lTfgitp',
                                   "iDisplayLength": 100,
                                   buttons: [
                                       {
                                           extend: 'excel',
                                           title: 'ReporteSustituto'
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
                           }, 1500);

                        alertFactory.success("Reporte cargado");
                    } else {
                        alertFactory.info("No se encontraron Reporte");
                    }
                }, function (error) {
                    alertFactory.error("Error al cargar Reporte Sustituto");
                });
            }

            //Funcion que devuelve la descripcion de los motivos de las asignacion de sustitutos  
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

    //Visualiza la órden de servicio
    $scope.aprobarTrabajo = function (sustituto) {
        localStorageService.set('objTrabajo', sustituto);
        location.href = '/ordenservicio';
    }

    $('#fechaTrabajo .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

 $scope.verEvidencia = function (idUnidadSustituto) {
    localStorageService.set('unidadsustituto', idUnidadSustituto);
    location.href = '/unidadesEvidencia';
 }

   $scope.cargaEvidencias = function () {
        sustitutoRepository.getEvidenciasByUnidad($scope.sustitutoUploadFile, $scope.userData.idTipoUsuario).then(function (result) {
            if (result.data.length > 0) {
                $scope.slides = result.data;
                setTimeout(function () {
                    $scope.efectoEvidencias();
                }, 1000)
            } else {
                $scope.alerta = 1;
            }
        }, function (error) {});
    }

    $scope.efectoEvidencias = function () {
        $('.file-box').each(function () {
            animationHover(this, 'pulse');
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
        }
        ,
        'completemultiple': function (file, xhr) {
            var checkErrorFile = file.some(checkExistsError);
            if(!checkErrorFile){
                var allSuccess = file.every(checkAllSuccess);
                if(allSuccess){
                    $scope.cargaEvidencias();
                    setTimeout(function(){
                        $scope.dzMethods.removeAllFiles(true);
                        $('#cotizacionDetalle').appendTo('body').modal('hide');
                    },1000);
                }
            }
        },
        'error': function (file, xhr) {
            if(!file.accepted){
                $scope.dzMethods.removeFile(file);
            }
            else{
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
