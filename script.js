document.addEventListener('DOMContentLoaded', function() {
    const CIDADES_ALVO = [
        { nome: "Três Lagoas, MS", latitude: -20.7833, longitude: -51.6833 },
        { nome: "Campo Grande, MS", latitude: -20.4428, longitude: -54.6464 },
        { nome: "Andradina, SP", latitude: -20.9011, longitude: -51.3789 },
        { nome: "Presidente Prudente, SP", latitude: -22.1228, longitude: -51.3858 },
        { nome: "São Paulo, SP", latitude: -23.5505, longitude: -46.6333 },
        { nome: "Rio de Janeiro, RJ", latitude: -22.9068, longitude: -43.1729 }
    ];

    const API_URL = "https://api.open-meteo.com/v1/forecast";

    function popularSelectCidades() {
        const select = document.getElementById('cidade-select');
        if (!select) return;

        select.innerHTML = '<option selected disabled value="">Selecione sua Cidade de Atuação...</option>';

        CIDADES_ALVO.forEach((cidade, index) => {
            const option = document.createElement('option');
            option.value = index; 
            option.textContent = cidade.nome;
            select.appendChild(option);
        });
    }

    async function buscarClima(latitude, longitude) {
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current: 'temperature_2m,wind_speed_10m',
            temperature_unit: 'celsius',
            wind_speed_unit: 'kmh',
            timezone: 'auto'
        });
        
        const url = `${API_URL}?${params.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data.current;
        } catch (error) {
            console.error("Erro ao buscar dados climáticos:", error);
            return null;
        }
    }

    function exibirResultado(dados, nomeCidade) {
        const resultadoDiv = document.getElementById('resultado-clima');
        const erroDiv = document.getElementById('erro-clima');
        const alertaDiv = document.getElementById('alerta-clima');
        const tempElement = document.getElementById('temp-atual');

        erroDiv.classList.add('d-none');
        resultadoDiv.classList.remove('d-none');
        
        const temp = dados.temperature_2m;
        const vento = dados.wind_speed_10m;

        document.getElementById('cidade-nome-display').textContent = nomeCidade;
        tempElement.textContent = `${temp.toFixed(1)}°C`;
        document.getElementById('vento-atual').textContent = `${vento.toFixed(1)} km/h`;

        alertaDiv.classList.add('d-none');
        tempElement.classList.remove('text-danger', 'text-ciano');

        if (temp >= 30) {
            alertaDiv.classList.remove('d-none');
            alertaDiv.innerHTML = `<i class="fas fa-fire-alt me-2"></i> **ALERTA MÁXIMO:** Com ${temp.toFixed(1)}°C, o compressor trabalha sob stress extremo. Risco de falha total aumenta em <span class="text-danger fw-bolder">40%</span>. Agende já!`;
            tempElement.classList.add('text-danger'); 
        } else {
            tempElement.classList.add('text-ciano');
        }
    }

    function prepararClima() {
        popularSelectCidades();

        const form = document.getElementById('form-clima');
        const resultadoDiv = document.getElementById('resultado-clima');
        const erroDiv = document.getElementById('erro-clima');

        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            resultadoDiv.classList.add('d-none');
            erroDiv.classList.add('d-none');

            const select = document.getElementById('cidade-select');
            const selectedIndex = select.value;

            if (selectedIndex === "") {
                return;
            }

            const cidadeSelecionada = CIDADES_ALVO[selectedIndex];
            
            document.getElementById('cidade-nome-display').textContent = cidadeSelecionada.nome;
            document.getElementById('temp-atual').innerHTML = '<i class="fas fa-spinner fa-spin text-warning"></i>';
            document.getElementById('vento-atual').innerHTML = '<i class="fas fa-spinner fa-spin text-warning"></i>';
            resultadoDiv.classList.remove('d-none');


            const dadosClima = await buscarClima(cidadeSelecionada.latitude, cidadeSelecionada.longitude);

            if (dadosClima) {
                exibirResultado(dadosClima, cidadeSelecionada.nome);
            } else {
                resultadoDiv.classList.add('d-none');
                erroDiv.classList.remove('d-none');
            }
        });
    }

    prepararClima();
});