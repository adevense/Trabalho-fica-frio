// Dados para Servicos (carregamento instantâneo para servicos.html)
const servicosAPI = [
    {
        titulo: "Limpeza e Higienização VIP",
        descricao: "Desmontagem completa, limpeza profunda com produto bactericida e laudo de qualidade do ar.",
        preco: "R$ 190,00",
        tag: "Saúde Plus Ultra"
    },
    {
        titulo: "Carga de Gás Ecológico R410A",
        descricao: "Diagnóstico de vazamento e recarga com gás refrigerante de baixo impacto ambiental (Inverter).",
        preco: "R$ 280,00",
        tag: "Sustentável"
    },
    {
        titulo: "Instalação Premium",
        descricao: "Instalação de equipamentos (Split ou Janela) com garantia total e acabamento discreto e durável.",
        preco: "R$ 490,00",
        tag: "Novos Aparelhos"
    },
    {
        titulo: "Manutenção Corretiva (Urgente)",
        descricao: "Troca de peças, reparo em placas e solução de ruídos. Atendimento prioritário e diagnóstico eletrônico.",
        preco: "Sob Orçamento",
        tag: "Emergência 24h"
    }
];

// Cidades pré-definidas para a API do clima (clima.html)
// [Nome, Latitude, Longitude]
const cidadesClima = [
    { nome: "Selecione uma Cidade", lat: "", lon: "" },
    { nome: "Três Lagoas (MS)", lat: -20.7831, lon: -51.6811 },
    { nome: "São Paulo (SP)", lat: -23.5505, lon: -46.6333 },
    { nome: "Rio de Janeiro (RJ)", lat: -22.9068, lon: -43.1729 },
    { nome: "Porto Alegre (RS)", lat: -30.0346, lon: -51.2177 },
    { nome: "Manaus (AM)", lat: -3.1190, lon: -60.0217 },
    { nome: "Belo Horizonte (MG)", lat: -19.9167, lon: -43.9345 }
];

// =========================================================================
// FUNÇÕES GERAIS
// =========================================================================

function carregarServicos() {
    // Implementação da renderização de serviços (para servicos.html)
    const container = document.getElementById('lista-servicos');
    if (container) {
        servicosAPI.forEach(servico => {
            const div = document.createElement('div');
            div.className = 'col-lg-3 col-md-6 mb-4';
            div.innerHTML = `
                <div class="card h-100 shadow text-center p-4">
                    <div class="badge bg-secondary text-gelo-dark mb-2 fw-bold">${servico.tag}</div>
                    <h5 class="card-title text-gelo fw-bold">${servico.titulo}</h5>
                    <p class="card-text text-muted">${servico.descricao}</p>
                    <h3 class="my-3 text-gelo-dark fw-bolder">${servico.preco}</h3>
                    <a href="contato.html" class="btn btn-primary bg-gelo-dark mt-auto fw-bold">AGENDAR PLUS ULTRA</a>
                </div>
            `;
            container.appendChild(div);
        });
    }
}

function enviarFormulario(event) {
    event.preventDefault();
    alert("🥳 SUCESSO PLUS ULTRA! Seu agendamento foi registrado e um técnico entrará em contato em menos de 1 hora. Prepare-se para o Gelado!");
    // Redireciona após o alerta
    window.location.href = "index.html"; 
}


// =========================================================================
// FUNÇÕES CLIMA (API REAL)
// =========================================================================

function prepararClima() {
    // Preenche o Select com as cidades pré-definidas
    const select = document.getElementById('cidade-select');
    if (select) {
        cidadesClima.forEach((cidade, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = cidade.nome;
            if (index === 0) {
                 option.disabled = true;
                 option.selected = true; 
            }
            select.appendChild(option);
        });
    }
}

async function buscarClima(event) {
    event.preventDefault();
    
    const select = document.getElementById('cidade-select');
    const selectedIndex = select.value;

    if (selectedIndex === "") {
        alert("Por favor, selecione uma cidade.");
        return;
    }

    const cidade = cidadesClima[selectedIndex];
    const lat = cidade.lat;
    const lon = cidade.lon;
    const nomeCidade = cidade.nome;
    
    // Elementos do DOM
    const resultadoDiv = document.getElementById('resultado-clima');
    const erroDiv = document.getElementById('erro-clima');
    const tempElement = document.getElementById('temp-atual');
    const ventoElement = document.getElementById('vento-atual');
    const alertaElement = document.getElementById('alerta-clima');
    const btnBuscar = document.getElementById('btn-buscar');
    const cidadeNomeDisplay = document.getElementById('cidade-nome-display');

    // Resetar estados e adicionar loading
    resultadoDiv.classList.add('d-none');
    erroDiv.classList.add('d-none');
    alertaElement.classList.add('d-none');
    cidadeNomeDisplay.textContent = nomeCidade;
    tempElement.innerHTML = '<div class="spinner-border spinner-border-sm text-secondary" role="status"></div>';
    ventoElement.innerHTML = '<div class="spinner-border spinner-border-sm text-secondary" role="status"></div>';
    btnBuscar.disabled = true;
    btnBuscar.textContent = 'Buscando...';

    // URL da API Open-Meteo
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&timezone=America%2FSao_Paulo`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.current) {
            const temp = data.current.temperature_2m;
            const wind = data.current.wind_speed_10m;
            
            tempElement.textContent = temp.toFixed(1) + ' °C';
            ventoElement.textContent = wind.toFixed(1) + ' km/h';
            
            // Lógica de alerta com base na temperatura (Plus Ultra)
            if (temp >= 32) {
                alertaElement.className = 'alert alert-danger mt-4';
                alertaElement.textContent = `🔥 CALOR EXTREMO (${temp.toFixed(1)}°C)! Seu AC corre sério risco de quebra. Chame-nos para uma manutenção Plus Ultra agora!`;
            } else if (temp >= 28) {
                alertaElement.className = 'alert alert-warning mt-4';
                alertaElement.textContent = `🥵 ALERTA DE MANUTENÇÃO: ${nomeCidade} está muito quente. Uma limpeza completa é essencial para não superaquecer.`;
            } else if (temp >= 24) {
                 alertaElement.className = 'alert alert-info mt-4';
                alertaElement.textContent = `🌤️ Temperatura ideal para agendar a manutenção preventiva e garantir que o verão não o pegue de surpresa.`;
            } else {
                alertaElement.className = 'alert alert-success mt-4';
                alertaElement.textContent = `✅ Clima ameno. Aproveite e agende a higienização para ter ar puro e economizar energia.`;
            }

            alertaElement.classList.remove('d-none');
            resultadoDiv.classList.remove('d-none');

        } else {
            erroDiv.classList.remove('d-none');
        }

    } catch (error) {
        console.error("Erro ao buscar API:", error);
        erroDiv.classList.remove('d-none');
    } finally {
        btnBuscar.disabled = false;
        btnBuscar.textContent = 'BUSCAR TEMPO';
    }
}