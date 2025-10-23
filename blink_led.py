import RPi.GPIO as GPIO
import time
import os

# --- Setup ---
GPIO.setmode(GPIO.BCM)

# External LED (board pin 36)
LED_EXT = 16
GPIO.setup(LED_EXT, GPIO.OUT)

# Onboard ACT LED path
LED_ACT_PATH = "/sys/class/leds/ACT"

# Disable system control of the ACT LED
os.system(f"echo none | sudo tee {LED_ACT_PATH}/trigger > /dev/null")

def set_act_led(state: bool):
    """Turn onboard ACT LED on/off."""
    try:
        with open(f"{LED_ACT_PATH}/brightness", "w") as f:
            f.write("1" if state else "0")
    except Exception as e:
        print(f"⚠️ Could not control ACT LED: {e}")

print("Flip-flop blinking between external LED (GPIO16) and onboard ACT LED.")
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
    # Turn off LEDs and clean up
    GPIO.output(LED_EXT, GPIO.LOW)
    set_act_led(False)
    GPIO.cleanup()
    # Restore normal system control of ACT LED
    os.system(f"echo mmc0 | sudo tee {LED_ACT_PATH}/trigger > /dev/null")
