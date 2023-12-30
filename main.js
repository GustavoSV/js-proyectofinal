class Cursada {
    constructor(codigoCursada, nombreCursada, contenido, imagen, duracionMeses, valorCursada, colorTexto) {
        this.codigoCursada = codigoCursada;
        this.nombreCursada = nombreCursada;
        this.contenido = contenido;
        this.imagen = imagen;
        this.duracionMeses = duracionMeses;
        this.valorCursada = valorCursada;
        this.colorTexto = colorTexto;
    }

    aumentarPrecio(porcentajeAumento) {
        this.valorCursada *= (1 + porcentajeAumento);
    }
}

const cursada1 = new Cursada("HST", "Historia Post Moderna", "La posmodernidad es un movimiento cultural y filosófico que influenció las artes y el pensamiento crítico a partir de 1960 hasta la actualidad", "./img/Historia.jpg", 6, 13500, "textoBlanco");
const cursada2 = new Cursada("MTM", "Matemática avanzada", "Las matemáticas avanzadas incluyen una amplia gama de temas, como lo son álgebra abstracta, análisis matemático, geometría diferencial, teoría de grupos y teoría de números", "./img/Matematicas.jpg",  10, 18500, "textoNegro");
const cursada3 = new Cursada("ART", "Arte clásico", "Contempla el estilo artístico que floreció en la antigua Grecia y Roma, caracterizado por la búsqueda de la armonía, la proporción y la perfección estética", "./img/Arte.jpg",  9, 15000, "textoBlanco");
const cursada4 = new Cursada("FIL", "Filosofía", "Es el estudio de problemáticas diversas como son el conocimiento, la mente, la consciencia, la ética, el lenguaje, la belleza y la moral", "./img/Filosofia.jpg",  10, 18500, "textoBlanco");
const cursada5 = new Cursada("GEO", "Geografía Continental", "Estudio de nuestro planeta a partir de los continentes incluyendo su demografía, cultura, situación política y las relaciones entre ellos", "./img/Geografia.jpg",  12, 20000, "textoBlanco");
const cursada6 = new Cursada("CIE", "Ciencias Laboratorio", "Estos estudios te capacitan para hacer análisis de muestras biológicas y te ofrecen una panorámica sobre técnicas generales aplicadas a biología, fisiopatología, análisis bioquímico y hematológico, microbiología, etc", "./img/Ciencias.jpg",  8, 16000, "textoVerde");
const cursadas = [cursada1, cursada2, cursada3, cursada4, cursada5, cursada6];

const cursadasOrden = [cursada1, cursada2, cursada3, cursada4, cursada5, cursada6];
cursadasOrden.sort((curso1, curso2) => {
    const nombre1 = curso1.nombreCursada.toLocaleLowerCase();
    const nombre2 = curso2.nombreCursada.toLocaleLowerCase();
    if (nombre1 < nombre2) {
        return -1
    } else if (nombre1 > nombre2) {
        return 1
    } else {
        return 0
    }
});
localStorage.setItem("cursadasLS", JSON.stringify(cursadasOrden));

let usuarioActual = {
    "idUsuario": 0,
    "nombreUsuario": "",
    "tipoUsuario": "" // AL=alumno PR=profesor
}

let alumnos;
let alumnosLS = localStorage.getItem("alumnosLS");
if (alumnosLS) {
    alumnos = JSON.parse(alumnosLS);
} else {
    alumnos = 
    [
        {
            "idAlumno": 1,
            "nombreAlumno": "Juan",
            "sexo": "M",
            "edad": 20,
            "contraseña": "123"
        },
        {
            "idAlumno": 2,
            "nombreAlumno": "Maria",
            "sexo": "F",
            "edad": 23,
            "contraseña": "123"
        },
        {
            "idAlumno": 3,
            "nombreAlumno": "Gustavo",
            "sexo": "M",
            "edad": 27,
            "contraseña": "123"
        }
    ];
    localStorage.setItem("alumnosLS", JSON.stringify(alumnos));
}

let profesores;
let profesoresLS = localStorage.getItem("profesoresLS");
if (profesoresLS) {
    profesores = JSON.parse(profesoresLS);
} else {
    profesores = 
    [
        {
            "idProfesor": 1,
            "nombreProfesor": "Carlos",
            "contraseña": "123"
        }
    ];
    localStorage.setItem("profesoresLS", JSON.stringify(profesores));
}

let notasxAlumno;
let notasxAlumnoLS = localStorage.getItem("notasxAlumnoLS");
if (notasxAlumnoLS) {
    notasxAlumno = JSON.parse(notasxAlumnoLS);
} else {
    notasxAlumno = 
    [
        {
            "codigoCursada": "HST",
            "idAlumno": 1,
            "nota1": 10,
            "nota2": 9,
            "nota3": 8,
            "fechaIngreso": "20/08/2023",
            "vrPagado": 12000,
            "moneda": "PESOS" // PESOS-DOLAR
        }
    ];
    localStorage.setItem("notasxAlumnoLS", JSON.stringify(notasxAlumno));
}

let cursosCarrito;
let cursosCarritoSS = sessionStorage.getItem("cursosCarritoSS");
if (cursosCarritoSS) {
    cursosCarrito = JSON.parse(cursosCarritoSS);
} else {
    cursosCarrito = [];
    sessionStorage.setItem("cursosCarritoSS", JSON.stringify(cursosCarrito));
}

const labelUsuarioLogin = document.getElementById("usuarioLogin");

let usuarioActualSS = sessionStorage.getItem("usuarioActualSS");
if (usuarioActualSS) {
    usuarioActual = JSON.parse(usuarioActualSS);
    labelUsuarioLogin.innerText = usuarioActual.nombreUsuario;
} else {
    labelUsuarioLogin.innerText = "";
}

let contenidoCarrusel = document.getElementById("contenidoCarrusel");
let i = 0;
for (const curso of cursadasOrden) {
    let fila = document.createElement("div");
    if (i == 0) {
        fila.innerHTML = 
        `<div class="carousel-item active" data-bs-interval="2000">
            <img src="${curso.imagen}" class="d-block w-100" alt="${curso.contenido}">
            <div class="carousel-caption d-none d-md-block">
                <h3 class="${curso.colorTexto}">${curso.nombreCursada}</h3>
                <p class="${curso.colorTexto}">${curso.contenido}</p>
            </div>
        </div>`;
        i ++;
    } else {
        fila.innerHTML = 
        `<div class="carousel-item" data-bs-interval="5000">
            <img src="${curso.imagen}" class="d-block w-100" alt="${curso.contenido}">
            <div class="carousel-caption d-none d-md-block">
                <h3 class="${curso.colorTexto}">${curso.nombreCursada}</h3>
                <p class="${curso.colorTexto}">${curso.contenido}</p>
            </div>
        </div>`;
    }
    contenidoCarrusel.appendChild(fila);
}
