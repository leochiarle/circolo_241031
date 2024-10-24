
/*
let linkPagamento = link5;
const link5 = "https://pay.sumup.com/b2c/Q5ACLDVZ"; //10
const link10 = "https://pay.sumup.com/b2c/QNCWRBHR"; //20
const link15 = "https://pay.sumup.com/b2c/Q038L7V3"; //30
const link20 = "https://pay.sumup.com/b2c/QEOXEFK9"; //40
const link25 = "https://pay.sumup.com/b2c/QYKT3G65"; //50
const link30 = "https://pay.sumup.com/b2c/Q8I71GMC"; //60
*/

let friendAdded = 0;
let totPerson = 1;
const prezzo = 15;
let CardSumUp;
const idCheckOut = 'ID_UNICO_' + Date.now();
let checkoutData;
let checkoutID;
let canaleDiVendita, valoreInEuro;
//const stripe = Stripe('pk_test_51QAv6nBlOJumB3Tb4czFvyfDoho7mf8pFnS1GKHhoxygr18cvwBEzNZTnsAo2zFREw5ShDy9bDGAdXC4JENUy3SH00cyYldY4e');
const stripe = Stripe('pk_live_51QAv6nBlOJumB3TbwzRFO14tmTkgA5QUj0FWnxCbF78IVvfg2LoPlH3yxvQmKn0ofSlocgjTrmHspbKKrxMC9Awq00VKm3xvdu');


function initialization(){
  /*
  let insta = navigator.userAgent.includes("Instagram");
  const isAndroid = navigator.userAgent.toLowerCase().includes('android');
  if(insta && isAndroid){
    document.getElementById("instagram").style.display = "inline-block";
  }
  */
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
  if(!isInputEmpty()){

    //checkoutID = createCheckout();
    document.getElementById('Date').value = dateNow();

    document.getElementById("friends-button").remove();
    document.getElementById("pagamento").remove();

    document.getElementById("title").style.display = "none";
    document.getElementById("sheetdb-form").style.display = "none";
    
    saveFormData();
    
    sheetdb();
    initialize();

    //document.getElementById("pay-with-satispay").style.display = "inline-block";
/*
    var satispay = SatispayWebButton.configure({
      paymentId: '8f27fbbc-ff4b-45eb-98d0-1cadb3a0afaa',
      completed: function() {
        // executed on payment success or failure
      }
    })
    
    document.getElementById('pay-with-satispay').addEventListener('click', function(e) {
      e.preventDefault()
      satispay.open()
    })
*/
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
    fetch('https://sheetdb.io/api/v1/70kkrjloojdhb', {
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

async function initialize() {
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


function isInputEmpty(){
  for(let i = 0; i < totPerson; i++){
    if(document.getElementById(`input-nome${i}`).value === "" || document.getElementById(`input-cognome${i}`).value === "" || document.getElementById(`input-email${i}`).value === "" || document.getElementById(`input-telefono${i}`).value === ""){
      return true;
    }
  }
  return false;
}

function addFriend(){
    friendAdded++;
    totPerson++;

    let newFormFriend = document.createElement("div");

    newFormFriend.id = `formFriend${friendAdded}`;

    newFormFriend.innerHTML = `<p id="friendNumber${friendAdded}" class="mt-5 mb-3 fw-bold fs-5">Friend number ${friendAdded}:</p>`;
    let a = `<div id="row-nome${friendAdded}" class="row">
              <div id="Nome${friendAdded}">
                <label for="validationDefault01" class="form-label"></label>
                <input id="input-nome${friendAdded}" type="text" class="form-control" name="Nome${friendAdded}" placeholder="Nome" id="validationDefault01" required>
              </div>
            </div>
            <div id="row-cognome${friendAdded}" class="row">
              <div id="Cognome${friendAdded}" class="">
                <label for="validationDefault02" class="form-label"></label>
                <input id="input-cognome${friendAdded}" type="text" class="form-control" name="Cognome${friendAdded}" placeholder="Cognome" id="validationDefault02" required>
              </div>
            </div>
            <div id="Email${friendAdded}" class="row">
              <div class="">
                <label for="validationDefaultUsername" class="form-label"></label>
                <div class="input-group">
                  <span class="input-group-text" id="inputGroupPrepend2">@</span>
                  <input id="input-email${friendAdded}" type="email" class="form-control" name="Email${friendAdded}" placeholder="Email" id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required>
                </div>
              </div>
            </div>
            <div id="phoneNumbe${friendAdded}" class="row">
              <div id="Phone" class="mb-3">
                <label for="validationDefault03" class="form-label"></label>
                <div class="input-group">
                  <span class="input-group-text" id="inputGroupPrepend3">+39</span>
                  <input id="input-telefono${friendAdded}" type="tel" class="form-control" name="Telefono${friendAdded}" placeholder="Telefono" id="validationDefault03" aria-describedby="inputGroupPrepend3" required>
                </div>
              </div>
            </div>`;

    newFormFriend.innerHTML += a;

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

