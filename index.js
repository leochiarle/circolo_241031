

let friendAdded = 0;
let totPerson = 1;
const prezzo = 20;
let canaleDiVendita, valoreInEuro;
//const stripe = Stripe('pk_test_51QAv6nBlOJumB3Tb4czFvyfDoho7mf8pFnS1GKHhoxygr18cvwBEzNZTnsAo2zFREw5ShDy9bDGAdXC4JENUy3SH00cyYldY4e');
const stripe = Stripe('pk_live_51QAv6nBlOJumB3TbwzRFO14tmTkgA5QUj0FWnxCbF78IVvfg2LoPlH3yxvQmKn0ofSlocgjTrmHspbKKrxMC9Awq00VKm3xvdu');


async function initialization(){
  
  const urlParams = new URLSearchParams(window.location.search);
  canaleDiVendita = urlParams.get('ncdhsdskfdnd');
  valoreInEuro = urlParams.get('riekndaocno');

  document.getElementById('vendita').value = canaleDiVendita;
  document.getElementById('valore').value = valoreInEuro;

  if(document.getElementById('vendita').value == ""){
    document.getElementById('vendita').value = "circololimoni";
    canaleDiVendita = "circololimoni";
  }

  window.history.pushState('page2', 'Title', window.location.href.split('?')[0]);
}

function dateNow(){
  var d = new Date();

  const ora = `${d.getHours()}`+"."+`${d.getMinutes()}`+"."+`${d.getSeconds()}`;
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ` + ora;
}

function payment(){
  for(let i = 0; i < totPerson; i++){
    document.getElementById(`invalid-email${i}`).style.display = "none";
    document.getElementById(`invalid-telefono${i}`).style.display = "none";
  }

  if(isInputValid()){

    document.getElementById('Date').value = dateNow();

    document.getElementById("friends-button").remove();
    document.getElementById("pagamento").remove();

    document.getElementById("title").style.display = "none";
    document.getElementById("sheetdb-form").style.display = "none";
    
    saveFormData();
    sheetdb();
    createCheckout();

  }
}

/* perche' questo non funziona?
async function sheetdb() {
  //document.getElementById("btn-submit").click();
  console.log("entro")
  for(let i = 0; i < totPerson; i++){
    console.log("i: " + i)
    const fetchSheetDb = async () => {
      try{
        const response = await fetch("https://sheetdb.io/api/v1/70kkrjloojdhb", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({
              data: [{
                      "Nome": "Leo",
                      "Cognome": "chiarle",
                      "Email": "leo@gmail",
                      "Telefono": 3334
                    }]
          })
        });
      const ris = await response.json();
      console.log("finito")
    }catch(error){
      console.log(error);
    }};
  }
}
*/

function sheetdb(){
  for(let i = 0; i < totPerson; i++){
    fetch('https://sheetdb.io/api/v1/w9iqfm0vgapyk', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          data: [{
                  "Date": document.getElementById("Date").value,
                  "Nome": document.getElementById(`input-nome${i}`).value,
                  "Cognome": document.getElementById(`input-cognome${i}`).value,
                  "Email": document.getElementById(`input-email${i}`).value,
                  "Telefono": document.getElementById(`input-telefono${i}`).value,
                  "canale_di_vendita": canaleDiVendita,
                  "valore_in_euro": "DEVE PAGARE"
              }]
      })
    })
    .then((response) => response.json())
    .then((data) => console.log(data));
  }
}

async function createCheckout() {
  try{
    const fetchClientSecret = async () => {
      const response = await fetch("https://circolo-server-private.onrender.com/create-checkout-session", {
      //const response = await fetch("http://localhost:3000/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify({
          'totPerson': totPerson
        })
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    };

    // Initialize Checkout
    const checkout = await stripe.initEmbeddedCheckout({
      fetchClientSecret,
    });

    // Mount Checkout
    checkout.mount('#checkout');

  }catch(error){
    console.log(error);
  }
}

function saveFormData(){
  localStorage.setItem("totPerson", totPerson);
  console.log(localStorage.getItem("totPerson"))
  for(let i = 0; i < totPerson; i++){
    localStorage.setItem("Date", document.getElementById("Date").value),
    localStorage.setItem(`Nome${i}`, document.getElementById(`input-nome${i}`).value)
    localStorage.setItem(`Cognome${i}`, document.getElementById(`input-cognome${i}`).value)
    localStorage.setItem(`Email${i}`, document.getElementById(`input-email${i}`).value)
    localStorage.setItem(`Telefono${i}`, document.getElementById(`input-telefono${i}`).value)
    localStorage.setItem(`Canale${i}`, canaleDiVendita)
    localStorage.setItem(`Valore${i}`, prezzo)
  }
}


function isInputValid(){
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  for(let i = 0; i < totPerson; i++){
    if(document.getElementById(`input-nome${i}`).value === "" || document.getElementById(`input-cognome${i}`).value === "" || document.getElementById(`input-email${i}`).value === "" || document.getElementById(`input-telefono${i}`).value === ""){
      return false;
    }else if(emailPattern.test(document.getElementById(`input-email${i}`).value) == false){
      document.getElementById(`invalid-email${i}`).innerHTML = "Formato email non valido"
      document.getElementById(`invalid-email${i}`).style.display = "inline-block";
      return false;
    }else if(existEmail(document.getElementById(`input-email${i}`).value, i) == true){
      document.getElementById(`invalid-email${i}`).innerHTML = "Hai gia' inserito questa mail"
      document.getElementById(`invalid-email${i}`).style.display = "inline-block";
      return false;
    }else if(existTelefono(document.getElementById(`input-telefono${i}`).value, i) == true){
      document.getElementById(`invalid-telefono${i}`).innerHTML = "Hai gia' inserito questo numero di telefono"
      document.getElementById(`invalid-telefono${i}`).style.display = "inline-block";
      return false;
    }else if((document.getElementById(`input-telefono${i}`).value).length < 10){
      document.getElementById(`invalid-telefono${i}`).innerHTML = "Numero di telefono non valido (meno di 10 cifre)"
      document.getElementById(`invalid-telefono${i}`).style.display = "inline-block";
      return false;
    }else if((document.getElementById(`input-telefono${i}`).value).length > 10){
      document.getElementById(`invalid-telefono${i}`).innerHTML = "Numero di telefono non valido (più di 10 cifre)"
      document.getElementById(`invalid-telefono${i}`).style.display = "inline-block";
      return false;
    }
  }
  return true;
}

function existEmail(email, index){
  for(let i = 0; i < index; i++){
    if(document.getElementById(`input-email${i}`).value == email){
      return true
    }
  }
  return false;
}

function existTelefono(telefono, index){
  for(let i = 0; i < index; i++){
    if(document.getElementById(`input-telefono${i}`).value == telefono){
      return true
    }
  }
  return false;
}

function addFriend(){
    friendAdded++;
    totPerson++;

    let newFormFriend = document.createElement("div");
    newFormFriend.id = `formFriend${friendAdded}`;

    newFormFriend.innerHTML = `<p id="friendNumber${friendAdded}" class="mt-5 mb-3 fw-bold fs-5">Friend number ${friendAdded}:</p>
            <div id="row-nome${friendAdded}" class="row">
              <div id="Nome${friendAdded}">
                <label class="form-label"></label>
                <input id="input-nome${friendAdded}" type="text" class="form-control" name="Nome${friendAdded}" placeholder="Nome" required>
              </div>
              <div id="invalid-nome${friendAdded}" class="invalid" style="display: none;"></div>
            </div>
            <div id="row-cognome${friendAdded}" class="row">
              <div id="Cognome${friendAdded}" class="">
                <label for="validationDefault02" class="form-label"></label>
                <input id="input-cognome${friendAdded}" type="text" class="form-control" name="Cognome${friendAdded}" placeholder="Cognome" required>
              </div>
              <div id="invalid-cognome${friendAdded}" class="invalid" style="display: none;"></div>
            </div>
            <div id="Email${friendAdded}" class="row">
              <div class="">
                <label class="form-label"></label>
                <div class="input-group">
                  <span class="input-group-text">@</span>
                  <input id="input-email${friendAdded}" type="email" class="form-control" name="Email${friendAdded}" placeholder="Email" required>
                </div>
              </div>
              <div id="invalid-email${friendAdded}" class="invalid ms-3 ps-5" style="display: none;"></div>
            </div>
            <div id="phoneNumbe${friendAdded}" class="row mb-4">
              <div id="Phone" class="">
                <label class="form-label"></label>
                <div class="input-group">
                  <span class="input-group-text">+39</span>
                  <input id="input-telefono${friendAdded}" type="tel" class="form-control" name="Telefono${friendAdded}" placeholder="Telefono" required>
                </div>
              </div>
              <div id="invalid-telefono${friendAdded}" class="invalid ms-3 ps-5" style="display: none;"></div>
            </div>`;

    document.getElementById("formFriend").append(newFormFriend);

    if (friendAdded === 1) {
        document.getElementById("btn-removeFriend").style.display = "inline-block";
    }else if(friendAdded === 5){
      document.getElementById("btn-addFriend").style.display = "none";
    }
}


function removeFriend() {
    document.getElementById(`formFriend${friendAdded}`).remove();
    friendAdded--;
    totPerson--;

    if (friendAdded === 0) {
        document.getElementById("btn-removeFriend").style.display = "none";
    }else if(friendAdded === 4){
      document.getElementById("btn-addFriend").style.display = "inline-block";
    }
}

