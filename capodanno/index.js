document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('uid');
  const source = urlParams.get('source') || 'unknown';

  const uidField = document.getElementById('uidField');
  uidField.value = uid;

  const form = document.getElementById('registrationForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!uid) return alert("UID mancante!");

    // Prepare data to update in SheetDB
    const data = {
      data: [{
        uid: uid,
        registered: "Yes",
        registration_time: new Date().toISOString(),
        source: source
      }]
    };

    try {
      // Replace YOUR_SHEETDB_API_ENDPOINT with your real endpoint
      const res = await fetch("https://sheetdb.io/api/v1/YOUR_SHEETDB_API_ENDPOINT", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("Registrazione confermata. Grazie!");
      } else {
        alert("Errore durante la registrazione. Riprova più tardi.");
      }
    } catch (error) {
      alert("Errore di rete. Riprova più tardi.");
    }
  });
});