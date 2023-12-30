const notaMinimaAprobar = 6;
let i = -1;

function tablaAlumnosCursadaHTML(codCurso) {
    const textoHTML =
        `<table class="table table-success table-striped m-2">
            <thead>
                <tr>
                    <th scope="col">Alumno</th>
                    <th scope="col">Nota 1</th>
                    <th scope="col">Nota 2</th>
                    <th scope="col">Nota 3</th>
                    <th scope="col">Aprobado?</th>
                </tr>
            </thead>
            <tbody id="filasTablaCursada${codCurso}">
            </tbody>
        </table>`;
    return textoHTML;
} 

function aproboAlumno(nt1, nt2, nt3) {
    let suma = 0;
    let cuantas = 0;
    let aprobado = "";
    if (nt1>0 && nt2>0 && nt3>0) {
        suma = nt1 + nt2 + nt3;
        cuantas = 3;
    } else if (nt1>0 && nt2>0) {
        suma = nt1 + nt2;
        cuantas = 2;
    } else if (nt1>0) {
        suma = nt1;
        cuantas = 1;
    }
    if (cuantas > 0) {
        suma = suma / cuantas;
        if (suma >= notaMinimaAprobar) {
            if (cuantas == 3) {
                aprobado = "SI"
            } else {
                aprobado = "SI*"
            }
        } else {
            if (cuantas == 3) {
                aprobado = "NO";
            } else {
                aprobado = "NO*"
            }
        }
    } else {
        aprobado = "**"
    }
    return aprobado;
}

let cursadas;
let cursadasLS = localStorage.getItem("cursadasLS");
if (cursadasLS) {
    cursadas = JSON.parse(cursadasLS);
} else {
    cursadas = [];
}

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

const seccionNoHayIngreso = document.getElementById("noHayIngreso");
const seccionesHayIngreso = document.getElementsByClassName("hayIngreso");

let alumnoLogueado = false;
let usuarioActual;
let usuarioActualSS = sessionStorage.getItem("usuarioActualSS");
if (usuarioActualSS) {
    usuarioActual = JSON.parse(usuarioActualSS);
    if (usuarioActual.tipoUsuario == "AL" || usuarioActual.tipoUsuario == "PR") {    
        seccionNoHayIngreso.classList.add("d-none");
        for (const seccion of seccionesHayIngreso) {
            seccion.classList.remove("d-none");
        }
        alumnoLogueado = true;
    } else {
        seccionNoHayIngreso.classList.remove("d-none");
        for (const seccion of seccionesHayIngreso) {
            seccion.classList.add("d-none");
        }
    }
    const capturarNota = document.getElementById("divCapturarNota");
    const botonAgregarNota = document.getElementById("botonAgregarNota");
    if (usuarioActual.tipoUsuario == "PR") {
        botonAgregarNota.classList.remove('d-none');
        capturarNota.classList.remove('d-none');
    } else {
        botonAgregarNota.classList.add('d-none');
        capturarNota.classList.add('d-none');
    }
} else {
    usuarioActual = {};
    seccionNoHayIngreso.classList.remove("d-none");
    for (const seccion of seccionesHayIngreso) {
        seccion.classList.add("d-none");
    }
}

function crearSelectAlumnos(etqHTML) {
    const comboboxAlumnos = document.getElementById("comboboxAlumnos");
    etqHTML =
        `<label for="formGroupExampleInput" class="form-label">Seleccione el Alumno</label>
        <select class="form-select" aria-label="Alumnos ..." id="alumnoNota">
            <option selected>Alumno ...</option>` + etqHTML;

    comboboxAlumnos.innerHTML = etqHTML;
}

function asignarEventoChange() {
    const cursadaNota = document.getElementById("cursadaNota");
    cursadaNota.addEventListener("change", (cursoSeleccionado) => {
        let j = -1;
        let eHTML = "";
        const opcion = cursoSeleccionado.target.value;
        console.log(opcion);
        const alumnosCurso = notasxAlumno.filter((item) => item.codigoCursada == cursoSeleccionado.target.value);
        for (const alumno of alumnosCurso) {
            j = alumnos.findIndex((alu) => alu.idAlumno == alumno.idAlumno);
            if (j > -1) {
                eHTML = eHTML +
                    `<option value="${alumnos[j].idAlumno}">${alumnos[j].nombreAlumno}</option>`;
            }
        }
        crearSelectAlumnos(eHTML);
    })
}

function cargarAcordeonNotas() {
    let acordeonCursadas = document.getElementById("acordeonCursadas");
    acordeonCursadas.innerHTML = "";
    let expandido = "true";
    let colapsado = "";
    let mostrar = "show";
    let k = 1;
    for (const curso of cursadas) {
        if (k > 1) {
            expandido = "false";
            colapsado = "collapsed";
            mostrar = "";
        }
        k ++;
        const acordeonItem = document.createElement("div");
        acordeonItem.classList.add("accordion-item");
        acordeonItem.setAttribute("id", "acordeonItem");
        acordeonCursadas.appendChild(acordeonItem);
        acordeonItem.innerHTML =
            `<h2 class="accordion-header">
                <button class="accordion-button ${colapsado}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${k}" aria-expanded="${expandido}" aria-controls="collapse${k}">
                    ${curso.nombreCursada}
                </button>
            </h2>
            <div id="collapse${k}" class="accordion-collapse collapse ${mostrar}" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    ${tablaAlumnosCursadaHTML(curso.codigoCursada)}
                </div>
            </div>`;
        let nombreAlumno = "";
        const filasTablaCursada = document.getElementById("filasTablaCursada" + curso.codigoCursada);
        let alumnosCursada;
        if (usuarioActual.tipoUsuario == "PR") {
            alumnosCursada = notasxAlumno.filter((item) => item.codigoCursada == curso.codigoCursada);
        } else {
            alumnosCursada = notasxAlumno.filter((item) => item.codigoCursada == curso.codigoCursada && item.idAlumno == usuarioActual.idUsuario);
        }
        for (const alumnoC of alumnosCursada) {
            i = alumnos.findIndex((item) => item.idAlumno == alumnoC.idAlumno);
            if (i > -1) {
                nombreAlumno = alumnos[i].nombreAlumno;
            } else {
                nombreAlumno = "ERROR no se encontró"
            }
            let fila = document.createElement("tr");
            fila.innerHTML =
                `<th scope="row">${nombreAlumno}</th>
                <td>${alumnoC.nota1}</td>
                <td>${alumnoC.nota2}</td>
                <td>${alumnoC.nota3}</td>
                <td>${aproboAlumno(alumnoC.nota1, alumnoC.nota2, alumnoC.nota3)}</td>`;
            filasTablaCursada.appendChild(fila);
        }
    }
}

function llenarMensaje(mensaje, texto) {
    if (mensaje == "") {
        mensaje = texto;
    } else {
        mensaje = mensaje + " / " + texto;
    }
    return mensaje;
}

function numeroDecimalValido(texto) {
    let mensaje = "";
    numero = parseFloat(texto);
    if (isNaN(numero)) {
        mensaje = "* Digite un número válido";
    } else if (numero < 0 || numero > 10) {
        mensaje = "* La nota es un número entre 0 y 10"
    }
    return mensaje;
}

function validarGuardarNota(cursoNota, alumNota, cualNota, vrNota) {
    let mensaje = "";

    if (cursoNota == "Cursada ...") {
        mensaje = llenarMensaje(mensaje, "* DEBE seleccionar la Cursada");
    }
    if (alumNota == "Alumno ...") {
        mensaje = llenarMensaje(mensaje, "* DEBE seleccionar el Alumno");
    }
    if (cualNota == "Nota ...") {
        mensaje = llenarMensaje(mensaje, "* DEBE seleccionar cuál es la Nota a grabar"); 
    }
    mensaje = llenarMensaje(mensaje, numeroDecimalValido(vrNota));

    if (mensaje != "") {
        Swal.fire({
            title: "Corregir",
            text: mensaje,
            icon: "error"
        });
        return false;
    } else {
        return true;
    }
}

cargarAcordeonNotas();

if (usuarioActual.tipoUsuario == "PR") {
    const comboboxCursadas = document.getElementById("comboboxCursadas");
    let etiquetaHTML =
        `<label for="formGroupExampleInput" class="form-label">Seleccione la Cursada</label>
        <select class="form-select" aria-label="Cursadas ..." id="cursadaNota">
        <option selected>Cursada ...</option>`;
    for (const curso of cursadas) {
        etiquetaHTML = etiquetaHTML + 
            `<option value="${curso.codigoCursada}">${curso.nombreCursada}</option>`;
    }
    comboboxCursadas.innerHTML = etiquetaHTML;

    crearSelectAlumnos("");

    asignarEventoChange();
}

const botonGuardarNota = document.getElementById("botonGuardarNota");
botonGuardarNota.onclick = () => { 
    const cursoNota = document.getElementById("cursadaNota").value;
    const alumNota = document.getElementById("alumnoNota").value;
    const cualNota = document.getElementById("cualNota").value;
    const vrNota = parseFloat(document.getElementById("vrNota").value);
    if (validarGuardarNota(cursoNota, alumNota, cualNota, vrNota)) {
        let j = -1;
        j = notasxAlumno.findIndex((alu) => alu.codigoCursada == cursoNota && alu.idAlumno == alumNota);
        if (j > -1) {
            if (cualNota == 1) {
                notasxAlumno[j].nota1 = vrNota;
            } else if (cualNota == 2) {
                notasxAlumno[j].nota2 = vrNota;
            } else if (cualNota == 3) {
                notasxAlumno[j].nota3 = vrNota;
            }
            localStorage.setItem("notasxAlumnoLS", JSON.stringify(notasxAlumno));
            Swal.fire({
                title: "Felicitaciones",
                text: "Se ha grabado correctamente la nota",
                icon: "success"
            });
            cargarAcordeonNotas();
        } else {
            // ERROR no se encontró el alumno en la cursada
        }
    }
}