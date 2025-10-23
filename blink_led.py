import RPi.GPIO as GPIO
import time

# Use BCM pin numbering
GPIO.setmode(GPIO.BCM)

# Set pin 16 (which is board pin 36) as output
LED_PIN = 16
GPIO.setup(LED_PIN, GPIO.OUT)

print("LED blinking on pin 36 (GPIO16). Press Ctrl+C to stop.")

try:
    while True:
        GPIO.output(LED_PIN, GPIO.HIGH)  # Turn LED on
        time.sleep(1)                    # Wait 1 second
        GPIO.output(LED_PIN, GPIO.LOW)   # Turn LED off
        time.sleep(1)                    # Wait 1 second
except KeyboardInterrupt:
    print("\nStopping program...")
finally:
    GPIO.cleanup()  # Reset GPIO settings
