import { View, StyleSheet, Platform, UIManager, Text, ScrollView, Image } from "react-native"
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";
import DateSelector from "@/components/DateSelector";
import { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Pergunta } from "@/components/Pergunta";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type Tour = {
  codigo: string;
  responsavel: string;
  status: "scheduled" | "in_progress" | "paused" | "finished" | "cancelled";
  data: string;
  hora_inicio_prevista: string;
  hora_fim_prevista: string;
};

const initialTours: Tour[] = [
  {
    "codigo": "A1B2C3D4",
    "responsavel": "João Pereira",
    "status": "scheduled",
    "data": "25/11/2025",
    "hora_inicio_prevista": "09:00",
    "hora_fim_prevista": "10:00"
  },
  {
    "codigo": "E5F6G7H8",
    "responsavel": "Mariana Souza",
    "status": "in_progress",
    "data": "17/11/2025",
    "hora_inicio_prevista": "10:30",
    "hora_fim_prevista": "11:15"
  },
  {
    "codigo": "I9J0K1L2",
    "responsavel": "Lucas Andrade",
    "status": "paused",
    "data": "16/11/2025",
    "hora_inicio_prevista": "11:00",
    "hora_fim_prevista": "11:45"
  },
  {
    "codigo": "M3N4O5P6",
    "responsavel": "Fernanda Costa",
    "status": "finished",
    "data": "14/11/2025",
    "hora_inicio_prevista": "13:00",
    "hora_fim_prevista": "14:00"
  },
  {
    "codigo": "Q7R8S9T0",
    "responsavel": "Ricardo Lima",
    "status": "cancelled",
    "data": "20/11/2025",
    "hora_inicio_prevista": "14:30",
    "hora_fim_prevista": "15:30"
  },
  {
    "codigo": "U1V2W3X4",
    "responsavel": "Ana Bezerra",
    "status": "scheduled",
    "data": "27/11/2025",
    "hora_inicio_prevista": "08:00",
    "hora_fim_prevista": "09:00"
  },
  {
    "codigo": "Y5Z6A7B8",
    "responsavel": "Gabriel Nunes",
    "status": "in_progress",
    "data": "17/11/2025",
    "hora_inicio_prevista": "15:00",
    "hora_fim_prevista": "15:45"
  },
  {
    "codigo": "C9D0E1F2",
    "responsavel": "Carla Moura",
    "status": "finished",
    "data": "15/11/2025",
    "hora_inicio_prevista": "16:00",
    "hora_fim_prevista": "17:00"
  },
  {
    "codigo": "G3H4I5J6",
    "responsavel": "Pedro Alves",
    "status": "paused",
    "data": "17/11/2025",
    "hora_inicio_prevista": "09:30",
    "hora_fim_prevista": "10:15"
  },
  {
    "codigo": "K7L8M9N0",
    "responsavel": "Julia Fernandes",
    "status": "scheduled",
    "data": "28/11/2025",
    "hora_inicio_prevista": "11:30",
    "hora_fim_prevista": "12:30"
  },
  {
    "codigo": "O1P2Q3R4",
    "responsavel": "Tiago Ramos",
    "status": "finished",
    "data": "13/11/2025",
    "hora_inicio_prevista": "13:30",
    "hora_fim_prevista": "14:20"
  },
  {
    "codigo": "S5T6U7V8",
    "responsavel": "Larissa Rocha",
    "status": "cancelled",
    "data": "19/11/2025",
    "hora_inicio_prevista": "15:45",
    "hora_fim_prevista": "16:30"
  },
  {
    "codigo": "W9X0Y1Z2",
    "responsavel": "André Martins",
    "status": "in_progress",
    "data": "17/11/2025",
    "hora_inicio_prevista": "10:00",
    "hora_fim_prevista": "11:00"
  },
  {
    "codigo": "A3B4C5D6",
    "responsavel": "Patrícia Gomes",
    "status": "scheduled",
    "data": "26/11/2025",
    "hora_inicio_prevista": "08:30",
    "hora_fim_prevista": "09:15"
  },
  {
    "codigo": "E7F8G9H0",
    "responsavel": "Rafael Tavares",
    "status": "finished",
    "data": "12/11/2025",
    "hora_inicio_prevista": "17:00",
    "hora_fim_prevista": "17:45"
  }
]

function getTourDoDia(toursDoDia: Tour[]) {
  if (toursDoDia.length === 0) return null;

  const ordenarPorHora = (a: Tour, b: Tour) =>
    a.hora_inicio_prevista.localeCompare(b.hora_inicio_prevista);

  const toursOrdenados = [...toursDoDia].sort(ordenarPorHora);

  const emAndamento = toursOrdenados.find(t => t.status === "in_progress");
  if (emAndamento) return emAndamento;

  const finalizados = toursOrdenados.filter(t => t.status === "finished");
  if (finalizados.length > 0) {
    return finalizados[finalizados.length - 1];
  }

  const agendados = toursOrdenados.filter(t => t.status === "scheduled");
  if (agendados.length > 0) {
    return agendados[0];
  }

  return null;
}

function getStatusColor(status: Tour["status"]) {
  switch (status) {
    case "scheduled":
      return "#404040";

    case "in_progress":
      return "#FFBB00";

    case "paused":
      return "#4DA6FF";

    case "finished":
      return "#246E46";

    case "cancelled":
      return "#635A76";

    default:
      return "#333333";
  }
}

export default function MapScreen() {
  const [tours, setTours] = useState(initialTours);
  const [selectedDate, setSelectedDate] = useState(new Date());


  function formatDate(date: Date) {
    return date.toLocaleDateString("pt-BR");
  }

  const filteredTours = tours.filter(
    tour => tour.data === formatDate(selectedDate)
  );

  const tourAtual = getTourDoDia(filteredTours);

  return (
    <View style={styles.container}>
      <Header />
      <DateSelector onDateChange={setSelectedDate} />

      <ScrollView
        horizontal={true}
        style={styles.tours}
        contentContainerStyle={{ gap: 8, paddingVertical: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {filteredTours.map((tour) => {
          const color = getStatusColor(tour.status);

          return (
            <View key={tour.codigo} style={[styles.tour, { borderColor: color, },]}>
              <View style={{ width: 6, height: 6, borderRadius: 50, backgroundColor: color, }} />

              <Text style={{ color: "white" }}>
                {tour.hora_inicio_prevista}
                <MaterialIcons name="arrow-right-alt" size={14} color="white" />
                {tour.hora_fim_prevista}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.status_atual}>
        {tourAtual ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* bolinha de status */}
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 50,
                backgroundColor:
                  tourAtual.status === "in_progress"
                    ? "#FFBB00"
                    : tourAtual.status === "finished"
                      ? "#4CAF50"
                      : "#0096FF"
              }}
            />

            {/* texto */}
            <Text style={{ color: "#FFF" }}>
              {tourAtual.status === "in_progress" &&
                `Tour #${tourAtual.codigo} em andamento`}

              {tourAtual.status === "finished" &&
                `Tour #${tourAtual.codigo} finalizado`}

              {tourAtual.status === "scheduled" &&
                `Próximo tour (#${tourAtual.codigo}) agendado`}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#FFF" }}>
            Nenhum tour encontrado para esta data.
          </Text>
        )}
      </View>

      <View style={{ marginVertical: 25, width: "95%", alignItems: 'center' }}>
        <Image source={require("@/assets/images/mapa.png")} width={35} height={20} />
      </View>


      <Text style={styles.text}>Perguntas Feitas</Text>
      <ScrollView
        style={{ width: "100%", marginVertical: 20, gap: 16, maxHeight: 180 }}
        contentContainerStyle={{ flexDirection: "column", gap: 8, justifyContent: "center", alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <Pergunta pergunta={"Qual o melhor curso do Inteli?"} local={"Auditório"} resposta={'Todos os cursos do Inteli possuem a mesma metodologia baseada em projetos. Mas se fosse para escolher um. Hmmm... Engenharia da Computação!'} />
        <Pergunta pergunta={"Por quê as mesas são em grupo?"} local={"Ateliê"} resposta={'Porque aqui usamos uma metodologia baseada em projetos, e os alunos trabalham em grupos o tempo todo para que possam compartilhar seus conhecimento e experiêcnias'} />
        <Pergunta pergunta={"Qual é o perfil do aluno Inteli?"} local={"Ateliê"} resposta={'O aluno do Inteli é caracterizado por ser curioso, resiliente e apaixonado por tecnologia, com interesse em negócios e liderança.'} />
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

  tours: {
    width: "92%",
    maxHeight: 60,
    marginTop: 90,
  },

  tour: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "#FFBB00",
    paddingVertical: 9,
    paddingHorizontal: 18,
    maxHeight: 40,
    gap: 4
  },

  status_atual: {
    borderWidth: 1,
    borderColor: "#402A78",
    borderRadius: 8,
    width: "92%",
    paddingVertical: 18,
    alignItems: "center",
    marginVertical: 12
  },
  text: {
    fontSize: 16,
    fontWeight: 700,
    color: "#FFF",
    textAlign: "left",
    marginVertical: 6,
    width: "85%"
  },
});
