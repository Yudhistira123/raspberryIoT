import RPi.GPIO as GPIO
import time
import os

# --- Setup ---
GPIO.setmode(GPIO.BCM)

# External LED pin (board pin 36)
LED_EXT = 16
GPIO.setup(LED_EXT, GPIO.OUT)

# Onboard ACT LED path (GPIO47 controlled by system)
LED_ACT_PATH = "/sys/class/leds/led0"

# Disable kernel control of ACT LED so we can control it manually
os.system(f"echo none | sudo tee {LED_ACT_PATH}/trigger > /dev/null")

def set_act_led(state: bool):
    """Turn onboard ACT LED on/off."""
    with open(f"{LED_ACT_PATH}/brightness", "w") as f:
        f.write("1" if state else "0")

print("Flip-flop blinking: external LED (GPIO16) and onboard ACT LED (GPIO47)")
print("Press Ctrl+C to stop.")

try:
    while True:
        # External ON, ACT OFF
        GPIO.output(LED_EXT, GPIO.HIGH)
        set_act_led(False)
        time.sleep(0.3)

        # External OFF, ACT ON
        GPIO.output(LED_EXT, GPIO.LOW)
        set_act_led(True)
        time.sleep(0.3)

except KeyboardInterrupt:
    print("\nStopping program...")

finally:
    # Turn off both LEDs and clean up
    GPIO.output(LED_EXT, GPIO.LOW)
    set_act_led(False)
    GPIO.cleanup()
    # Restore ACT LED to normal activity trigger (optional)
    os.system(f"echo mmc0 | sudo tee {LED_ACT_PATH}/trigger > /dev/null")
