const botaoBuscar = document.getElementById("buscar");

botaoBuscar.addEventListener("click", buscarClima);

function buscarClima () {
    const campoCidade = document.getElementById("cidade");

      // .value pega o que o usuário digitou
  // .trim() remove espaços extras no início/fim

  const cidade = campoCidade.value.trim();

  console.log("Cidade digitada:", cidade);

    window.alert("O botão foi clicado.")
}

if (cidade === "") {
    alert("Digite o nome de uma cidade.");
    return;
}

// ============================================
// CONFIGURAÇÃO DA API — Open-Meteo (não exige chave)
// ============================================
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CLIMA_URL = "https://api.open-meteo.com/v1/forecast";

// 1) Descobre a latitude e a longitude da cidade digitada
const urlBusca =
  `${GEO_URL}?name=${encodeURIComponent(cidade)}` +
  `&count=1&language=pt&format=json`;

fetch(urlBusca)
  .then(resposta => resposta.json())
  .then(dadosCidade => {
    const { latitude, longitude } = dadosCidade.results[0];

    // 2) Usa a latitude e a longitude para consultar o clima
    const urlClima =
      `${CLIMA_URL}?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m` +
      `,wind_speed_10m,weather_code`;

    return fetch(urlClima);
  })
  .then(resposta => resposta.json())
  .then(dadosClima => {
    console.log(dadosClima);
  });

