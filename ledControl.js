import { Gpio } from "onoff";

// Define GPIO pin 17 as output Yudhistira
const led = new Gpio(17, "out");

// Blink LED every second
let value = 0;
setInterval(() => {
  value = value ^ 1; // toggle between 0 and 1
  led.writeSync(value);
  console.log(`LED is now ${value ? "ON" : "OFF"}`);
}, 1000);

// Cleanup on exit
process.on("SIGINT", () => {
  led.writeSync(0);
  led.unexport();
  console.log("Bye 👋");
  process.exit();
});
