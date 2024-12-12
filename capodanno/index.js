const sheetDbUrl = "https://sheetdb.io/api/v1/w9iqfm0vgapyk"; // Replace with your SheetDB endpoint

async function initialization() {
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('uid') || '';
  const source = urlParams.get('source') || 'unknown';

  // Set UID field value
  const uidField = document.getElementById('uidField');
  if (uidField) {
    uidField.value = uid;
  }

  // Store source globally if needed
  window.formSource = source;

  // Remove query params from URL
  window.history.replaceState({}, document.title, window.location.pathname);
}

function dateNow() {
  const d = new Date();
  const ora = `${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`;
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${ora}`;
}

document.addEventListener('DOMContentLoaded', () => {
  initialization();

  const form = document.getElementById('sheetdb-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const uid = document.getElementById('uidField').value.trim();
    if (!uid) {
      alert('UID mancante');
      return;
    }

    // Prepare data to PATCH or POST to SheetDB
    const data = {
      data: [{
        UID: uid,
        capodanno: "Yes",
        registration_time: dateNow(),
        source: window.formSource || 'unknown'
      }]
    };

    try {
      const response = await fetch(sheetDbUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...data, _method="PATCH"})
      });

      if (response.ok) {
        alert('Registrazione confermata. Grazie!');
      } else {
        alert('Errore durante la registrazione. Riprova più tardi.');
      }
    } catch (error) {
      alert('Errore di rete. Riprova più tardi.');
    }
  });
});
