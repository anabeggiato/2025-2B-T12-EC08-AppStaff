import { View, StyleSheet, Platform, UIManager, Text, ScrollView, Image } from "react-native"
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";
import { useState, useEffect } from 'react'
import { Pergunta } from "@/components/Pergunta";
import Checkpoint from "@/components/Checkpoint";
import { tourService, type Tour as ApiTour } from "@/services/api";
import { AlertButton } from "@/components/AlertButton";
import AlertPopup from "@/components/AlertPopup";


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


export default function MapScreen() {

  const [isNow, setIsNow] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await tourService.tourNow(1);
      setIsNow(result);
    }
    fetchData();
  }, []);

  //const tourAtual = getTourDoDia(filteredTours);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={{ width: "100%", marginTop: 150, gap: 16 }}
        contentContainerStyle={{ flexDirection: "column", gap: 8, justifyContent: "center", alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {isNow ? (
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ marginVertical: 25, width: "95%", alignItems: 'center', flexDirection: "row", gap: 50, justifyContent: "center" }}>
              <Checkpoint id={1} status={"done"} label={"recepção"} />
              <Checkpoint id={2} status={"in_progress"} label={"auditório"} />
              <Checkpoint id={3} status={"not_started"} label={"ateliê"} />
              <Checkpoint id={4} status={"not_started"} label={"casinhas"} />
              <Checkpoint id={5} status={"not_started"} label={"dog house"} />
            </View>


            <Text style={[styles.text]}>Perguntas Feitas</Text>
            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", gap: 4, paddingTop: 15 }}>
              <Pergunta pergunta={"Qual o melhor curso do Inteli?"} local={"Auditório"} resposta={'Todos os cursos do Inteli possuem a mesma metodologia baseada em projetos. Mas se fosse para escolher um. Hmmm... Engenharia da Computação!'} />
              <Pergunta pergunta={"Por quê as mesas são em grupo?"} local={"Ateliê"} resposta={'Porque aqui usamos uma metodologia baseada em projetos, e os alunos trabalham em grupos o tempo todo para que possam compartilhar seus conhecimento e experiêcnias'} />
              <Pergunta pergunta={"Qual é o perfil do aluno Inteli?"} local={"Ateliê"} resposta={'O aluno do Inteli é caracterizado por ser curioso, resiliente e apaixonado por tecnologia, com interesse em negócios e liderança.'} />
            </View>
          </View>
        ) : (
          <View style={styles.status_atual}>
            <Text style={{ color: "#FFF" }}>
              Nenhum tour em andamento no momento.
            </Text>
          </View>
        )}
      </ScrollView>

      {alert && (
        <AlertPopup />
      )}

      {isNow && (
        <AlertButton onOpen={() => setAlert(true)} />
      )}
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
    width: "85%",
    marginTop: 15
  },
});
