// src/js/film.js

// Obtener el contenido del atributo data-content
const content = JSON.parse(
  document.getElementById("mosaic-container").getAttribute("data-content")
);

// Función para abrir el modal
window.openModal = function (index) {
  const item = content[index];
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalVideo = document.getElementById("modal-video");
  const modalVideoSource = document.getElementById("modal-video-source");

  if (item.tipo === "foto") {
    modalImage.src = item.ruta;
    modalImage.classList.remove("hidden");
    modalVideo.classList.add("hidden");
  } else {
    modalVideoSource.src = item.ruta;
    modalVideo.load();
    modalVideo.classList.remove("hidden");
    modalImage.classList.add("hidden");
  }

  // Mostrar el modal con transición
  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100", "pointer-events-auto");
};

// Función para cerrar el modal
window.closeModal = function () {
  const modal = document.getElementById("modal");
  const modalVideo = document.getElementById("modal-video");

  // Ocultar el modal con transición
  modal.classList.remove("opacity-100", "pointer-events-auto");
  modal.classList.add("opacity-0", "pointer-events-none");

  modalVideo.pause(); // Pausar el video al cerrar el modal
};
