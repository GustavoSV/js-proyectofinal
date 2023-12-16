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
        text: "Hola " + nombre + " has ingresado como un usuario tipo " + tipoUsuario,
        icon: "success"
    });
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

let botonAgregarUsuario = document.getElementById("botonAgregarUsuario");
let usuarioNombre = document.getElementById("usuarioNombre");
let usuarioClave = document.getElementById("usuarioClave");
let usuarioId = 0;

botonAgregarUsuario.onclick = () => {
    const hintUsuario = document.getElementById("usuarioHint");
    let usuario = alumnos.find((item) => item.nombreAlumno == usuarioNombre.value && item.contraseña == usuarioClave.value);
    if (usuario != undefined) {
        hintUsuario.innerText = "";
        registrarUsuario(usuario.idAlumno, usuario.nombreAlumno, "AL");
    } else {
        usuario = profesores.find((item) => item.nombreProfesor == usuarioNombre.value && item.contraseña == usuarioClave.value);
        if (usuario != undefined) {
            hintUsuario.innerText = "";
            registrarUsuario(usuario.idProfesor, usuario.nombreProfesor, "PR");
        } else {
            hintUsuario.innerText = "NO coinciden el nombre de usuario o la contraseña para " + usuarioNombre.value;
        }
    }
}