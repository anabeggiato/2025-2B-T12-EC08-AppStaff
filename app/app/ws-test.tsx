import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";

const WS_URL = "ws://10.140.0.11:8080/v1/ws/tour/check";

const PAYLOAD = {
  data_local: "2025-12-18",
};

type WsResponse = {
  status?: string;
  tour_id?: number;
  codigo?: string;
  perguntas?: {
    id_pergunta?: number;
    texto_pergunta?: string;
    checkpoint?: number;
    texto_resposta?: string | null;
  }[];
};

export default function WsTestScreen() {
  const socketRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState("Desconectado");
  const [message, setMessage] = useState<WsResponse | null>(null);
  const [rawMessage, setRawMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      socketRef.current?.close();
    };
  }, []);

  const buildPayload = () => {
    const now = new Date();
    const horario_verificacao = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return {
      ...PAYLOAD,
      horario_verificacao,
    };
  };

  const sendPayload = () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const payload = buildPayload();
    const payloadText = JSON.stringify(payload);
    socket.send(payloadText);
    setLastPayload(payloadText);
  };

  const connectAndSend = () => {
    setError(null);
    setMessage(null);
    setRawMessage(null);
    setLastPayload(null);

    try {
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;
      setStatus("Conectando...");

      ws.onopen = () => {
        setStatus("Conectado, enviando payload...");
        sendPayload();
        intervalRef.current = setInterval(() => {
          sendPayload();
        }, 30000);
      };

      ws.onmessage = (event) => {
        setStatus("Mensagem recebida");
        setRawMessage(event.data);
        try {
          const parsed = JSON.parse(event.data);
          setMessage(parsed);
        } catch (parseErr) {
          setError("Não foi possível parsear a mensagem como JSON.");
        }
      };

      ws.onerror = () => {
        setStatus("Erro");
        setError("Falha na conexão WebSocket.");
      };

      ws.onclose = () => {
        setStatus("Desconectado");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } catch (err) {
      setStatus("Erro");
      setError(String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste WebSocket</Text>
      <Text style={styles.label}>URL</Text>
      <Text style={styles.code}>{WS_URL}</Text>

      <Pressable style={styles.button} onPress={connectAndSend}>
        <Text style={styles.buttonText}>Conectar e enviar payload</Text>
      </Pressable>

      <Text style={styles.label}>Payload enviado (ultimo)</Text>
      <Text style={styles.code}>{lastPayload ?? "Nenhum envio ainda."}</Text>

      <Text style={styles.label}>Status</Text>
      <Text style={styles.status}>{status}</Text>

      {error && (
        <>
          <Text style={styles.label}>Erro</Text>
          <Text style={styles.error}>{error}</Text>
        </>
      )}

      <Text style={styles.label}>Resposta (JSON)</Text>
      <ScrollView style={styles.responseBox}>
        <Text style={styles.responseText}>
          {message ? JSON.stringify(message, null, 2) : "Sem resposta ainda."}
        </Text>
      </ScrollView>

      <Text style={styles.label}>Resposta bruta</Text>
      <ScrollView style={styles.responseBox}>
        <Text style={styles.responseText}>
          {rawMessage ?? "Sem resposta ainda."}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A2C",
    paddingTop: 80,
    paddingHorizontal: 18,
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
  },
  label: {
    color: "#A6A2B8",
    marginTop: 14,
    marginBottom: 4,
    fontWeight: "700",
  },
  code: {
    color: "#FFF",
    backgroundColor: "#2B2341",
    padding: 10,
    borderRadius: 12,
    fontFamily: "monospace",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#855EDE",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  status: {
    color: "#FFF",
    backgroundColor: "#2B2341",
    padding: 10,
    borderRadius: 12,
  },
  responseBox: {
    marginTop: 6,
    backgroundColor: "#2B2341",
    borderRadius: 12,
    maxHeight: 180,
    padding: 10,
  },
  responseText: {
    color: "#FFF",
    fontFamily: "monospace",
  },
  error: {
    color: "#FF9B9B",
    backgroundColor: "#3B1F2E",
    padding: 10,
    borderRadius: 12,
  },
});
