// src/components/ui/InfoRamal.tsx
import { StyleSheet, Text, View } from "react-native";

interface Props {
  tipo: string;
  percurso: string;
}

export function InfoRamal({ tipo, percurso }: Props) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoText}>📍 Percurso: {percurso}</Text>
      <Text style={styles.infoText}>⚡ Fornecimento: {tipo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: "#0f766e", // Fundo levemente mais claro que o card principal para dar contraste
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
    width: "100%",
  },
  infoText: {
    color: "#ccfbf1",
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "500",
  },
});
