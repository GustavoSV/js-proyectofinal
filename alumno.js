let alumnos;
let alumnosLS = localStorage.getItem("alumnosLS");
if (alumnosLS) {
    alumnos = JSON.parse(alumnosLS);
} else {
    alumnos = [];
}

let notasxAlumno;
let notasxAlumnoLS = localStorage.getItem("notasxAlumnoLS");
if (notasxAlumnoLS) {
    notasxAlumno = JSON.parse(notasxAlumnoLS);
} else {
    notasxAlumno = [];
}

let alumnoLogueado = false;
let usuarioActual;
const seccionNoHayIngreso = document.getElementById("noHayIngreso");
const seccionesAlumnoLogueado = document.getElementsByClassName("alumnoLogueado");

const tablaCursosAlumno = 
    `<thead>
        <tr>
            <th scope="col">Cursada</th>
            <th scope="col">Fecha Ingreso</th>
            <th scope="col">Vr pagado</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody id="tablaCursosAlumno">
    </tbody>`;

let usuarioActualSS = sessionStorage.getItem("usuarioActualSS");
if (usuarioActualSS) {
    usuarioActual = JSON.parse(usuarioActualSS);
    if (usuarioActual.tipoUsuario == "AL") {    
        seccionNoHayIngreso.classList.add("d-none");
        for (const seccion of seccionesAlumnoLogueado) {
            seccion.classList.remove("d-none");
        }
        alumnoLogueado = true;
    } else {
        seccionNoHayIngreso.classList.remove("d-none");
        for (const seccion of seccionesAlumnoLogueado) {
            seccion.classList.add("d-none");
        }
    }
} else {
    usuarioActual = {};
    seccionNoHayIngreso.classList.remove("d-none");
    for (const seccion of seccionesAlumnoLogueado) {
        seccion.classList.add("d-none");
    }
}

// se carga la información SOLO cuando tenemos un ALUMNO logueado
if (alumnoLogueado == true) {
    let tituloAlumnoLogueado = document.getElementById("tituloAlumnoLogueado");
    tituloAlumnoLogueado.innerText = "Información del Alumno " + usuarioActual.nombreUsuario;

    // cargamos la tabla de notas del alumno en los diferentes cursos que está inscrito
    const cursosAlumno =  notasxAlumno.find((curso) => curso.idAlumno = usuarioActual.idUsuario);
    if (cursosAlumno.length == 0) {
        const h3Label = document.createElement("h3");
        h3Label.innerText = `El Alumno ${usuarioActual.nombreUsuario} NO está inscrito en ninguna cursada`;
        let tablaAlumnoLogueado = document.getElementById("tablaAlumnoLogueado");
        tablaAlumnoLogueado.appendChild(h3Label);
    } else {
        
    }
}

"codigoCursada": "HST",
        "idAlumno": 1,
        "fechaIngreso": "20/08/2023",
        "nota1": 10,
        "nota2": 9,
        "nota3": 8

        "idUsuario": id,
        "nombreUsuario": nombre,
        "tipoUsuario": tipo