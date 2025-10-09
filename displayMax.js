import { LedMatrix } from "node-max7219-led-matrix";
import mqtt from "mqtt";

// Initialize the LED matrix
const matrix = new LedMatrix("/dev/spidev0.0", 4); // 4 cascaded 8x8 matrices

// MQTT configuration
const mqttServer = "mqtt://103.27.206.14:1883";
const mqttTopic = "parola/display";

const client = mqtt.connect(mqttServer);

client.on("connect", () => {
  console.log("✅ Connected to MQTT");
  client.subscribe(mqttTopic, () => {
    console.log(`📡 Subscribed to topic: ${mqttTopic}`);
    showMessage("Display Connected");
  });
});

client.on("message", (topic, message) => {
  const text = message.toString();
  console.log("💬 MQTT Message:", text);
  showMessage(text);
});

function showMessage(text) {
  try {
    matrix.clear();
    matrix.showMessage(text);
  } catch (err) {
    console.error("Display error:", err);
  }
}
