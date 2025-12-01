import { useState } from 'react'
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { Tour } from '@/app/(tabs)/index'
import { FormInput } from './FormInput'
import { DatePickerField } from './DatePickerField'
import { TimePickerField } from './TimePickerField'
import { StatePickerField } from './StatePickerField'
import { CompanionSection } from './CompanionSection'

type Props = {
  onClose: () => void;
  addTour: (tour: Tour) => void;
};

export function AddTourPopup({ onClose, addTour }: Props) {
  const [form, setForm] = useState({
    responsavel: "",
    data: new Date(),
    horaInicioPrevista: "",
    horaFimPrevista: "",
    status: "A começar",
    nomeVisitante: "",
    emailVisitante: "",
    perfilvisitante: "",
    estado: "",
    cpf: "",
    telefone: "",
    cidade: "",
    acompanhante: false,
    nomeAcompanhante: "",
    cpfAcompanhante: ""
  });

  function updateField(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function generateCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";

    for (let i = 0; i < 4; i++) {
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
      code += randomLetter + randomNumber;
    }

    return code;
  }

  function handleSubmit() {
    const newTour: Tour = {
      codigo: generateCode(),
      responsavel: form.responsavel,
      status: "scheduled",
      data: form.data,
      hora_inicio_prevista: form.horaInicioPrevista,
      hora_fim_prevista: form.horaFimPrevista
    };

    addTour(newTour);
    onClose();
  }

  const handleHoraInicioChange = (hora: string) => {
    updateField("horaInicioPrevista", hora);

    // Cria nova data para o horário final
    const [horas, minutos] = hora.split(':');
    const inicio = new Date();
    inicio.setHours(parseInt(horas), parseInt(minutos));

    const fim = new Date(inicio.getTime());
    fim.setHours(fim.getHours() + 1);

    const horaFim = fim.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    updateField("horaFimPrevista", horaFim);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.add_tour_popup}>
        <View style={styles.topo}>
          <Text style={styles.title}>Cadastrar novo tour</Text>
          <View style={styles.botoes}>
            <Pressable onPress={handleSubmit}>
              <Feather name="check-circle" size={20} color="#9747FF" />
            </Pressable>

            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={20} color="black" />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Informações gerais */}
          <View style={styles.bloco_input}>
            <FormInput
              label="Staff"
              value={form.responsavel}
              onChangeText={text => updateField("responsavel", text)}
              width="48%"
            />

            <DatePickerField
              label="Data"
              value={form.data}
              onChange={date => updateField("data", date)}
              width="48%"
            />

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
              onChange={hora => updateField("horaFimPrevista", hora)}
              width="48%"
              testID="timePickerFim"
            />
          </View>

          {/* Visitantes */}
          <Text style={[styles.title, { paddingBottom: 8 }]}>Visitantes</Text>

          <View style={styles.bloco_input}>
            <FormInput
              label="Nome"
              value={form.nomeVisitante}
              onChangeText={text => updateField("nomeVisitante", text)}
              width="95%"
            />

            <FormInput
              label="E-mail"
              value={form.emailVisitante}
              onChangeText={text => updateField("emailVisitante", text)}
              width="95%"
            />

            <FormInput
              label="Perfil"
              value={form.perfilvisitante}
              onChangeText={text => updateField("perfilvisitante", text)}
              width="95%"
            />

            <FormInput
              label="CPF"
              value={form.cpf}
              onChangeText={text => updateField("cpf", text)}
              width="48%"
            />

            <FormInput
              label="Telefone"
              value={form.telefone}
              onChangeText={text => updateField("telefone", text)}
              width="48%"
            />

            <StatePickerField
              label="Estado"
              value={form.estado}
              onChange={value => updateField("estado", value)}
              width="48%"
            />

            <FormInput
              label="Cidade"
              value={form.cidade}
              onChangeText={text => updateField("cidade", text)}
              width="48%"
            />
          </View>

          <CompanionSection
            hasCompanion={form.acompanhante}
            companionName={form.nomeAcompanhante}
            companionCpf={form.cpfAcompanhante}
            onToggleCompanion={() => updateField("acompanhante", !form.acompanhante)}
            onChangeCompanionName={text => updateField("nomeAcompanhante", text)}
            onChangeCompanionCpf={text => updateField("cpfAcompanhante", text)}
          />
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
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  add_tour_popup: {
    width: "90%",
    borderRadius: 20,
    backgroundColor: "white",
    marginTop: 60,
    elevation: 6,
    padding: 16,
    zIndex: 2,
    maxHeight: "95%"
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#404040"
  },
  topo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  botoes: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "20%",
  },
  bloco_input: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 25
  }
});
