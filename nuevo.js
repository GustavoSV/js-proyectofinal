function numeroEnteroValido(texto, tope) {
    let numero = 0;
    numero = parseInt(texto);
    if (isNaN(numero)) {
        return -1;
    } if (numero < 1 || numero > tope) {
        return  -1;
    }
    return numero;
}
let i = -1;
let alumnos;
let alumnosLS = localStorage.getItem("alumnosLS");
if (alumnosLS) {
    alumnos = JSON.parse(alumnosLS);
} else {
    alumnos = [];
}

let profesores;
let profesoresLS = localStorage.getItem("profesoresLS");
if (profesoresLS) {
    profesores = JSON.parse(profesoresLS);
} else {
    profesores = [];
}

const urlParametros = new URLSearchParams(window.location.search);
let tipoUsuario = urlParametros.get("tipo");
let usuarioTipo = "";
if (tipoUsuario === "alumno") {
    usuarioTipo = "AL";
} else if (tipoUsuario === "profesor") {
    usuarioTipo = "PR";
}  

const tituloPagina = document.getElementById("titulo");
tituloPagina.innerText = `Nuevos usuarios tipo ${tipoUsuario.toUpperCase()} del sistema MyLS` 

const usuarioNombre = document.getElementById("usuarioNombre");
const usuarioSexo = document.getElementById("usuarioSexo");
const usuarioEdad = document.getElementById("usuarioEdad");
const usuarioClave = document.getElementById("usuarioClave");
const usuarioClaveRepite = document.getElementById("usuarioClaveRepite");
const hintUsuario = document.getElementById("usuarioHint");
const botonGrabarUsuario = document.getElementById("botonGrabarUsuario");
const usuarioEdadNro = 0;

// Validaciones
function yaExisteUsuario() {
    i = -1;
    if (usuarioTipo == "AL") {
        i = alumnos.findIndex((alumno) => alumno.nombreAlumno == usuarioNombre.value);
        if (i > -1) {
            return true;
        } else {
            return false;
        }
    } else if (usuarioTipo == "PR") {
        i = profesores.findIndex((profe) => profe.nombreProfesor == usuarioNombre.value);
        if (i > -1) {
            return true;
        } else {
            return false;
        }
    }
}

function validacionDatos() {
    hintUsuario.innerText = "";
    // const existeUsuario = yaExisteUsuario();
    if (usuarioNombre.value == "") {
        hintUsuario.innerText = "DEBE inidicar el Nombre del usuario";
    } else if (yaExisteUsuario() == true) {
        hintUsuario.innerText = "YA EXISTE un usuario " + tipoUsuario + " con el nombre " + usuarioNombre.value;
    } else if (usuarioSexo.value != "F" && usuarioSexo.value != "M") {
        hintUsuario.innerText = "DEBE seleccionar el sexo del usuario";
    } else if (numeroEnteroValido(usuarioEdad.value, 100) == -1) {
        hintUsuario.innerText = "La edad DEBE ser un número entero válido mayor que cero y menor que 100";
    } else if (usuarioClave.value == "") {
        hintUsuario.innerText = "DEBE indicar una Contraseña";
    } else if (usuarioClave.value != usuarioClaveRepite.value) {
        hintUsuario.innerText = "NO coinciden los valores de la Contraseña";
    }

    if (hintUsuario.innerText == "") {
        return true
    } else {
        return false
    }
}

function registrarUsuario(id, nombre, tipo) {
    let tipoUsuario;
    const nuevousuario = {
        "idUsuario": id,
        "nombreUsuario": nombre,
        "tipoUsuario": tipo
    }
    if (tipo === "AL") {
        tipoUsuario = "ALUMNO"
    } else if (tipo === "PR") {
        tipoUsuario = "PROFESOR"
    } else {
        tipoUsuario = "ERROR"
    }
    sessionStorage.setItem("usuarioActualSS", JSON.stringify(nuevousuario));
    Swal.fire({
        title: "Bienvenido!",
        text: "Hola " + nombre + " te has registrado como un usuario tipo " + tipoUsuario,
        icon: "success"
    });
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

botonGrabarUsuario.onclick = () => {
    if (validacionDatos() == true) {
        if (usuarioTipo == "AL") {
            const usuarioNuevo = {
                "idAlumno": alumnos.length + 1,
                "nombreAlumno": usuarioNombre.value,
                "sexo": usuarioSexo.value,
                "edad": parseInt(usuarioEdad.value),
                "contraseña": usuarioClave.value
            }
            alumnos.push(usuarioNuevo);
            localStorage.setItem("alumnosLS", JSON.stringify(alumnos));
            registrarUsuario(usuarioNuevo.idAlumno, usuarioNuevo.nombreAlumno, "AL");
        } else if (usuarioTipo == "PR") {
            const usuarioNuevo = {
                "idProfesor": profesores.length + 1,
                "nombreProfesor": usuarioNombre.value,
                "contraseña": usuarioClave.value
            }
            profesores.push(usuarioNuevo);
            localStorage.setItem("profesoresLS", JSON.stringify(profesores));
            registrarUsuario(usuarioNuevo.idProfesor, usuarioNuevo.nombreProfesor, "PR");
        }
    }
}