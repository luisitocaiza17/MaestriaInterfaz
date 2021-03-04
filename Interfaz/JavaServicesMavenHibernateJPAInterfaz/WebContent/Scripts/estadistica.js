/// <reference path="../Config.ts" />
/// <reference path="../Scripts/Configure/Proxy.ts" />
head.ready(function () {
    //llamamos al servicio para traer la informacion
    get$RegistroDatos$leerCalificacionArquitectura(58, function (result) {
        var respuesta = result.data;
        console.log(respuesta);
        //busco el listado de puntuaciones
        var listadoValores = [];
        var listadoValoresMinimos = [];
        var listadoValoresNombres = [];
        var valorMinimoRecomendado = 0;
        for (var _i = 0, _a = respuesta.factor; _i < _a.length; _i++) {
            var valor = _a[_i];
            listadoValores.push(valor.porcentajeEstadistico);
            listadoValoresMinimos.push(valor.porcentajeEstadisticoMinimo);
            listadoValoresNombres.push(valor.nombreFactor);
            valorMinimoRecomendado += valor.porcentajeEstadisticoMinimo;
        }
        //chart lineal global    
        $("#chart-mmHg").kendoChart({
            title: {
                text: "Recomendación del proyecto"
            },
            legend: {
                position: "bottom"
            },
            series: [{
                    type: "bullet",
                    data: [[respuesta.calificacionEstadistica, valorMinimoRecomendado]]
                }],
            chartArea: {
                margin: {
                    left: 0
                }
            },
            categoryAxis: {
                majorGridLines: {
                    visible: false
                },
                majorTicks: {
                    visible: false
                }
            },
            valueAxis: [{
                    plotBands: [{
                            from: 0, to: 100, color: "#ccc", opacity: .6
                        }],
                    majorGridLines: {
                        visible: true
                    },
                    min: 0,
                    max: 100,
                    minorTicks: {
                        visible: true
                    }
                }],
            tooltip: {
                visible: true,
                template: "Mínimo Recomendado: #= value.target # <br /> Total Proyecto: #= value.current #"
            }
        });
        //este es el chart de estrella
        $("#chart").kendoChart({
            title: {
                text: "Recomendación por factor"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "radarLine"
            },
            series: [{
                    name: "Porcentaje de recomendación por Factor",
                    data: listadoValores
                }, {
                    name: "Valor mínimo recomendable",
                    data: listadoValoresMinimos
                }],
            categoryAxis: {
                categories: listadoValoresNombres
            },
            valueAxis: {
                labels: {
                    format: "{0} %"
                }
            },
            tooltip: {
                visible: true,
                format: "{0} %"
            }
        });
        //para llenar este char se debe agrupar las calificaciones en base pares    
        var factor1 = [listadoValores[0], listadoValoresMinimos[0]];
        var factor2 = [listadoValores[1], listadoValoresMinimos[1]];
        var factor3 = [listadoValores[2], listadoValoresMinimos[2]];
        var factor4 = [listadoValores[3], listadoValoresMinimos[3]];
        var factor5 = [listadoValores[4], listadoValoresMinimos[4]];
        var factor6 = [listadoValores[5], listadoValoresMinimos[5]];
        var factor7 = [listadoValores[6], listadoValoresMinimos[6]];
        var factor8 = [listadoValores[7], listadoValoresMinimos[7]];
        var factor9 = [listadoValores[8], listadoValoresMinimos[8]];
        var factor10 = [listadoValores[9], listadoValoresMinimos[9]];
        //aqui le vamos a poner el chart de barras                
        $("#chartBarras").kendoChart({
            title: {
                text: "Recomendación por factor"
            },
            legend: {
                visible: true
            },
            seriesDefaults: {
                type: "bar",
                stack: true
            },
            series: [{
                    name: listadoValoresNombres[0],
                    data: factor1,
                    color: "#7400b8"
                }, {
                    name: listadoValoresNombres[1],
                    data: factor2,
                    color: "#6930c3"
                }, {
                    name: listadoValoresNombres[2],
                    data: factor3,
                    color: "#5e60ce"
                }, {
                    name: listadoValoresNombres[3],
                    data: factor4,
                    color: "#5390d9"
                }, {
                    name: listadoValoresNombres[4],
                    data: factor5,
                    color: "#4ea8de"
                }, {
                    name: listadoValoresNombres[5],
                    data: factor6,
                    color: "#48bfe3"
                }, {
                    name: listadoValoresNombres[6],
                    data: factor7,
                    color: "#56cfe1"
                }, {
                    name: listadoValoresNombres[7],
                    data: factor8,
                    color: "#64dfdf"
                }, {
                    name: listadoValoresNombres[8],
                    data: factor9,
                    color: "#72efdd"
                }, {
                    name: listadoValoresNombres[9],
                    data: factor10,
                    color: "#64dfdf"
                }],
            valueAxis: {
                max: 100,
                line: {
                    visible: true
                },
                minorGridLines: {
                    visible: true
                }
            },
            categoryAxis: {
                categories: ["Proyecto", "Recomenación Mínima"],
                majorGridLines: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                template: "#= series.name #: #= value #"
            }
        });
    }, function (error) { });
});
