/// <reference path="../Config.ts" />
/// <reference path="../Scripts/Configure/Proxy.ts" />
var modulos = new Array();
head.ready(function () {
    $('#principal').show();
    $('#carga').hide();
    var UsuarioLogueado;
    $('#parteInicial').show();
    $('#partePreguntas').hide();
    $('#parteAnalisis').hide();
    $('#parteDosPreguntas').hide();
    $('#parteTresPreguntas').hide();
    $('#parteCuatroPreguntas').hide();
    $('#parteQuintaPreguntas').hide();
    $('#parteSextaPreguntas').hide();
    $('#parteSeptimaPreguntas').hide();
    $('#parteOctavaPreguntas').hide();
    $('#parteNovenaPreguntas').hide();
    $('#parteDecimaPreguntas').hide();
    $('#parteOncePreguntas').hide();
    $('#cabeceraOriginal').hide();
    $('#parteDocePreguntas').hide();
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
    //sumatoria de preguntas
    var preguntaIntegracionContinua = 0;
    //inicializacion de barra de progreso
    var pb = $("#profileCompleteness").kendoProgressBar({
        min: 0,
        max: 11,
        type: "percent"
    }).data("kendoProgressBar");
    function Ingresar() {
        var usr = new UsuarioPojo();
        var proyecto = String($('#in_nombre_proyecto').val());
        nombreProyecto = String(proyecto);
        var usuario = String($('#in_nombre_usuario').val());
        var correo = String($('#in_email').val());
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
                $('.nombreProyecto').text(validacionLogueo.nombreProyecto);
                $('.nombreUsuario').text(validacionLogueo.nombre);
                idUsuario = validacionLogueo.id;
                //activamos las partes del amor
                $('#partePreguntas').show();
                $('#btn_Siguiente').show();
                $('#preguntas').show();
                $('#btn_Finalizar').hide();
                $("#idContador").empty();
                $("#idContador").append('<p>Preguntas</p><p>1/12</p>');
                pb.value(1);
                $('#cabeceraOriginal').show();
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
    //variable para calcular en base a la pregunta 1 y 2 el porcentaje de recomendacion
    var resumenFactorUnoDos = 0;
    //funcion  del primer formulario  
    $('#btn_Siguiente').click(function () {
        //verificamos que seleccione algo
        var preguntasCheckeadas = $('.pregunta1').filter(':checked').length;
        if (preguntasCheckeadas == 0)
            return alert('Debe seleccionar al menos una respuesta para poder continuar');
        $("#lineaTC").val(0);
        $("#lineaFC").val(0);
        $("#TiempoMax").val(0);
        $("#TiempoMin").val(0);
        $("#TiempoPromedio").val(0);
        $("#lineaMO").val(0);
        $("#lineaCL").val(0);
        $("#lineaNU").val(0);
        $("#lineaHA").val(0);
        $('#partePreguntas').hide();
        $('#parteDosPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>2/12</p>');
        pb.value(2);
        //avaluamos esta pregunta
        var valor = $('input[name="pregunta1"]:checked').val();
        //verificamos los valores de cada facotr segun la tabla de configuracion
        //Patrón  Manejabilidad       recursos  escalabilidad  disponibilidad y fiabilidad
        //SPP         Alta                        Baja        Baja        Media 
        //ShPP Media / Alta               Alta        Media     Baja
        //CPP       Media                     Alta         Media     Alta         
        //MShPP  Baja                        Alta         Alta         Media 
        //MCPP    Baja                        Alta         Alta         Alta
        if (valor == 'ninguno') {
            valorPorcentualEscalabilidadDinamica = 0;
            valorPorcentualManejabilidad = 0;
            valorPorcentualUtilizacionRecursos = 0;
            valorPorcentualDsiponibilidad = 0;
            valorPorcentualFiabilidad = 0;
        }
        if (valor == 'SPP') {
            valorPorcentualEscalabilidadDinamica = 66;
            valorPorcentualManejabilidad = 100;
            valorPorcentualUtilizacionRecursos = 33;
            valorPorcentualDsiponibilidad = 66;
            valorPorcentualFiabilidad = 66;
        }
        if (valor == 'SHPP') {
            valorPorcentualEscalabilidadDinamica = 33;
            valorPorcentualManejabilidad = 66;
            valorPorcentualUtilizacionRecursos = 66;
            valorPorcentualDsiponibilidad = 33;
            valorPorcentualFiabilidad = 33;
        }
        if (valor == 'CPP') {
            valorPorcentualEscalabilidadDinamica = 100;
            valorPorcentualManejabilidad = 66;
            valorPorcentualUtilizacionRecursos = 66;
            valorPorcentualDsiponibilidad = 100;
            valorPorcentualFiabilidad = 100;
        }
        if (valor == 'MSHPP') {
            valorPorcentualEscalabilidadDinamica = 66;
            valorPorcentualManejabilidad = 33;
            valorPorcentualUtilizacionRecursos = 100;
            valorPorcentualDsiponibilidad = 66;
            valorPorcentualFiabilidad = 66;
        }
        if (valor == 'MCPP') {
            valorPorcentualEscalabilidadDinamica = 100;
            valorPorcentualManejabilidad = 33;
            valorPorcentualUtilizacionRecursos = 100;
            valorPorcentualDsiponibilidad = 100;
            valorPorcentualFiabilidad = 100;
        }
    });
    var primeraMetricaDos = 0;
    var segundaMetricaDos = 0;
    //resultados booleanos de metricas pregunta dos
    var primerMetricaAlta = false;
    var segundaMetricaAlta = false;
    var terceraMetricaAlta = false;
    var CuartaMetricaMOAlta = false;
    var CuartaMetricaAlta = false;
    var QuintaMetricaAlta = false;
    var SextaMetricaAlta = false;
    var SeptimaMetricaAlta = false;
    var OctavaMetricaAlta = false;
    var MetricaCLAlta = false;
    var MetricaHAAlta = false;
    var MetricaTCAlta = false;
    var MetricaNUAlta = false;
    //regresar a pregunta 1
    $('#btn_Atras1').click(function () {
        $('#partePreguntas').show();
        $('#parteDosPreguntas').hide();
        $('#parteTresPreguntas').hide();
        $("#idContador").empty();
        pb.value(1);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>1/11</p>');
    });
    var contadorPorcentajes = 0;
    //funcion  del segundo  formulario  
    $('#btn_SiguienteDos').click(function () {
        //hacemos el calculo
        //PRIMERA PREGUNTA
        //si FC/TC es ALTA 
        if ($("#lineaTC").val() == undefined || $("#lineaTC").val() == '') {
            return alert('TC debe contener un valor numerico');
        }
        if ($("#lineaFC").val() == undefined || $("#lineaFC").val() == '') {
            return alert('FC debe contener un valor numerico');
        }
        if ($("#TiempoMax").val() == undefined || $("TiempoMax").val() == '') {
            return alert('MaxT = Tiempo Máximo debe contener un valor numerico');
        }
        if ($("#TiempoMin").val() == undefined || $("#TiempoMin").val() == '') {
            return alert('MinT = Tiempo Mínimo debe contener un valor numerico');
        }
        if ($("#lineaNU").val() == undefined || $("#lineaNU").val() == '') {
            return alert('NU = Utilización de la Red (valor _%/100) un valor numerico');
        }
        if ($("#lineaMO").val() == undefined || $("lineaMO").val() == '') {
            return alert('MO = Ocupación de Memoria debe contener un valor numerico');
        }
        if (Number($("#lineaMO").val()) > 100) {
            return alert('MO = Ocupación de Memoria no puede sobre pasar el 100%');
        }
        if ($("#lineaCL").val() == undefined || $("lineaCL").val() == '') {
            return alert('CL = Carga de CPU debe contener un valor numerico');
        }
        //No puede ser mayor al 100%    
        if (Number($("#lineaCL").val()) > 100) {
            return alert('CL = Carga de CPU no puede sobre pasar el 100%');
        }
        if (Number($("#lineaNU").val()) > 100) {
            return alert('Utilización del Ancho de banda de la red no puede sobre pasar el 100%');
        }
        primeraMetricaDos = Number($("#lineaFC").val()) / Number($("#lineaTC").val());
        if (valorMinimoFCTC < primeraMetricaDos)
            primerMetricaAlta = true;
        //SEGUNDA PREGUNTA
        //si MaxT − MinT es ALTA
        segundaMetricaDos = Number($("#TiempoMax").val()) - Number($("#TiempoMin").val());
        if (valorMinimoMaxMinTiempo < segundaMetricaDos)
            segundaMetricaAlta = true;
        //TERCERA PREGUNTA
        //si AveTi − AveTj es ALTA
        if ($("#TiempoPromedio").val() == undefined || $("TiempoPromedio").val() == '') {
            return alert('AveTi  = Tiempo Promedio debe contener un valor numerico');
        }
        var valorPromedioPorcentual = Number($("#TiempoPromedio").val()) * 100 / Number($("#TiempoMax").val());
        if (valroMinitmoAveT < valorPromedioPorcentual)
            terceraMetricaAlta = true;
        //CUARTA PREGUNTA
        //si TC es BAJA y MO es ALTA
        //metrica tc alta
        if (valorMinimoTC < Number($("#lineaTC").val()))
            MetricaTCAlta = true;
        //metrica MO    
        if (valorMinimoMO < Number($("#lineaMO").val()))
            CuartaMetricaMOAlta = true;
        //verifico
        if (MetricaTCAlta == false && CuartaMetricaMOAlta == true) {
            CuartaMetricaAlta = true;
        }
        //QUINTA PREGUNTA
        //si TC es ALTA y CL es BAJA y HA es BAJA
        //metrica CL    
        if (valorMinimoCL < Number($("#lineaCL").val()))
            MetricaCLAlta = true;
        if ($("#lineaHA").val() == undefined || $("lineaHA").val() == '') {
            return alert('HA = Disponibilidad de Host debe contener un valor numerico');
        }
        //metrica HA    
        if (valorMinimoHA < Number($("#lineaHA").val()))
            MetricaHAAlta = true;
        //calculo de regla
        if (MetricaTCAlta == true && MetricaCLAlta == false && MetricaHAAlta == false)
            QuintaMetricaAlta = true;
        //SEXTA  PREGUNTA
        //si TC es ALTA y CL es BAJA y HA es BAJA
        if (MetricaTCAlta == true && MetricaCLAlta == true)
            SextaMetricaAlta = true;
        //SEPTIMA  PREGUNTA
        //si NU es ALTA
        //metrica HA    
        if (valorMinimoNU < Number($("#lineaNU").val())) {
            MetricaNUAlta = true;
            SeptimaMetricaAlta = true;
        }
        //OCTAVA  PREGUNTA
        //si TC es BAJA y CL es ALTA y HA es BAJA
        if (MetricaTCAlta == false && MetricaCLAlta == true && MetricaHAAlta == false)
            OctavaMetricaAlta = true;
        //verificamos las alarmas levantadas
        if (primerMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (segundaMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (terceraMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (CuartaMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (QuintaMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (SextaMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (SeptimaMetricaAlta == true)
            contadorPorcentajes += 12.5;
        if (OctavaMetricaAlta == true)
            contadorPorcentajes += 12.5;
        //sumamos los factores ppara sumar las metricas y promedio
        valorPorcentualEscalabilidadDinamica += contadorPorcentajes;
        valorPorcentualManejabilidad += contadorPorcentajes;
        valorPorcentualUtilizacionRecursos += contadorPorcentajes;
        valorPorcentualDsiponibilidad += contadorPorcentajes;
        valorPorcentualFiabilidad += contadorPorcentajes;
        //aqui tenemos el 50% de la primera pregunta
        valorPorcentualEscalabilidadDinamica = valorPorcentualEscalabilidadDinamica / 2;
        valorPorcentualManejabilidad = valorPorcentualManejabilidad / 2;
        valorPorcentualUtilizacionRecursos = valorPorcentualUtilizacionRecursos / 2;
        valorPorcentualDsiponibilidad = valorPorcentualDsiponibilidad / 2;
        valorPorcentualFiabilidad = valorPorcentualFiabilidad / 2;
        // mostramos el otro formulario y ocultmaos este
        $('#partePreguntas').hide();
        $('#parteDosPreguntas').hide();
        $('#parteTresPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>3/11</p>');
        pb.value(3);
    });
    //regresar a pregunta 2
    $('#btn_Atras2').click(function () {
        $('#parteDosPreguntas').show();
        $('#parteTresPreguntas').hide();
        $("#idContador").empty();
        pb.value(2);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>2/11</p>');
        preguntaIntegracionContinua = 0;
        valorPorcentualEscalabilidadDinamica -= contadorPorcentajes;
        valorPorcentualManejabilidad -= contadorPorcentajes;
        valorPorcentualUtilizacionRecursos -= contadorPorcentajes;
        valorPorcentualDsiponibilidad -= contadorPorcentajes;
        valorPorcentualFiabilidad -= contadorPorcentajes;
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteTres').click(function () {
        var preguntasCheckeadas = $('.Integracion1').filter(':checked').length;
        if (preguntasCheckeadas == 0)
            return alert('Debe seleccionar al menos una respuesta para poder continuar');
        // mostramos el otro formulario y ocultmaos este
        $('#parteTresPreguntas').hide();
        $('#parteCuatroPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>4/11</p>');
        pb.value(4);
        preguntaIntegracionContinua += Number($('input[name="Integracion1"]:checked').val());
    });
    //regresar a pregunta 2
    $('#btn_Atras3').click(function () {
        $('#parteCuatroPreguntas').hide();
        $('#parteTresPreguntas').show();
        $("#idContador").empty();
        pb.value(3);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>3/11</p>');
        preguntaIntegracionContinua = preguntaIntegracionContinua - Number($('input[name="Integracion1"]:checked').val());
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteCuatro').click(function () {
        var preguntasCheckeadas = $('.Integracion2').filter(':checked').length;
        if (preguntasCheckeadas == 0)
            return alert('Debe seleccionar al menos una respuesta para poder continuar');
        // btn_SiguienteCuatro el otro formulario y ocultmaos este
        $('#parteCuatroPreguntas').hide();
        $('#parteSextaPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>5/11</p>');
        pb.value(5);
        preguntaIntegracionContinua += Number($('input[name="Integracion2"]:checked').val());
    });
    //regresar a pregunta 2
    $('#btn_Atras4').click(function () {
        $('#parteCuatroPreguntas').show();
        $('#parteSextaPreguntas').hide();
        $("#idContador").empty();
        pb.value(4);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>4/11</p>');
        preguntaIntegracionContinua -= Number($('input[name="Integracion2"]:checked').val());
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteSexto').click(function () {
        var preguntasCheckeadas = $('.Integracion3').filter(':checked').length;
        if (preguntasCheckeadas == 0)
            return alert('Debe seleccionar al menos una respuesta para poder continuar');
        // mostramos el otro formulario y ocultmaos este
        $('#parteSextaPreguntas').hide();
        $('#parteSeptimaPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>6/11</p>');
        pb.value(6);
        preguntaIntegracionContinua += Number($('input[name="Integracion3"]:checked').val());
    });
    //regresar a pregunta 4
    $('#btn_Atras5').click(function () {
        $('#parteSextaPreguntas').show();
        $('#parteSeptimaPreguntas').hide();
        $("#idContador").empty();
        pb.value(5);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>5/11</p>');
        preguntaIntegracionContinua -= Number($('input[name="Integracion3"]:checked').val());
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteSeptimo').click(function () {
        var preguntasCheckeadas = $('.Integracion4').filter(':checked').length;
        if (preguntasCheckeadas == 0)
            return alert('Debe seleccionar al menos una respuesta para poder continuar');
        // mostramos el otro formulario y ocultmaos este
        $('#parteSeptimaPreguntas').hide();
        $('#parteOctavaPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>7/11</p>');
        pb.value(7);
        preguntaIntegracionContinua += Number($('input[name="Integracion4"]:checked').val());
    });
    //regresar a pregunta 4
    $('#btn_Atras6').click(function () {
        $('#parteSeptimaPreguntas').show();
        $('#parteOctavaPreguntas').hide();
        $("#idContador").empty();
        pb.value(6);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>6/11</p>');
        preguntaIntegracionContinua -= Number($('input[name="Integracion4"]:checked').val());
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteOctava').click(function () {
        // mostramos el otro formulario y ocultmaos este
        $('#parteOctavaPreguntas').hide();
        $('#parteNovenaPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>8/11</p>');
        pb.value(8);
        var preguntasCheckeadas = $('.Integracion5').filter(':checked').length;
        if (preguntasCheckeadas > 0)
            preguntaIntegracionContinua += 1;
    });
    //regresar a pregunta 4
    $('#btn_Atras7').click(function () {
        $('#parteOctavaPreguntas').show();
        $('#parteNovenaPreguntas').hide();
        $("#idContador").empty();
        pb.value(7);
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>7/11</p>');
        preguntaIntegracionContinua--;
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteNovena').click(function () {
        // mostramos el otro formulario y ocultmaos este
        $('#parteNovenaPreguntas').hide();
        $('#parteDecimaPreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>9/11</p>');
        pb.value(9);
        var preguntasCheckeadas = $('.Integracion6').filter(':checked').length;
        if (preguntasCheckeadas > 0)
            preguntaIntegracionContinua += 1;
    });
    //regresar a pregunta 4
    $('#btn_Atras8').click(function () {
        $('#parteNovenaPreguntas').show();
        $('#parteDecimaPreguntas').hide();
        $("#idContador").empty();
        pb.value(8);
        $("#idContador").append('<p>Preguntas</p><p>8/11</p>');
        preguntaIntegracionContinua--;
    });
    //funcion  del tercer  formulario  
    $('#btn_SiguienteDecima').click(function () {
        // mostramos el otro formulario y ocultmaos este
        $('#parteDecimaPreguntas').hide();
        $('#parteOncePreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>10/11</p>');
        pb.value(10);
        var preguntasCheckeadas = $('.Integracion7').filter(':checked').length;
        if (preguntasCheckeadas > 0)
            preguntaIntegracionContinua += 1;
    });
    //regresar a pregunta 4
    $('#btn_Atras9').click(function () {
        $('#parteDecimaPreguntas').show();
        $('#parteOncePreguntas').hide();
        $("#idContador").empty();
        pb.value(9);
        $("#idContador").append('<p>Preguntas</p><p>9/11</p>');
        preguntaIntegracionContinua--;
    });
    //funcion  del Once  formulario  
    $('#btn_SiguienteOnce').click(function () {
        // mostramos el otro formulario y ocultmaos este
        var preguntasCheckeadas = $('.Integracion8').filter(':checked').length;
        if (preguntasCheckeadas > 0)
            preguntaIntegracionContinua += 1;
        //en base a todas las preguntas calculamos el porcentaje de recomendacion
        var valorPorcentual = preguntaIntegracionContinua * 100 / 16;
        valorPorcentualIntegracionContinua = valorPorcentual;
        $("#ControlesDinamicos").empty();
        $("#inCBN").val(0);
        $("#inCBCOM").val(0);
        $("#inAC").val(0);
        $("#inEC").val(0);
        $("#inNUCPCOM").val(0);
        $("#inNumCycles").val(0);
        $("#inInDepned").val(0);
        $("#inNCOMPUC").val(0);
        $("#inNCPCOM").val(0);
        $("#inPeso").val(0);
        modulos = new Array();
        $('#parteOncePreguntas').hide();
        $('#parteDocePreguntas').show();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>11/11</p>');
        pb.value(11);
    });
    //regresar a pregunta 4
    $('#btn_Atras10').click(function () {
        $('#parteOncePreguntas').show();
        $('#parteDocePreguntas').hide();
        $("#idContador").empty();
        $("#idContador").empty();
        $("#idContador").append('<p>Preguntas</p><p>10/11</p>');
        preguntaIntegracionContinua--;
        pb.value(10);
    });
    //muestra ventana de agregar modulos
    $('#btn_Modulo').click(function () {
        $("#VentanaAgregarModulo").kendoWindow({
            width: "650px",
            height: "400px",
            title: "Agregar Modulos",
            modal: true
        }).data("kendoWindow").center().open();
    });
    var contadorModulos = 0;
    var sumatoriaValoresModulosGLobales = 0;
    var modulosIndividuales = new Array();
    //Agregamos un modulo a la tabla
    $('#AgregarMod').click(function () {
        contadorModulos++;
        var nombreModulo = $("#inNombre").val();
        var pesoModulo = $("#inPeso").val();
        $("#ControlesDinamicos").append('<tr id="c_' + contadorModulos + '"><td>' + contadorModulos + '</td><td>' + nombreModulo + '</td><td>' + pesoModulo + '</td>' +
            '<td><button type="button" id="btn_detalle' + contadorModulos + '" disabled  onclick="javascript:editar(' + contadorModulos + ');"  class="btn btn-primary">Editar</button></td>' +
            '<td><button type="button" id="btn_Eliminar' + contadorModulos + '" onclick="javascript:eliminar(' + contadorModulos + ');"  class="btn btn-primary">Eliminar Modulo</button></td>' +
            '</tr>');
        //Agregamos el registro al listado de objetos
        var factorIndividual = new factorDetalle();
        factorIndividual.id = contadorModulos;
        factorIndividual.nombre = nombreModulo;
        factorIndividual.peso = pesoModulo;
        modulosIndividuales.push(factorIndividual);
        $("#VentanaAgregarModulo").data("kendoWindow").close();
    });
    //cerrar ventana por cacnelacion
    $('#CancelarMod').click(function () {
        $("#inNombre").val('');
        $("#inPeso").val(0);
        $("#VentanaAgregarModulo").data("kendoWindow").close();
    });
    //regresar a pregunta 4
    $('#btn_Atras11').click(function () {
        $('#parteDocePreguntas').show();
        $('#parteAnalisis').hide();
        $("#idContador").empty();
        pb.value(11);
        totalModularidadPregunta = 0;
        totalNCCOMP = 0;
        totalNUCPCOM = 0;
    });
    var pesoTotalModulos = 0;
    var numeroTotalModulos = 0;
    //Confirmar modulos
    $('#btn_ConfirmarModulos').click(function () {
        var conf = confirm('¿Esta seguro de querer confirmar todos los modulos agregados? despues de aceptar no podra agregar ni eliminar modulos');
        if (!conf)
            return false;
        for (var _i = 0, modulosIndividuales_1 = modulosIndividuales; _i < modulosIndividuales_1.length; _i++) {
            var m = modulosIndividuales_1[_i];
            $('#btn_detalle' + m.id).prop('disabled', false);
            $('#btn_Eliminar' + m.id).prop('disabled', true);
            pesoTotalModulos += m.peso;
            numeroTotalModulos++;
        }
        $('#btn_SiguienteDoce').show();
        $('#btn_AtrasDetalle').show();
        $('#btn_ConfirmarModulos').hide();
        $('#btn_Modulo').hide();
        $('#btn_Atras10').hide();
    });
    $('#btn_AtrasDetalle').click(function () {
        for (var _i = 0, modulosIndividuales_2 = modulosIndividuales; _i < modulosIndividuales_2.length; _i++) {
            var m = modulosIndividuales_2[_i];
            $('#btn_detalle' + m.id).prop('disabled', true);
            $('#btn_Eliminar' + m.id).prop('disabled', false);
        }
        pesoTotalModulos = 0;
        numeroTotalModulos = 0;
        $('#btn_SiguienteDoce').hide();
        $('#btn_AtrasDetalle').hide();
        $('#btn_ConfirmarModulos').show();
        $('#btn_Modulo').show();
        $('#btn_Atras10').show();
    });
    modulos = new Array();
    var listasFinal;
    var factorTodos = new Array();
    var listadoValores = new Array();
    var listadoValoresMinimos = new Array();
    var listadoValoresNombres = new Array();
    //funcion  del Doce  formulario  
    $('#btn_SiguienteDoce').click(function () {
        // mostramos el otro formulario y ocultmaos este
        $('#parteAnalisis').show();
        $('#parteDocePreguntas').hide();
        pb.value(12);
        var totalPesos = 0;
        var totalModularidadPregunta = 0;
        var totalNCCOMP = 0;
        var totalNUCPCOM = 0;
        for (var _i = 0, modulosIndividuales_3 = modulosIndividuales; _i < modulosIndividuales_3.length; _i++) {
            var m = modulosIndividuales_3[_i];
            totalModularidadPregunta += m.modularidad;
            totalNCCOMP += m.ncpcom;
            totalNUCPCOM += m.nucpcom;
        }
        //saco el promedio por numero de modulos
        totalModularidadPregunta = (totalModularidadPregunta * 100) / contadorModulos;
        totalNCCOMP = (totalNCCOMP * 100) / contadorModulos;
        totalNUCPCOM = (totalNUCPCOM * 100) / contadorModulos;
        //agrego al factor modularidad
        valorPorcentualModularidad = totalModularidadPregunta;
        valorPorcentualFlexibilidad = totalModularidadPregunta;
        valorPorcentualInterOperabilidad = totalModularidadPregunta;
        valorPorcentualMantenibilidad = totalNCCOMP;
        valorPorcentualReusabilidad = totalNCCOMP;
        valorPorcentualChoesionAcoplamiento = totalNUCPCOM;
        valorPorcentualPortabilidad = totalNUCPCOM;
        valorPorcentualComputacionNube = valorPorcentualEscalabilidadDinamica;
        /**Ahora voy a ver las recomendacionesnes SI o NO de cada factor**/
        //1))PorcentualEscalabilidadDinamica
        var escalabilidad = false;
        if (valorPorcentualEscalabilidadDinamica > 50) {
            escalabilidad = true;
        }
        var factor1 = new factor();
        var valor1 = (valorPorcentualEscalabilidadDinamica * 7.6) / 100;
        factor1.nombre = 'Escalabilidad Dinámica';
        factor1.valor = valor1;
        factorTodos.push(factor1);
        listadoValores.push(valor1);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Escalabilidad Dinámica');
        //2)) valorPorcentualManejabilidad   
        var manejabilidad = false;
        if (valorPorcentualManejabilidad > 50) {
            escalabilidad = true;
        }
        var factor2 = new factor();
        var valor2 = (valorPorcentualManejabilidad * 7.6) / 100;
        ;
        factor2.nombre = 'Manejabilidad';
        factor2.valor = valor2;
        factorTodos.push(factor2);
        listadoValores.push(valor2);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Manejabilidad');
        //3)) valorPorcentualUtilizacionRecursos   
        var utilizacionRecursos = false;
        if (valorPorcentualUtilizacionRecursos > 50) {
            utilizacionRecursos = true;
        }
        var factor3 = new factor();
        var valor3 = (valorPorcentualUtilizacionRecursos * 7.6) / 100;
        factor3.nombre = 'Utilizacion de Recursos';
        factor3.valor = valor3;
        factorTodos.push(factor3);
        listadoValores.push(valor3);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Utilizacion de Recursos');
        //4)) valorPorcentualDsiponibilidad   
        var disponibilidad = false;
        if (valorPorcentualDsiponibilidad > 50) {
            disponibilidad = true;
        }
        var factor4 = new factor();
        var valor4 = (valorPorcentualDsiponibilidad * 7.6) / 100;
        factor4.nombre = 'Disponibilidad';
        factor4.valor = valor4;
        factorTodos.push(factor4);
        listadoValores.push(valor4);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Disponibilidad');
        //5)) valorPorcentualFiabilidad   
        var fiabilidad = false;
        if (valorPorcentualFiabilidad > 50) {
            fiabilidad = true;
        }
        var factor5 = new factor();
        var valor5 = (valorPorcentualFiabilidad * 7.6) / 100;
        factor5.nombre = 'Fiabilidad';
        factor5.valor = valor5;
        factorTodos.push(factor5);
        listadoValores.push(valor5);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Fiabilidad');
        //6)) valorPorcentualFiabilidad   
        var integracionContinua = false;
        if (valorPorcentualIntegracionContinua > 50) {
            integracionContinua = true;
        }
        var factor6 = new factor();
        var valor6 = (valorPorcentualIntegracionContinua * 7.6) / 100;
        factor6.nombre = 'Integración Continua';
        factor6.valor = valor6;
        factorTodos.push(factor6);
        listadoValores.push(valor6);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Integración Continua');
        //7)) valorPorcentualModularidad   
        var modularidad = false;
        if (valorPorcentualModularidad > 14) {
            modularidad = true;
        }
        var factor7 = new factor();
        var valor7 = (valorPorcentualModularidad * 7.6) / 100;
        factor7.nombre = 'Modularidad';
        factor7.valor = valor7;
        factorTodos.push(factor7);
        listadoValores.push(valor7);
        listadoValoresMinimos.push(0.106); //14%
        listadoValoresNombres.push('Modularidad');
        //8)) valorPorcentualMantenibilidad   
        var mantenibilidad = false;
        if (valorPorcentualMantenibilidad > 50) {
            mantenibilidad = true;
        }
        var factor8 = new factor();
        var valor8 = (valorPorcentualMantenibilidad * 7.6) / 100;
        factor8.nombre = 'Mantenibilidad';
        factor8.valor = valor8;
        factorTodos.push(factor8);
        listadoValores.push(valor8);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Mantenibilidad');
        //9)) valorPorcentualReusabilidad   
        var reusabilidad = false;
        if (valorPorcentualReusabilidad > 50) {
            reusabilidad = true;
        }
        var factor9 = new factor();
        var valor9 = (valorPorcentualReusabilidad * 7.6) / 100;
        factor9.nombre = 'Reusabilidad';
        factor9.valor = valor9;
        factorTodos.push(factor9);
        listadoValores.push(valor9);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Reusabilidad');
        //10)) valorPorcentualFlexibilidad   
        var flexibilidad = false;
        if (valorPorcentualFlexibilidad > 14) {
            flexibilidad = true;
        }
        var factor10 = new factor();
        var valor10 = (valorPorcentualFlexibilidad * 7.6) / 100;
        factor10.nombre = 'Flexibilidad';
        factor10.valor = valor10;
        factorTodos.push(factor10);
        listadoValores.push(valor10);
        listadoValoresMinimos.push(0.106);
        listadoValoresNombres.push('Flexibilidad');
        //11)) valorPorcentualInterOperabilidad   
        var interOperabilidad = false;
        if (valorPorcentualInterOperabilidad > 14) {
            interOperabilidad = true;
        }
        var factor11 = new factor();
        var valor11 = (valorPorcentualInterOperabilidad * 7.6) / 100;
        factor11.nombre = 'Interoperabilidad';
        factor11.valor = valor11;
        factorTodos.push(factor11);
        listadoValores.push(valor11);
        listadoValoresMinimos.push(0.106);
        listadoValoresNombres.push('Interoperabilidad');
        //12)) valorPorcentualChoesionAcoplamiento   
        var CohesionAcoplamiento = false;
        if (valorPorcentualChoesionAcoplamiento > 50) {
            CohesionAcoplamiento = true;
        }
        var factor12 = new factor();
        var valor12 = (valorPorcentualChoesionAcoplamiento * 7.6) / 100;
        factor12.nombre = 'Cohesión y Acoplamiento';
        factor12.valor = valor12;
        factorTodos.push(factor12);
        listadoValores.push(valor12);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Cohesión y Acoplamiento');
        //13)) valorPorcentualPortabilidad   
        var portabilidad = false;
        if (valorPorcentualPortabilidad > 50) {
            portabilidad = true;
        }
        var factor13 = new factor();
        var valor13 = (valorPorcentualPortabilidad * 7.6) / 100;
        factor13.nombre = 'Portabilidad';
        factor13.valor = valor13;
        factorTodos.push(factor13);
        listadoValores.push(valor13);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Portabilidad');
        //14)) valorPorcentualComputacionNube   
        var ComputacionNube = false;
        if (valorPorcentualComputacionNube > 50) {
            ComputacionNube = true;
        }
        var factor14 = new factor();
        var valor14 = (valorPorcentualComputacionNube * 7.6) / 100;
        factor14.nombre = 'Computacion en la Nube';
        factor14.valor = valor14;
        factorTodos.push(factor14);
        listadoValores.push(valor14);
        listadoValoresMinimos.push(3.8);
        listadoValoresNombres.push('Computacion en la Nube');
        //contador de verdaderos y falsos
        var contadorSi = 0;
        var contadorNo = 0;
        var EscalabilidadDinamicaCount = 0;
        var ManejabilidadCount = 0;
        var UtilizacionRecursosCount = 0;
        var DsiponibilidadCount = 0;
        var FiabilidadCount = 0;
        var ComputacionNubeCount = 0;
        var ModularidadCount = 0;
        var MantenibilidadCount = 0;
        var ReusabilidadCount = 0;
        var FlexibilidadCount = 0;
        var InterOperabilidadCount = 0;
        var ChoesionAcoplamientoCount = 0;
        var PortabilidadCount = 0;
        var IntegracionContinuaCount = 0;
        if (escalabilidad) {
            contadorSi++;
            EscalabilidadDinamicaCount += 1;
        }
        else
            contadorNo++;
        if (manejabilidad) {
            contadorSi++;
            ManejabilidadCount += 1;
        }
        else
            contadorNo++;
        if (utilizacionRecursos) {
            contadorSi++;
            UtilizacionRecursosCount += 1;
        }
        else
            contadorNo++;
        if (disponibilidad) {
            contadorSi++;
            DsiponibilidadCount += 1;
        }
        else
            contadorNo++;
        if (fiabilidad) {
            contadorSi++;
            FiabilidadCount += 1;
        }
        else
            contadorNo++;
        if (ComputacionNube) {
            contadorSi++;
            ComputacionNubeCount += 1;
        }
        else
            contadorNo++;
        if (modularidad) {
            contadorSi++;
            ModularidadCount += 1;
        }
        else
            contadorNo++;
        if (mantenibilidad) {
            contadorSi++;
            MantenibilidadCount += 1;
        }
        else
            contadorNo++;
        if (reusabilidad) {
            contadorSi++;
            ReusabilidadCount += 1;
        }
        else
            contadorNo++;
        if (flexibilidad) {
            contadorSi++;
            FlexibilidadCount += 1;
        }
        else
            contadorNo++;
        if (interOperabilidad) {
            contadorSi++;
            InterOperabilidadCount += 1;
        }
        else
            contadorNo++;
        if (CohesionAcoplamiento) {
            contadorSi++;
            ChoesionAcoplamientoCount += 1;
        }
        else
            contadorNo++;
        if (portabilidad) {
            contadorSi++;
            PortabilidadCount += 1;
        }
        else
            contadorNo++;
        if (integracionContinua) {
            contadorSi++;
            IntegracionContinuaCount += 1;
        }
        else
            contadorNo++;
        //con esto al final saco el promedio y veo el porcentaje de recomendacion
        var porcentajeSI = contadorSi * 100 / 14;
        var ResultadoRecomendacion = '';
        if (porcentajeSI > 50) {
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
            '<p class="mb-0">El proyecto <b>' + nombreProyecto + '</b> fue analizado en base a sus factores técnicos y obtuvo un grado de recomendación del (<b>' + (Math.round(porcentajeSI)) + '/100)%</b>' +
            ' por lo que ' + ResultadoRecomendacion + '<p><br>' +
            '<footer class="blockquote-footer">Esta es una recomendación por parte del modelo de sugerencia de toma de desciciones es opción del usuario acogerse o no a la misma.</footer></blockquote>');
        //tabla de valores
        $("#resumenFactor").empty();
        $('#resumenFactor').append('<table class="table"><thead><tr><th></th>Factor</tr></th>&nbsp;Recomendación</tr></thead>' +
            '<tbody>' +
            '<tr><td>Escalabilidad Dinámica</td><td>' + (EscalabilidadDinamicaCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Manejabilidad</td><td>' + (ManejabilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Utilización de recursos</td><td>' + (UtilizacionRecursosCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Disponibilidad</td><td>' + (DsiponibilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Fiabilidad</td><td>' + (FiabilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Computación en la nube</td><td>' + (ComputacionNubeCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Modularidad</td><td>' + (ModularidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Mantenibilidad</td><td>' + (MantenibilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Reusabilidad </td><td>' + (ReusabilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Flexibilidad</td><td>' + (FlexibilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>InterOperabilidad</td><td>' + (InterOperabilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Cohesión y Acoplamiento</td><td>' + (ChoesionAcoplamientoCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Portabilidad</td><td>' + (PortabilidadCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '<tr><td>Integracion Continua</td><td>' + (IntegracionContinuaCount == 1 ? 'SI' : 'NO') + '</td></tr>' +
            '</tbody>' +
            '</table>');
        //guardamos en la base de datos
        var data = new DataPojo();
        data.cohesionAcoplamiento = valor12;
        data.cohesionAcoplamientoSi = ChoesionAcoplamientoCount == 1 ? true : false;
        data.computacionNube = valor14;
        data.computacionNubeSi = ComputacionNubeCount == 1 ? true : false;
        data.disponibilidad = valor4;
        data.disponibilidadSi = DsiponibilidadCount == 1 ? true : false;
        data.escalabilidadDinamica = valor1;
        data.escalabilidadDinamicaSi = EscalabilidadDinamicaCount == 1 ? true : false;
        data.fiabilidad = valor5;
        data.fiabilidadSi = FiabilidadCount == 1 ? true : false;
        data.flexibilidad = valor10;
        data.flexibilidadSi = FlexibilidadCount == 1 ? true : false;
        data.integracionContinua = valor6;
        data.integracionContinuaSi = IntegracionContinuaCount == 1 ? true : false;
        data.interOperabilidad = valor11;
        data.interOperabilidadSi = InterOperabilidadCount == 1 ? true : false;
        data.manejabilidad = valor2;
        data.manejabilidadSi = ManejabilidadCount == 1 ? true : false;
        data.mantenibilidad = valor8;
        data.mantenibilidadSi = MantenibilidadCount == 1 ? true : false;
        data.modularidad = valor7;
        data.ModularidadSi = ModularidadCount == 1 ? true : false;
        data.porcentajeRecomendacion = (Math.round(porcentajeSI));
        data.porcentajeRecomendacionSi = (porcentajeSI > 50 ? true : false);
        data.portabilidad = valor13;
        data.portabilidadSi = PortabilidadCount == 1 ? true : false;
        data.recomendacionFinal = ResultadoRecomendacion;
        data.reusabilidad = valor9;
        data.reusabilidadSi = ReusabilidadCount == 1 ? true : false;
        data.utilizacionRecursos = valor3;
        data.utilizacionRecursosSi = UtilizacionRecursosCount == 1 ? true : false;
        data.idProyecto = idUsuario;
        post$Usuario$GuardarDatos(data, function (result) {
        }, function (error) {
        });
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
                    data: [[porcentajeSI.toFixed(2), valorMinimoRecomendado]]
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
        //char de sumatorias
        $("#chart").kendoChart({
            title: {
                text: "Métricas por factor técnico determinante"
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: "bar",
                stack: true
            },
            series: [{
                    name: "Escalabilidad Dinamica",
                    data: [EscalabilidadDinamicaCount],
                    color: "#d1c4e9"
                }, {
                    name: "Manejabilidad",
                    data: [ManejabilidadCount],
                    color: "#b39ddb"
                }, {
                    name: "Utilización de recursos",
                    data: [UtilizacionRecursosCount],
                    color: "#9575cd"
                }, {
                    name: "Disponibilida",
                    data: [DsiponibilidadCount],
                    color: "#7e57c2"
                }, {
                    name: "Fiabilidad",
                    data: [FiabilidadCount],
                    color: "#673ab7"
                }, {
                    name: "Flexibilidad",
                    data: [FlexibilidadCount],
                    color: "#512da8"
                }, {
                    name: "Computación en la Nube",
                    data: [ComputacionNubeCount],
                    color: "#4527a0"
                }, {
                    name: "Modularidad",
                    data: [ModularidadCount],
                    color: "#311b92"
                }, {
                    name: "Mantenibilidad",
                    data: [MantenibilidadCount],
                    color: "#1a237e"
                }, {
                    name: "Reusabilidad",
                    data: [ReusabilidadCount],
                    color: "#0d47a1"
                }, {
                    name: "Manejabilidad",
                    data: [ManejabilidadCount],
                    color: "#0d47a1"
                }, {
                    name: "Inter Operatibiblidad",
                    data: [InterOperabilidadCount],
                    color: "#0d47a1"
                }, {
                    name: "Cohesión y Acoplamiento",
                    data: [ChoesionAcoplamientoCount],
                    color: "#0d47a1"
                }, {
                    name: "Portabilidad",
                    data: [PortabilidadCount],
                    color: "#0d47a1"
                }
            ],
            valueAxis: {
                max: 14,
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: true
                }
            },
            categoryAxis: {
                categories: ['Factores Determinantes'],
                majorGridLines: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                template: "#= series.name #: #= value #"
            }
        });
        //este es el chart de estrella
        $("#chart2").kendoChart({
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
        //aqui le vamos a poner el chart de barras                
        /*$("#chartBarras").kendoChart({
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
                data: valor1,
                color: "#7400b8"
            }, {
                name: listadoValoresNombres[1],
                data: valor2,
                color: "#6930c3"
            }, {
                name: listadoValoresNombres[2],
                data: valor3,
                color: "#5e60ce"
            }, {
                name: listadoValoresNombres[3],
                data: valor4,
                color: "#5390d9"
            }, {
                name: listadoValoresNombres[4],
                data: valor5,
                color: "#4ea8de"
            }, {
                name: listadoValoresNombres[5],
                data: valor6,
                color: "#48bfe3"
            }, {
                name: listadoValoresNombres[6],
                data: valor7,
                color: "#56cfe1"
            }, {
                name: listadoValoresNombres[7],
                data: valor8,
                color: "#64dfdf"
            }, {
                name: listadoValoresNombres[8],
                data: valor9,
                color: "#72efdd"
            }, {
                name: listadoValoresNombres[9],
                data: valor10,
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
                categories: ["Proyecto","Recomenación Mínima"],
               majorGridLines: {
                    visible: false
                }
           },
            tooltip: {
                visible: true,
                template: "#= series.name #: #= value #"
            }
        });  */
    });
    //mostrar vendtad con formulario de modulos
    $('#btn_AgregarElemento').click(function () {
        $('#inNombre').val('');
        $('#inPeso').val(0);
        $("#ventanaAgregarModulos").kendoWindow({
            width: "750px",
            height: "600px",
            title: "Modulos",
            modal: true
        }).data("kendoWindow").center().open();
    });
    var idEditar = 0;
    //agregar elementos a la tabla
    $('#AgregarModuloLista').click(function () {
        //agregamos al listado 
        if ($("#inCBN").val() == undefined || $("#inCBN").val() == null || $("#inCBN").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inCBCOM").val() == undefined || $("#inCBCOM").val() == null || $("inCBCOM").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inAC").val() == undefined || $("#inAC").val() == null || $("#inAC").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inEC").val() == undefined || $("#inEC").val() == null || $("#inEC").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inNUCPCOM").val() == undefined || $("#inNUCPCOM").val() == null || $("#inNUCPCOM").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inNumCycles").val() == undefined || $("#inNumCycles").val() == null || $("#inNumCycles").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inInDepned").val() == undefined || $("#inInDepned").val() == null || $("#inInDepned").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inNCOMPUC").val() == undefined || $("#inNCOMPUC").val() == null || $("#inNCOMPUC").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        if ($("#inNCPCOM").val() == undefined || $("#inNCPCOM").val() == null || $("#inNCPCOM").val() == '') {
            return alert('debe llenar el campo CBN');
        }
        //validaciones de valores 
        if ($("#inCBN").val() > numeroTotalModulos)
            return alert('CBN no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inCBCOM").val() > numeroTotalModulos)
            return alert('CBCOM no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inAC").val() > numeroTotalModulos)
            return alert('AC no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inEC").val() > numeroTotalModulos)
            return alert('EC no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inNUCPCOM").val() > numeroTotalModulos)
            return alert('NUCPCOM no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inNumCycles").val() > numeroTotalModulos)
            return alert('NumCycles no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inInDepned").val() > numeroTotalModulos)
            return alert('InDepned no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inNCOMPUC").val() > numeroTotalModulos)
            return alert('NCOMPUC no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        if ($("#inNCPCOM").val() > numeroTotalModulos)
            return alert('NCPCOM no puede tener un valor mayor al total de modulos  ' + numeroTotalModulos);
        //agrego los detalles al objeto especifivo por id
        for (var _i = 0, modulosIndividuales_4 = modulosIndividuales; _i < modulosIndividuales_4.length; _i++) {
            var modulo = modulosIndividuales_4[_i];
            if (modulo.id == idEditar) {
                //agrego los detalles al modulo
                //por cada facroe de modulo  aplicamos la formula
                //val= valorIngresado-valorMinimo/ valorMaximo-valorIngresado;
                var CBNCalculo = (Number($("#inCBN").val()) - 0) / (numeroTotalModulos - 0);
                var CBCOMCalculo = (Number($("#inCBCOM").val()) - 0) / (numeroTotalModulos - 0);
                var ACCalculo = (Number($("#inAC").val()) - 0) / (numeroTotalModulos - 0);
                var ECCalculo = (Number($("#inEC").val()) - 0) / (numeroTotalModulos - 0);
                var NUCPCOMCalculo = (Number($("#inNUCPCOM").val()) - 0) / (numeroTotalModulos - 0);
                var NumCyclesCalculo = (Number($("#inNumCycles").val()) - 0) / (numeroTotalModulos - 0);
                var InDepnedCalculo = (Number($("#inInDepned").val()) - 0) / (numeroTotalModulos - 0);
                var NCOMPUCCalculo = (Number($("#inNCOMPUC").val()) - 0) / (numeroTotalModulos - 0);
                var NCPCOMCalculo = (Number($("#inNCPCOM").val()) - 0) / (numeroTotalModulos - 0);
                // ahora calculamos el valor de la modularidad en base a la formula
                //modularidad= NUCPCOM * 0.1 + ( 1 - CBCOM )*0.1 + (1-AC)*0.1 + (1-EC)*0.15 + (1- NumCycles)*0.3 + (1-InDepned)*0.25 + (1-NCPCOM)*0.25;
                var modularidadCompleta = (NUCPCOMCalculo * 0.1) + ((1 - CBCOMCalculo) * 0.1) + ((1 - ACCalculo) * 0.1) + ((1 - ECCalculo) * 0.15) + ((1 - NumCyclesCalculo) * 0.3) + ((1 - InDepnedCalculo) * 0.25) + ((1 - NCPCOMCalculo) * 0.25);
                modulo.cbn = CBNCalculo;
                modulo.cbcom = CBCOMCalculo;
                modulo.ac = ACCalculo;
                modulo.ec = ECCalculo;
                modulo.nucpcom = NUCPCOMCalculo;
                modulo.numcycles = NumCyclesCalculo;
                modulo.indepnedd = InDepnedCalculo;
                modulo.ncompuc = NCOMPUCCalculo;
                modulo.ncpcom = NCPCOMCalculo;
                modulo.modularidad = modularidadCompleta;
            }
        }
        $("#ventanaAgregarModulos").data("kendoWindow").close();
    });
    $('#CancelarModulo').click(function () {
        $("#ventanaAgregarModulos").data("kendoWindow").close();
        $("#inCBN").val(0);
        $("#inCBCOM").val(0);
        $("#inAC").val(0);
        $("#inEC").val(0);
        $("#inNUCPCOM").val(0);
        $("#inNumCycles").val(0);
        $("#inInDepned").val(0);
        $("#inNCOMPUC").val(0);
        $("#inNCPCOM").val(0);
        $("#inPeso").val(0);
    });
    //exportar chart principal    
    $("#descargaPrincipal").click(function () {
        $("#chart-mmHg").getKendoChart().saveAsPDF();
    });
    //exportar chart segundo    
    $("#descargaSegunda").click(function () {
        $("#chart2").getKendoChart().saveAsPDF();
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
    function llamarVentanaHerramientas() {
        $("#ventanaOpcionesHerramientas").kendoWindow({
            width: "500px",
            height: "400px",
            title: "Herramientas Sugeridas",
            modal: true
        }).data("kendoWindow").center().open();
    }
    llamarVentanaHerramientasGeneral = llamarVentanaHerramientas;
    function eliminarColumna(id) {
        $('#c_' + id + '').remove();
        modulosIndividuales = modulosIndividuales.filter(function (item) {
            return item.id !== id;
        });
    }
    eliminar = eliminarColumna;
    function editarModulo(id) {
        idEditar = id;
        $("#ventanaAgregarModulos").kendoWindow({
            width: "500px",
            height: "600px",
            title: "Detalle de Modulos",
            modal: true
        }).data("kendoWindow").center().open();
    }
    editar = editarModulo;
    function llamarVentanaOpcionesMenu() {
        $("#ventanaOpcionesMenu").kendoWindow({
            width: "400px",
            height: "80px",
            title: "Información",
            modal: true
        }).data("kendoWindow").center().open();
    }
    llamarVentanaOpcionesMenuGeneral = llamarVentanaOpcionesMenu;
    function llamarVentanaContactos() {
        $("#ventanaContactos").kendoWindow({
            width: "400px",
            height: "200px",
            title: "Contactos",
            modal: true
        }).data("kendoWindow").center().open();
    }
    llamarVentanaContactosGeneral = llamarVentanaContactos;
    Loading_Hide();
});
