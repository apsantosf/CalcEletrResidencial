// src/components/ui/Seletor.tsx
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";

interface Props<T> {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: T[];
  itemLabelKey: keyof T; // Chave do objeto que será exibida no label
  itemValueKey: keyof T; // Chave do objeto que será passada no value
}

export function Seletor<T>({
  label,
  selectedValue,
  onValueChange,
  items,
  itemLabelKey,
  itemValueKey,
}: Props<T>) {
  return (
    <View style={styles.inlineContainer}>
      <Text style={styles.labelInline}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.pickerStyle}
        >
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={String(item[itemLabelKey])}
              value={String(item[itemValueKey])}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  labelInline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    width: 110,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    height: 45,
    justifyContent: "center",
  },
  pickerStyle: {
    backgroundColor: "transparent",
    width: "100%",
    color: "#374151",
  },
});
