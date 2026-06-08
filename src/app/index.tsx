//  src/app/index.tsx
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { sugerirBitola } from "../utils/calculosFisicos";

export default function TelaPrincipal() {
  const [distancia, setDistancia] = useState("");
  const [corrente, setCorrente] = useState("");
  const [bitolaSugerida, setBitolaSugerida] = useState<number | null>(null);

  useEffect(() => {
    if (distancia && corrente) {
      const bitola = sugerirBitola(Number(distancia), Number(corrente), 220);
      setBitolaSugerida(bitola.bitola);
    } else {
      setBitolaSugerida(null);
    }
  }, [distancia, corrente]);

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.phoneContainer}>
        <Text style={styles.titulo}>Dimensionamento de Ramal</Text>

        <TextInput
          style={styles.input}
          placeholder="Distância (metros)"
          keyboardType="numeric"
          value={distancia}
          onChangeText={setDistancia}
        />
        <TextInput
          style={styles.input}
          placeholder="Corrente (Amperes)"
          keyboardType="numeric"
          value={corrente}
          onChangeText={setCorrente}
        />

        {bitolaSugerida && (
          <View style={styles.cardResultado}>
            <Text style={styles.txtLabel}>Bitola Sugerida:</Text>
            <Text style={styles.txtResultado}>{bitolaSugerida} mm²</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Isso centraliza o "celular" na tela do seu computador
  screenWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
  },
  // Isso simula o tamanho de um celular
  phoneContainer: {
    width: "100%",
    maxWidth: 400, // Largura máxima de um celular
    backgroundColor: "#f3f4f6",
    padding: 20,
    borderRadius: 20,
    minHeight: 600,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardResultado: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#064e3b",
    borderRadius: 8,
    alignItems: "center",
  },
  txtLabel: { color: "#fff", fontSize: 14 },
  txtResultado: { color: "#fde047", fontSize: 24, fontWeight: "bold" },
});
