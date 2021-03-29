/// <reference path="Init.ts" /> 
/// <reference path="Clases.ts" /> 

 //1)Metodo get/post
 //2)$Nombre del servicio
 //3)$Nombre del metodo dentro del servicio
 //Parametros dentro del servicio
 //4)Dentro del metodo la direccion del servicio
 //5)Parametros Post en caso de no haberlos null
 //ejem:JSON.stringify(empresas)
 //6)Parametros Get  en caso de no haverlos null 
 //ejm:{ "empresaNumero": empresaNumero.join(","), "sucursalEmpresa": sucursalEmpresa.join(",")}
 //7)args arguments, callDone, callFail por defectp
 //function get$contrato$ObtenerMovimientosBeneficiariosEmpresas(empresaNumero: string[], sucursalEmpresa: string[], codigoProducto: string[], fechaDesde: Date, fechaHasta: Date, codigoTransaccion: string[], callDone, callFail) {
     //Callback(serviceMain, null, { "empresaNumero": empresaNumero.join(","), "sucursalEmpresa": sucursalEmpresa.join(","), "codigoProducto": codigoProducto.join(","), "fechaDesde": getFormattedDateymd(fechaDesde), "fechaHasta": getFormattedDateymd(fechaHasta), "codigoTransaccion": codigoTransaccion.join(",") }, arguments, callDone, callFail);
 //}

/* SERVICIOS */
function post$Login$ValidateUser(user: Login, callDone, callFail) {
    Callback(serviceMain, JSON.stringify(user), null, arguments, callDone, callFail);
}
 
function post$Usuario$CrearUsuarioProyecto(user: UsuarioPojo, callDone, callFail) {
    Callback(serviceMain, JSON.stringify(user), null, arguments, callDone, callFail);
}
 
function get$Preguntas$BuscarPreguntas(callDone, callFail) {
    Callback(serviceMain, null, null, arguments, callDone, callFail);
}

function post$RegistroDatos$RegistrarPregunta(calificacion:CalificacionFactorPojo,callDone, callFail) {
    Callback(serviceMain, JSON.stringify(calificacion), null, arguments, callDone, callFail);
}

function get$RegistroDatos$ProcesarArquitectura(idProyecto:number,callDone, callFail) {
    Callback(serviceMain, null, { "idProyecto": idProyecto}, arguments, callDone, callFail);
}

function get$RegistroDatos$leerCalificacionArquitectura(idProyecto:number,callDone, callFail) {
    Callback(serviceMain, null, { "idProyecto": idProyecto}, arguments, callDone, callFail);
}

function post$Usuario$GuardarDatos(data: DataPojo, callDone, callFail) {
    Callback(serviceMain, JSON.stringify(data), null, arguments, callDone, callFail);
}
