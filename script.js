const custos = [30000, 50000, 40000, 10000, 20000];
const retornos = [40000, 60000, 45000, 15000, 25000];
const nomes = [
    "Ações de Empresa X",
    "Ações de Empresa Y",
    "Imóvel Z",
    "Títulos públicos P",
    "Fundo de investimento F"
];
const orcamento_maximo = 100000;
const populacao_tamanho = 10;
const geracoes = 50;

function gerar_individuo() {
    return Array.from({ length: custos.length }, () => Math.round(Math.random()));
}

function calcular_retorno(individuo) {
    let custo_total = 0;
    let retorno_total = 0;
    for (let i = 0; i < individuo.length; i++) {
        if (individuo[i] === 1) {
            custo_total += custos[i];
            retorno_total += retornos[i];
        }
    }
    return custo_total <= orcamento_maximo ? retorno_total : 0;
}

function gerar_populacao() {
    return Array.from({ length: populacao_tamanho }, gerar_individuo);
}

function selecionar_parents(populacao) {
    return populacao.sort((a, b) => calcular_retorno(b) - calcular_retorno(a)).slice(0, 2);
}

function cruzar(parent1, parent2) {
    const ponto = Math.floor(Math.random() * parent1.length);
    return [...parent1.slice(0, ponto), ...parent2.slice(ponto)];
}

function mutar(individuo) {
    const mutacao = Math.floor(Math.random() * individuo.length);
    individuo[mutacao] = 1 - individuo[mutacao];
}

function algoritmo_genetico() {
    let populacao = gerar_populacao();
    for (let i = 0; i < geracoes; i++) {
        const new_population = [];
        while (new_population.length < populacao_tamanho) {
            const parents = selecionar_parents(populacao);
            let filho = cruzar(parents[0], parents[1]);
            if (Math.random() < 0.1) mutar(filho);
            new_population.push(filho);
        }
        populacao = new_population;
    }
    const melhor_individuo = populacao.reduce((melhor, atual) => {
        return calcular_retorno(atual) > calcular_retorno(melhor) ? atual : melhor;
    });
    return melhor_individuo;
}

document.getElementById("calcular").addEventListener("click", () => {
    const melhor_comb = algoritmo_genetico();
    const retorno_maximo = calcular_retorno(melhor_comb);
    const resultado_div = document.getElementById("resultado");

    resultado_div.innerHTML = `<h2>Retorno máximo obtido é: R$ ${retorno_maximo}</h2>`;
    resultado_div.innerHTML += "<h3>Ativos utilizados para alcançar o retorno máximo:</h3>";
    const lista = document.createElement("ul");
    melhor_comb.forEach((incluido, i) => {
        if (incluido === 1) {
            const li = document.createElement("li");
            li.textContent = `${nomes[i]}: Custo = R$ ${custos[i]}, Retorno = R$ ${retornos[i]}`;
            lista.appendChild(li);
        }
    });
    if (lista.children.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhum ativo foi selecionado.";
        lista.appendChild(li);
    }
    resultado_div.appendChild(lista);
});
