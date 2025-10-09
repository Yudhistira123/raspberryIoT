import rpio from "rpio";

rpio.init({ gpiomem: false }); // use /dev/mem if pigpiod not used
const pin = 36;

rpio.open(pin, rpio.OUTPUT, rpio.LOW);

setInterval(() => {
  const state = rpio.read(pin);
  rpio.write(pin, state ^ 1);
  console.log("LED", state ? "OFF" : "ON");
}, 500);
