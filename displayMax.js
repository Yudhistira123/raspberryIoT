// parolaDisplay.js
import mqtt from "mqtt";
import Max7219 from "max7219-display";

// ====== MQTT & Wi-Fi Config ======
const mqttHost = "mqtt://103.27.206.14";
const mqttTopic = "parola/display";
const mqttPort = 1883;

// ====== MAX7219 Config ======
const display = new Max7219({
  device: 4, // same as MAX_DEVICES = 4
  csPin: 8, // CS = GPIO8 (CE0)
  spiBus: 0, // default SPI0
  orientation: 0,
});

display.init();
display.clear();
display.writeText("WELCOME TO PAROLA!");

// ====== MQTT Setup ======
const client = mqtt.connect(mqttHost, { port: mqttPort });

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
  client.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log("Subscribed to topic:", mqttTopic);
      display.clear();
      display.writeText("Display Connected");
    }
  });
});

client.on("message", (topic, message) => {
  const text = message.toString();
  console.log("📩 Received message:", text);
  display.clear();
  display.writeText(text);
});

client.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

process.on("SIGINT", () => {
  display.clear();
  display.writeText("Bye!");
  console.log("🛑 Exit program");
  process.exit(0);
});
