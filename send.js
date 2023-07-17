const mqtt = require('mqtt');
const zlib = require('zlib');

const brokerUrl = 'mqtt://test.mosquitto.org:1883';
const client = mqtt.connect(brokerUrl);

// Dados de exemplo
const jsonData = {
    "teste": "12345678998746532216597844652313516549846513265489305",
  "id": 123,
  "name": "João da Silva",
  "email": "joao.silvakdfskldjfskjdfksjkdlfjskdfjskldjfksjdfklsjdfklsjdklfjskldfjsdk@example.com",
  "age": 30,
  "address": {
    "street": "Rua das Flores",
    "city": "São Paulo",
    "zipCode": "01234-567"
  },
  "hobbies": ["reading", "cooking", "hiking"]
};

// Transforma o objeto jsonData em uma string JSON
const jsonStringData = JSON.stringify(jsonData);

// Mensagem sem compressão
const uncompressedSize = Buffer.byteLength(jsonStringData); // Tamanho da mensagem sem compressão

client.on('connect', () => {
  console.log('Conexão estabelecida com sucesso!');

  // Publica a mensagem sem compressão em um tópico MQTT
  client.publish('/topico', jsonStringData);

  // Compressão e publicação da mensagem
  const compressedData = zlib.deflateSync(jsonStringData);
  const compressedSize = compressedData.length; // Tamanho da mensagem comprimida

  // Publica a mensagem comprimida em um tópico MQTT
  client.publish('/topico-comprimido', compressedData);

  // Comparação do ganho de compressão
  const gain = 100 - (compressedSize / uncompressedSize) * 100;
  console.log('Ganho de compressão:', gain.toFixed(2), '%');
});



