import Max7219 from "max7219-display";
import mqtt from "mqtt";

// === Initialize the Display ===
const display = new Max7219("/dev/spidev0.0", {
  blocks: 4, // number of cascaded MAX7219 modules
});

// === MQTT Config ===
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

// === Function to Show Text ===
function showMessage(text) {
  try {
    display.clear(); // clear previous text
    display.text(text, { x: 0 }); // write text starting at column 0
    display.render(); // send to the display
  } catch (err) {
    console.error("Display error:", err);
  }
}
