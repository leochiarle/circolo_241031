// Global variables
let html5QrCode;
let uid;
let resultQR;
let checkCf = true, checkResidenza = true, checkEmail = true, checkTelefono = true;

// 1) Initialize camera scanning on page load
window.addEventListener("load", () => {
  html5QrCode = new Html5Qrcode("reader");
  startCamera();
});

// 2) Start the camera automatically
function startCamera() {
  html5QrCode.start(
    { facingMode: "environment" }, // Use the rear camera if available
    { fps: 10, qrbox: 250 },
    onScanSuccess,
    onScanFailure
  ).catch(err => {
    console.error("Camera start error:", err);
  });
}

// 3) Handle scan success
async function onScanSuccess(decodedText, decodedResult) {
  console.log("Decoded text:", decodedText);

  // Optionally stop scanning after a successful read
  await html5QrCode.stop();

  uid = decodedText;
  resultQR = await check_qr(decodedText);

  if (resultQR.status === 200) {
    showResult(resultQR);
  } else {
    console.log("Errore nel server");
  }
  console.log("Result QR:", resultQR);
}

// 4) Handle scan failure (optional)
function onScanFailure(error) {
  // This is called on each unsuccessful scan attempt
  // console.warn(`Scan failed: ${error}`);
}

// 5) Show result based on server response
function showResult(result) {
  // Set background color based on status
  switch (result.stato) {
    case 'green':
      document.body.style.backgroundColor = '#4CAF50'; // Verde
      document.getElementById('nome-cognome').textContent = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "Accesso <br> Consentito";
      if (result.drink !== undefined) {
        document.getElementById('testo').textContent = `Drink ${result.drink}`;
      }
      break;

    case 'red':
      document.body.style.backgroundColor = '#F44336'; // Rosso
      document.getElementById('nome-cognome').textContent = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "Tessera già <br> scansionata";
      break;

    case 'grey':
      document.body.style.backgroundColor = '#a1a5a8'; // Grigio
      document.getElementById('message').textContent = "Tessera non esistente";
      break;

    case 'ligthblue':
      document.body.style.backgroundColor = '#84cbe9'; // Azzurro
      document.getElementById('nome-cognome').textContent = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "Non ancora entrato";
      document.getElementById('testo').textContent = "Compilare i campi:";
      document.getElementById('form').style.display = "block";

      // Conditionally hide fields not needed
      if (result.cfCol === undefined) {
        document.getElementById('CF').style.display = "none";
        checkCf = false;
      }
      if (result.residenzaCol === undefined) {
        document.getElementById('residenza').style.display = "none";
        checkResidenza = false;
      }
      if (result.emailCol === undefined) {
        document.getElementById('email').style.display = "none";
        checkEmail = false;
      }
      if (result.telefonoCol === undefined) {
        document.getElementById('telefono').style.display = "none";
        checkTelefono = false;
      }
      break;

    case 'yellow':
      document.body.style.backgroundColor = '#fed627'; // Giallo
      document.getElementById('nome-cognome').textContent = `${result.name} ${result.cognome}`;
      document.getElementById('message').textContent = "OMAGGIO";
      if (result.drink !== undefined) {
        document.getElementById('testo').textContent = `Drink ${result.drink}`;
      }
      break;

    default:
      // Handle unexpected states if necessary
      break;
  }

  // Show the "Apri Scanner" button for subsequent scans
  document.getElementById('btn-scanner').style.display = "inline-block";
}

// 6) Handle the form submission if user needs to fill missing data
async function updateData() {
  // Hide any previous error messages
  document.getElementById('invalid-CF').style.display = "none";
  document.getElementById('invalid-residenza').style.display = "none";
  document.getElementById('invalid-email').style.display = "none";
  document.getElementById('invalid-telefono').style.display = "none";

  if (isInputValid(checkCf, checkResidenza, checkEmail, checkTelefono)) {
    document.getElementById('message').innerHTML = "Sto mandando i dati...";
    document.getElementById('testo').style.display = "none";
    document.getElementById('form').style.display = "none";

    const result = await addCfResidenza();
    console.log("Update result:", result);

    if (result.status === 200) {
      document.getElementById('message').innerHTML = "Dati inviati con successo";
    } else {
      console.log("errore addCfResidenza");
      document.getElementById('message').innerHTML = "Errore Nell'invio dei dati, riprova";
    }
  }
}

// 7) Validate user input
function isInputValid(cf, residenza, email, telefono) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const CFpattern = /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;

  if (cf) {
    const cfValue = document.getElementById('input-CF').value;
    if (cfValue === "") return false;
    if (cfValue.search(CFpattern) === -1) {
      document.getElementById('invalid-CF').textContent = "Formato non valido";
      document.getElementById('invalid-CF').style.display = "inline-block";
      return false;
    }
  }

  if (residenza) {
    if (document.getElementById('input-residenza').value === "") return false;
  }

  if (email) {
    const emailValue = document.getElementById('input-email').value;
    if (emailValue === "") return false;
    if (!emailPattern.test(emailValue)) {
      document.getElementById('invalid-email').textContent = "Formato email non valido";
      document.getElementById('invalid-email').style.display = "inline-block";
      return false;
    }
  }

  if (telefono) {
    const phoneValue = document.getElementById('input-telefono').value;
    if (phoneValue === "") return false;
    if (phoneValue.length < 10) {
      document.getElementById('invalid-telefono').textContent = "Numero di telefono non valido (meno di 10 cifre)";
      document.getElementById('invalid-telefono').style.display = "inline-block";
      return false;
    }
    if (phoneValue.length > 10) {
      document.getElementById('invalid-telefono').textContent = "Numero di telefono non valido (più di 10 cifre)";
      document.getElementById('invalid-telefono').style.display = "inline-block";
      return false;
    }
  }

  return true;
}

// 8) Reload the page to scan again
function reloadScan() {
  location.reload();
}

// 9) Check QR via your server
async function check_qr(uid) {
  const response = await fetch('https://circolo-server-private.onrender.com/check_qr', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uid: uid })
  });
  return await response.json();
}

// 10) Submit missing info to your server
async function addCfResidenza() {
  const response = await fetch('https://circolo-server-private.onrender.com/update_data', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uid: uid,
      row: resultQR.row,
      cfCol: resultQR.cfCol,
      residenzaCol: resultQR.residenzaCol,
      emailCol: resultQR.emailCol,
      telefonoCol: resultQR.telefonoCol,
      cf: document.getElementById('input-CF').value.toUpperCase(),
      residenza: document.getElementById('input-residenza').value,
      email: document.getElementById('input-email').value,
      telefono: document.getElementById('input-telefono').value
    })
  });
  return await response.json();
}
