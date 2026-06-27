// src/components/ui/InputComInfo.tsx
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface InputComInfoProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  infoTitulo: string;
  infoTexto: string;
}

export function InputComInfo({
  placeholder,
  value,
  onChangeText,
  infoTitulo,
  infoTexto,
}: InputComInfoProps) {
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

      {mostrarInfo && (
        <View style={styles.infoCaixaTexto}>
          <Text style={styles.infoTituloCaixa}>{infoTitulo}</Text>
          <Text style={styles.infoDescricaoCaixa}>{infoTexto}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainerBox: { marginBottom: 10, width: "100%" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputField: { flex: 1, padding: 15 },
  infoButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoIconText: { fontSize: 20, color: "#0284c7" },
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
  infoDescricaoCaixa: { color: "#0c4a6e", fontSize: 12, lineHeight: 18 },
});
