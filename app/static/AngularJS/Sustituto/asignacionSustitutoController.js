registrationModule.controller('asignacionSustitutoController', function (MarkerCreatorService, $scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository, uploadRepository, citaRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
	
	$scope.motivos= [];
    $scope.address = '';
    $scope.show_mapUnidad = false;
    $scope.show_mapSustituto = false;
        

	$scope.init_asignacion = function (){

         $scope.getMotivo();

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

    MarkerCreatorService.createByCoords(19.4353367, -99.1379815, function (marker) {
        marker.options.labelContent = 'Posición';
        $scope.autentiaMarker = marker;
    });
    
    $scope.map = {
        center: {
            latitude: $scope.autentiaMarker.latitude,
            longitude: $scope.autentiaMarker.longitude
        },
        zoom: 12,
        markers: [],
        control: {},
        options: {
            scrollwheel: false
        }
    }

    $scope.map.markers.push($scope.autentiaMarker);

    $scope.addCurrentLocation = function () {
        MarkerCreatorService.createByCurrentLocation(function (marker) {
            marker.options.labelContent = 'Usted se encuentra Aqui';
            $scope.map.markers.push(marker);
            refresh(marker);
        });
    }

    $scope.getUnidad = function (datoUnidad) {
        debugger;
        $('#btnBuscar').button('Buscando...');
        $scope.promise = citaRepository.getUnidadInformation(datoUnidad, $scope.userData.idUsuario).then(function (unidadInfo) {
            $('.dataTableUnidad').DataTable().destroy();
            $scope.unidades = unidadInfo.data;
            if (unidadInfo.data.length > 0) {
                globalFactory.waitDrawDocument("dataTableUnidad", "Unidad");
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
    }

    $scope.getSustituto = function (dataSustituto) {
        debugger;
        $('#btnSustituto').button('Buscando...');
        sustitutoRepository.getSustituto(dataSustituto).then(function (Info) {
            $('.dataTableSustituto').DataTable().destroy();
            $scope.sustitutos = Info.data;
            if (Info.data.length > 0) {
                globalFactory.waitDrawDocument("dataTableSustituto", "Sustituto");
                alertFactory.success('Datos encontrados');
                $('#btnSustituto').button('reset');
            } else {
                alertFactory.info('No se encontraron datos');
                $('#btnSustituto').button('reset');
            }
        }, function (error) {
            debugger;
            alertFactory.error('Error al obtener los datos');
            $('#btnSustituto').button('reset');
        });
    }


    $scope.selUnidad = function (unidad) {
        debugger;
         $scope.show_mapUnidad = true;
         $scope.select_unidad=unidad;

    }

    $scope.selsustituto = function (sustituto) {
        debugger;
        $scope.show_mapSustituto = true;
        $scope.select_sustituto=sustituto;

    }
    

});