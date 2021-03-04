/// <reference path="../Config.ts" />
/// <reference path="../Scripts/Configure/Proxy.ts" />
head.ready(function () {
    $('#principal').show();
    $('#carga').hide();
    var UsuarioLogueado;
    $('#parteInicial').show();
    $('#partePreguntas').hide();
    $('#parteAnalisis').hide();
    $('#btn_Ingresar').click(function () {
        Ingresar();
    });
    var contadorPreguntas = 0;
    var idUsuario = 0;
    var catalogoPreguntas;
    var idPregunta = 0;
    var idFactor = 0;
    var porcentajeEstadisticoPregunta = 0;
    var nombreProyecto = '';
    //inicializacion de barra de progreso
    var pb = $("#profileCompleteness").kendoProgressBar({
        min: 0,
        max: 50,
        type: "percent"
    }).data("kendoProgressBar");
    function Ingresar() {
        var usr = new UsuarioPojo();
        var proyecto = $('#in_nombre_proyecto').val().toString();
        nombreProyecto = proyecto;
        var usuario = $('#in_nombre_usuario').val().toString();
        var correo = $('#in_email').val().toString();
        if (!validateEmail(correo)) {
            return alert('Ingrese un email valido.');
        }
        if (proyecto == null || proyecto == '' || usuario == null || usuario == '' || correo == null || correo == '')
            return alert('El usuario y contraseña deben estar llenos.');
        usr.nombre = usuario;
        usr.nombreProyecto = proyecto;
        usr.correoElectronico = correo;
        post$Usuario$CrearUsuarioProyecto(usr, function (result) {
            if (result.status != 'OK')
                return alert('EL usuario o contraseña son incorrectos');
            var validacionLogueo = result.data;
            if (validacionLogueo != undefined && validacionLogueo.id != 0) {
                $('#parteInicial').hide();
                $('#nombreProyecto').text(validacionLogueo.nombreProyecto);
                $('#nombreUsuario').text(validacionLogueo.nombre);
                idUsuario = validacionLogueo.id;
                //activamos las partes del amor
                $('#partePreguntas').show();
                $('#btn_Siguiente').show();
                $('#btn_Finalizar').hide();
                //ahora buscamos el catalogo de preguntas
                get$Preguntas$BuscarPreguntas(function (result) {
                    catalogoPreguntas = result.data;
                    //graficamos la primera pregunta
                    idPregunta = catalogoPreguntas[contadorPreguntas].id;
                    idFactor = catalogoPreguntas[contadorPreguntas].idFactor;
                    porcentajeEstadisticoPregunta = catalogoPreguntas[contadorPreguntas].pesoEstadistico;
                    $("#preguntas").empty();
                    $("#preguntas").append('<p style="font-size:22px">' + catalogoPreguntas[contadorPreguntas].nombre + '</p>');
                    $("#preguntas").append('<table class="table"><tr>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="5">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor5 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="4">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor4 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="3">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor3 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="2">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor2 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="1">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor1 + '</label></td>' +
                        '</tr></table>');
                    //Envio el contador de preguntas
                    $("#idContador").empty();
                    $("#idContador").append('<p>Preguntas</p><p>1/50</p>');
                }, function (error) { });
            }
            else {
                alert('tuvimos un problema en la creacion del proyecto por favor intentelo en uno minutos.');
                $('#parteInicial').show();
            }
        }, function (error) {
            //// almacena variables de sesión
            //sessionStorage.setItem("logged", "1");
            //// redirección a la ventana interna
            //window.location = 'Home.html';
        });
    }
    //funcion  que graba los datos de la pregunta y ademas carga una nueva pregunta   
    $('#btn_Siguiente').click(function () {
        //validacion
        if ($('input[name="gender"]:checked').val() == undefined || $('input[name="gender"]:checked').val() == null || $('input[name="gender"]:checked').val() == 0) {
            return alert('Debe seleccionar un valor');
        }
        var respuesta = new CalificacionFactorPojo();
        respuesta.idPregunta = idPregunta;
        respuesta.idUsuario = idUsuario;
        respuesta.idFactor = idFactor;
        respuesta.calificacion = Number($('input[name="gender"]:checked').val());
        respuesta.porcentajeEstadisticoPregunta = porcentajeEstadisticoPregunta;
        post$RegistroDatos$RegistrarPregunta(respuesta, function (result) {
            var almacenamiento = result.data;
            if (almacenamiento) {
                //si se almaceno correctamente cargo la siguiente pregunta
                contadorPreguntas += 1;
                if ((catalogoPreguntas.length - 1) == contadorPreguntas) {
                    pb.value(contadorPreguntas);
                    $('#btn_Siguiente').hide();
                    $('#btn_Finalizar').show();
                    $("#idContador").empty();
                    $("#idContador").append('<p>Preguntas</p><p>' + (contadorPreguntas + 1) + '/50</p>');
                }
                else {
                    pb.value(contadorPreguntas);
                    idPregunta = catalogoPreguntas[contadorPreguntas].id;
                    idFactor = catalogoPreguntas[contadorPreguntas].idFactor;
                    porcentajeEstadisticoPregunta = catalogoPreguntas[contadorPreguntas].pesoEstadistico;
                    $("#preguntas").empty();
                    $("#preguntas").append('<p style="font-size:22px">' + catalogoPreguntas[contadorPreguntas].nombre + '</p>');
                    $("#preguntas").append('<table class="table"><tr>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="5">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor5 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="4">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor4 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="3">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor3 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="2">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor2 + '</label></td>' +
                        '<td><label style="font-size:18px"><input type="radio" name="gender" value="1">&nbsp;' + catalogoPreguntas[contadorPreguntas].valor1 + '</label></td>' +
                        '</tr></table>');
                    //Envio el contador de preguntas
                    $("#idContador").empty();
                    $("#idContador").append('<p>Preguntas</p><p>' + (contadorPreguntas + 1) + '/50</p>');
                }
            }
            else {
                alert('Tuvimos un problema al registrar la pregunta, por favor intentelo de nuevo');
            }
        }, function (error) { });
    });
    //finalizamos y alizamos el proceso
    $('#btn_Finalizar').click(function () {
        Loading_Show2();
        var respuesta = new CalificacionFactorPojo();
        respuesta.idPregunta = idPregunta;
        respuesta.idUsuario = idUsuario;
        respuesta.idFactor = idFactor;
        respuesta.calificacion = Number($('input[name="gender"]:checked').val());
        respuesta.porcentajeEstadisticoPregunta = porcentajeEstadisticoPregunta;
        //registramos la ultima pregunta 
        post$RegistroDatos$RegistrarPregunta(respuesta, function (result) {
            var almacenamiento = result.data;
            if (almacenamiento) {
                //procesamos la arquitectura
                get$RegistroDatos$ProcesarArquitectura(idUsuario, function (result) {
                    //llamamos al servicio para traer la informacion
                    get$RegistroDatos$leerCalificacionArquitectura(idUsuario, function (result) {
                        var respuesta = result.data;
                        $('#parteInicial').hide();
                        $('#partePreguntas').hide();
                        $('#parteAnalisis').show();
                        Loading_Hide2();
                        //busco el listado de puntuaciones
                        var listadoValores = [];
                        var listadoValoresMinimos = [];
                        var listadoValoresNombres = [];
                        var valorMinimoRecomendado = 0;
                        for (var _i = 0, _a = respuesta.factor; _i < _a.length; _i++) {
                            var valor = _a[_i];
                            listadoValores.push(Number(valor.porcentajeEstadistico.toFixed(2)));
                            listadoValoresMinimos.push(Number(valor.porcentajeEstadisticoMinimo.toFixed(2)));
                            listadoValoresNombres.push(valor.nombreFactor);
                            valorMinimoRecomendado += valor.porcentajeEstadisticoMinimo;
                        }
                        var ResultadoRecomendacion = '';
                        if (respuesta.calificacionEstadistica > valorMinimoRecomendado) {
                            ResultadoRecomendacion = '<b>SI</b> se recomienda el uso de la arquitectura de Micro-Servicios.';
                        }
                        else {
                            ResultadoRecomendacion = '<b>NO</b> se recomienda el uso de la arquitectura de Micro-Servicios.';
                        }
                        $("#tituloFinal").empty();
                        $('#tituloFinal').append('<h3 align="center">Sistema de Sugerencias de Arquitectura de Micro-servicios' +
                            '<small class="text-muted">(SSAM)</small>' +
                            '</h3> ' +
                            '<br/>' +
                            '<blockquote class="blockquote" align="center">' +
                            '<p class="mb-0">El proyecto <b>' + nombreProyecto + '</b> fue analizado en base a sus factores técnicos y obtuvo un grado de recomendación del (<b>' + (respuesta.calificacionEstadistica.toFixed(2)) + '/100)%</b>' +
                            ' por lo que ' + ResultadoRecomendacion + '<p><br>' +
                            '<footer class="blockquote-footer">Esta es una recomendación por parte del modelo de sugerencia de toma de desciciones es opción del usuario acogerse o no a la misma.</footer></blockquote>');
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
                                    data: [[respuesta.calificacionEstadistica.toFixed(2), valorMinimoRecomendado.toFixed(2)]]
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
                                template: "Mínimo Recomendado: #= value.target # % <br /> Total Proyecto: #= value.current # %"
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
                        var factor1 = [Number(listadoValores[0]), Number(listadoValoresMinimos[0])];
                        var factor2 = [Number(listadoValores[1]), Number(listadoValoresMinimos[1])];
                        var factor3 = [Number(listadoValores[2]), Number(listadoValoresMinimos[2])];
                        var factor4 = [Number(listadoValores[3]), Number(listadoValoresMinimos[3])];
                        var factor5 = [Number(listadoValores[4]), Number(listadoValoresMinimos[4])];
                        var factor6 = [Number(listadoValores[5]), Number(listadoValoresMinimos[5])];
                        var factor7 = [Number(listadoValores[6]), Number(listadoValoresMinimos[6])];
                        var factor8 = [Number(listadoValores[7]), Number(listadoValoresMinimos[7])];
                        var factor9 = [Number(listadoValores[8]), Number(listadoValoresMinimos[8])];
                        var factor10 = [Number(listadoValores[9]), Number(listadoValoresMinimos[9])];
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
                }, function (error) { });
            }
        }, function (error) { });
    });
    //exportar chart principal    
    $("#descargaPrincipal").click(function () {
        $("#chart-mmHg").getKendoChart().saveAsPDF();
    });
    //exportar chart segundo    
    $("#descargaSegunda").click(function () {
        $("#chart").getKendoChart().saveAsPDF();
    });
    //exportar chart tercero    
    $("#descargaTercera").click(function () {
        $("#chartBarras").getKendoChart().saveAsPDF();
    });
    function llamarVentanaInformacion() {
        $("#elProyecto_window").kendoWindow({
            width: "650px",
            height: "600px",
            title: "EL Proyecto",
            modal: true
        }).data("kendoWindow").center().open();
    }
    llamarVentanaInformacionGeneral = llamarVentanaInformacion;
    function llamarVentanaEquipo() {
        $("#elProyecto_window2").kendoWindow({
            width: "650px",
            height: "600px",
            title: "Nuestro Equipo",
            modal: true
        }).data("kendoWindow").center().open();
    }
    llamarVentanaEquipoGeneral = llamarVentanaEquipo;
    Loading_Hide();
});
