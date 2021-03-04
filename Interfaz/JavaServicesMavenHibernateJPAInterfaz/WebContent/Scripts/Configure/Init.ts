/// <reference path="../Configure/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../Configure/typings/jquery/jquery.d.ts" />
/// <reference path="../Configure/typings/headjs/headjs.d.ts" />
/// <reference path="../Configure/typings/filesaver/filesaver.d.ts" />
/// <reference path="../Configure/typings/cryptojs/cryptojs.d.ts" />
/// <reference path="../Configure/Proxy.ts" />
/// <reference path="../Configure/Utilities.ts" />


var idleTime = 0;
var llamarVentanaInformacionGeneral;
var llamarVentanaEquipoGeneral;
// primero cargo Jquery
head.load(
        "../Config.js",
        "../Scripts/Configure/Utilities.js",
        "../Scripts/Configure/Proxy.js",
        "../Scripts/Configure/Clases.js",
        function () {
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/') + 1);   
        
    // Luego cargo Kendo UI y el Estilo principal del sitio
    head.load("../libs/bootstrap/css/bootstrap.min.css",
        "../libs/bootstrap/js/bootstrap.bundle.min.js",
            "../libs/kendo-ui/js/jquery.min.js", 
            "../libs/kendo-ui/js/kendo.all.min.js",
            "../libs/kendo-ui/styles/kendo.default-v2.min.css",
            "../libs/kendo-ui/styles/kendo.default-v2.min.css", 
        function () {
            $('#loading-container2').show();
            // Luego cargo los archivos de js y css específicos de la pantalla
            head.load('../Scripts/' + filename.replace('.html', '.js'),
                '../Styles/' + filename.replace('.html', '.css'),
                function () {
                    //inicializar la cultura
                        Loading_Hide2();                    
                });
        });
    
});

//llamada a servicio

function Callback(Address: string, argsPOST, argsGET, argsup, callDone, callFail) {
    Loading_Show();   
    var partsOfFunctionName = argsup.callee.name.split('$');
    var argumentsArray = [].slice.apply(argsup);
    argumentsArray.pop(); // retiro
    // hago la llamada al servicio y obtengo el encriptado de retorno
    $.ajax({
        url: Address +''+partsOfFunctionName[1]+'/'+ partsOfFunctionName[2] + (argsGET != null ? "?" + $.param(argsGET) : ""),
        type: partsOfFunctionName[0].toString().toUpperCase(), // 'POST',
        dataType: 'text',
        data: argsPOST,
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
        crossDomain: false,
        cache: false,
        timeout: 1200000, // 60 segundos
        headers: {
            'CodigoAplicacion': '3',
            'DispositivoNavegador': 'Chrome',
            'DireccionIP': '1.1.1.1',
            'SistemaOperativo': 'Windows',
            'Token': '123',
            'CodigoPlataforma': '7'
        },
    }).done(function (PostReturn) {
        if (!PostReturn) {
            throw ('No se ha recibido respuesta del servidor.');
        }
        var result = <Msg>JSON.parse(PostReturn);
        // Si hay un error en el servidor
        if (result == null && result == undefined) {
            alert('No se obtuvo respuesta del servicio');
            Loading_Hide();
            //throw ('Ha ocurrido un error en el procesamiento de su pedido. Por favor tome contacto con el administrador del sistema. Mensaje: ' + res.errorMessage);
        }
        // devuelvo el objeto de respuesta
        else if (typeof callDone === "function") {
            // if (res.Results.length == 1) {
            //     callback(res.Results[0].ReturnObject);
            // }
            callDone(result);
            Loading_Hide();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.readyState == 4) {
            // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
            if (jqXHR.statusText == "timeout") {
                alert('Tiempo de espera de respuesta de servicio agotado.');
            }
            else if (jqXHR.responseText != undefined) {
                try {
                    var result = <Msg>JSON.parse(jqXHR.responseText);

                    // Si hay un error en el servidor
                    if (result != null && result.message != undefined && result.message.length > 0 && result.message[0] != null) {
                        alert(result.message.join());
                        //throw ('Ha ocurrido un error en el procesamiento de su pedido. Por favor tome contacto con el administrador del sistema. Mensaje: ' + res.errorMessage);
                    }
                }
                catch (ex) {
                    alert(jqXHR.responseText);
                }
            }
            else {
                alert('No se ha recibido respuesta del servidor, #: ' + jqXHR.status);
            }
        }
        else if (jqXHR.readyState == 0) {
            // Network error (i.e. connection refused, access denied due to CORS, etc.)
            alert('Ha ocurrido un error de conexión con el servidor. Por favor intente más tarde.');
        }
        else {
            // something weird is happening
        }

        if (typeof callFail === "function") {
            // if (res.Results.length == 1) {
            //     callback(res.Results[0].ReturnObject);
            // }
            callFail(result);
        }
        Loading_Hide();
    }).always(function () {
        Loading_Hide();
    });
    
}

//llamada para descargar archivos 
function Callback2(Address: string, argsPOST, argsGET, argsup, callDone, callFail) {
    Loading_Show();    
    var partsOfFunctionName = argsup.callee.name.split('$');
    var argumentsArray = [].slice.apply(argsup);
    argumentsArray.pop(); // retiro
    //setup ajax
    $.ajaxSetup({
        beforeSend: function (jqXHR, settings) {
            if (settings.dataType === 'binary') {
                settings.xhr().responseType = 'arraybuffer';
                settings.processData = false;
            }
        }
    })

    // hago la llamada al servicio y obtengo el encriptado de retorno
    $.ajax({
        url: Address + partsOfFunctionName[2] + (argsGET != null ? "?" + $.param(argsGET) : ""),
        type: partsOfFunctionName[0].toString().toUpperCase(), // 'POST',
        dataType: 'binary',
        processData: false,
        data: argsPOST,
        contentType: 'application/json; charset=UTF-8',
        mimeType: 'application/json',
        crossDomain: false,
        cache: false,
        timeout: 600000, // 60 segundos
        headers: {
            'CodigoAplicacion': '3',
            'DispositivoNavegador': 'Chrome',
            'DireccionIP': '1.1.1.1',
            'SistemaOperativo': 'Windows',
            'CodigoPlataforma': '7',
            'X-Page-Number': '1',
            'X-Page-Size': '0'
        },
    }).done(function (PostReturn) {
        if (!PostReturn) {
            throw ('No se ha recibido respuesta del servidor.');
        }

        var result = PostReturn;
        callDone(result);
        Loading_Hide();

    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.readyState == 4) {
            // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)

            if (jqXHR.statusText == "timeout") {
                alert('Tiempo de espera de respuesta de servicio agotado.');
            }
            else if (jqXHR.responseText != undefined) {
                try {
                    //var result = <Msg>JSON.parse(jqXHR.responseText);
                    var result = jqXHR.responseText;
                    // Si hay un error en el servidor
                    if (result == undefined || result == null) {
                        alert(result);
                        //throw ('Ha ocurrido un error en el procesamiento de su pedido. Por favor tome contacto con el administrador del sistema. Mensaje: ' + res.errorMessage);
                    } else {
                        return result;
                    }
                }
                catch (ex) {
                    alert(jqXHR.responseText);
                }
            }
            else {
                alert('No se ha recibido respuesta del servidor, #: ' + jqXHR.status);
            }
        }
        else if (jqXHR.readyState == 0) {
            // Network error (i.e. connection refused, access denied due to CORS, etc.)
            alert('Ha ocurrido un error de conexión con el servidor. Por favor intente más tarde.');
        }
        else {
            // something weird is happening
        }

        if (typeof callFail === "function") {
            // if (res.Results.length == 1) {
            //     callback(res.Results[0].ReturnObject);
            // }
            callFail(result);
        }
        Loading_Hide();
    }).always(function () {
        Loading_Hide();
    });   
}

function CerrarSesion() {
    sessionStorage.setItem("logged", "0");
    sessionStorage.setItem("user", "");
    window.location.assign('Login.html');
}

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > SessionTimeOut - 1) {
        // Cierra sesión
        CerrarSesion();
    }
}

function UsuarioSesion(): UsuarioEntity {
    if (sessionStorage.getItem("user") == null || sessionStorage.getItem("user") == undefined || sessionStorage.getItem("user") == "") {
        //document.location.assign('Login.html'); // Si no está logueado, cambia la página al login //Comentado mientras se espera integracion.... para pruebas.
        return null;
    }
    return <UsuarioEntity>JSON.parse(Decrypt(sessionStorage.getItem("user").toString()));
}

//https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name: string, url?: string) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}