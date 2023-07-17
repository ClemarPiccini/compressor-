const mqtt = require('mqtt');
const zlib = require('zlib');

const brokerUrl = 'mqtt://test.mosquitto.org:1883';
const client = mqtt.connect(brokerUrl);

// Função para descomprimir e mostrar as mensagens
function decompressAndDisplay(topic, message) {
  zlib.inflate(message, (err, decompressedData) => {
    if (err) {
      console.error('Erro ao descomprimir a mensagem:', err);
      return;
    }

    const originalData = decompressedData.toString();
    const compressedSize = message.byteLength;
    const uncompressedSize = decompressedData.byteLength;

    console.log('--- Mensagem Recebida ---');
    console.log('Tópico:', topic);
    console.log('Mensagem Comprimida:', message.toString(), '| Tamanho:', compressedSize, 'bytes');
    console.log('Mensagem Original:', originalData, '| Tamanho:', uncompressedSize, 'bytes');
  });
}

client.on('connect', () => {
  console.log('Conexão estabelecida com sucesso!');

  // Subscreve aos tópicos para receber as mensagens comprimidas
  client.subscribe('/topico');
  client.subscribe('/topico-comprimido');

  // Quando uma mensagem é recebida em algum dos tópicos
  client.on('message', (topic, message) => {
    if (topic === '/topico') {
      // Mensagem sem compressão (em formato JSON)
      console.log('--- Mensagem Recebida ---');
      console.log('Tópico:', topic);
      console.log('Mensagem Original:', message.toString(), '| Tamanho:', message.byteLength, 'bytes');
    } else if (topic === '/topico-comprimido') {
      // Mensagem comprimida
      decompressAndDisplay(topic, message);
    }
  });
});
