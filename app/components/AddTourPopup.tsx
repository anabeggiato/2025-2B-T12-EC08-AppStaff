import { useState } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native'
import { CheckBox } from 'react-native-elements'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { Tour } from '@/app/(tabs)/index'
import DateTimePicker from '@react-native-community/datetimepicker'

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

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showTimeInicio, setShowTimeInicio] = useState(false);
  const [showTimeFim, setShowTimeFim] = useState(false);


  function updateField(field, value) {
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

  const showDatepicker = () => {
    setShow(true);
  };

  const changeDate = (event, selectedDate) => {
    const currentDate = selectedDate || form.data;
    setShow(Platform.OS === 'ios');
    updateField("data", currentDate);
  };

  const formatarData = (d) => {
    return d.toLocaleDateString("pt-BR");
  };

  const formatarHora = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const changeHoraInicio = (event, selectedDate) => {
    if (selectedDate) {
      // Define horário inicial
      updateField("horaInicioPrevista", formatarHora(selectedDate));

      // Cria nova data para o horário final
      const fim = new Date(selectedDate.getTime());
      fim.setHours(fim.getHours() + 1);

      // Define horário final automaticamente
      updateField("horaFimPrevista", formatarHora(fim));
    }

    setShowTimeInicio(false);
  };


  const changeHoraFim = (event, selectedDate) => {
    if (selectedDate) {
      updateField("horaFimPrevista", formatarHora(selectedDate));
    }
    setShowTimeFim(false);
  };


  return (
    <View style={styles.overlay}>
      <View style={styles.add_tour_popup}>
        <View style={[styles.topo]}>
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

          {/*Informações gerais*/}
          <View style={styles.bloco_input}>
            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Staff</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => updateField("responsavel", text)}
                value={form.responsavel}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Data</Text>

              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  style={styles.input}
                  value={formatarData(form.data)}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={form.data}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={changeDate}
                />
              )}
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Horário inicial</Text>

              <TouchableOpacity onPress={() => setShowTimeInicio(true)}>
                <TextInput
                  style={styles.input}
                  value={form.horaInicioPrevista}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {showTimeInicio && (
                <DateTimePicker
                  testID="timePickerInicio"
                  value={new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={changeHoraInicio}
                />
              )}
            </View>


            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Horário final</Text>

              <TouchableOpacity onPress={() => setShowTimeFim(true)}>
                <TextInput
                  style={styles.input}
                  value={form.horaFimPrevista}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {showTimeFim && (
                <DateTimePicker
                  testID="timePickerFim"
                  value={new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={changeHoraFim}
                />
              )}
            </View>
          </View>

          {/*Visitantes*/}
          <Text style={[styles.title, { paddingBottom: 8 }]}>Visitantes</Text>

          <View style={styles.bloco_input}>
            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("nomeVisitante", text)}
                value={form.nomeVisitante}
              />
            </View>

            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("emailVisitante", text)}
                value={form.emailVisitante}
              />
            </View>

            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>Perfil</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("perfilvisitante", text)}
                value={form.perfilvisitante}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("cpf", text)}
                value={form.cpf}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("telefone", text)}
                value={form.telefone}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("estado", text)}
                value={form.estado}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                onChangeText={text => updateField("cidade", text)}
                value={form.cidade}
              />
            </View>
          </View>

          <View>
            <CheckBox
              title='Vai trazer acompanhante?'
              checked={form.acompanhante}
              onPress={() => updateField("acompanhante", !form.acompanhante)}
            />

            {form.acompanhante && (
              <>
                <View style={[styles.input_section, { width: "95%" }]}>
                  <Text style={styles.label}>Nome do Acompanhante</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => updateField("nomeAcompanhante", text)}
                    value={form.nomeAcompanhante}
                  />
                </View>

                <View style={[styles.input_section, { width: "95%" }]}>
                  <Text style={styles.label}>CPF do Acompanhante</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={text => updateField("cpfAcompanhante", text)}
                    value={form.cpfAcompanhante}
                  />
                </View>
              </>
            )}
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
    fontWeight: 700,
    color: "404040"
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

  input: {
    fontSize: 14,
    paddingHorizontal: 0,
  },

  button_section: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },

  button: {
    borderWidth: 1,
    borderColor: "#855EDE",
    borderRadius: 20,
    padding: 8
  }

})
