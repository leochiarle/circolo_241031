

let canaleDiVendita, valoreInEuro;

function initialization(){

  const urlParams = new URLSearchParams(window.location.search);
  canaleDiVendita = urlParams.get('src');
  valoreInEuro = urlParams.get('riekndaocno');

  document.getElementById('vendita').value = canaleDiVendita;
  document.getElementById('valore').value = valoreInEuro;

  window.history.pushState('page2', 'Title', window.location.href.split('?')[0]);
}

function dateNow(){
  var d = new Date();

  const ora = `${d.getHours()}`+"."+`${d.getMinutes()}`+"."+`${d.getSeconds()}`;
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ` + ora;
}

function payment(){

  //document.getElementById(`invalid-email0`).style.display = "none";
  document.getElementById(`invalid-telefono0`).style.display = "none";

  if(isInputValid()){
    document.getElementById('Date').value = dateNow();
    
    document.getElementById("title").style.display = "none";
    document.getElementById("sheetdb-form").style.display = "none";
    
    sheetdb();

    document.getElementById("risposta").style.display = "inline-block";
  }
}


function sheetdb(){
  let res
  fetch('https://sheetdb.io/api/v1/fu50bgf6xw2j9', {
     method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        data: [{
                "Date": document.getElementById("Date").value,
                "Nome": document.getElementById(`input-nome0`).value,
                "Cognome": document.getElementById(`input-cognome0`).value,
                "Email": document.getElementById(`input-email0`).value,
                "Telefono": document.getElementById(`input-telefono0`).value,
                "Metodo di Pagamento": "omaggio",
                "canale_di_vendita": "omaggio " + canaleDiVendita,
                "valore_in_euro": 0,
                "carnevale": "TRUE",
                "registration_time": document.getElementById("Date").value,
                "First Event": "250301"
            }]
    })
  })
  .then((response) => response.json())
  .then((data) => console.log(data));
  console.log(res)
  return res;
}

function isInputValid(){
  if(document.getElementById(`input-nome0`).value === "" || document.getElementById(`input-cognome0`).value === "" || document.getElementById(`input-email0`).value === "" || document.getElementById(`input-telefono0`).value === ""){
    return false;
  }else if((document.getElementById(`input-telefono0`).value).length < 10){
    document.getElementById(`invalid-telefono0`).innerHTML = "Numero di telefono non valido (meno di 10 cifre)"
    document.getElementById(`invalid-telefono0`).style.display = "inline-block";
    return false;
  }else if((document.getElementById(`input-telefono0`).value).length > 10){
    document.getElementById(`invalid-telefono0`).innerHTML = "Numero di telefono non valido (più di 10 cifre)"
    document.getElementById(`invalid-telefono0`).style.display = "inline-block";
    return false;
  }
  return true;
}

