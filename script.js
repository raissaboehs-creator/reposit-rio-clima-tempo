// Nome da API
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CLIMA_URL = "https://api.open-meteo.com/v1/forecast";

// Elementos da página
const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");
const campoCidade = document.getElementById("cidade");

// Clique do botão
botao.addEventListener("click", buscarClima);


function buscarClima(){

    const cidade = campoCidade.value.trim();

    if(cidade === ""){
        resultado.innerHTML = "<p>Digite uma cidade.</p>";
        return;
    }

    resultado.innerHTML = "<p>Consultando...</p>";

    const urlCidade =
    `${GEO_URL}?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

    fetch(urlCidade)
    .then(resposta => resposta.json())

    // Caso a cidade não for encontrada
    .then(dadosCidade =>{

        if(!dadosCidade.results){
            throw new Error("Cidade não encontrada");
        }
        
       // Dados da cidade
        const local = dadosCidade.results[0];

        const latitude = local.latitude;
        const longitude = local.longitude;

        const urlClima =
        `${CLIMA_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

        return fetch(urlClima)
        .then(resposta => resposta.json())
        .then(clima => ({clima, nome: local.name}));
    })

    // Aparece nome da cidade e as informações
    .then(({clima, nome})=>{

        const temp = clima.current.temperature_2m;
        const umidade = clima.current.relative_humidity_2m;
        const vento = clima.current.wind_speed_10m;
        const codigo = clima.current.weather_code;

        let condicao = "Não informado";
        let icone = "🌐";

        if(codigo == 0){
            condicao = "Céu limpo";
            icone = "☀️";
        }
        else if(codigo <= 3){
            condicao = "Parcialmente nublado";
            icone = "🌤️";
        }
        else if(codigo <= 48){
            condicao = "Neblina";
            icone = "🌫️";
        }
        else if(codigo <= 67){
            condicao = "Chuva";
            icone = "🌧️";
        }
        else{
            condicao = "Tempo instável";
            icone = "⛅";
        }

        resultado.innerHTML = `
            <div class="icone">${icone}</div>

            <h2>${nome}</h2>

            <p><strong>${temp}°C</strong> • ${condicao}</p>

            <p>💧 Umidade: ${umidade}%</p>

            <p>🌬️ Vento: ${vento} km/h</p>
        `;
    })


    .catch(erro =>{
        resultado.innerHTML =
        "<p>❌ Cidade não encontrada.</p>";
        console.log(erro);
    });

}

