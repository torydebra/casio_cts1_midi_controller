# casio_cts1_midi_controller

I have a [Casio CTS1](https://www.casio.com/it/electronic-musical-instruments/product.CT-S1BKSET/) keyboard but it is not "officially" 
possible to split the keys and having multiple voices in different parts of the keyboard. It is possible with this app now.

## Instruction
Download the apk, or clone and build with android studio. App is very basic but *it works on my phone*. Only wired connection (usb) is available, and you must keep 
the phone connected to the keyboard. I feel no latency buy I am not absolutely an expert. Also, you should mute the first sound layer by pressing ```function + F#2```

## Features
Image should be self explanatory.
- Two different channels (bottom and upper part of the keyboard) can play different voices.
- Selectable split point
- Octave shift for the lower and upper voice indipendently
- 4 buttons per channel for fast voice change. Each voice in each button can be changed with the dropdown menu aside the button
- All Casio voices (61)+1 implemented.
- The +1 is the [standard MIDI drum set](https://en.wikipedia.org/wiki/General_MIDI#Percussion) :sunglasses:
- Activable debug prints for eventual problems

## Description
Casio is also a midi keyboard: you can connect to a device and let be exchange midi data. Hence, it is indeed possible to hack it a bit.
According to some forums online, this casio has two "sound layers". It is not possible to control the top one through midi (which is the one controllable by the keyboard buttons) 
but the second one is controllable. So, as suggested online, you can play any kind of sounds with a *loopback* midi: key pressure is detected by the app, which command back to the key to
play the note but with the voice choosen. Since in this way both sound layers will play, you have to deactivate the first one with ```function + F#2``` (check the manual, I am not 100% sure this is the correct key)
The presence of the two sound layers is also the reason why you need to keep the phone connected: through MIDI it is not possible to change the first layer voice (AFAIK), which is
the one that "memorize" the voice change with the keyboard buttons themselves.

The app is basically a webview that runs the [webmidi.js](https://github.com/djipco/webmidi) library. You can also run it opening the html (in www folder) on a pc. On the phone, I can not find a method
to open interpet the html, so I localhost server was always necessary, but MIDI api does not allow to pass through localhost if this is
for some [secure issues](https://stackoverflow.com/questions/63026587/web-midi-on-chrome-works-with-local-server-but-not-when-served-in-the-cloud).
So the app. 

## TODOs
App is very basic and with for sure improvable design, since I have not so much time but it is anyway working I am releasing as it is for now.  
I would like to improve it one day adding:
- Pitch/modulation wheels
- Save configuration file to keep the "shortcut voices"
- *other pages?*
