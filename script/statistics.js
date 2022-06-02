//let members = data.results[0].members;

let changeId = document.querySelector("#masterId") ? "senate" : "house"
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
let members = data.results[0].members;    
let estadisticas = {
  democratas: [],
  republicanos: [],
  idependents: [],
};

estadisticas.democratas = members.filter((member) => member.party === "D");
estadisticas.republicanos = members.filter((member) => member.party === "R");
estadisticas.idependents = members.filter((member) => member.party === "ID");




function calcPromedio(array, propiedad) {
  let promedio = 0;
  let suma = 0;
  array.forEach((member) => {
    suma += member[propiedad];
  });
  let cantidad = array.length;

  promedio = suma / cantidad;

  return promedio.toFixed(2);
}

function imprimirGlance(objeto, idTabla) {
  const cuerpoTabla = document.querySelector(`#${idTabla} tbody`);
  let voto1 = Number(calcPromedio(objeto.democratas, "votes_with_party_pct"));
  let voto2 = Number(calcPromedio(objeto.republicanos, "votes_with_party_pct"));
  let voto3 = Number(calcPromedio(objeto.idependents, "votes_with_party_pct"));
  voto3 = isNaN(voto3) ? 0 : voto3;

  let result =
    objeto.democratas.length +
    objeto.republicanos.length +
    objeto.idependents.length;

  let resultadoPor;
  if (voto3 === 0) {
    resultadoPor = (voto1 + voto2) / 2;
  } else {
    resultadoPor = ((voto1 + voto2 + voto3) / 3).toFixed(2);
  }

  cuerpoTabla.innerHTML += `
    <tr><td class="border border-2 border-dark text-center" >Democrat</td><td class="border border-2 border-dark text-center">${objeto.democratas.length}</td><td class="border border-2 border-dark text-center">${calcPromedio(
    objeto.democratas,
    "votes_with_party_pct"
  )}%</td>
    </tr>
    <tr><td class="border border-2 border-dark text-center">Republicans</td><td class="border border-2 border-dark text-center">${
      objeto.republicanos.length
    }</td><td class="border border-2 border-dark text-center">${calcPromedio(objeto.republicanos, "votes_with_party_pct")}%</td>
    </tr>
    <tr><td class="border border-2 border-dark text-center">Independents</td><td class="border border-2 border-dark text-center">${objeto.idependents.length}</td><td class="border border-2 border-dark text-center">${
    calcPromedio(objeto.idependents, "votes_with_party_pct") === "NaN"
      ? 0
      : calcPromedio(objeto.idependents, "votes_with_party_pct")
  }%</td>
    </tr>
    <tr><td class="border border-2 border-dark text-center">Total</td><td class="border border-2 border-dark text-center">${result}</td><td class="border border-2 border-dark text-center">${resultadoPor}%</td>
    </tr>`;
}
imprimirGlance(estadisticas, "atGlance");

let estadisticasEngaged = {
  leastEngaged: [],
  mostEngaged: [],
  leastLoyalty: [],
  mostLoyalty: []
};



estadisticasEngaged.leastEngaged = votoPerdido(members, false, "missed_votes");
estadisticasEngaged.mostEngaged = votoPerdido(members, true, "missed_votes");




function CuentaPo(array) {
    arrayPush = []
    array.forEach(numero => {
        let number = Math.round((numero.total_votes * numero.votes_with_party_pct) / 100)
        let gente = {
          "first_name": numero.first_name,
          "middle_name": numero.middle_name,
          "last_name": numero.last_name,
          "total_votes": number,
          "votes_with_party_pct": numero.votes_with_party_pct
        }
        arrayPush.push(gente)
    })
    return arrayPush
}

let arrayMiembros = CuentaPo(members)

estadisticasEngaged.leastLoyalty = votoPerdido(arrayMiembros, true, "total_votes");
estadisticasEngaged.mostLoyalty = votoPerdido(arrayMiembros, false, "total_votes");

function votoPerdido(array, booleano, parametro) {
    
  let arrayAuxiliar = [];
  let copiaMiembros = [...array];
  if (booleano) {
    copiaMiembros.sort(
      (miembrosA, miembrosB) => miembrosA[parametro] - miembrosB[parametro]
    );
  } else {
    copiaMiembros.sort((miembrosA, miembrosB) => miembrosB[parametro] - miembrosA[parametro]
    );
  }

  let indiceLimite = Math.round((copiaMiembros.length * 10) / 100) - 1;
  let limite = copiaMiembros[indiceLimite][parametro];

  if (booleano) {
    arrayAuxiliar = copiaMiembros.filter((miembros) => miembros[parametro] <= limite
    );
  } else {
    arrayAuxiliar = copiaMiembros.filter((miembros) => miembros[parametro] >= limite
    );
  }

  return arrayAuxiliar;
}

function imprimirEngaged(array, idTabla, parametroV, parametroP){
    const cuerpoTabla = document.querySelector(`#${idTabla} tbody`);
   
     array.forEach((miembro) => {
        let segundoNombre = `${miembro.middle_name ? miembro.middle_name : ""}`;
        cuerpoTabla.innerHTML += `
            <tr>  
            <td class="border border-2 border-dark text-center"><a target="_blank" href=${miembro.url}>${miembro.first_name} ${segundoNombre} ${miembro.last_name} </a></td>
            <td class="border border-2 border-dark text-center">${miembro[parametroV]}</td>
            <td class="border border-2 border-dark text-center">${miembro[parametroP]}%</td>
            </tr>`;
      });
    

}
if(document.title === "DIG | Senate Attendance" || document.title === "DIG | House Attendance"){
imprimirEngaged(estadisticasEngaged.leastEngaged, "leastEngaged", "missed_votes", "missed_votes_pct")
imprimirEngaged(estadisticasEngaged.mostEngaged, "leastMost", "missed_votes", "missed_votes_pct")
} else {
    imprimirEngaged(estadisticasEngaged.leastLoyalty, "leastLoyal", "total_votes", "votes_with_party_pct")
    imprimirEngaged(estadisticasEngaged.mostLoyalty, "mostLoyal", "total_votes", "votes_with_party_pct")
}
} 