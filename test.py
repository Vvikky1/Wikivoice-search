import pyttsx3

def test_tts():
    engine = pyttsx3.init()
    engine.say("Testing, one, two, three.")
    engine.runAndWait()

test_tts()
