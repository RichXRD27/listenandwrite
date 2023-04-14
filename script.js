let ultimoAudioReproducido = null;

function crearSeccionesDesdeTxt(contenidoTxt) {
  // Divide el contenido del archivo de texto en líneas
  const lineas = contenidoTxt.split('\n');

  // Crea una nueva sección y un botón "mostrar" para cada línea del archivo de texto
  const secciones = document.createElement('div');
  secciones.classList.add('polo');
  for (let i = 0; i < lineas.length; i++) {
    const seccion = document.createElement('section');
    seccion.classList.add('seccion-txt'); // Agrega la nueva clase a la sección

    const botonMostrar = document.createElement('button');
    botonMostrar.textContent = 'Mostrar';
    botonMostrar.addEventListener('click', function() {
      const contenido = botonMostrar.nextElementSibling;
      if (contenido.style.display === 'none') {
        contenido.style.display = 'block';
        botonMostrar.textContent = 'Ocultar';
      } else {
        contenido.style.display = 'none';
        botonMostrar.textContent = 'Mostrar';
      }
    });

    seccion.appendChild(botonMostrar);

    const contenido = document.createElement('p');
    contenido.textContent = lineas[i];
    seccion.appendChild(contenido);

    // Oculta el contenido de la sección al crearla
    contenido.style.display = 'none';

    secciones.appendChild(seccion);
  }

  return secciones;
}


// Función para crear secciones a partir de archivos de audio
function crearSeccionesDesdeAudio(archivosAudio) {
  const seccionesAudio = document.createElement('div');
  seccionesAudio.classList.add('marco');
  let mostrarControles = false;

  for (let i = 0; i < archivosAudio.length; i++) {
    const seccion = document.createElement('section');
    seccion.classList.add('audio-section');

    const audio = document.createElement('audio');
    audio.controls = false;
    audio.src = URL.createObjectURL(archivosAudio[i]);
    audio.volume = 0.3;
    audio.addEventListener('loadedmetadata', function() {
      audio.playbackRate = 1.5;
      audio.loop = true;
    });
    audio.addEventListener('play', function() {
      if (ultimoAudioReproducido !== null && ultimoAudioReproducido !== audio) {
        ultimoAudioReproducido.pause();
      }
      ultimoAudioReproducido = audio;
    });

    const texto = document.createElement('textarea');
    texto.placeholder = 'Ingrese su texto aquí';
    texto.addEventListener('click', function() {
      audio.play();
    });
    
    // Agregar controlador de eventos "keydown" al área de texto
    texto.addEventListener('keydown', function(evento) {
      if (evento.key === 'Enter') {
        // Obtener el índice de la sección actual
        const indiceSeccion = Array.from(seccionesAudio.children).indexOf(seccion);
        // Obtener el botón "Mostrar" correspondiente en la sección creada por el archivo de texto
        const botonMostrar = document.querySelectorAll('.seccion-txt button')[indiceSeccion];
        // Activar el botón "Mostrar"
        botonMostrar.click();
      }
    });

    seccion.appendChild(audio);
    seccion.appendChild(texto);

    seccion.addEventListener('dblclick', function() {
      mostrarControles = !mostrarControles;
      audio.controls = mostrarControles;
    });

    seccionesAudio.appendChild(seccion);
  }

  return seccionesAudio;
}

// Acción del botón "Seleccionar archivo de texto"
const btnSeleccionarTxt = document.getElementById('btnSeleccionarTxt');
btnSeleccionarTxt.addEventListener('click', function() {
  const archivo = document.createElement('input');
  archivo.type = 'file';
  archivo.accept = '.txt';

  archivo.onchange = function(evento) {
    const archivoSeleccionado = evento.target.files[0];

    // Lee el contenido del archivo de texto seleccionado
    const lector = new FileReader();
    lector.onload = function(evento) {
      // Crea secciones a partir del contenido del archivo de texto
      const contenidoTxt = evento.target.result;
      const secciones = crearSeccionesDesdeTxt(contenidoTxt);

      // Agrega las secciones creadas al documento HTML
      const divSecciones = document.getElementById('secciones');
      divSecciones.appendChild(secciones);
    };
    lector.readAsText(archivoSeleccionado);
  };

  archivo.click();
});


// Acción del botón "Seleccionar archivos de audio"
const btnSeleccionarAudio = document.getElementById('btnSeleccionarAudio');
btnSeleccionarAudio.addEventListener('click', function() {
  const archivos = document.createElement('input');
  archivos.type = 'file';
  archivos.accept = 'audio/*';
  archivos.multiple = true;

  archivos.onchange = function(evento) {
    const archivosSeleccionados = evento.target.files;

    // Crea secciones a partir de los archivos de audio seleccionados
    const seccionesAudio = crearSeccionesDesdeAudio(archivosSeleccionados);

    // Agrega las secciones creadas al documento HTML
    const divSecciones = document.getElementById('secciones');
    divSecciones.appendChild(seccionesAudio);
  };

  archivos.click();
});