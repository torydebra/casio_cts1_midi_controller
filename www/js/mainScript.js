// Enable WEBMIDI.js and trigger the onEnabled() function when ready
WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function triggered when WEBMIDI.js is ready
async function onEnabled() {

    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
      document.body.innerHTML+= "No device detected.";
    } else {
      WebMidi.inputs.forEach((device, index) => {
        document.body.innerHTML+= `${index}: ${device.name} <br>`;
      });

    //   WebMidi.outputs[1].channels.forEach((device, index) => {
    //     document.body.innerHTML+= `${index}: ${device.name} <br>`;
    //   });

    }

    const mySynth = WebMidi.inputs[1];
    // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")

    mySynth.channels[1].addListener("noteon", e => {
        //document.body.innerHTML+= `${e.note.name} <br>`;
        channel.playNote(e.note);
        console.log(e)
    });

    let output = WebMidi.outputs[1];
    let channel = output.channels[1];
    channel.playNote("C3");
    await sleep(500);
    output.sendControlChange("bankselectcoarse", parseInt("00100000"));
    // data = new Uint8Array(3);
    // data[0] = 148;
    // data[1] = 60;
    // data[2] = 127;
    //output.send(data)
    channel.sendProgramChange(1)
    await new Promise(r => setTimeout(r, 500));
    channel.playNote("C3");



//     data1 = new Uint8Array(3);
// data1[0] = 176;
// data1[1] = 0;
// data1[2] = 2;
// data2 = new Uint8Array(3);
// data2[0] = 176;
// data2[1] = 32;
// data2[2] = 64;
// data3 = new Uint8Array(2);
// data3[0] = 192;
// data3[1] = 42;
// data4 = new Uint8Array(3);
// data4[0] = 176;
// data4[1] = 7;
// data4[2] = 127;
// data5 = new Uint8Array(3);
// data5[0] = 176;
// data5[1] = 72;
// data5[2] = 64;
// mySynthOut.send(data1)
// mySynthOut.send(data2)
// mySynthOut.send(data3)
// mySynthOut.send(data4)
// mySynthOut.send(data5)


}