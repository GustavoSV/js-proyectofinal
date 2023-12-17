let i = -1;

let cursadas;
let cursadasLS = localStorage.getItem("cursadasLS");
if (cursadasLS) {
    cursadas = JSON.parse(cursadasLS);
} else {
    cursadas = [];
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
}

const seccionNoHayIngreso = document.getElementById("contenedorVacio");
const seccionesAlumnoLogueado = document.getElementsByClassName("carritoContenido");
let alumnoLogueado = false;
let usuarioActual;
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

const cardsCarrito =
    `<div class="encabezadoComprarCursos">
        <h2>Cursadas en el carrito</h2>
    </div>
    <div class="row row-cols-1 row-cols-md-3 g-4" id="cardsCursosCarrito">
    </div>`;

function cargarBotonEliminar() {
    const botones = document.querySelectorAll(".buttonEliminarCarrito");
    for (const boton of botones) {
        boton.onclick = (e) => {
            const cursoId = e.currentTarget.id;
            i = cursosCarrito.findIndex((item) => item.codigoCursada == cursoId && item.idAlumno == usuarioActual.idUsuario);
            if (i > -1) {
                cursosCarrito.splice(i, 1);
                sessionStorage.setItem("cursosCarritoSS", JSON.stringify(cursosCarrito));
                cargarCursosCarrito();
            }
        }
    }
}

function cargarCursosCarrito() {
    const cursosUsuario = cursosCarrito.filter((curso) => curso.idAlumno == usuarioActual.idUsuario);
    const contenedorCursosCarrito = document.getElementById("contenedorCarrito");
    const totalPagar = document.getElementById("totalPagar");
    contenedorCursosCarrito.innerHTML = "";

    contenedorCursosCarrito.innerHTML = cardsCarrito;
        
    const cardsCursosCarrito = document.getElementById("cardsCursosCarrito");
    let precio = 0;
    let totalCarrito = 0;
    let simboloMoneda = "";
    for (const curso of cursadas) {
        i = cursosUsuario.findIndex((cursoU) => cursoU.codigoCursada == curso.codigoCursada);
        if (i > -1) {
            precio = cursosUsuario[i].vrPagado;
            totalCarrito += precio;
            if (cursosUsuario[i].moneda == "PESOS") {
                simboloMoneda = "$";
                precio = precio.toFixed(0);
            } else if (cursosUsuario[i].moneda == "DOLAR") {
                simboloMoneda = "USD";
                precio = precio.toFixed(2);
            } else {
                simboloMoneda = "XXX";
            }
            let filaC = document.createElement("div");
            filaC.classList.add("col");
            filaC.innerHTML = 
                `<div class="card h-100">
                    <img src="${curso.imagen}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h4 class="card-title">${curso.nombreCursada}</h4>
                        <p class="card-text">${curso.contenido}</p>
                        <h5 class="precioCursada">${simboloMoneda} ${precio}</h5>
                        <button type="button" class="btn btn-outline-danger buttonEliminarCarrito" id="${curso.codigoCursada}">Eliminar</button>
                    </div>
                </div>`;
            cardsCursosCarrito.appendChild(filaC);
        } 
    }
    if (simboloMoneda == "USD") {
        totalCarrito = totalCarrito.toFixed(2);
    } else {
        totalCarrito = totalCarrito.toFixed(0);
    }
    totalPagar.innerText = `${simboloMoneda} ${totalCarrito}`;
    
    cargarBotonEliminar();
}

function obtenerFecha() {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let año = fecha.getFullYear();
    let fch = "";
    if (mes < 10) {
        fch = `${dia}/0${mes}/${año}`;
    } else {
        fch = `${dia}/${mes}/${año}`;
    }
    return fch;
}

const cursosActualesAlumno =  notasxAlumno.filter((curso) => curso.idAlumno == usuarioActual.idUsuario);
const buttonPagar = document.getElementById("buttonPagar");

buttonPagar.onclick = (e) => {
    if (cursosCarrito.length > 0) {
        for (const item of cursosCarrito) {
            i = cursosActualesAlumno.findIndex((curso) => curso.codigoCursada == item.codigoCursada);
            if (i < 0) {
                const nuevoNotasxAlumno = {
                    "codigoCursada": item.codigoCursada,
                    "idAlumno": item.idAlumno,
                    "nota1": 0,
                    "nota2": 0,
                    "nota3": 0,
                    "fechaIngreso": obtenerFecha(),
                    "vrPagado": item.vrPagado,
                    "moneda": item.moneda
                }
                notasxAlumno.push(nuevoNotasxAlumno);
                localStorage.setItem("notasxAlumnoLS", JSON.stringify(notasxAlumno));
            }
        }
        cursosCarrito = [];
        sessionStorage.setItem("cursosCarritoSS", JSON.stringify(cursosCarrito));
        Swal.fire({
            title: "Felicitaciones!",
            text: `Hemos agregado tus cursadas correctamente. Sigue así ampliando el mundo con tus conocimientos`,
            icon: "success"
        });setTimeout(() => {
            window.location.href = "alumno.html";
        }, 3000);
    }
}

if (alumnoLogueado == true) {
    cargarCursosCarrito();
}