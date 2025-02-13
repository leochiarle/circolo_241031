
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

/*  // Remove query params from URL
  window.history.replaceState({}, document.title, window.location.pathname);
*/
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

    // Prepare data to PATCH or POST to SheetDB
    const data = {
        UID: uid,
        carnevale: "TRUE",
        registration_time: dateNow(),
        source: window.formSource || 'unknown'
    };

    const endpointUrl =`https://sheetdb.io/api/v1/w9iqfm0vgapyk/UID/${uid}`

    try {
      const response = await fetch(endpointUrl, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.location.href = "./result.html";
      } else {
        alert('Errore durante la registrazione. Riprova più tardi.');
      }
    } catch (error) {
      alert('Errore di rete. Riprova più tardi.');
    }
  });
});
