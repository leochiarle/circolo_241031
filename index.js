let friendAdded = 0;
let totPerson = 1;
const prezzo = 20;
let canaleDiVendita, valoreInEuro;
const stripe = Stripe('pk_live_51QAv6nBlOJumB3TbwzRFO14tmTkgA5QUj0FWnxCbF78IVvfg2LoPlH3yxvQmKn0ofSlocgjTrmHspbKKrxMC9Awq00VKm3xvdu');

async function initialization() {
  const urlParams = new URLSearchParams(window.location.search);
  canaleDiVendita = urlParams.get('src');
  valoreInEuro = urlParams.get('riekndaocno');

  document.getElementById('vendita').value = canaleDiVendita;
  document.getElementById('valore').value = valoreInEuro;

  if (document.getElementById('vendita').value === "") {
    document.getElementById('vendita').value = "circololimoni";
    canaleDiVendita = "circololimoni";
  }

  // Clean the URL
  window.history.pushState('page2', 'Title', window.location.href.split('?')[0]);
}

/**
 * Generate UID the same way your Apps Script does.
 * 1) firstCharNome + firstCharCognome + base36( sumCharCodes( Nome+Cognome+Email+Telefono ) ) => 5 digits
 */

function generateUID(nome, cognome, email, telefono) {
  const firstCharNome = nome.charAt(0).toUpperCase();     
  const firstCharCognome = cognome.charAt(0).toUpperCase();
  const concatenated = nome + cognome + email + telefono;

  // Sum of char codes
  let sumCharCodes = 0;
  for (let j = 0; j < concatenated.length; j++) {
    sumCharCodes += concatenated.charCodeAt(j);
  }

  // mod 60466176
  const modResult = sumCharCodes % 60466176;

  // Base36 + pad to 5
  const base36Str = modResult.toString(36).toUpperCase().padStart(5, '0');

  // Final
  return firstCharNome + firstCharCognome + base36Str;
}

/**
 * Triggered by the "Procedi al pagamento" button.
 */
function payment() {
  // Clear previous error messages
  for (let i = 0; i < totPerson; i++) {
    // If you have invalid-nome, invalid-cognome, etc., reset them here
    const invalidNome = document.getElementById(`invalid-nome${i}`);
    const invalidCognome = document.getElementById(`invalid-cognome${i}`);
    const invalidEmail = document.getElementById(`invalid-email${i}`);
    const invalidTelefono = document.getElementById(`invalid-telefono${i}`);

    if (invalidNome) invalidNome.style.display = "none";
    if (invalidCognome) invalidCognome.style.display = "none";
    if (invalidEmail) invalidEmail.style.display = "none";
    if (invalidTelefono) invalidTelefono.style.display = "none";
  }

  // Validate inputs
  if (isInputValid()) {
    document.getElementById('Date').value = dateNow();
    // Remove form elements
    document.getElementById("friends-button").remove();
    document.getElementById("pagamento").remove();
    document.getElementById("title").style.display = "none";
    document.getElementById("sheetdb-form").style.display = "none";

    // Save data to localStorage
    saveFormData();

    // Post (UID + DEVE PAGARE) to SheetDB for each person
    postUnpaidRows()
      .then(() => {
        // Then create embedded Checkout
        createCheckout();
      })
      .catch((err) => console.error("Error posting data: ", err));
  }
}

/**
 * Create a row with "UID" + "DEVE PAGARE" for each person.
 */
async function postUnpaidRows() {
  // We'll wait for all fetches to complete
  for (let i = 0; i < totPerson; i++) {
    const nome = localStorage.getItem(`Nome${i}`);
    const cognome = localStorage.getItem(`Cognome${i}`);
    const email = localStorage.getItem(`Email${i}`);
    const telefono = localStorage.getItem(`Telefono${i}`);

    // If we haven't generated a UID yet, do it now
    let uid = generateUID(nome, cognome, email, telefono);
    localStorage.setItem(`UID${i}`, uid);
    localStorage.setItem(`Valore${i}`, prezzo);

    const postBody = {
      data: [
        {
          "Date": localStorage.getItem("Date"),
          "UID": uid,
          "Nome": nome,
          "Cognome": cognome,
          "Email": email,
          "Telefono": telefono,
          "canale_di_vendita": localStorage.getItem(`Canale${i}`),
          "valore_in_euro": "DEVE PAGARE",
          "Metodo di Pagamento": "",
          "carnevale": "",
          "registration_time": localStorage.getItem("Date"),
          "source": "new",
          "First Event": "250301"
        }
      ]
    };

    const response = await fetch('https://sheetdb.io/api/v1/fu50bgf6xw2j9', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    });
    const data = await response.json();
    console.log("Posted unpaid row #", i, data);
  }
}


/**
 * Validates all required fields (Nome, Cognome, Email, Telefono)
 * and shows appropriate error messages if something is missing/invalid.
 */
function isInputValid() {
  const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  for (let i = 0; i < totPerson; i++) {
    const nomeVal = document.getElementById(`input-nome${i}`).value.trim();
    const cognomeVal = document.getElementById(`input-cognome${i}`).value.trim();
    const emailVal = document.getElementById(`input-email${i}`).value.trim();
    const telefonoVal = document.getElementById(`input-telefono${i}`).value.trim();

    // Get references to "invalid" message containers
    const invalidNome = document.getElementById(`invalid-nome${i}`);
    const invalidCognome = document.getElementById(`invalid-cognome${i}`);
    const invalidEmail = document.getElementById(`invalid-email${i}`);
    const invalidTelefono = document.getElementById(`invalid-telefono${i}`);

    // Check Nome
    if (!nomeVal) {
      if (invalidNome) {
        invalidNome.innerText = "Il campo Nome è obbligatorio";
        invalidNome.style.display = "inline-block";
      }
      return false;
    }

    // Check Cognome
    if (!cognomeVal) {
      if (invalidCognome) {
        invalidCognome.innerText = "Il campo Cognome è obbligatorio";
        invalidCognome.style.display = "inline-block";
      }
      return false;
    }

    // Check Email
    if (!emailVal) {
      if (invalidEmail) {
        invalidEmail.innerText = "Il campo Email è obbligatorio";
        invalidEmail.style.display = "inline-block";
      }
      return false;
    } else if (!emailPattern.test(emailVal)) {
      if (invalidEmail) {
        invalidEmail.innerText = "Formato email non valido";
        invalidEmail.style.display = "inline-block";
      }
      return false;
    } else if (existEmail(emailVal, i)) {
      if (invalidEmail) {
        invalidEmail.innerText = "Hai già inserito questa email";
        invalidEmail.style.display = "inline-block";
      }
      return false;
    }

    // Check Telefono
    if (!telefonoVal) {
      if (invalidTelefono) {
        invalidTelefono.innerText = "Il campo Telefono è obbligatorio";
        invalidTelefono.style.display = "inline-block";
      }
      return false;
    } else if (existTelefono(telefonoVal, i)) {
      if (invalidTelefono) {
        invalidTelefono.innerText = "Hai già inserito questo numero di telefono";
        invalidTelefono.style.display = "inline-block";
      }
      return false;
    } else if (telefonoVal.length < 10) {
      if (invalidTelefono) {
        invalidTelefono.innerText = "Numero di telefono non valido (meno di 10 cifre)";
        invalidTelefono.style.display = "inline-block";
      }
      return false;
    } else if (telefonoVal.length > 10) {
      if (invalidTelefono) {
        invalidTelefono.innerText = "Numero di telefono non valido (più di 10 cifre)";
        invalidTelefono.style.display = "inline-block";
      }
      return false;
    }
  }
  return true;
}

/** 
 * Check if the email has already been entered for another friend 
 */
function existEmail(email, index) {
  for (let i = 0; i < index; i++) {
    if (document.getElementById(`input-email${i}`).value.trim() === email) {
      return true;
    }
  }
  return false;
}

/** 
 * Check if the phone number has already been entered for another friend 
 */
function existTelefono(telefono, index) {
  for (let i = 0; i < index; i++) {
    if (document.getElementById(`input-telefono${i}`).value.trim() === telefono) {
      return true;
    }
  }
  return false;
}

/**
 * Dynamically adds a friend's form. (No CF/Residenza fields)
 */
function addFriend() {
  friendAdded++;
  totPerson++;

  const newFormFriend = document.createElement("div");
  newFormFriend.id = `formFriend${friendAdded}`;

  newFormFriend.innerHTML = `
    <p id="friendNumber${friendAdded}" class="mt-5 mb-3 fw-bold fs-5">Amicə ${friendAdded}:</p>
    <div id="row-nome${friendAdded}" class="row">
      <div id="Nome${friendAdded}">
        <label class="form-label"></label>
        <input
          id="input-nome${friendAdded}"
          type="text"
          class="form-control"
          name="Nome${friendAdded}"
          placeholder="Nome"
          required
        />
      </div>
      <div id="invalid-nome${friendAdded}" class="invalid" style="display: none;"></div>
    </div>
    <div id="row-cognome${friendAdded}" class="row">
      <div id="Cognome${friendAdded}" class="">
        <label class="form-label"></label>
        <input
          id="input-cognome${friendAdded}"
          type="text"
          class="form-control"
          name="Cognome${friendAdded}"
          placeholder="Cognome"
          required
        />
      </div>
      <div id="invalid-cognome${friendAdded}" class="invalid" style="display: none;"></div>
    </div>
    <div id="Email${friendAdded}" class="row">
      <div class="">
        <label class="form-label"></label>
        <div class="input-group">
          <span class="input-group-text">@</span>
          <input
            id="input-email${friendAdded}"
            type="email"
            class="form-control"
            name="Email${friendAdded}"
            placeholder="Email"
            required
          />
        </div>
      </div>
      <div id="invalid-email${friendAdded}" class="invalid ms-3 ps-5" style="display: none;"></div>
    </div>
    <div id="phoneNumber${friendAdded}" class="row mb-4">
      <div id="Phone${friendAdded}" class="">
        <label class="form-label"></label>
        <div class="input-group">
          <span class="input-group-text">+39</span>
          <input
            id="input-telefono${friendAdded}"
            type="tel"
            class="form-control"
            name="Telefono${friendAdded}"
            placeholder="Telefono"
            required
          />
        </div>
      </div>
      <div id="invalid-telefono${friendAdded}" class="invalid ms-3 ps-5" style="display: none;"></div>
    </div>
    <!-- CF and Residenza fields removed. -->
  `;

  document.getElementById("formFriend").append(newFormFriend);

  // Show "remove friend" button if there's at least one friend
  if (friendAdded === 1) {
    document.getElementById("btn-removeFriend").style.display = "inline-block";
  }
  // Hide "add friend" button if we reach 5
  else if (friendAdded === 5) {
    document.getElementById("btn-addFriend").style.display = "none";
  }
}

/**
 * Remove the last friend added.
 */
function removeFriend() {
  document.getElementById(`formFriend${friendAdded}`).remove();
  friendAdded--;
  totPerson--;

  if (friendAdded === 0) {
    document.getElementById("btn-removeFriend").style.display = "none";
  } else if (friendAdded === 4) {
    document.getElementById("btn-addFriend").style.display = "inline-block";
  }
}

//Save user data to localStorage
function saveFormData() {
  localStorage.setItem("totPerson", totPerson);
  localStorage.setItem("Date", dateNow());

  for (let i = 0; i < totPerson; i++) {
    localStorage.setItem(`Nome${i}`, document.getElementById(`input-nome${i}`).value.trim());
    localStorage.setItem(`Cognome${i}`, document.getElementById(`input-cognome${i}`).value.trim());
    localStorage.setItem(`Email${i}`, document.getElementById(`input-email${i}`).value.trim());
    localStorage.setItem(`Telefono${i}`, document.getElementById(`input-telefono${i}`).value.trim());
    localStorage.setItem(`Canale${i}`, document.getElementById('vendita').value);
    localStorage.setItem(`Valore${i}`, document.getElementById('valore').value);
  }
}

function dateNow() {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`;
}

/**
 * Initialize and mount Stripe's Embedded Checkout
 */
async function createCheckout() {
  try {
    const fetchClientSecret = async () => {
      const response = await fetch("https://circolo-server-private.onrender.com/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totPerson })
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    };

    const checkout = await stripe.initEmbeddedCheckout({ fetchClientSecret });
    checkout.mount('#checkout');
  } catch (error) {
    console.log(error);
  }
}