window.addEventListener("DOMContentLoaded", () => {
    const cont = document.getElementById("oferta-timer");
    if (!cont) return;
    
    const end = new Date(cont.dataset.end).getTime();
    const timerId = setInterval(() => {
      const now = Date.now();
      let diff = Math.max(0, end - now);
      const secTot = Math.floor(diff / 1000);
      
      const ore = String(Math.floor(secTot / 3600)).padStart(2, "0");
      const minute = String(Math.floor((secTot % 3600) / 60)).padStart(2, "0");
      const secunde = String(secTot % 60).padStart(2, "0");
      
      cont.textContent = `${ore}:${minute}:${secunde}`;
      
      if (secTot <= 10)
        cont.classList.add("ultimele-secunde");
      
      if (diff === 0) {
        clearInterval(timerId);
        location.reload();
      }
    }, 1000);
  });