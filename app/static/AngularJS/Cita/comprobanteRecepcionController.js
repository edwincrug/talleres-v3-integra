registrationModule.controller('comprobanteRecepcionController', function ($scope, $route, $modal, $rootScope, localStorageService, alertFactory, globalFactory, citaRepository, ordenServicioRepository, cotizacionRepository, trabajoRepository, uploadRepository) {

	
	$scope.init = function(){
		$scope.infoCita=localStorageService.get('cita');
		$scope.show_exteriores=true;
		$scope.show_interiores=false;
		$scope.show_accesorios=false;
		$scope.show_componentes=false;
		$scope.show_documentos=false;
		$scope.show_tablero=false;
		$scope.show_unidad=false;
		$scope.ubi_Delantera=false;
		$scope.ubi_Trasera=false;
		$scope.ubi_ParteDerecha=false;
		$scope.ubi_ParteIzquierda=false;
		$scope.ubi_Techo=false;
		
		
	}  

	$scope.menu = function(data){
		$scope.show_exteriores=false;
		$scope.show_interiores=false;
		$scope.show_accesorios=false;
		$scope.show_componentes=false;
		$scope.show_documentos=false;
		$scope.show_tablero=false;
		$scope.show_unidad=false;

		switch(data)
        {
              case 0:
                $scope.show_exteriores=true;
              break;

              case 1:
                $scope.show_interiores=true;
              break;

              case 2:
                $scope.show_accesorios=true;
              break;

              case 3:
                $scope.show_componentes=true;
              break;

              case 4:
                $scope.show_documentos=true;
              break;

              case 5:
                $scope.show_tablero=true;
              break;

              case 6:
                $scope.show_unidad=true;
              break;

              
        }  
	}

	$scope.changeDesc = function (data, esttus) {

		if (!esttus) {
			switch(data) {
              case 'delantera':
                $scope.ubi_DelanteraDesc='';
              break;

              case 'trasera':
                $scope.ubi_TraseraDesc='';
              break;

              case 'derecha':
                $scope.ubi_ParteDerechaDesc='';
              break;

              case 'izquierda':
                $scope.ubi_ParteIzquierdaDesc='';
              break;   

              case 'techo':
                $scope.ubi_TechoDesc='';
              break;
	        }  
		}
		
	
	}


	$scope.addComprobanteRecepcion = function () {
	
		var data = {};
		if (!$scope.acepta) {
			alertFactory.info("Debe Aceptar las Condiciones.");
		}else{
			$scope.class_buttonCeritficado = 'fa fa-spinner fa-spin';
			data.ext_Claxon=$scope.ext_Claxon;
			data.ext_TaponGasolina=$scope.ext_TaponGasolina;
			data.ext_TaponLlantas=$scope.ext_TaponLlantas;
			data.ext_FarosDelanteros=$scope.ext_FarosDelanteros;
			data.ext_Antena=$scope.ext_Antena;
			data.ext_Emblemas=$scope.ext_Emblemas;
			data.ext_Cristales=$scope.ext_Cristales;
			data.int_EspejoRetrovisor=$scope.int_EspejoRetrovisor;
			data.int_Radio=$scope.int_Radio;
			data.int_CinturonSeguridad=$scope.int_CinturonSeguridad;
			data.int_ManijasSeguros=$scope.int_ManijasSeguros;
			data.int_Encendedor=$scope.int_Encendedor;
			data.int_Cenicero=$scope.int_Cenicero;
			data.int_Tapetes=$scope.int_Tapetes;
			data.int_Ac=$scope.int_Ac;
			data.int_Lector=$scope.int_Lector;
			data.int_BolsaAireDelantera=$scope.int_BolsaAireDelantera;
			data.int_BolsaAireLateral=$scope.int_BolsaAireLateral;
			data.int_Usb=$scope.int_Usb;
			data.int_LlavesUnidad=$scope.int_LlavesUnidad;
			data.acs_Gato=$scope.acs_Gato;
			data.acs_ManeralGato=$scope.acs_ManeralGato;
			data.acs_LlaveRuedas=$scope.acs_LlaveRuedas;
			data.acs_Reflejantes=$scope.acs_Reflejantes;
			data.acs_Extintor=$scope.acs_Extintor;
			data.acs_LlantaRefaccion=$scope.acs_LlantaRefaccion;
			data.acs_CableCorriente=$scope.acs_CableCorriente;
			data.acs_PeliculaAntiasalto=$scope.acs_PeliculaAntiasalto;
			data.acs_BirlosTuercas=$scope.acs_BirlosTuercas;
			data.acs_ProteccionEspejoLateral=$scope.acs_ProteccionEspejoLateral;
			data.acs_Gps=$scope.acs_Gps;
			data.com_TaponAceite=$scope.com_TaponAceite;
			data.com_TaponRadiador=$scope.com_TaponRadiador;
			data.com_VarillaAceite=$scope.com_VarillaAceite;
			data.com_Bateria=$scope.com_Bateria;
			data.com_TaponMotor=$scope.com_TaponMotor;
			data.doc_PolizaSeguro=$scope.doc_PolizaSeguro;
			data.doc_TarjetaCirculacion=$scope.doc_TarjetaCirculacion;
			data.doc_Engomado=$scope.doc_Engomado;
			data.doc_Verificacion=$scope.doc_Verificacion;
			data.doc_ManualesUnidad=$scope.doc_ManualesUnidad;
			data.doc_PermisoProvisional=$scope.doc_PermisoProvisional;
			data.tab_Descripcion=$scope.tab_Descripcion;
			data.tab_Odometro=$scope.tab_Odometro;
			data.ubi_DelanteraDesc=$scope.ubi_DelanteraDesc;
			data.ubi_TraseraDesc=$scope.ubi_TraseraDesc;
			data.ubi_ParteDerechaDesc=$scope.ubi_ParteDerechaDesc;
			data.ubi_ParteIzquierdaDesc=$scope.ubi_ParteIzquierdaDesc;
			data.ubi_TechoDesc=$scope.ubi_TechoDesc;
			data.aprobacion=1;
			data.idCita=$scope.infoCita.idCita;
			data.idUsuario=$scope.userData.idUsuario;

			if ($scope.ubi_Techo) {
				data.ubi_Techo=1;
			}else{
				data.ubi_Techo=0;
			}

			if ($scope.ubi_Delantera) {
				data.ubi_Delantera=1;
			}else{
				data.ubi_Delantera=0;
			}

			if ($scope.ubi_Trasera) {
				data.ubi_Trasera=1;
			}else{
				data.ubi_Trasera=0;
			}

			if ($scope.ubi_ParteDerecha) {
				data.ubi_ParteDerecha=1;
			}else{
				data.ubi_ParteDerecha=0;
			}

			if ($scope.ubi_ParteIzquierda) {
				data.ubi_ParteIzquierda=1;
			}else{
				data.ubi_ParteIzquierda=0;
			}

			
			citaRepository.addComprobanteRecepcion(data).then(function (rest) {
				
	            if (rest.data[0].id > 0) {
	                alertFactory.success("Se insertó correctamente");
	                $scope.updateEstatusTrabajo();
	                //location.href = '/tallercita';
	            }else{
	            	 alertFactory.error("Error al insertar datos");
	            }
	            
	        }, function (error) {
	            alertFactory.error("Error al insertar datos");
	        });
	    }    
	}

	 //comprobante recepción cargada
    $scope.updateEstatusTrabajo = function () {
        trabajoRepository.insertTrabajo($scope.infoCita.idCita, $scope.userData.idUsuario, $scope.infoCita.idUnidad)
            .then(function (trabajo) {
                $scope.idTrabajoNew = trabajo.data[0].idTrabajo;
                $scope.generarPdfdata();
            }, function (error) {
                alertFactory.error("Error al insertar el trabajo");
            });
    }

     $scope.dzMethods = {};

	$scope.validateAprobacion = function(){
		
		if ($scope.ext_Claxon != undefined 
			&& $scope.ext_TaponGasolina != undefined 
			&& $scope.ext_TaponLlantas != undefined 
			&& $scope.ext_FarosDelanteros != undefined 
			&& $scope.ext_Antena != undefined 
			&& $scope.ext_Emblemas != undefined 
			&& $scope.ext_Cristales != undefined 
			&& $scope.int_EspejoRetrovisor != undefined 
			&& $scope.int_Radio != undefined 
			&& $scope.int_CinturonSeguridad != undefined 
			&& $scope.int_ManijasSeguros != undefined 
			&& $scope.int_Encendedor != undefined 
			&& $scope.int_Cenicero != undefined 
			&& $scope.int_Tapetes != undefined
			&& $scope.int_Ac != undefined
			&& $scope.int_Lector != undefined
			&& $scope.int_BolsaAireDelantera != undefined
			&& $scope.int_BolsaAireLateral != undefined
			&& $scope.int_Usb != undefined
			&& $scope.int_LlavesUnidad != undefined
			&& $scope.acs_Gato != undefined
			&& $scope.acs_ManeralGato != undefined
			&& $scope.acs_LlaveRuedas != undefined
			&& $scope.acs_Reflejantes != undefined
			&& $scope.acs_Extintor != undefined
			&& $scope.acs_LlantaRefaccion != undefined
			&& $scope.acs_CableCorriente != undefined
			&& $scope.acs_PeliculaAntiasalto != undefined
			&& $scope.acs_BirlosTuercas != undefined
			&& $scope.acs_ProteccionEspejoLateral != undefined
			&& $scope.acs_Gps != undefined
			&& $scope.com_TaponAceite != undefined
			&& $scope.com_TaponRadiador != undefined
			&& $scope.com_VarillaAceite != undefined
			&& $scope.com_Bateria != undefined
			&& $scope.com_TaponMotor != undefined
			&& $scope.doc_PolizaSeguro != undefined
			&& $scope.doc_TarjetaCirculacion != undefined
			&& $scope.doc_Engomado != undefined
			&& $scope.doc_Verificacion != undefined
			&& $scope.doc_ManualesUnidad != undefined
			&& $scope.doc_PermisoProvisional != undefined
			&& $scope.tab_Descripcion != undefined
			&& $scope.tab_Odometro != undefined
			&& $scope.tab_Descripcion != ''
			&& $scope.tab_Odometro != '') {
			return true;

		}else {
			return false;
		}	
	}


	    //////////////////////////////////////////////////////////////////////////////////////////////////
    //    Manda a Generar el PDF ultima version (03/feb/2017)
    //////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.generarPdfdata = function () {
       
        citaRepository.getGeneraPdf($scope.infoCita.idCita).then(function (result) {
           
            if (result.data.length>0) {
            	var data = {
					"DatosUnidad": 
					    {
					        "ext_Claxon":result.data[0].ext_Claxon,
					        "ext_TaponGasolina":result.data[0].ext_TaponGasolina,
					        "ext_TaponLlantas":result.data[0].ext_TaponLlantas,
					        "ext_FarosDelanteros":result.data[0].ext_FarosDelanteros,
					        "ext_Antena":result.data[0].ext_Antena,
					        "ext_Emblemas":result.data[0].ext_Emblemas,
					        "ext_Cristales":result.data[0].ext_Cristales,
					        "int_EspejoRetrovisor":result.data[0].int_EspejoRetrovisor,
					        "int_Radio":result.data[0].int_Radio,
					        "int_CinturonSeguridad":result.data[0].int_CinturonSeguridad,
					        "int_ManijasSeguros":result.data[0].int_ManijasSeguros,
					        "int_Encendedor":result.data[0].int_Encendedor,
					        "int_Cenicero":result.data[0].int_Cenicero,
					        "int_Tapetes":result.data[0].int_Tapetes,
					        "int_Ac":result.data[0].int_Ac,
					        "int_Lector":result.data[0].int_Lector,
					        "int_BolsaAireDelantera":result.data[0].int_BolsaAireDelantera,
					        "int_BolsaAireLateral":result.data[0].int_BolsaAireLateral,
					        "int_Usb":result.data[0].int_Usb,
					        "int_LlavesUnidad":result.data[0].int_LlavesUnidad,
					        "acs_Gato":result.data[0].acs_Gato,
					        "acs_ManeralGato":result.data[0].acs_ManeralGato,
					        "acs_LlaveRuedas":result.data[0].acs_LlaveRuedas,
					        "acs_Reflejantes":result.data[0].acs_Reflejantes,
					        "acs_Extintor":result.data[0].acs_Extintor,
					        "acs_LlantaRefaccion":result.data[0].acs_LlantaRefaccion,
					        "acs_CableCorriente":result.data[0].acs_CableCorriente,
					        "acs_PeliculaAntiasalto":result.data[0].acs_PeliculaAntiasalto,
					        "acs_BirlosTuercas":result.data[0].acs_BirlosTuercas,
					        "acs_ProteccionEspejoLateral":result.data[0].acs_ProteccionEspejoLateral,
					        "acs_Gps":result.data[0].acs_Gps,
					        "com_TaponAceite":result.data[0].com_TaponAceite,
					        "com_TaponRadiador":result.data[0].com_TaponRadiador,
					        "com_VarillaAceite":result.data[0].com_VarillaAceite,
					        "com_Bateria":result.data[0].com_Bateria,
					        "com_TaponMotor":result.data[0].com_TaponMotor,
					        "doc_PolizaSeguro":result.data[0].doc_PolizaSeguro,
					        "doc_TarjetaCirculacion":result.data[0].doc_TarjetaCirculacion,
					        "doc_Engomado":result.data[0].doc_Engomado,
					        "doc_Verificacion":result.data[0].doc_Verificacion,
					        "doc_ManualesUnidad":result.data[0].doc_ManualesUnidad,
					        "doc_PermisoProvisional":result.data[0].doc_PermisoProvisional,
					        "ubi_Delantera":result.data[0].ubi_Delantera,
					        "ubi_DelanteraDesc":result.data[0].ubi_DelanteraDesc,
					        "ubi_Trasera":result.data[0].ubi_Trasera,
					        "ubi_TraseraDesc":result.data[0].ubi_TraseraDesc,
					        "ubi_ParteDerecha":result.data[0].ubi_ParteDerecha,
					        "ubi_ParteDerechaDesc":result.data[0].ubi_ParteDerechaDesc,
					        "ubi_ParteIzquierda":result.data[0].ubi_ParteIzquierda,
					        "ubi_ParteIzquierdaDesc":result.data[0].ubi_ParteIzquierdaDesc,
					        "ubi_Techo":result.data[0].ubi_Techo,
					        "ubi_TechoDesc":result.data[0].ubi_TechoDesc,
					        "tab_Descripcion":result.data[0].tab_Descripcion,
					        "tab_Odometro":result.data[0].tab_Odometro,
					        "aprobacion":result.data[0].aprobacion,
					        "nombreCompleto":result.data[0].nombreCompleto, 		  
					        "fecha":result.data[0].fecha,
					        "idTrabajo":result.data[0].idTrabajo
					    },
					"Taller":
					       {
					       	"idTaller":result.data[0].idTaller,
					        "GAR":result.data[0].GAR,
					        "TAD":result.data[0].TAR,
					        "ciudad":result.data[0].ciudad,
					        "razonSocial":result.data[0].razonSocial,
					        "idTAR":result.data[0].idTAR,
					        "idProveedor":result.data[0].idTaller,
					       },
					"unidad":
					       {
					       "idUnidad":result.data[0].idUnidad,
					       "idLicitacion":result.data[0].idLicitacion,
					       "numEconomico":result.data[0].numEconomico,
					       "modelo":result.data[0].modelo,
					       "clienteNumInventario":result.data[0].clienteNumInventario,
					       "numTAR":result.data[0].numTAR,
					       "TAR":result.data[0].TAR,
					       "GAR":result.data[0].GAR,
					       "ubicacion":result.data[0].ubicacion,
					       "oper_pdes":result.data[0].oper_pdes,
					       "marca":result.data[0].marca,
					       "modeloMarca":result.data[0].modeloMarca,
					       "motor":result.data[0].motor,
					       "capacidadLts":result.data[0].capacidadLts,
					       "idTar":result.data[0].idTar
					       }
					}	
				}	
   
        var jsonData = {
            "template": {
                "name": "talleresUnidad_rpt" 
            },
            "data": data
        }
	        citaRepository.callExternalPdf(jsonData).then(function (result) {	        	
	        	setTimeout(function () {
		            window.open($rootScope.vIpServer + result.data);
		            location.href = '/tallercita';
		         }, 5000);	        	   			
	        });

        }, function (error) {
	        alertFactory.error("Error al insertar datos");
	    });
    }




});
