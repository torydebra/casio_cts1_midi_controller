// Enable WEBMIDI.js and trigger the onEnabled() function when ready
// WebMidi
//     .enable()
//     .then(onEnabled)
//     .catch(err => alert(err));

let split = "C4";
splitNote = new Note(split);

let chan1_octave_shift = 0;
let chan2_octave_shift = 0;

const DEBUG = true
var mySynthIn;
var mySynthOut;

// Function triggered when WEBMIDI.js is ready
function onEnabled() {

    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
      document.body.innerHTML+= "No device detected.";
      return;
    } 

    mySynthIn = WebMidi.inputs[1];
    mySynthOut = WebMidi.outputs[1];

    mySynthIn.channels[1].addListener("noteon", e => {
        //document.body.innerHTML+= `${e.note.name} <br>`;

        console.log(e.note)
        if (e.note.number <= splitNote.number) {
          e.note.octave = Number(e.note.octave) + Number(chan1_octave_shift)
          mySynthOut.channels[1].playNote(e.note);
        } else {
          e.note.octave = Number(e.note.octave) + Number(chan2_octave_shift)
          mySynthOut.channels[2].playNote(e.note);
        }

    });
    mySynthIn.addListener("noteoff", e => {
        mySynthOut.stopNote(e.note);
        //console.log(e)
    });

    // bytePair = "0,3";
    // const bytes = bytePair.split(',')
    // const lsb = parseInt(bytes[0].trim())
    // const msb = parseInt(bytes[1].trim())
    // console.log(lsb)
    // console.log(msb)

}

$(function() {
  $('input[id=split_note_slider]').change(function(e) {
      // console.log(this.value)
      // console.log(this.type)

      splitNote = new Note(Number(this.value));
    });
});

$(function() {
  $('input[id=split_note_text]').change(function(e) {
    // console.log(this.value)
    splitNote = new Note(this.value);
  });
});

$(function() {
  $('input[id=channel_1_octave]').change(function(e) {
      chan1_octave_shift = this.value;
    });
});

$(function() {
  $('input[id=channel_2_octave]').change(function(e) {
      chan2_octave_shift = this.value;
    });
});


$(function() {
  $('input[id=splitNotechannel1-voice]').change(function(e) {
      sendProgChange(2, 64, 1, instruments[this.value])
    });
});

$(function() {
  $('input[name=channel2-voice]').change(function(e) {
      sendProgChange(2, 64, 2, instruments[this.value])
    });
});

function sendProgChange(msb, lsb, chan, progNum) {
  if (!mySynthOut) return

  try {

    checkValue(lsb, 'Bank LSB')
    checkValue(msb, 'Bank MSB')
    checkChannel(chan)

    if (DEBUG) console.debug(`MIDI prog change - lsb:${lsb}, msb:${msb}, progNum:${progNum}, channel:${chan}`)

    // Send three messages two for bank select and one for prog change
    mySynthOut.send([0xb0 + (chan - 1), 0x00, msb])
    mySynthOut.send([0xb0 + (chan - 1), 0x20, lsb])
    mySynthOut.send([0xc0 + (chan - 1), progNum])
  } catch (err) {
    console.warn('Malformed program change number:', err)
  }
}

// =====================================================================================
// Validation functions
// =====================================================================================
function checkChannel(channel) {
  if (!(channel > 0 && channel <= 16 && Number.isInteger(channel))) {
    throw `MIDI channel '${channel}' is invalid, should be an integer between 1 and 16`
  }
}

function checkValue(value, type = 'value') {
  if (!(value >= 0 && value <= 127 && Number.isInteger(value))) {
    throw `MIDI value '${value}' for '${type}' is invalid, should be an integer between 0 and 127`
  }
}