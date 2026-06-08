// src/data/tabelasCondutores.ts

export interface Condutor {
  bitola: number;
  capacidadeCorrente: number; // Ampères (baseado em método de instalação comum)
}

export const tabelaCondutores: Condutor[] = [
  { bitola: 1.5, capacidadeCorrente: 15 },
  { bitola: 2.5, capacidadeCorrente: 21 },
  { bitola: 4.0, capacidadeCorrente: 28 },
  { bitola: 6.0, capacidadeCorrente: 36 },
  { bitola: 10, capacidadeCorrente: 50 },
  { bitola: 16, capacidadeCorrente: 68 },
  { bitola: 25, capacidadeCorrente: 89 },
];
