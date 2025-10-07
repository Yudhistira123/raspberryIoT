import { Gpio } from "pigpio";

const led = new Gpio(17, { mode: Gpio.OUTPUT });
let value = 0;

setInterval(() => {
  value ^= 1;
  led.digitalWrite(value);
  console.log("LED is now", value ? "ON" : "OFF");
}, 1000);
