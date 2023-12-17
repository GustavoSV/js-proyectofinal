let i = -1;
let monedaPago = "PESOS";
let monedaCambio = 1;
let cursosEnCarrito = 0;
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

let cursosCarrito;
let cursosCarritoSS = sessionStorage.getItem("cursosCarritoSS");
if (cursosCarritoSS) {
    cursosCarrito = JSON.parse(cursosCarritoSS);
} else {
    cursosCarrito = [];
    sessionStorage.setItem("cursosCarritoSS", JSON.stringify(cursosCarrito));
}

let alumnoLogueado = false;
let usuarioActual;
const seccionNoHayIngreso = document.getElementById("noHayIngreso");
const seccionesAlumnoLogueado = document.getElementsByClassName("alumnoLogueado");

const tablaCursosAlumnoHTML = 
    `<thead>
        <tr>
            <th scope="col">Cursada</th>
            <th scope="col">Fecha Ingreso</th>
            <th scope="col">Vr pagado</th>
            <th scope="col">Moneda</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody id="filasTablaNotasAlumno">
    </tbody>`;

function definirCursadasHTML(nro) {
    const cardsCursadasHTML =
        `<div class="encabezadoComprarCursos">
        <h2>Seleccione las cursadas a las que quieres ingresar</h2>
        <a class="botonCarrito" href="carrito.html" id="nroCursosCarrito"><i class="bi bi-cart3 iconoCarrito"></i>${nro}</a>
        </div>
        <div class="moneda">
        <label class="col-form-label labelMonedaPago">Deseas pagar en</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="pagoPesos" value="PESOS" checked>
            <label class="form-check-label" for="inlineRadio1">Pesos</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="pagoDolar" value="DOLAR">
            <label class="form-check-label" for="inlineRadio2">Dolares</label>
        </div>
        </div>
        <div class="row row-cols-1 row-cols-md-3 g-4" id="cursosDisponiblesAlumno">`;
    return cardsCursadasHTML;
}

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

function cargarBotonEliminar() {
    const botones = document.querySelectorAll(".botonEliminar");
    for (const boton of botones) {
        boton.onclick = (e) => {
            const cursoId = e.currentTarget.id;
            i = notasxAlumno.findIndex((item) => item.codigoCursada == cursoId);
            if (i > -1) {
                notasxAlumno.splice(i, 1);
                eliminarNotasxAlumno(i+1);
                localStorage.setItem("notasxAlumnoLS", JSON.stringify(notasxAlumno));
                console.log(notasxAlumno);
                cargarCursosDisponiblesAlumno();
            }
        }
    }
}

function eliminarNotasxAlumno(index) {
    const tabla = document.getElementById("tablaNotasAlumno");
    tabla.deleteRow(index);
}

function cargarBotonAgregar() {
    const botones = document.querySelectorAll(".buttonAgregarCursada");
    const nroCursosCarrito = document.getElementById("nroCursosCarrito");
    let precio = 0;
    let nroCursos = parseInt(nroCursosCarrito.innerText);
    for (const boton of botones) {
        boton.onclick = (e) => {
            const cursoId = e.currentTarget.id;
            // validamos que no esté en el carrito
            i = cursosCarrito.findIndex((curso) => curso.codigoCursada == cursoId);
            if (i > -1) {
                Swal.fire({
                    title: "Ya existe!",
                    text: `La cursada seleccionada fue adicionada anteriormente al carrito`,
                    icon: "error"
                });
            } else {
                //
                i = cursadas.findIndex((curso) => curso.codigoCursada == cursoId);
                if (i > -1 && monedaCambio > 0) {
                    precio = cursadas[i].valorCursada / monedaCambio;
                }
                const cursoAdicionar = {
                    "codigoCursada": cursoId,
                    "idAlumno": usuarioActual.idUsuario,
                    "vrPagado": precio,
                    "moneda": monedaPago
                }
                cursosCarrito.push(cursoAdicionar);
                sessionStorage.setItem("cursosCarritoSS", JSON.stringify(cursosCarrito));

                nroCursos ++;
                nroCursosCarrito.innerHTML = `<i class="bi bi-cart3 iconoCarrito"></i>${nroCursos}`;

                Swal.fire({
                    title: "Agregada al carrito",
                    text: `Hemos adicionado ${cursadas[i].nombreCursada} al carrito`,
                    icon: "success"
                });
            }
        }
    }
}

function recalcularPrecios(vrCambio, simbolo) {
    const precioCursada = document.getElementsByClassName("precioCursada");
    const codigosCurso = document.getElementsByClassName("buttonAgregarCursada");
    console.log(precioCursada);
    console.log(codigosCurso);
    let k = -1;
    let precio;
    for (const curso of codigosCurso) {
        i = cursadas.findIndex((item) => item.codigoCursada == curso.getAttribute("id"));
        if (i > -1) {
            precio = cursadas[i].valorCursada / vrCambio;
            if (simbolo == "USD") {
                precio = precio.toFixed(2);
            } else {
                precio = precio.toFixed(0);
            }
            
        } else {
            precio = "ERROR";
        }
        k ++
        precioCursada[k].innerHTML = `${simbolo} ${precio}`;
    }
}

function cargarCursosDisponiblesAlumno() {
    const cursosActualesAlumno =  notasxAlumno.filter((curso) => curso.idAlumno == usuarioActual.idUsuario);
    const comprarCursos = document.getElementById("comprarCursos");
    comprarCursos.innerHTML = "";

    const cursosUsuario = cursosCarrito.filter((curso) => curso.idAlumno == usuarioActual.idUsuario);
    cursosEnCarrito = cursosUsuario.length;

    comprarCursos.innerHTML = definirCursadasHTML(cursosEnCarrito);
        
    const cursosDisponiblesAlumno = document.getElementById("cursosDisponiblesAlumno");
    for (const curso of cursadas) {
        i = cursosActualesAlumno.findIndex((cursoD) => cursoD.codigoCursada == curso.codigoCursada);
        if (i < 0) {
            let filaC = document.createElement("div");
            filaC.classList.add("col");
            filaC.innerHTML = 
                `<div class="card h-100">
                    <img src="${curso.imagen}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h4 class="card-title">${curso.nombreCursada}</h4>
                        <p class="card-text">${curso.contenido}</p>
                        <h5 class="precioCursada">$${curso.valorCursada}</h5>
                        <button type="button" class="btn btn-primary buttonAgregarCursada" id="${curso.codigoCursada}">Agregar</button>
                    </div>
                </div>`;
            cursosDisponiblesAlumno.appendChild(filaC);
        } 
    }

    // capturamos la moneda de pago
    const pagoPesos = document.getElementById("pagoPesos");
    const pagoDolar = document.getElementById("pagoDolar");
    pagoPesos.onclick = (() => {
        monedaPago = "PESOS";
        monedaCambio = 1;
        console.log(monedaPago + " - " + monedaCambio);
        recalcularPrecios(monedaCambio, "$");
    });
    pagoDolar.onclick = (() => {
        fetch('https://criptoya.com/api/dolar')
            .then((response) => response.json())
            .then(({blue}) => {
                monedaPago = "DOLAR";
                monedaCambio = blue;
                console.log(monedaPago + " - " + monedaCambio);
                recalcularPrecios(monedaCambio, "USD");
            })
    });

    cargarBotonAgregar();
}

// se carga la información SOLO cuando tenemos un ALUMNO logueado
if (alumnoLogueado == true) {
    let tituloAlumnoLogueado = document.getElementById("tituloAlumnoLogueado");
    tituloAlumnoLogueado.innerText = "Información del Alumno " + usuarioActual.nombreUsuario;

    // limpiamos la tabla de notas del alumno
    const tablaNotasAlumno = document.getElementById("tablaNotasAlumno");
    tablaNotasAlumno.innerHTML = "";
    
    const cursosAlumno =  notasxAlumno.filter((curso) => curso.idAlumno == usuarioActual.idUsuario);
    if (cursosAlumno.length == 0) {
        const h4Label = document.createElement("h4");
        h4Label.classList.add("h4Label");
        h4Label.innerText = `El Alumno ${usuarioActual.nombreUsuario} NO está inscrito en ninguna cursada`;
        const tablaAlumnoLogueado = document.getElementById("tablaAlumnoLogueado");
        tablaAlumnoLogueado.appendChild(h4Label);
    } else {
        // cargamos la tabla con las notas
        tablaNotasAlumno.innerHTML = tablaCursosAlumnoHTML;
        let nombreCurso = "";
        const filasTablaNotasAlumno = document.getElementById("filasTablaNotasAlumno");
        for (const curso of cursosAlumno) {
            i = cursadas.findIndex((cursoD) => cursoD.codigoCursada == curso.codigoCursada);
            if (i > -1) {
                nombreCurso = cursadas[i].nombreCursada;
            } else {
                nombreCurso = "ERROR no se encontró";
            }
            let fila = document.createElement("tr");
            fila.innerHTML =
                `<th scope="row">${nombreCurso}</th>
                <td>${curso.fechaIngreso}</td>
                <td>${curso.vrPagado}</td>
                <td>${curso.moneda}</td>
                <td><a href="#eliminarCurso" class="btn btn-outline-primary btn-sm botonEliminar" id="${curso.codigoCursada}">Eliminar Curso</a></td>`;
            filasTablaNotasAlumno.appendChild(fila);
        }
        cargarBotonEliminar();
    }
    // cargamos los cursos disponibles para el Alumno, solo aparecen los que no ha tomado
    cargarCursosDisponiblesAlumno();
}
