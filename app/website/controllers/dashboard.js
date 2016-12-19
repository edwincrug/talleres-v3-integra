var DashBoardView = require('../views/ejemploVista'),
    DashBoardModel = require('../models/dataAccess2');

var DashBoard = function (conf) {
    this.conf = conf || {};

    this.view = new DashBoardView();
    this.model = new DashBoardModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}


//Obtiene la sumatoria de las citas 
DashBoard.prototype.get_sumatoriaCitas = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_CITAS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene la sumatoria de las cotizaciones
DashBoard.prototype.get_sumatoriaCotizaciones = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_COTIZACIONES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las zonas
DashBoard.prototype.get_zonas = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
       }
   ];

    this.model.query('SEL_GAR_POR_USUARIO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las tars
DashBoard.prototype.get_tars = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_TAR_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las tars
DashBoard.prototype.get_citasHistorial = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idEstatus',
            value: req.query.idEstatus,
            type: self.model.types.INT
        },
        {
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        },
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_CITA_DETALLE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene la sumatoria de las ordenes
DashBoard.prototype.get_sumatoriaOrdenes = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_ORDENES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene la sumatoria de las ordenes por cobrar
DashBoard.prototype.get_sumatoriaOrdenesPorCobrar = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_ORDENES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las ordens
DashBoard.prototype.get_ordenesHistorial = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idEstatus',
            value: req.query.idEstatus,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        },
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_ORDENES_DETALLE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las cotizaciones
DashBoard.prototype.get_cotizacionesHistorial = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'idEstatus',
            value: req.query.idEstatus,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_COTIZACIONES_DETALLE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las ordenes por cobrar
DashBoard.prototype.get_porCobrarHistorial = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'idEstatus',
            value: req.query.idEstatus,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        },
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_REPORTE_ORDENES_DETALLE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = DashBoard;