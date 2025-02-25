// free-registration.js

let friendAdded = 0;
let totPerson = 1;

// --- Reusable Functions (from your original index.js) ---
// Copy these functions *exactly* as they are from your original index.js:
// * generateUID(nome, cognome, email, telefono)
// * isInputValid()
// * existEmail(email, index)
// * existTelefono(telefono, index)
// * addFriend()
// * removeFriend()
// * saveFormData() //  Keep this, but we'll modify it slightly.
// * dateNow()

function initialization() {
    // Get the 'src' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let canaleDiVendita = urlParams.get('src');

    // Set a default value if 'src' is not present
    if (!canaleDiVendita) {
        canaleDiVendita = "circololimoni"; // Default value
    }

    // Set the hidden input field's value
    document.getElementById('vendita').value = canaleDiVendita;

    // Clean the URL (optional, but good practice)
    window.history.pushState('page2', 'Title', window.location.href.split('?')[0]);
    document.getElementById('Date').value = dateNow();

}
//Modified saveFormData
function saveFormData() {
    localStorage.setItem("totPerson", totPerson);
    localStorage.setItem("Date", dateNow());

    for (let i = 0; i < totPerson; i++) {
        localStorage.setItem(`Nome${i}`, document.getElementById(`input-nome${i}`).value.trim());
        localStorage.setItem(`Cognome${i}`, document.getElementById(`input-cognome${i}`).value.trim());
        localStorage.setItem(`Email${i}`, document.getElementById(`input-email${i}`).value.trim());
        localStorage.setItem(`Telefono${i}`, document.getElementById(`input-telefono${i}`).value.trim());
        //Use the value from the hidden input, which is now populated by initialization()
        localStorage.setItem(`Canale${i}`, document.getElementById('vendita').value);
        localStorage.setItem(`Valore${i}`, document.getElementById('valore').value); //Now using the hidden field.
    }
}

async function registerFree() {
    // Clear previous error messages (same as before)
    for (let i = 0; i < totPerson; i++) {
        const invalidNome = document.getElementById(`invalid-nome${i}`);
        const invalidCognome = document.getElementById(`invalid-cognome${i}`);
        const invalidEmail = document.getElementById(`invalid-email${i}`);
        const invalidTelefono = document.getElementById(`invalid-telefono${i}`);

        if (invalidNome) invalidNome.style.display = "none";
        if (invalidCognome) invalidCognome.style.display = "none";
        if (invalidEmail) invalidEmail.style.display = "none";
        if (invalidTelefono) invalidTelefono.style.display = "none";
    }

    if (isInputValid()) {
        document.getElementById('Date').value = dateNow(); // Redundant, but harmless.
        saveFormData();

        postFreeRows()
            .then(() => {
                window.location.href = "free-success.html";
            })
            .catch((err) => console.error("Error posting data: ", err));
    }
}

async function postFreeRows() {
    for (let i = 0; i < totPerson; i++) {
        const nome = localStorage.getItem(`Nome${i}`);
        const cognome = localStorage.getItem(`Cognome${i}`);
        const email = localStorage.getItem(`Email${i}`);
        const telefono = localStorage.getItem(`Telefono${i}`);
        const canaleDiVendita = localStorage.getItem(`Canale${i}`); // Get from localStorage
        const valoreInEuro = localStorage.getItem(`Valore${i}`); // Get from localStorage

        let uid = generateUID(nome, cognome, email, telefono);
        localStorage.setItem(`UID${i}`, uid);

        const postBody = {
            data: [
                {
                    "Date": localStorage.getItem("Date"),
                    "UID": uid,
                    "Nome": nome,
                    "Cognome": cognome,
                    "Email": email,
                    "Telefono": telefono,
                    "canale_di_vendita": canaleDiVendita, // Use the retrieved value
                    "valore_in_euro": valoreInEuro,
                    "Metodo di Pagamento": "gratuito",
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
        console.log("Posted free row #", i, data);
    }
}