// Importar SweetAlert2
import Swal from "sweetalert2";

// Obtener el contenido del atributo data-content
const content = JSON.parse(
  document.getElementById("mosaic-container").getAttribute("data-content")
);

// Función para abrir el modal con SweetAlert2
window.openModal = function (index) {
  const item = content[index];

  Swal.fire({
    html: `
      ${
        item.tipo === "foto"
          ? `
        <img
          src="${item.ruta}"
          alt="${item.descripcion}"
          class="w-full h-full object-contain zoomable-content"
          style="max-width: 80vw; max-height: 80vh;"
        />
      `
          : `
        <video class="w-full h-full object-contain zoomable-content" controls autoplay style="max-width: 80vw; max-height: 80vh;">
          <source src="${item.ruta}" type="video/webm" />
          <source src="${item.ruta.replace(
            ".webm",
            ".mp4"
          )}" type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>
      `
      }
    `,
    showConfirmButton: false,
    background: "transparent",
    backdrop: "rgba(0, 0, 0, 0.8)",
    width: "auto",
    padding: "0",
    customClass: {
      popup: "swal2-no-border",
    },
    didOpen: () => {
      document.body.classList.add("no-scroll");

      const contentElement = document.querySelector(".zoomable-content");
      let isZoomed = false;

      contentElement.addEventListener("dblclick", () => {
        if (isZoomed) {
          contentElement.style.transform = "scale(1)";
          document.body.classList.remove("no-scroll-zoom");
        } else {
          contentElement.style.transform = "scale(1.2)";
          document.body.classList.add("no-scroll-zoom");
        }
        isZoomed = !isZoomed;
      });
    },
    willClose: () => {
      document.body.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll-zoom");
    },
  });
};
