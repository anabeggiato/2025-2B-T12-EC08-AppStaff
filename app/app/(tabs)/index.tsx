import { View, StyleSheet, Platform, UIManager, ScrollView } from "react-native"
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";
import CardTour from "@/components/CardTour";
import DateSelector from "@/components/DateSelector";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Tour = {
  codigo: string;
  responsavel: string;
  status: "scheduled" | "in_progress" | "paused" | "finished" | "cancelled";
  hora_inicio_prevista: string;
  hora_fim_prevista: string;
};

const tours: Tour[] = [
  {
    "codigo": "A1B2C3D4",
    "responsavel": "João Pereira",
    "status": "scheduled",
    "hora_inicio_prevista": "09:00",
    "hora_fim_prevista": "10:00"
  },
  {
    "codigo": "E5F6G7H8",
    "responsavel": "Mariana Souza",
    "status": "in_progress",
    "hora_inicio_prevista": "10:30",
    "hora_fim_prevista": "11:15"
  },
  {
    "codigo": "I9J0K1L2",
    "responsavel": "Lucas Andrade",
    "status": "paused",
    "hora_inicio_prevista": "11:00",
    "hora_fim_prevista": "11:45"
  },
  {
    "codigo": "M3N4O5P6",
    "responsavel": "Fernanda Costa",
    "status": "finished",
    "hora_inicio_prevista": "13:00",
    "hora_fim_prevista": "14:00"
  },
  {
    "codigo": "Q7R8S9T0",
    "responsavel": "Ricardo Lima",
    "status": "cancelled",
    "hora_inicio_prevista": "14:30",
    "hora_fim_prevista": "15:30"
  },
  {
    "codigo": "U1V2W3X4",
    "responsavel": "Ana Bezerra",
    "status": "scheduled",
    "hora_inicio_prevista": "08:00",
    "hora_fim_prevista": "09:00"
  },
  {
    "codigo": "Y5Z6A7B8",
    "responsavel": "Gabriel Nunes",
    "status": "in_progress",
    "hora_inicio_prevista": "15:00",
    "hora_fim_prevista": "15:45"
  },
  {
    "codigo": "C9D0E1F2",
    "responsavel": "Carla Moura",
    "status": "finished",
    "hora_inicio_prevista": "16:00",
    "hora_fim_prevista": "17:00"
  },
  {
    "codigo": "G3H4I5J6",
    "responsavel": "Pedro Alves",
    "status": "paused",
    "hora_inicio_prevista": "09:30",
    "hora_fim_prevista": "10:15"
  },
  {
    "codigo": "K7L8M9N0",
    "responsavel": "Julia Fernandes",
    "status": "scheduled",
    "hora_inicio_prevista": "11:30",
    "hora_fim_prevista": "12:30"
  },
  {
    "codigo": "O1P2Q3R4",
    "responsavel": "Tiago Ramos",
    "status": "finished",
    "hora_inicio_prevista": "13:30",
    "hora_fim_prevista": "14:20"
  },
  {
    "codigo": "S5T6U7V8",
    "responsavel": "Larissa Rocha",
    "status": "cancelled",
    "hora_inicio_prevista": "15:45",
    "hora_fim_prevista": "16:30"
  },
  {
    "codigo": "W9X0Y1Z2",
    "responsavel": "André Martins",
    "status": "in_progress",
    "hora_inicio_prevista": "10:00",
    "hora_fim_prevista": "11:00"
  },
  {
    "codigo": "A3B4C5D6",
    "responsavel": "Patrícia Gomes",
    "status": "scheduled",
    "hora_inicio_prevista": "08:30",
    "hora_fim_prevista": "09:15"
  },
  {
    "codigo": "E7F8G9H0",
    "responsavel": "Rafael Tavares",
    "status": "finished",
    "hora_inicio_prevista": "17:00",
    "hora_fim_prevista": "17:45"
  }
]


export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Header />
      <DateSelector />
      <ScrollView
        style={styles.cards}
        contentContainerStyle={{
          alignItems: "center",
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {tours.map((tour) => (
          <CardTour
            key={tour.codigo}
            codigo={tour.codigo}
            responsavel={tour.responsavel}
            status={tour.status}
            hora_inicio_prevista={tour.hora_inicio_prevista}
            hora_fim_prevista={tour.hora_fim_prevista}
          />
        ))}
      </ScrollView>

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



