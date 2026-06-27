// src/app/index.tsx
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { InfoRamal } from "../components/ui/InfoRamal";
import { InputComInfo } from "../components/ui/InputComInfo";
import { Seletor } from "../components/ui/Seletor";
import {
  configuracoesConcessionarias,
  RegrasConcessionaria,
} from "../data/regrasConcessionarias";
import { obterFatorDemanda, processarTrecho } from "../utils/calculosEletricos";

export default function TelaNovoRamal() {
  const [distanciaExterna, setDistanciaExterna] = useState("");
  const [distanciaInterna, setDistanciaInterna] = useState("");
  const [potenciaTotal, setPotenciaTotal] = useState("");
  const [tensao, setTensao] = useState("220");

  const [concessionaria, setConcessionaria] = useState<RegrasConcessionaria>(
    Object.values(configuracoesConcessionarias)[0],
  );

  // Estados dos Resultados
  const [fatorAplicado, setFatorAplicado] = useState<number | null>(null);
  const [correntePura, setCorrentePura] = useState<number | null>(null);
  const [correnteDemanda, setCorrenteDemanda] = useState<number | null>(null);

  const [resultadoTrecho1, setResultadoTrecho1] = useState<any>(null);
  const [resultadoTrecho2, setResultadoTrecho2] = useState<any>(null);

  // Limpa os resultados da tela sempre que o usuário alterar algum valor de entrada
  useEffect(() => {
    setResultadoTrecho1(null);
    setResultadoTrecho2(null);
  }, [
    distanciaExterna,
    distanciaInterna,
    potenciaTotal,
    tensao,
    concessionaria,
  ]);

  // Função disparada apenas quando o botão "Calcular" é pressionado
  const handleCalcular = () => {
    const distExtNum = Number(distanciaExterna);
    const distIntNum = Number(distanciaInterna);
    const potInstalada = Number(potenciaTotal);
    const tensaoNum = Number(tensao);

    // Validação básica para evitar erros
    if (!distanciaExterna || !distanciaInterna || !potenciaTotal) {
      Alert.alert(
        "Atenção",
        "Por favor, preencha todos os campos antes de calcular.",
      );
      return;
    }

    if (
      !isNaN(distExtNum) &&
      !isNaN(distIntNum) &&
      !isNaN(potInstalada) &&
      tensaoNum > 0
    ) {
      // ⚡ Executa os cálculos apenas aqui
      const corrPuraVal = potInstalada / tensaoNum;
      const fatorVal = obterFatorDemanda(potInstalada);
      const corrDemandaVal = (potInstalada * fatorVal) / tensaoNum;

      setFatorAplicado(Math.round(fatorVal * 100));
      setCorrentePura(Number(corrPuraVal.toFixed(1)));
      setCorrenteDemanda(Number(corrDemandaVal.toFixed(1)));

      const caboMin = concessionaria.caboMinimoEntrada || 10;

      // 📍 Processa o 1º e o 2º trecho
      setResultadoTrecho1(
        processarTrecho(distExtNum, corrDemandaVal, tensaoNum, caboMin),
      );
      setResultadoTrecho2(
        processarTrecho(distIntNum, corrDemandaVal, tensaoNum, 0),
      );
    }
  };

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
          infoTexto="Cabo da rede da rua até a caixa do medidor de entrada da residência."
        />

        <InputComInfo
          placeholder="Distância Medidor ao Quadro (m)"
          value={distanciaInterna}
          onChangeText={setDistanciaInterna}
          infoTitulo="Medidor ao Quadro Geral"
          infoTexto="Distância do medidor de entrada até o Quadro de Distribuição (QDC) interno."
        />

        <InputComInfo
          placeholder="Potência Total Instalada (W)"
          value={potenciaTotal}
          onChangeText={setPotenciaTotal}
          infoTitulo="Potência Instalada"
          infoTexto="Soma total de todas as cargas da residência."
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

        {/* 🆕 Botão de Calcular adicionado aqui */}
        <TouchableOpacity
          style={styles.botaoCalcular}
          onPress={handleCalcular}
          activeOpacity={0.8}
        >
          <Text style={styles.txtBotaoCalcular}>Calcular Dimensionamento</Text>
        </TouchableOpacity>

        {resultadoTrecho1 && resultadoTrecho2 && (
          <View style={styles.cardResultado}>
            <View style={styles.boxDemandaInfo}>
              <Text style={styles.txtFatorTexto}>
                🔌 Corrente Bruta Total:{" "}
                <Text style={styles.txtFatorDestaque}>{correntePura} A</Text>
              </Text>
              <Text style={styles.txtFatorTexto}>
                📉 Fator aplicado pela Concessionária:{" "}
                <Text style={styles.txtFatorDestaque}>{fatorAplicado}%</Text>
              </Text>
              <Text style={styles.txtLabelCorrente}>
                ⚡ Corrente de Demanda Corrigida:
              </Text>
              <Text style={styles.txtCorrenteCalculada}>
                {correnteDemanda} A
              </Text>
            </View>

            <View style={styles.divisorFino} />

            <Text style={styles.secaoTitulo}>
              📍 1º Trecho: Ramal de Entrada
            </Text>
            <InfoRamal
              tipo="Cabo Subterrâneo/Aéreo"
              percurso="Rua até o Medidor"
            />

            <View style={styles.subCardComparacao}>
              <Text style={styles.labelSubCardDemanda}>
                • Cálculo com Demanda (Norma):
              </Text>
              <Text style={styles.txtSubResultadoDemanda}>
                Cabo: {resultadoTrecho1.bitola} mm² | Disjuntor:{" "}
                {resultadoTrecho1.disjuntor} A
              </Text>
              <Text style={styles.txtClassificacao}>
                Classificação: {resultadoTrecho1.classificacao}
              </Text>
            </View>

            <View style={styles.divisor} />

            <Text style={styles.secaoTitulo}>🏠 2º Trecho: Ramal Interno</Text>
            <InfoRamal
              tipo="Cabo Protegido/Eletroduto"
              percurso="Medidor até o QDC"
            />

            <View style={styles.subCardComparacao}>
              <Text style={styles.labelSubCardDemanda}>
                • Cálculo com Demanda (Otimizado):
              </Text>
              <Text style={styles.txtSubResultadoDemanda}>
                Cabo: {resultadoTrecho2.bitola} mm² | Disjuntor:{" "}
                {resultadoTrecho2.disjuntor} A
              </Text>
              <Text style={styles.txtClassificacao}>
                Classificação: {resultadoTrecho2.classificacao}
              </Text>
            </View>

            <Text style={styles.txtMensagemStatus}>
              Dimensionamento concluído com sucesso conforme as normas da{" "}
              {concessionaria.nome}.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

  // 🆕 Estilo do Botão
  botaoCalcular: {
    backgroundColor: "#0284c7", // Azul profissional
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    elevation: 2,
  },
  txtBotaoCalcular: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  cardResultado: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#064e3b",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  boxDemandaInfo: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#045e45",
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  txtFatorTexto: { color: "#ccfbf1", fontSize: 12, marginBottom: 2 },
  txtFatorDestaque: { fontWeight: "bold", color: "#fde047" },
  txtLabelCorrente: {
    color: "#a7f3d0",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
  },
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
  subCardComparacao: {
    backgroundColor: "#044e39",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#065f46",
    marginTop: 5,
  },
  labelSubCardDemanda: { color: "#a7f3d0", fontSize: 12, fontWeight: "600" },
  txtSubResultadoDemanda: {
    color: "#fde047",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  txtClassificacao: {
    color: "#34d399",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
  divisor: {
    height: 1,
    width: "100%",
    backgroundColor: "#045e45",
    marginVertical: 15,
  },
  txtMensagemStatus: {
    color: "#d1fae5",
    fontSize: 11,
    marginTop: 15,
    fontStyle: "italic",
    textAlign: "center",
  },
});
