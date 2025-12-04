import { View, StyleSheet, Platform, UIManager, Text, ScrollView, Alert } from "react-native"
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";
import { useState, useEffect } from 'react'
import { Pergunta } from "@/components/Pergunta";
import Checkpoint from "@/components/Checkpoint";
import {
  tourService,
  perguntasService,
  respostasService,
  checkpointService,
  type Checkpoint as ApiCheckpoint,
} from "@/services/api";
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
  const [tourId, setTourId] = useState<number | null>(null);
  const [perguntas, setPerguntas] = useState<
    { id: number | undefined; pergunta: string; local: string; resposta: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const mockId = await tourService.tourMock();
        const id = typeof mockId === "number" ? mockId : (mockId as any)?.data ?? null;
        setTourId(id);

        if (!id) {
          setError("Nenhum tour selecionado.");
          setIsNow(false);
          return;
        }

        const [hasTourNow, perguntasResp, checkpointResp] = await Promise.all([
          tourService.getById(id),
          perguntasService.listByTour(id),
          checkpointService.listByTour(id),
        ]);

        setIsNow(hasTourNow);

        const checkpointMap = new Map<number, ApiCheckpoint["tipo"]>();
        (checkpointResp.data ?? []).forEach((cp) => {
          if (cp.id != null) {
            checkpointMap.set(cp.id, cp.tipo);
          }
        });

        const perguntasComRespostas = await Promise.all(
          (perguntasResp.data ?? []).map(async (pergunta) => {
            let respostaTexto = "Sem resposta ainda.";
            try {
              if (pergunta.id != null) {
                const respostasResp = await respostasService.listByPergunta(pergunta.id);
                const primeira = respostasResp.data?.[0];
                if (primeira?.texto) respostaTexto = primeira.texto;
              }
            } catch (resErr) {
              console.warn("Erro ao buscar resposta", resErr);
            }

            const local = checkpointMap.get(pergunta.checkpoint_id) ?? `Checkpoint ${pergunta.checkpoint_id}`;

            return {
              id: pergunta.id,
              pergunta: pergunta.texto,
              local,
              resposta: respostaTexto,
            };
          }),
        );

        setPerguntas(perguntasComRespostas);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar as perguntas.");
        setIsNow(false);
      } finally {
        setLoading(false);
      }
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
        {loading ? (
          <Text style={{ color: "#FFF" }}>Carregando...</Text>
        ) : error ? (
          <View style={styles.status_atual}>
            <Text style={{ color: "#FFF" }}>{error}</Text>
          </View>
        ) : isNow ? (
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
              {perguntas.length === 0 ? (
                <Text style={{ color: "#FFF" }}>Nenhuma pergunta registrada.</Text>
              ) : (
                perguntas.map((p) => (
                  <Pergunta
                    key={p.id ?? `${p.pergunta}-${p.local}`}
                    pergunta={p.pergunta}
                    local={p.local}
                    resposta={p.resposta}
                  />
                ))
              )}
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
        <AlertPopup
          onClose={() => setAlert(false)}
          tourId={tourId}
        />
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
