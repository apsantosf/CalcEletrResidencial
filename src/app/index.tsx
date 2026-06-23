// src/app/index.tsx
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { InfoRamal } from "../components/ui/InfoRamal";
import { Seletor } from "../components/ui/Seletor";
import {
  configuracoesConcessionarias,
  RegrasConcessionaria,
} from "../data/regrasConcessionarias";
import { sugerirBitola } from "../utils/calculosFisicos";

const determinarTipoDisjuntor = (corrente: number) => {
  if (corrente <= 40) {
    return { tipo: "Monofásico (1 Polo)", fases: 1 };
  } else if (corrente > 40 && corrente <= 70) {
    return { tipo: "Bifásico (2 Polos)", fases: 2 };
  } else {
    return { tipo: "Trifásico (3 Polos)", fases: 3 };
  }
};

// Componente para o Input com Ícone (Abre um card explicativo)
interface InputComInfoProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  infoTitulo: string;
  infoTexto: string;
}

function InputComInfo({
  placeholder,
  value,
  onChangeText,
  infoTitulo,
  infoTexto,
}: InputComInfoProps) {
  // Controle para mostrar/esconder a explicação
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <View style={styles.inputContainerBox}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setMostrarInfo(!mostrarInfo)}
          activeOpacity={0.7}
        >
          <Text style={styles.infoIconText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Caixinha que aparece quando clica no "i" */}
      {mostrarInfo && (
        <View style={styles.infoCaixaTexto}>
          <Text style={styles.infoTituloCaixa}>{infoTitulo}</Text>
          <Text style={styles.infoDescricaoCaixa}>{infoTexto}</Text>
        </View>
      )}
    </View>
  );
}

// Tela Principal
export default function TelaNovoRamal() {
  // Entradas do Usuário
  const [distanciaExterna, setDistanciaExterna] = useState("");
  const [distanciaInterna, setDistanciaInterna] = useState("");
  const [potenciaTotal, setPotenciaTotal] = useState("");
  const [tensao, setTensao] = useState("220");

  const [concessionaria, setConcessionaria] = useState<RegrasConcessionaria>(
    Object.values(configuracoesConcessionarias)[0],
  );

  // Resultados Calculados
  const [correnteCalculada, setCorrenteCalculada] = useState<number | null>(
    null,
  );
  const [caboEntrada, setCaboEntrada] = useState<number | null>(null);
  const [disjuntorEntrada, setDisjuntorEntrada] = useState<number | null>(null);
  const [tipoDisjuntorEntrada, setTipoDisjuntorEntrada] = useState("");

  const [caboInterno, setCaboInterno] = useState<number | null>(null);
  const [disjuntorInterno, setDisjuntorInterno] = useState<number | null>(null);
  const [tipoDisjuntorInterno, setTipoDisjuntorInterno] = useState("");

  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (distanciaExterna && distanciaInterna && potenciaTotal) {
      const distExtNum = Number(distanciaExterna);
      const distIntNum = Number(distanciaInterna);
      const potNum = Number(potenciaTotal);
      const tensaoNum = Number(tensao);

      if (
        !isNaN(distExtNum) &&
        !isNaN(distIntNum) &&
        !isNaN(potNum) &&
        tensaoNum > 0
      ) {
        const corrNum = potNum / tensaoNum;
        setCorrenteCalculada(Number(corrNum.toFixed(1)));

        // 1. Cálculo do Ramal de Entrada (Rua -> Medidor)
        const caboMin = concessionaria.caboMinimoEntrada || 10;
        const calculoEntrada = sugerirBitola(distExtNum, corrNum, tensaoNum);
        const bitolaEntradaAjustada = Math.max(calculoEntrada.bitola, caboMin);

        const disjEntradaVal =
          calculoEntrada.capacidadeCorrente <= 50
            ? 50
            : calculoEntrada.capacidadeCorrente;
        const recDisjEntrada = determinarTipoDisjuntor(disjEntradaVal);

        setCaboEntrada(bitolaEntradaAjustada);
        setDisjuntorEntrada(disjEntradaVal);
        setTipoDisjuntorEntrada(recDisjEntrada.tipo);

        // 2. Cálculo do Ramal Interno (Medidor -> Segundo Disjuntor / QDC)
        const calculoInterno = sugerirBitola(distIntNum, corrNum, tensaoNum);
        const disjInternoVal = calculoInterno.capacidadeCorrente;
        const recDisjInterno = determinarTipoDisjuntor(disjInternoVal);

        setCaboInterno(calculoInterno.bitola);
        setDisjuntorInterno(disjInternoVal);
        setTipoDisjuntorInterno(recDisjInterno.tipo);

        setStatusMsg(
          `Dimensionamento concluído com sucesso conforme as normas da ${concessionaria.nome}.`,
        );
      }
    } else {
      setCorrenteCalculada(null);
      setCaboEntrada(null);
      setDisjuntorEntrada(null);
      setCaboInterno(null);
      setDisjuntorInterno(null);
      setStatusMsg("");
    }
  }, [
    distanciaExterna,
    distanciaInterna,
    potenciaTotal,
    tensao,
    concessionaria,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.scrollWrapper}>
      <View style={styles.phoneContainer}>
        <Text style={styles.titulo}>Elétrica Residencial</Text>
        <Text style={styles.subtitulo}>
          Dimensionamento de Entrada e Circuitos
        </Text>

        <Seletor
          label="Concessionária:"
          selectedValue={concessionaria.nome}
          onValueChange={(val) => {
            const sel = Object.values(configuracoesConcessionarias).find(
              (c) => c.nome === val,
            );
            if (sel) setConcessionaria(sel);
          }}
          items={Object.values(configuracoesConcessionarias)}
          itemLabelKey="nome"
          itemValueKey="nome"
        />

        <InputComInfo
          placeholder="Distância Rua ao Medidor (m)"
          value={distanciaExterna}
          onChangeText={setDistanciaExterna}
          infoTitulo="Rua ao Medidor"
          infoTexto="É o cabo que vem do poste da rede da concessionária na rua até a caixa do medidor (relógio) de entrada da residência."
        />

        <InputComInfo
          placeholder="Distância Medidor ao Quadro (m)"
          value={distanciaInterna}
          onChangeText={setDistanciaInterna}
          infoTitulo="Medidor ao Quadro Geral"
          infoTexto="É a distância do poste de entrada da residência (onde fica o medidor) até o Quadro de Distribuição de Circuitos (QDC) que fica dentro da casa."
        />

        <InputComInfo
          placeholder="Potência Total de Demanda (W)"
          value={potenciaTotal}
          onChangeText={setPotenciaTotal}
          infoTitulo="Potência de Demanda"
          infoTexto="A soma total da potência (em Watts) de todas as lâmpadas, tomadas e equipamentos pesados, já aplicando o fator de demanda (porque nem tudo liga ao mesmo tempo)."
        />

        <Seletor
          label="Tensão:"
          selectedValue={tensao}
          onValueChange={(val) => setTensao(val)}
          items={[
            { label: "127V", valor: "127" },
            { label: "220V", valor: "220" },
          ]}
          itemLabelKey="label"
          itemValueKey="valor"
        />

        {caboEntrada && disjuntorEntrada && (
          <View style={styles.cardResultado}>
            <Text style={styles.txtLabelCorrente}>
              ⚡ Corrente de Demanda Calculada:
            </Text>
            <Text style={styles.txtCorrenteCalculada}>
              {correnteCalculada} A
            </Text>

            <View style={styles.divisorFino} />

            <Text style={styles.secaoTitulo}>
              📍 1º Trecho: Ramal de Entrada
            </Text>
            <InfoRamal
              tipo="Cabo Subterrâneo/Aéreo"
              percurso="Rua até o Medidor"
            />

            <Text style={styles.txtLabel}>Bitola do Cabo:</Text>
            <Text style={styles.txtResultado}>{caboEntrada} mm²</Text>

            <Text style={styles.txtLabel}>Disjuntor Geral (Entrada):</Text>
            <Text style={styles.txtResultadoDisj}>{disjuntorEntrada} A</Text>

            <Text style={styles.txtLabelRecomendacao}>Classificação:</Text>
            <Text style={styles.txtRecomendacao}>{tipoDisjuntorEntrada}</Text>

            <View style={styles.divisor} />

            <Text style={styles.secaoTitulo}>🏠 2º Trecho: Ramal Interno</Text>
            <InfoRamal
              tipo="Cabo Protegido/Eletroduto"
              percurso="Medidor até o QDC"
            />

            <Text style={styles.txtLabel}>Bitola do Cabo (Técnica):</Text>
            <Text style={styles.txtResultado}>{caboInterno} mm²</Text>

            <Text style={styles.txtLabel}>Segundo Disjuntor (Geral QDC):</Text>
            <Text style={styles.txtResultadoDisj}>{disjuntorInterno} A</Text>

            <Text style={styles.txtLabelRecomendacao}>Classificação:</Text>
            <Text style={styles.txtRecomendacao}>{tipoDisjuntorInterno}</Text>

            <Text style={styles.txtMensagemStatus}>{statusMsg}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Estilos do componente de Input com Ícone
  inputContainerBox: {
    marginBottom: 10,
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputField: {
    flex: 1,
    padding: 15,
  },
  infoButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoIconText: {
    fontSize: 20,
    color: "#0284c7",
  },
  infoCaixaTexto: {
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 6,
    marginTop: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#0284c7",
  },
  infoTituloCaixa: {
    fontWeight: "bold",
    color: "#0369a1",
    fontSize: 13,
    marginBottom: 4,
  },
  infoDescricaoCaixa: {
    color: "#0c4a6e",
    fontSize: 12,
    lineHeight: 18,
  },
  // Estilos da Tela Principal
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    paddingVertical: 20,
  },
  phoneContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#f3f4f6",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 20,
    textAlign: "center",
  },
  cardResultado: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#064e3b",
    borderRadius: 8,
    alignItems: "center",
  },
  txtLabelCorrente: { color: "#a7f3d0", fontSize: 13, fontWeight: "600" },
  txtCorrenteCalculada: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 2,
  },
  divisorFino: {
    height: 1,
    width: "90%",
    backgroundColor: "#047857",
    marginVertical: 10,
  },
  secaoTitulo: {
    color: "#fbbf24",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  txtLabel: { color: "#cbd5e1", fontSize: 12, marginTop: 5 },
  txtResultado: {
    color: "#fde047",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  txtResultadoDisj: {
    color: "#67e8f9",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  txtLabelRecomendacao: { color: "#cbd5e1", fontSize: 12, marginTop: 5 },
  txtRecomendacao: {
    color: "#34d399",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  divisor: {
    height: 1,
    width: "100%",
    backgroundColor: "#334155",
    marginVertical: 15,
  },
  txtMensagemStatus: {
    color: "#d1fae5",
    fontSize: 12,
    marginTop: 15,
    fontStyle: "italic",
    textAlign: "center",
  },
});
