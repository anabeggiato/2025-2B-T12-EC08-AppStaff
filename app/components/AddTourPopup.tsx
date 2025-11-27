import { useState } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { Tour } from '@/app/(tabs)/index'

type Props = {
  onClose: () => void;
  addTour: (tour: Tour) => void;
};

export function AddTourPopup({ onClose, addTour }: Props) {
  const [responsavel, setResponsavel] = useState("");
  const [data, setData] = useState("");
  const [horaInicioPrevista, setHoraInicioPrevista] = useState("");
  const [horaFimPrevista, setHoraFimPrevista] = useState("");
  const [status, setStatus] = useState("A começar");
  const [nomeVisitante, setNomeVisitante] = useState("");
  const [emailVisitante, setEmailVisitante] = useState("");
  const [perfilvisitante, setPerfilVisitante] = useState("");
  const [estado, setEstado] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [acompanhante, setAcompanhante] = useState(false);
  const [nomeAcompanhante, setNomeAcompanhante] = useState("");
  const [cpfAcompanhante, setCpfAcompanhante] = useState("")

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
      responsavel: responsavel,
      status: "scheduled",
      data: data,
      hora_inicio_prevista: horaInicioPrevista,
      hora_fim_prevista: horaFimPrevista
    };

    addTour(newTour);
    onClose();
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.add_tour_popup}>
        <View style={[styles.topo,]}>
          <Text style={styles.title}>Cadastrar novo tour</Text>
          <View style={styles.botoes}>
            <Pressable onPress={handleSubmit}>
              <Feather name="check-circle" size={20} color="#9747FF" />
            </Pressable>

            <Pressable onPress={() => { onClose() }}>
              <MaterialIcons name="close" size={20} color="black" />
            </Pressable>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

          {/*Informações gerais do tour */}
          <View style={styles.bloco_input}>
            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Staff</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setResponsavel(text)}
                value={responsavel}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setData(text)}
                value={data}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Horário inicial</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setHoraInicioPrevista(text)}
                value={horaInicioPrevista}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Horário final</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setHoraFimPrevista(text)}
                value={horaFimPrevista}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Status</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setStatus(text)}
                value={status}
              />
            </View>
          </View>

          {/*informações do visitante*/}
          <Text style={[styles.title, { paddingBottom: 8 }]}>Visitantes</Text>
          <View style={styles.bloco_input}>
            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setNomeVisitante(text)}
                value={nomeVisitante}
              />
            </View>

            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setEmailVisitante(text)}
                value={emailVisitante}
              />
            </View>

            <View style={[styles.input_section, { width: "95%" }]}>
              <Text style={styles.label}>Perfil</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setPerfilVisitante(text)}
                value={perfilvisitante}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setCpf(text)}
                value={cpf}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setTelefone(text)}
                value={telefone}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setEstado(text)}
                value={estado}
              />
            </View>

            <View style={[styles.input_section, { width: "48%" }]}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput
                style={styles.input}
                editable
                onChangeText={text => setCidade(text)}
                value={cidade}
              />
            </View>
          </View>

          <View>
            <CheckBox
              title='Vai trazer acompanhante?'
              checked={acompanhante}
              onPress={() => setAcompanhante(!acompanhante)} />

            {acompanhante && (
              <>
                <View style={[styles.input_section, { width: "95%" }]}>
                  <Text style={styles.label}>Nome do Acompanhante</Text>
                  <TextInput
                    style={styles.input}
                    editable
                    onChangeText={text => setNomeAcompanhante(text)}
                    value={nomeAcompanhante}
                  />
                </View>

                <View style={[styles.input_section, { width: "95%" }]}>
                  <Text style={styles.label}>CPF do Acompanhante</Text>
                  <TextInput
                    style={styles.input}
                    editable
                    onChangeText={text => setCpfAcompanhante(text)}
                    value={cpfAcompanhante}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  )
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
