// src/utils/calculosEletricos.ts
import { sugerirBitola } from "./calculosFisicos";

// Calcula o Fator de Demanda conforme a potência instalada
export const obterFatorDemanda = (potenciaWatts: number): number => {
  if (potenciaWatts <= 1000) return 0.86;
  if (potenciaWatts <= 2000) return 0.75;
  if (potenciaWatts <= 3000) return 0.66;
  if (potenciaWatts <= 4000) return 0.59;
  if (potenciaWatts <= 5000) return 0.52;
  if (potenciaWatts <= 6000) return 0.45;
  if (potenciaWatts <= 7000) return 0.4;
  if (potenciaWatts <= 8000) return 0.35;
  if (potenciaWatts <= 9000) return 0.31;
  if (potenciaWatts <= 10000) return 0.27;
  return 0.5;
};

// Encontra o disjuntor comercial adequado que proteja o cabo
export const encontrarDisjuntorComercial = (
  correnteDemanda: number,
  capacidadeCabo: number,
): number => {
  const disjuntoresComerciais = [
    10, 16, 20, 25, 32, 40, 50, 63, 70, 80, 100, 125,
  ];
  const adequados = disjuntoresComerciais.filter(
    (d) => d >= correnteDemanda && d <= capacidadeCabo,
  );
  if (adequados.length > 0) return adequados[0];
  return disjuntoresComerciais.find((d) => d >= correnteDemanda) || 125;
};

// Determina a classificação do disjuntor com base nos polos
export const determinarTipoDisjuntor = (correnteBreaker: number): string => {
  if (correnteBreaker <= 40) return "Monofásico (1 Polo)";
  if (correnteBreaker > 40 && correnteBreaker <= 70)
    return "Bifásico (2 Polos)";
  return "Trifásico (3 Polos)";
};

// Função principal que orquestra todo o dimensionamento de um trecho
export const processarTrecho = (
  distancia: number,
  corrente: number,
  tensao: number,
  caboMinimo: number,
) => {
  const calculo = sugerirBitola(distancia, corrente, tensao);
  const bitolaAjustada = Math.max(calculo.bitola, caboMinimo);
  const disjuntor = encontrarDisjuntorComercial(
    corrente,
    calculo.capacidadeCorrente,
  );
  const classificacao = determinarTipoDisjuntor(disjuntor);

  return {
    bitola: bitolaAjustada,
    disjuntor: disjuntor,
    classificacao: classificacao,
  };
};
