export function initHoldButton() {
  const scrollButtons = document.querySelectorAll(".scrollButton");

  // Función para aplicar las transiciones de visibilidad
  const toggleElementVisibility = (element, show = true) => {
    if (show) {
      element.classList.remove("opacity-0", "scale-0", "hidden");
      element.classList.add("opacity-100", "scale-100");
    } else {
      element.classList.add("opacity-0", "scale-0");
      element.classList.remove("opacity-100", "scale-100");
    }
  };

  scrollButtons.forEach((scrollButton) => {
    const holdEffect = scrollButton.querySelector(".holdEffect");
    const arrowIcon = scrollButton.querySelector(".arrowIcon");
    const verifiedIcon = scrollButton.querySelector(".verifiedIcon");

    let holdTimeout;
    let isHoldTriggered = false;
    let isMouseDown = false; // Variable para rastrear si el botón está siendo presionado

    // Verificar si los elementos existen
    if (!holdEffect || !arrowIcon || !verifiedIcon) {
      console.error("Uno o más elementos no se encontraron.");
      return;
    }

    // Función para reiniciar los íconos
    const resetIcons = () => {
      toggleElementVisibility(holdEffect, false);
      toggleElementVisibility(verifiedIcon, false);
      toggleElementVisibility(arrowIcon, true); // Mostrar la flecha nuevamente
    };

    // Iniciar animación al mantener pulsado
    const onMouseDown = () => {
      isHoldTriggered = false;
      isMouseDown = true; // El botón está siendo presionado

      // Mostrar el sombreado lentamente con un retraso
      setTimeout(() => {
        toggleElementVisibility(holdEffect, true); // Muestra el sombreado
      }, 500); // Retraso de 500ms antes de mostrar el sombreado

      // Mostrar el icono de verificación después de un poco más de tiempo
      setTimeout(() => {
        toggleElementVisibility(verifiedIcon, true); // Icono de ir al home
      }, 800); // Retraso de 800ms para que el icono aparezca después del sombreado

      // Ocultar la flecha al mismo tiempo que el sombreado
      setTimeout(() => {
        toggleElementVisibility(arrowIcon, false); // Desvanece la flecha
      }, 500); // Desaparece la flecha al mismo tiempo que el sombreado

      // Ocultar el cursor en todo el documento
      document.body.style.cursor = "none";

      holdTimeout = setTimeout(() => {
        isHoldTriggered = true;
        document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });

        setTimeout(resetIcons, 1000); // Resetear después de 1 segundo
      }, 1700); // 1 segundo para "hold"
    };

    // Mostrar el cursor al soltar el clic
    const onMouseUpOrLeave = () => {
      isMouseDown = false; // El botón ya no está siendo presionado
      document.body.style.cursor = "auto"; // Vuelve a la apariencia normal del cursor
      clearTimeout(holdTimeout);
      if (!isHoldTriggered) resetIcons();
    };

    // Ocultar el cursor cuando el mouse se mueve mientras el botón está presionado
    const onMouseMove = () => {
      if (isMouseDown) {
        console.log("Mouse move detected while holding the button"); // Depuración
        document.body.style.cursor = "none";
      }
    };

    // Añadir evento de hover para reiniciar las animaciones
    scrollButton.addEventListener("mouseenter", () => {
      if (!isHoldTriggered) {
        // Si no se ha activado el "hold", reiniciamos los íconos cuando el mouse entra.
        resetIcons();
      }
    });

    // Agregar eventos de mouse
    scrollButton.addEventListener("mousedown", onMouseDown);
    scrollButton.addEventListener("mouseup", onMouseUpOrLeave);
    scrollButton.addEventListener("mouseleave", onMouseUpOrLeave);
    document.addEventListener("mousemove", onMouseMove); // Escuchar el evento mousemove en todo el documento
  });
}
