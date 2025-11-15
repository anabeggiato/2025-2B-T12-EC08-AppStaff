import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DateCarousel() {
  const [selected, setSelected] = useState(new Date());

  // Gera apenas 5 datas ao redor da selecionada
  const dates = useMemo(() => {
    const arr = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(selected);
      d.setDate(selected.getDate() + i);
      arr.push({
        offset: i,
        date: d,
        day: d.getDate(),
        month: d.toLocaleString("pt-BR", { month: "short" }).toUpperCase(),
      });
    }
    return arr;
  }, [selected]);

  return (
    <View style={styles.container}>

      <View style={styles.row}>
        {dates.map((item, index) => {
          const isCenter = item.offset === 0;
          const isMedium = Math.abs(item.offset) === 1;
          const isSmall = Math.abs(item.offset) === 2;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelected(item.date)}
              style={[
                styles.box,
                isCenter && styles.big,
                isMedium && styles.medium,
                isSmall && styles.small
              ]}
            >
              <Text style={styles.dayText}>{item.day}</Text>

              {isCenter && (
                <Text style={styles.monthText}>{item.month}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1b1628",
    paddingVertical: 40,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  box: {
    borderWidth: 2,
    borderColor: "#5A43A6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#241d33",
  },

  // Tamanhos
  small: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  medium: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  big: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: "#372b6c",
  },

  dayText: {
    color: "white",
    fontSize: 20,
  },
  monthText: {
    color: "white",
    fontSize: 16,
    marginTop: 4,
    fontWeight: "bold",
  },
});
