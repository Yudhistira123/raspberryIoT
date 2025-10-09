// displayMax.js
import mqtt from "mqtt";
import Max7219 from "max7219-display";

// ===== MQTT Config =====
const mqttHost = "mqtt://103.27.206.14";
const mqttTopic = "parola/display";
const mqttPort = 1883;

// ===== MAX7219 Config =====
// Use SPI device path, not numbers.
const display = new Max7219({
  device: "/dev/spidev0.0", // SPI0 CE0 (CS on GPIO8)
  cascaded: 4, // number of 8x8 modules
  rotation: 0, // no rotation
  font: "cp437", // built-in simple font
});

await display.init();
await display.clear();
await display.print("WELCOME TO PAROLA!");

// ===== MQTT Setup =====
const client = mqtt.connect(mqttHost, { port: mqttPort });

client.on("connect", async () => {
  console.log("✅ Connected to MQTT broker");
  client.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log("Subscribed to topic:", mqttTopic);
    }
  });

  await display.clear();
  await display.print("Display Connected");
});

client.on("message", async (topic, message) => {
  const text = message.toString();
  console.log("📩 Received message:", text);
  await display.clear();
  await display.print(text);
});

client.on("error", (err) => {
  console.error("❌ MQTT error:", err);
});

process.on("SIGINT", async () => {
  await display.clear();
  await display.print("Bye!");
  console.log("🛑 Exit program");
  process.exit(0);
});
