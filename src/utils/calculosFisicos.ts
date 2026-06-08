// src/utils/calculosFisicos.ts
import { tabelaCondutores } from "../data/tabelasCondutores";

/**
 * Calcula a queda de tensão em porcentagem.
 */
export const calcularQuedaTensao = (
  comprimento: number,
  corrente: number,
  bitola: number,
  tensao: number,
  ehTrifasico: boolean = false,
): number => {
  const resistividadeCobre = 0.0172;
  const fatorFase = ehTrifasico ? Math.sqrt(3) : 2;
  const deltaU =
    (fatorFase * comprimento * corrente * resistividadeCobre) / bitola;
  return (deltaU / tensao) * 100;
};

/**
 * Sugere a bitola ideal baseada em capacidade térmica e queda de tensão.
 */
export const sugerirBitola = (
  comprimento: number,
  corrente: number,
  tensao: number,
) => {
  const cabosPossiveis = tabelaCondutores.filter(
    (c) => c.capacidadeCorrente >= corrente,
  );

  const bitolaIdeal = cabosPossiveis.find((c) => {
    // Chamamos a função diretamente, pois estão no mesmo arquivo!
    const queda = calcularQuedaTensao(comprimento, corrente, c.bitola, tensao);
    return queda <= 4.0;
  });

  return bitolaIdeal || cabosPossiveis[cabosPossiveis.length - 1];
};
