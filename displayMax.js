import Max7219 from "max7219-display";
import mqtt from "mqtt";

// === SPI 0.0 = CE0 ===
// If your MAX7219 uses CE1, use "/dev/spidev0.1"
const display = new Max7219("/dev/spidev0.0", 4); // 4 modules

// === MQTT Configuration ===
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
  display.clear();
  display.writeString(text);
}
