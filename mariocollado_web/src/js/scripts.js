// Función para pausar o reproducir un video
function togglePlayPause(video) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Asignar los eventos de clic a los videos
document.addEventListener("DOMContentLoaded", () => {
  const video1 = document.getElementById("video-1");
  const video2 = document.getElementById("video-2");

  // Asignar evento de play/pause al primer video
  video1.addEventListener("click", () => {
    togglePlayPause(video1);
  });

  // Asignar evento de play/pause al segundo video
  video2.addEventListener("click", () => {
    togglePlayPause(video2);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // HOLDBUTTON flechas de scroll
  const scrollButton = document.getElementById("scrollButton");
  const holdEffect = document.getElementById("holdEffect");
  const arrowIcon = document.getElementById("arrowIcon");
  const verifiedIcon = document.getElementById("verifiedIcon");
  let holdTimeout;

  if (!scrollButton) {
    console.error("El botón de desplazamiento no se encuentra.");
    return;
  }

  // Iniciar pulsación larga
  scrollButton.addEventListener("mousedown", () => {
    // Animar sombra
    holdEffect.classList.remove("opacity-0", "scale-0");
    holdEffect.classList.add("opacity-100", "scale-100");

    // Ocultar flecha y mostrar icono verificado
    arrowIcon.classList.add("opacity-0");
    verifiedIcon.classList.remove("opacity-0", "scale-0");
    verifiedIcon.classList.add("opacity-100", "scale-100");

    // Redirigir tras 1 segundo (desplazarse suavemente a la sección #home)
    holdTimeout = setTimeout(() => {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.scrollIntoView({
          behavior: "smooth",
        });
      }

      // Volver a mostrar la flecha después de la animación
      arrowIcon.classList.remove("opacity-0");
      verifiedIcon.classList.add("opacity-0", "scale-0");
    }, 1000); // 1 segundo
  });

  // Cancelar si se suelta antes de 1 segundo
  const cancelHold = () => {
    clearTimeout(holdTimeout);

    // Ocultar sombra e icono verificado
    holdEffect.classList.add("opacity-0", "scale-0");
    verifiedIcon.classList.add("opacity-0", "scale-0");

    // Mostrar flecha de nuevo
    arrowIcon.classList.remove("opacity-0");
  };

  scrollButton.addEventListener("mouseup", cancelHold);
  scrollButton.addEventListener("mouseleave", cancelHold);
});
