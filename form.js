
let friendAdded = 0;
let totPerson = 1;
const link5 = "https://pay.sumup.com/b2c/Q5ACLDVZ"; //10
const link10 = "https://pay.sumup.com/b2c/QNCWRBHR"; //20
const link15 = "https://pay.sumup.com/b2c/Q038L7V3"; //30
const link20 = "https://pay.sumup.com/b2c/QEOXEFK9"; //40
const link25 = "https://pay.sumup.com/b2c/QYKT3G65"; //50
const link30 = "https://pay.sumup.com/b2c/Q8I71GMC"; //60

let linkPagamento = link5;

function initialization(){
  //sizeStyle();
  /*
  let insta = navigator.userAgent.includes("Instagram");
  const isAndroid = navigator.userAgent.toLowerCase().includes('android');
  console.log(`The user is on an Android: ${isAndroid}`);
  if(insta && isAndroid){
    document.getElementById("instagram").style.display = "inline-block";
  }
  */
  const urlParams = new URLSearchParams(window.location.search);
  const canaleDiVendita = urlParams.get('ncdhsdskfdnd');
  const valoreInEuro = urlParams.get('riekndaocno');

  document.getElementById('vendita').value = canaleDiVendita;
  document.getElementById('valore').value = valoreInEuro;

  window.history.pushState('page2', 'Title', window.location.href.split('?')[0]);
  /**/

  const form = document.getElementById('sheetdb-form');
  form.addEventListener("submit", function(e) {
    var d = new Date();

    const ora = `${d.getHours()}`+"."+`${d.getMinutes()}`+"."+`${d.getSeconds()}`;
    var date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ` + ora;

    document.getElementById('Date').value = date;
    //e.preventDefault();
    window.open(linkPagamento, '_blank');
    /*
    
    const data = new FormData(form);
    console.log(data);
    fetch("https://script.google.com/macros/s/AKfycbyxS8JAJJ_AIw88g-DUgHxfNRE8OdArgdVr5LRZAzTk/dev", {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    })
    .then(() => {
      window.open(linkPagamento, '_blank'); 
      alert("Dati inviati con successo!");
    })
    e.preventDefault();
    */
  });
}

/*
async function fetchData(){
  try{
    const response = await fetch("https://sheetdb.io/api/v1/70kkrjloojdhb");

    if(!response.ok){
      throw new Error("Errore nella ricezione dei dati");
    }

    const data = await response.json();

    console.log(data);

  }catch(e){
    console.log(e);
  }
}
*/

function addFriend(){
    friendAdded++;
    totPerson++;

    let newFormFriend = document.createElement("div");

    newFormFriend.id = `formFriend${friendAdded}`;

    newFormFriend.innerHTML = `<p id="friendNumber${friendAdded}" class="mt-5 mb-3 fw-bold fs-5">Friend number ${friendAdded}:</p>`;
    let a = `<div id="row-nome${friendAdded}" class="row">
              <div id="Nome${friendAdded}">
                <label for="validationDefault01" class="form-label"></label>
                <input type="text" class="form-control" name="Nome${friendAdded}" placeholder="Nome" id="validationDefault01" value="" required>
              </div>
            </div>
            <div id="row-cognome${friendAdded}" class="row">
              <div id="Cognome${friendAdded}" class="">
                <label for="validationDefault02" class="form-label"></label>
                <input type="text" class="form-control" name="Cognome${friendAdded}" placeholder="Cognome" id="validationDefault02" value="" required>
              </div>
            </div>
            <div id="Email${friendAdded}" class="row">
              <div class="">
                <label for="validationDefaultUsername" class="form-label"></label>
                <div class="input-group">
                  <span class="input-group-text" id="inputGroupPrepend2">@</span>
                  <input type="email" class="form-control" name="Email${friendAdded}" placeholder="Email" id="validationDefaultUsername" aria-describedby="inputGroupPrepend2" required>
                </div>
              </div>
            </div>
            <div id="phoneNumbe${friendAdded}" class="row">
              <div id="Phone" class="mb-3">
                <label for="validationDefault03" class="form-label"></label>
                <div class="input-group">
                  <span class="input-group-text" id="inputGroupPrepend3">+39</span>
                  <input type="tel" class="form-control" name="Telefono${friendAdded}" placeholder="Telefono" id="validationDefault03" aria-describedby="inputGroupPrepend3" required>
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

    pagamento();
    //sizeStyle();
}
/*
function pagamento(){
  window.location.href = linkPagamento;
}
*/
function removeFriend() {
    document.getElementById(`formFriend${friendAdded}`).remove();
    friendAdded--;
    totPerson--;

    if (friendAdded === 0) {
        document.getElementById("btn-removeFriend").style.display = "none";
    }else if(friendAdded === 4){
      document.getElementById("btn-addFriend").style.display = "inline-block";
    }

    pagamento();
}

/*
function sizeStyle(){
  if(window.innerWidth < 576){
    //document.getElementById("row-nome").classList.remove("row");
    //document.getElementById("row-cognome").classList.remove("row");
    //document.getElementById('Nome').classList.add('mx-5');
    //document.getElementById('Cognome').classList.add('mx-5');
    //document.getElementById("phoneNumber").classList.remove("row");
    //document.getElementById('Phone').classList.add('mx-5');
    for(let i = friendAdded; i > 0; i--){
      //document.getElementById(`row-nome${i}`).classList.remove("row");
      //document.getElementById(`row-cognome${i}`).classList.remove("row");
      //document.getElementById(`Nome${i}`).classList.add('mx-5');
      //document.getElementById(`Cognome${i}`).classList.add('mx-5');
      //document.getElementById(`phoneNumber${i}`).classList.remove("row");
      //document.getElementById(`Phone${i}`).classList.add('mx-5');
    }
  }else if(window.innerWidth >= 576){
    //document.getElementById("row-nome").classList.add("row");
    //document.getElementById("row-cognome").classList.add("row");
    //document.getElementById('Nome').classList.remove('mx-5');
    //document.getElementById('Cognome').classList.remove('mx-5');
    //document.getElementById("phoneNumber").classList.add("row");
    //document.getElementById('Phone').classList.remove('mx-5');
    for(let i = friendAdded; i > 0; i--){
      //document.getElementById(`row-nome${i}`).classList.add("row");
      //document.getElementById(`row-cognome${i}`).classList.add("row");
      //document.getElementById(`Nome${i}`).classList.remove('mx-5');
      //document.getElementById(`Cognome${i}`).classList.remove('mx-5');
      //document.getElementById(`phoneNumber${i}`).classList.add("row");
      //document.getElementById(`Phone${i}`).classList.remove('mx-5');
    }
  }
}


window.addEventListener('resize', function(event) {
  sizeStyle();
});
*/

function pagamento(){
  if(totPerson === 1){
    linkPagamento = link5;
  }else if(totPerson === 2){
    linkPagamento = link10;
  }else if(totPerson === 3){
    linkPagamento = link15;
  }else if(totPerson === 4){
    linkPagamento = link20;
  }else if(totPerson === 5){
    linkPagamento = link25;
  }else if(totPerson === 6){
    linkPagamento = link30;
  }
}

/*
cerca di inviare i dati al google sheet in modo diverso cosi' da poter mettere nell'attributo action del form il link di pagamento

non puoi aprire il link di pagamento direttamente da apps script perche' non sai che link aprire
*/


/*
function paga(){
  window.location = linkPagamento;
  //window.open(linkPagamento,'_parent',''); 
  window.close();
  return false;
}
*/

/*
{
  "application_type": "web",
  "client_id": "cc_classic_3VBCzfd6xdNxR5BdrlWsAyP95SeYZ",
  "client_secret": "cc_sk_classic_F6HEKbAdRXUEKZLNQDtYdPVZej1hjSAGZmoDzRdWvtkjx6EXso",
  "cors_uris": [
    ""
  ],
  "id": "CCCNPS42D",
  "name": "Registrazione Eventi",
  "redirect_uris": [
    "https://leo312002.github.io/FormGabbo/"
  ]
}


const axios = require('axios');

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const response = await axios.post('https://api.sumup.com/token', params, {
    auth: {
      username: "cc_classic_3VBCzfd6xdNxR5BdrlWsAyP95SeYZ",
      password: "cc_sk_classic_F6HEKbAdRXUEKZLNQDtYdPVZej1hjSAGZmoDzRdWvtkjx6EXso"
    }
  });

  return response.data.access_token;
}



async function createPaymentLink(amount, currency, description) {
    const accessToken = await getAccessToken();
  
    const response = await axios.post('https://api.sumup.com/v0.1/me/payment-links', {
      amount: amount,
      currency: currency,
      description: description
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  
    return response.data.short_url;
  }
  
*/
/*
// Funzione per creare il checkout
async function initializePayment() {
  try {
    // Effettua una chiamata al tuo server per ottenere un checkoutId
    const response = await fetch('/create-checkout');
    const data = await response.json();
    const checkoutId = data.checkoutId;

    // Inizializza il widget SumUp
    SumUpCard.mount({
      checkoutId: checkoutId,
      onResponse: function (type, body) {
        if (type === 'success') {
          // Pagamento completato con successo
          window.location.href = '/successo';
        } else {
          // Gestione degli errori
          alert('Errore durante il pagamento: ' + body.error.message);
        }
      },
    });
  } catch (error) {
    console.error('Errore durante l\'inizializzazione del pagamento:', error);
  }
}

// Chiama la funzione per inizializzare il pagamento
initializePayment();
*/




