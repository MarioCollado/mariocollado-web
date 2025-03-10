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
