// OBJETO LIBRO
function Libro(titulo, autor, isbn, anio) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.anio = anio;
    this.leido = false; // por defecto no leído
}

// Array principal de libros
let libros = [];

// Expresiones regulares para validar
const regex = {
    titulo: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,}$/,
    autor: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{3,}$/,
    isbn: /^[0-9]{13}$/,
    anio: /^(19|20)\d{2}$/
};

// Cargar libros desde localStorage al iniciar
window.addEventListener("load", function() {
    const datos = localStorage.getItem("libros");
    if(datos) {
        libros = JSON.parse(datos);
        mostrarLibros(libros);
    }
});

// VALIDACIÓN DE CAMPOS
function validarCampo(input, errorElemento, patron, mensaje) {
    if(patron.test(input.value.trim())) {
        input.classList.add("correcto");
        input.classList.remove("incorrecto");
        errorElemento.textContent = "";
        return true;
    } else {
        input.classList.add("incorrecto");
        input.classList.remove("correcto");
        errorElemento.textContent = mensaje;
        return false;
    }
}

// EVENTOS DE VALIDACIÓN EN TIEMPO REAL
document.querySelector("#titulo").addEventListener("keyup", function() {
    validarCampo(this, document.querySelector("#errorTitulo"), regex.titulo, "Título inválido");
});
document.querySelector("#autor").addEventListener("keyup", function() {
    validarCampo(this, document.querySelector("#errorAutor"), regex.autor, "Autor inválido");
});
document.querySelector("#isbn").addEventListener("keyup", function() {
    validarCampo(this, document.querySelector("#errorISBN"), regex.isbn, "ISBN debe tener 13 dígitos");
});
document.querySelector("#anio").addEventListener("keyup", function() {
    validarCampo(this, document.querySelector("#errorAnio"), regex.anio, "Año inválido");
});

// AÑADIR LIBRO
document.querySelector("#formLibro").addEventListener("submit", function(e){
    e.preventDefault();

    const titulo = document.querySelector("#titulo");
    const autor = document.querySelector("#autor");
    const isbn = document.querySelector("#isbn");
    const anio = document.querySelector("#anio");

    // Validar todos los campos antes de añadir
    const valido = validarCampo(titulo, document.querySelector("#errorTitulo"), regex.titulo, "Título inválido") &
                   validarCampo(autor, document.querySelector("#errorAutor"), regex.autor, "Autor inválido") &
                   validarCampo(isbn, document.querySelector("#errorISBN"), regex.isbn, "ISBN inválido") &
                   validarCampo(anio, document.querySelector("#errorAnio"), regex.anio, "Año inválido");

    if(!valido) return;

    // Crear nuevo libro
    const nuevoLibro = new Libro(titulo.value, autor.value, isbn.value, anio.value);
    libros.push(nuevoLibro);

    // Guardar en localStorage
    localStorage.setItem("libros", JSON.stringify(libros));

    // Limpiar formulario
    titulo.value = ""; autor.value = ""; isbn.value = ""; anio.value = "";
    titulo.classList.remove("correcto"); autor.classList.remove("correcto");
    isbn.classList.remove("correcto"); anio.classList.remove("correcto");

    mostrarLibros(libros);
});

// MOSTRAR LIBROS EN PANTALLA
function mostrarLibros(lista) {
    const contenedor = document.querySelector("#listaLibros");
    contenedor.innerHTML = "";

    lista.forEach((libro, index) => {
        const div = document.createElement("div");
        div.className = "col-md-4";

        const card = document.createElement("div");
        card.className = "card-libro bg-white shadow-sm";

        card.innerHTML = "<h5>" + libro.titulo + "</h5>" +
                         "<p>Autor: " + libro.autor + "</p>" +
                         "<p>ISBN: " + libro.isbn + "</p>" +
                         "<p>Año: " + libro.anio + "</p>" +
                         "<p>Estado: " + (libro.leido ? "Leído" : "No leído") + "</p>";

        // Botón para cambiar estado leído/no leído
        const btnLeido = document.createElement("button");
        btnLeido.textContent = libro.leido ? "Marcar como no leído" : "Marcar como leído";
        btnLeido.className = "btn btn-success btn-leido";

        btnLeido.addEventListener("click", function() {
            libro.leido = !libro.leido;
            localStorage.setItem("libros", JSON.stringify(libros));
            mostrarLibros(lista);
        });

        // Botón para eliminar libro
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn btn-danger btn-leido ms-2";

        btnEliminar.addEventListener("click", function() {
            //if(confirm("¿Quieres eliminar el libro '" + libro.titulo + "'?")) {
                libros.splice(index,1);
                localStorage.setItem("libros", JSON.stringify(libros));
                mostrarLibros(lista);
           // }
        });

        card.appendChild(btnLeido);
        card.appendChild(btnEliminar);

        div.appendChild(card);
        contenedor.appendChild(div);
    });
}

// BUSCADOR DE LIBROS
document.querySelector("#buscar").addEventListener("keyup", function(){
    const texto = this.value.toLowerCase();
    const filtrados = libros.filter(libro => 
        libro.titulo.toLowerCase().includes(texto) || libro.autor.toLowerCase().includes(texto)
    );
    mostrarLibros(filtrados);
});