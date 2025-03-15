// Importar SweetAlert2
import Swal from "sweetalert2";

// Obtener el contenido del atributo data-content
const content = JSON.parse(
  document.getElementById("mosaic-container").getAttribute("data-content")
);

// Función para abrir el modal con SweetAlert2
window.openModal = function (index) {
  const item = content[index];

  if (item.tipo === "foto") {
    Swal.fire({
      imageUrl: item.ruta, // Ruta de la imagen
      imageAlt: item.descripcion, // Texto alternativo
      imageWidth: "80%", // Ancho de la imagen (80% del modal)
      imageHeight: "auto", // Altura automática para mantener la proporción
      showConfirmButton: false, // No mostrar botón de confirmación
      background: "transparent", // Fondo del modal
      backdrop: "rgba(0, 0, 0, 0.8)", // Fondo oscuro detrás del modal
      width: "40em", // Ancho del modal se ajusta al contenido
      padding: "0", // Sin padding
      didOpen: () => {
        // Deshabilitar el scroll del cuerpo
        document.body.classList.add("no-scroll");
      },
      willClose: () => {
        // Habilitar el scroll del cuerpo al cerrar la modal
        document.body.classList.remove("no-scroll");
      },
    });
  } else if (item.tipo === "video") {
    Swal.fire({
      html: `
        <video class="w-full h-full object-contain zoomable-video" controls autoplay style="max-width: 80vw; max-height: 80vh;">
          <source src="${item.ruta}" type="video/webm" />
          <source src="${item.ruta.replace(
            ".webm",
            ".mp4"
          )}" type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>
      `,
      showConfirmButton: false, // No mostrar botón de confirmación
      background: "transparent", // Fondo transparente
      backdrop: "rgba(0, 0, 0, 0.8)", // Fondo oscuro detrás del modal
      width: "auto", // Ancho del modal se ajusta al contenido
      padding: "0", // Sin padding
      customClass: {
        popup: "swal2-no-border", // Clase personalizada para el modal
      },
      didOpen: () => {
        // Deshabilitar el scroll del cuerpo
        document.body.classList.add("no-scroll");

        // Agregar evento de doble clic para hacer zoom
        const video = document.querySelector(".zoomable-video");
        video.style.transition = "transform 0.25s ease"; // Transición suave
        video.addEventListener("dblclick", () => {
          if (video.style.transform === "scale(1.5)") {
            video.style.transform = "scale(1)"; // Restablecer el zoom
          } else {
            video.style.transform = "scale(1.5)"; // Aplicar zoom
          }
        });
      },
      willClose: () => {
        // Habilitar el scroll del cuerpo al cerrar la modal
        document.body.classList.remove("overflow-hidden");
      },
    });
  }
};
