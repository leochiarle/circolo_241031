

let checkoutId;
let result;
let totPerson;

async function initialization(){
  const urlParams = new URLSearchParams(window.location.search);
  checkoutId = urlParams.get('session_id');
  totPerson = localStorage.getItem("totPerson")

  sheetdb();

  localStorage.clear();
}


function sheetdb(){
  console.log(totPerson)
  for(let i = 0; i < totPerson; i++){
    console.log(i)
    fetch('https://sheetdb.io/api/v1/fu50bgf6xw2j9', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          data: [{
                  "Date": localStorage.getItem("Date"),
                  "Nome": localStorage.getItem(`Nome${i}`),
                  "Cognome": localStorage.getItem(`Cognome${i}`),
                  "Email": localStorage.getItem(`Email${i}`),
                  "Telefono": localStorage.getItem(`Telefono${i}`),
                  "canale_di_vendita": localStorage.getItem(`Canale${i}`),
                  "valore_in_euro": localStorage.getItem(`Valore${i}`),
                  "Metodo di Pagamento": "stripe"
              }]
      })
    })
    .then((response) => response.json())
    .then((data) => console.log(data));
  }
}



