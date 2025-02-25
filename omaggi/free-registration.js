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
// * saveFormData()
// * dateNow()

function initialization() {
    // Clean the URL if needed on your free registration
    window.history.pushState('page2', 'Title', window.location.href.split('?')[0]);
    document.getElementById('Date').value = dateNow();
}

async function registerFree() {
    // Clear previous error messages
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
        document.getElementById('Date').value = dateNow();
        saveFormData();  // Save to localStorage

        // Post directly to SheetDB
        postFreeRows()
            .then(() => {
                // Redirect to success page
                window.location.href = "free-success.html"; // Create this page!
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
        const canaleDiVendita = localStorage.getItem(`Canale${i}`);
        const valoreInEuro = "0"; // Or whatever value represents a free registration

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
                    "canale_di_vendita": canaleDiVendita,
                    "valore_in_euro": valoreInEuro,
                    "Metodo di Pagamento": "gratuito", // Good practice to track this
                    "carnevale": "",  //  Keep consistent
                    "registration_time": localStorage.getItem("Date"),
                    "source": "new", // Or adjust as needed
                    "First Event": "250301" // Or adjust
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