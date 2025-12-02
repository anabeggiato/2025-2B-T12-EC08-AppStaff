import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { Tour } from "@/app/(tabs)/index";
import { FormInput } from "./FormInput";
import { DatePickerField } from "./DatePickerField";
import { TimePickerField } from "./TimePickerField";
import { StatePickerField } from "./StatePickerField";
import { CompanionSection } from "./CompanionSection";
import { tourService, visitanteService, tourVisitanteService, type Usuario } from "@/services/api";

type Props = {
  onClose: () => void;
  updateTour: (tour: Tour) => void;
  tour: Tour;
};

// Mock de responsáveis enquanto não há rota de usuários
const mockUsuarios: Usuario[] = [
  { id: 1, nome: "João Silva", email: "joao@example.com" },
  { id: 2, nome: "Maria Souza", email: "maria@example.com" },
];

export function EditTourPopup({ onClose, updateTour, tour }: Props) {
  const [form, setForm] = useState({
    roboId: "",
    titulo: "",
    data: new Date(),
    horaInicioPrevista: "",
    horaFimPrevista: "",
    status: "scheduled" as Tour["status"],
    nomeVisitante: "",
    emailVisitante: "",
    perfilvisitante: "",
    estado: "",
    cpf: "",
    telefone: "",
    cidade: "",
    acompanhante: false,
    nomeAcompanhante: "",
    cpfAcompanhante: "",
  });

  const [responsavelSelecionado, setResponsavelSelecionado] = useState<{ id: number; nome: string | null } | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showResponsavelList, setShowResponsavelList] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher o formulário com os dados do tour selecionado
  useEffect(() => {
    if (tour) {
      // Converter a data de string para Date
      const parseDate = (dateStr: string | Date) => {
        if (dateStr instanceof Date) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      };

      setForm({
        roboId: "",
        titulo: "",
        data: parseDate(tour.data),
        horaInicioPrevista: tour.hora_inicio_prevista || "",
        horaFimPrevista: tour.hora_fim_prevista || "",
        status: tour.status || "scheduled",
        nomeVisitante: "",
        emailVisitante: "",
        perfilvisitante: "",
        estado: "",
        cpf: "",
        telefone: "",
        cidade: "",
        acompanhante: false,
        nomeAcompanhante: "",
        cpfAcompanhante: "",
      });

      // Encontrar o responsável no mock de usuários
      const responsavel = mockUsuarios.find(u => u.nome === tour.responsavel);
      if (responsavel) {
        setResponsavelSelecionado({ id: responsavel.id as number, nome: responsavel.nome });
      }
    }
  }, [tour]);

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    setLoadingUsuarios(true);
    setUsuarios(mockUsuarios);
    setLoadingUsuarios(false);
  }, []);

  function toIsoDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function timeWithSeconds(value: string) {
    if (!value) return "";
    const parts = value.split(":");
    if (parts.length === 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
    if (parts.length >= 3)
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].slice(0, 2).padStart(2, "0")}`;
    return value;
  }

  function normalizeStatusInput(value: string) {
    const allowed: Tour["status"][] = ["scheduled", "in_progress", "paused", "finished", "cancelled"];
    return allowed.includes(value as Tour["status"]) ? (value as Tour["status"]) : "scheduled";
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    if (!form.nomeVisitante || !form.emailVisitante || !form.telefone) {
      Alert.alert("Campos obrigatórios", "Preencha nome, email e telefone do visitante.");
      return;
    }

    if (!form.horaInicioPrevista || !form.horaFimPrevista) {
      Alert.alert("Campos obrigatórios", "Preencha os horários do tour.");
      return;
    }

    if (!responsavelSelecionado) {
      Alert.alert("Responsável", "Selecione um responsável para o tour.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Aqui você faria a chamada de UPDATE na API
      // Por enquanto, vamos apenas atualizar localmente
      
      const updatedTour: Tour = {
        codigo: tour.codigo,
        responsavel: responsavelSelecionado?.nome ?? tour.responsavel,
        status: normalizeStatusInput(form.status),
        data: form.data.toLocaleDateString("pt-BR"),
        hora_inicio_prevista: form.horaInicioPrevista,
        hora_fim_prevista: form.horaFimPrevista,
      };

      updateTour(updatedTour);
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o tour.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleHoraInicioChange = (hora: string) => {
    updateField("horaInicioPrevista", hora);

    const [horas, minutos] = hora.split(":");
    const inicio = new Date();
    inicio.setHours(parseInt(horas, 10), parseInt(minutos, 10));

    const fim = new Date(inicio.getTime());
    fim.setHours(fim.getHours() + 1);

    const horaFim = fim.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    updateField("horaFimPrevista", horaFim);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.edit_tour_popup}>
        <View style={styles.topo}>
          <Text style={styles.title}>Editar tour</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={20} color="black" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Informações gerais */}
          <View style={styles.bloco_input}>
            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>Staff responsável</Text>
              <Pressable onPress={() => setShowResponsavelList((prev) => !prev)} style={styles.selectBox}>
                <Text style={{ fontSize: 14 }}>
                  {responsavelSelecionado?.nome || (loadingUsuarios ? "Carregando..." : "Selecione o responsável")}
                </Text>
              </Pressable>
              {showResponsavelList && (
                <View style={styles.dropdown}>
                  {usuarios.map((user) => (
                    <Pressable
                      key={user.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setResponsavelSelecionado({ id: user.id as number, nome: user.nome });
                        setShowResponsavelList(false);
                      }}
                    >
                      <Text>{user.nome || `Usuário #${user.id}`}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <FormInput
              label="Robô ID"
              value={form.roboId}
              onChangeText={(text) => updateField("roboId", text)}
              width="48%"
              keyboardType="numeric"
            />

            <DatePickerField label="Data" value={form.data} onChange={(date) => updateField("data", date)} width="48%" />

            <TimePickerField
              label="Horário inicial"
              value={form.horaInicioPrevista}
              onChange={handleHoraInicioChange}
              width="48%"
              testID="timePickerInicio"
            />

            <TimePickerField
              label="Horário final"
              value={form.horaFimPrevista}
              onChange={(hora) => updateField("horaFimPrevista", hora)}
              width="48%"
              testID="timePickerFim"
            />

            <FormInput label="Título" value={form.titulo} onChangeText={(text) => updateField("titulo", text)} width="95%" />
          </View>

          {/* Visitantes */}
          <Text style={[styles.title, { paddingBottom: 8 }]}>Visitantes</Text>

          <View style={styles.bloco_input}>
            <FormInput label="Nome" value={form.nomeVisitante} onChangeText={(text) => updateField("nomeVisitante", text)} width="95%" />

            <FormInput
              label="E-mail"
              value={form.emailVisitante}
              onChangeText={(text) => updateField("emailVisitante", text)}
              width="95%"
            />

            <FormInput
              label="Perfil"
              value={form.perfilvisitante}
              onChangeText={(text) => updateField("perfilvisitante", text)}
              width="95%"
            />

            <FormInput label="CPF" value={form.cpf} onChangeText={(text) => updateField("cpf", text)} width="48%" />

            <FormInput label="Telefone" value={form.telefone} onChangeText={(text) => updateField("telefone", text)} width="48%" />

            <StatePickerField label="Estado" value={form.estado} onChange={(value) => updateField("estado", value)} width="48%" />

            <FormInput label="Cidade" value={form.cidade} onChangeText={(text) => updateField("cidade", text)} width="48%" />
          </View>

          <CompanionSection
            hasCompanion={form.acompanhante}
            companionName={form.nomeAcompanhante}
            companionCpf={form.cpfAcompanhante}
            onToggleCompanion={() => updateField("acompanhante", !form.acompanhante)}
            onChangeCompanionName={(text) => updateField("nomeAcompanhante", text)}
            onChangeCompanionCpf={(text) => updateField("cpfAcompanhante", text)}
          />

          {/* Botão de Editar */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.editButton, isSubmitting && styles.editButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.editButtonText}>
                {isSubmitting ? "Salvando..." : "Editar tour"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
  },
  edit_tour_popup: {
    width: "90%",
    borderRadius: 20,
    backgroundColor: "white",
    marginTop: 60,
    elevation: 10,
    padding: 16,
    zIndex: 1001,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#404040",
  },
  topo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bloco_input: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 25,
  },
  input_section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  label: {
    color: "rgba(19, 26, 41, 0.48)",
    fontSize: 12,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: "#F8F8F8",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#FFF",
    maxHeight: 160,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#9747FF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 200,
    alignItems: "center",
  },
  editButtonDisabled: {
    backgroundColor: "#D0B3FF",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});