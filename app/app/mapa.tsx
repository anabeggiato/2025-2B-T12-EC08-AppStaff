import { View, StyleSheet, Platform, UIManager, ScrollView } from "react-native"
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";
import CardTour from "@/components/CardTour";
import DateSelector from "@/components/DateSelector";
import { AddTourIcon } from "@/components/AddTourIcon";
import { useState } from 'react'
import { AddTourPopup } from "@/components/AddTourPopup"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export default function MapScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <Header />

      <DateSelector onDateChange={setSelectedDate} />

      <Navbar />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A2C",
    paddingTop: 64,
    justifyContent: "center",
    alignItems: "center",
  },

  cards: {
    width: "100%",
    flexGrow: 1,
    maxHeight: "65%"
  },
});
