if (document.title === "DIG | Home"){
  let botonRead = document.querySelector("#readMore")
  botonRead.addEventListener("click", ()=> {
    if (botonRead.innerText === "Read More") {
      botonRead.innerText = "Read Less"
    }else{
      botonRead.innerText = "Read More"
    }
  })
}
let changeId = document.querySelector("#tabla-senate") ? "senate" : "house"

let endpoint = `https://api.propublica.org/congress/v1/113/${changeId}/members.json`

let init = {
    method: "GET",
    headers: {
        "X-API-Key": "SgE9Qy6xdghWDiPrZHSRNSn7lxhUFHlD3JeBaMHQ"
    }
  }
   
  fetch(endpoint, init)
  .then(api => api.json())
  .then(datas => {  
    myProgram(datas)
  })
  
  function myProgram(data){
    


let miembro = data.results[0].members;
let cuerpoTabla = document.querySelector(`#tabla-${changeId}  tbody`);

function republicMembers(miembros) {
  
  cuerpoTabla.innerHTML = "";
  miembros.forEach((miembro) => {
   

    
    let segundoNombre = `${miembro.middle_name ? miembro.middle_name : ""}`;
    cuerpoTabla.innerHTML += `
    <tr>  
    <td class="border border-2 border-dark text-center"><a target="_blank" href=${miembro.url}>${miembro.first_name} ${segundoNombre} ${miembro.last_name} </a></td>
    <td class="border border-2 border-dark text-center">${miembro.party}</td>
    <td class="border border-2 border-dark text-center">${miembro.state}</td>
    <td class="border border-2 border-dark text-center">${miembro.seniority}</td>
    <td class="border border-2 border-dark text-center">${miembro.votes_with_party_pct} %</td>
    </tr>`;
   
  });
}

republicMembers(miembro);

function noRepetirState(array) {
  let mostrarState = [];

  array.forEach((miembros) => {
    if (!mostrarState.includes(miembros.state)) {
      mostrarState.push(miembros.state);
    }
  });

  return mostrarState;
}

let select = document.querySelector("#select");

let state = noRepetirState(miembro).sort();

function mostrarState(array) {
  state.forEach((estado) => {
    select.innerHTML += `<option value="${estado}">${estado}</option>`;
  });
}

// Imprimiendo select
mostrarState(miembro);

select.addEventListener("change", filtroState);

function filtroState() {
  let div = document.querySelector('#alerta')
  let selectState;
  if (select.value != "All State") {
    selectState = miembro.filter((miembro) => miembro.state === select.value);
  } else {
    selectState = miembro;
  }
  
  selectState = selectState.filter(miembro => box.includes(miembro.party))

  if (selectState.length) {
    div.innerHTML = ""
    republicMembers(selectState);
  }else {
    cuerpoTabla.innerHTML = ""
    div.innerHTML += `
    <div class="alert alert-warning" role="alert">
    ¡Upss! No search results</div>`
  }
}

//CheckBox

let box = ["R", "D", "ID"];

let check = document.querySelectorAll("input[type='checkbox']");

let arrayCheck = Array.from(check);

arrayCheck.forEach((check) => {

    check.addEventListener("change", evento => {

    let select = evento.target.value;
    let checkOk = evento.target.checked 

    if (box.includes(select) && !checkOk) {
      box = box.filter(elemento => elemento != select)
    }else{
      box.push(select)
    }
    filtroState()

  });
});
}


 /* if (document.title === "DIG | Home") {
    // Boton de index.html
    const readMore = document.querySelector("#readMore");
    readMore.addEventListener("click", () => {
      if (readMore.innerText === "Read more") {
        readMore.innerText = "Hide text";
      } else {
        readMore.innerText = "Read more";
      }
    });
  }*/