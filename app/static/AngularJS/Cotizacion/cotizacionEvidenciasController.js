registrationModule.controller('cotizacionEvidenciasController', function ($scope, localStorageService, alertFactory, cotizacionEvidenciasRepository, $rootScope, uploadRepository) {
    var idCotizacion = localStorageService.get('cotizacion');
    $scope.idTrabajo = localStorageService.get('work');
    $scope.userData = localStorageService.get('userData');

    $scope.init = function () {
        //configuraciones de dropzone
        Dropzone.autoDiscover = false;
        $scope.dzOptionsCotizacion = uploadRepository.getDzOptions("image/*,application/pdf,.mp4,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,.docX,.DOCX,.ppt,.PPT",20);
        $scope.cargaEvidencias();
    }

    $scope.cargaEvidencias = function () {
        cotizacionEvidenciasRepository.getEvidenciasByCotizacion(idCotizacion, $scope.userData.idTipoUsuario, $scope.idTrabajo).then(function (result) {
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

    $scope.openEvidencia = function () {
        document.getElementById("myNav").style.width = "100%";
    }

    $scope.adjuntarEvidencia = function () {
        $('#cotizacionDetalle').appendTo('body').modal('show');
    }

    $scope.setValFiltro = function (val) {
        $scope.filtro = {};
        //$scope.filtro.idTipoArchivo = 0;
        $scope.filtro.idTipoArchivo = val;
    }

    //Se realiza la carga de archivos
    //call backs of drop zone
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            $scope.newFile = file;
        },
        'sending': function(file, xhr, formData){
            formData.append('idTrabajo', $scope.idTrabajo);
            formData.append('idCotizacion', idCotizacion);
            formData.append('idCategoria', 1);
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