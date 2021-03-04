class UsuarioEntity {
    public id:number;
    public nombres: string;
    public apellidos: string;
}

class Msg {
    constructor(
        public status: string,
        public data: any,
        public message: string[]
    ) { }
}


class TokenInfo {
    public access_token: string;
    public expires_in: number;
    public refresh_token: string;
    public token_type: string;
    public user_data: string;
    public error: string;
    public error_description: string;
    public token_retrieve: number;
}

class Login {
    public id:number;
    public nombre:string;
    public password: string;
    public esCorrecto: boolean;
    public persona:persona;
}

class persona {
    public nombres:number;
    public apellidos: string;
    public id: string;
}

class UsuarioPojo {
    public id:number;
    public nombre:string;
    public correoElectronico:string;
    public nombreProyecto:string;
}
class Preguntas{
    public id:number;
    public idFactor:number;
    public nombre:string;
    public peso:number;
    public pesoEstadistico:number;
    public pesoMinimo:number;
    public pesoMinimoEstadistico:number;
    public importancia:number;
    public fechaCreacion:Date;
    public Concepto:string;
    public valor5:string;
    public valor4:string;
    public valor3:string;
    public valor2:string;
    public valor1:string;
}
class CalificacionFactorPojo {
    public id:number;
    public idUsuario:number;
    public idPregunta:number;
    public calificacion:number;
    public porcentajeEstadistico:number;
    public fechaCreacion:Date;
    public porcentajeEstadisticoPregunta:number;
    public idFactor:number;
    public nombreFactor:string;
    public porcentajeEstadisticoMinimo:number;    
}

class RespuestaGeneralPojo {
    //devolvemos el listado calificado de factores
    public factor:Array<CalificacionFactorPojo>;
    public idUsuario:number;
    public calificacionEstadistica:number;  
    public Recomendacion:string;
}
