const scanner = new Html5QrcodeScanner("reader", { 
    fps: 10, 
    qrbox: 250, 
    videoConstraints: { facingMode: { exact: "environment" } }
  });
  scanner.render(onScanSuccess);
  
  let uid;
  let resultQR;
  let checkCf = true, checkResidenza = true, checkEmail = true, checkTelefono = true;
  
  async function onScanSuccess(decodedText, decodedResult) {
    scanner.clear();
    uid = decodedText;
    console.log(decodedText);
    
    resultQR = await check_qr(decodedText);
    if (resultQR.status == 200) {
      showResult(resultQR);
    } else {
      console.log("c'e' stato un errore");
    }
    console.log(resultQR);
  }
  
  function showResult(result) {
    if (result.stato === 'green') {
      document.body.style.backgroundColor = '#4CAF50'; // Verde
      document.getElementById('nome-cognome').innerHTML = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "Accesso <br> Consentito";
      if (result.drink !== undefined) {
        document.getElementById('testo').innerHTML = `Drink ${result.drink}`;
      }
      document.getElementById('btn-scanner').style.display = "inline-block";
    } else if (result.stato === 'red') {
      document.body.style.backgroundColor = '#F44336'; // Rosso
      document.getElementById('nome-cognome').innerHTML = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "Tessera già <br> scansionata<br>";
      document.getElementById('btn-scanner').style.display = "inline-block";
    } else if (result.stato === 'grey') {
      document.body.style.backgroundColor = '#a1a5a8'; // Grigio
      document.getElementById('message').textContent = 'Tessera non esistente';
      document.getElementById('btn-scanner').style.display = "inline-block";
    } else if (result.stato === 'ligthblue') {
      document.body.style.backgroundColor = '#84cbe9'; // Azzurro
      document.getElementById('nome-cognome').innerHTML = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "Non ancora entrato <br>";
      document.getElementById('testo').innerHTML = "Compilare i campi:";
      document.getElementById('form').style.display = "inline-block";
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
      document.getElementById('btn-scanner').style.display = "inline-block";
    } else if (result.stato === 'yellow') {
      document.body.style.backgroundColor = '#fed627'; // Giallo
      document.getElementById('nome-cognome').innerHTML = `${result.name} ${result.cognome}`;
      document.getElementById('message').innerHTML = "OMAGGIO";
      if (result.drink !== undefined) {
        document.getElementById('testo').innerHTML = `Drink ${result.drink}`;
      }
      document.getElementById('btn-scanner').style.display = "inline-block";
    }
  }
  
  async function updateData() {
    document.getElementById('invalid-CF').style.display = "none";
    document.getElementById('invalid-residenza').style.display = "none";
    document.getElementById('invalid-email').style.display = "none";
    document.getElementById('invalid-telefono').style.display = "none";
  
    if (isInputValid(checkCf, checkResidenza, checkEmail, checkTelefono)) {
      document.getElementById('message').innerHTML = "Sto mandando i dati... <br>";
      document.getElementById('testo').style.display = "none";
      document.getElementById('form').style.display = "none";
      const result = await addCfResidenza();
      console.log(result);
      if (result.status == 200) {
        document.getElementById('message').innerHTML = "Dati inviati con successo <br>";
      } else {
        console.log("errore addCfResidenza");
        document.getElementById('message').innerHTML = "Errore Nell'invio dei dati, riprova <br>";
      }
    }
  }
  
  function isInputValid(cf, residenza, email, telefono) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const CFpattern = /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;
  
    if (cf) {
      if (document.getElementById('input-CF').value === "") {
        return false;
      }
      if (document.getElementById('input-CF').value.search(CFpattern) === -1) {
        document.getElementById('invalid-CF').innerHTML = "Formato non valido";
        document.getElementById('invalid-CF').style.display = "inline-block";
        return false;
      }
    }
    if (residenza) {
      if (document.getElementById('input-residenza').value === "") {
        return false;
      }
    }
    if (email) {
      if (document.getElementById('input-email').value === "") {
        return false;
      } else if (!emailPattern.test(document.getElementById('input-email').value)) {
        document.getElementById('invalid-email').innerHTML = "Formato email non valido";
        document.getElementById('invalid-email').style.display = "inline-block";
        return false;
      }
    }
    if (telefono) {
      if (document.getElementById('input-telefono').value === "") {
        return false;
      } else if (document.getElementById('input-telefono').value.length < 10) {
        document.getElementById('invalid-telefono').innerHTML = "Numero di telefono non valido (meno di 10 cifre)";
        document.getElementById('invalid-telefono').style.display = "inline-block";
        return false;
      } else if (document.getElementById('input-telefono').value.length > 10) {
        document.getElementById('invalid-telefono').innerHTML = "Numero di telefono non valido (più di 10 cifre)";
        document.getElementById('invalid-telefono').style.display = "inline-block";
        return false;
      }
    }
    return true;
  }
  
  function reloadScan() {
    location.reload();
    //window.open("https://script.google.com/macros/s/AKfycbyxS8JAJJ_AIw88g-DUgHxfNRE8OdArgdVr5LRZAzTk/dev",'_top');
  }
  
  async function check_qr(uid) {
    //const response = await fetch('http://localhost:3000/check_qr', {
    const response = await fetch('https://circolo-server-private.onrender.com/check_qr', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: uid })
    });
    const res = await response.json();
    return res;
  }
  
  async function addCfResidenza() {
    //const response = await fetch('http://localhost:3000/update_data', {
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
    const res = await response.json();
    return res;
  }
  