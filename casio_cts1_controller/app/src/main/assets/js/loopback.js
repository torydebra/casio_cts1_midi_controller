// Enable WEBMIDI.js and trigger the onEnabled() function when ready

let split = "C4";
splitNote = new Note(split);

let chan1_octave_shift = 0;
let chan2_octave_shift = 0;

let chan1_drums = false;
let chan2_drums = false;

debug = false

var mySynthIn;
var mySynthOut;

$(document).ready(function () {
    WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));

    $(function() {
      $('input[id=split_note_slider]').change(function(e) {
          $("#debug_text_area").append(`Split ${this.value}<br>`);

          splitNote = new Note(Number(this.value));
        });
    });


    $(function() {
      $('input[id=split_note_text]').change(function(e) {
        if (debug) { $("#debug_text_area").append(`Split ${this.value}<br>`);}
        splitNote = new Note(this.value);
      });
    });

    $(function() {
      $('input[id=channel_1_octave]').change(function(e) {
        if (debug) { $("#debug_text_area").append(`Octave Change Channel 1: ${this.value}<br>`);}
        chan1_octave_shift = this.value;

        });
    });

    $(function() {
      $('input[id=channel_2_octave]').change(function(e) {
          if (debug) { $("#debug_text_area").append(`Octave Change Channel 2: ${this.value}<br>`);}
          chan2_octave_shift = this.value;
        });
    });

    $('input[name=channel1-voice]').change(function(e) {
        if (instruments[this.value] == 99) {
            chan1_drums = true;
            if (debug) {$("#debug_text_area").append(`DRUMS for channel 1!<br>`);}
        } else {
            chan1_drums = false;
            sendProgChange(2, 64, 1, instruments[this.value]);
        }
    });


    $('input[name=channel2-voice]').change(function(e) {
        if (instruments[this.value] == 99) {
            chan2_drums = true;
            if (debug) {$("#debug_text_area").append(`DRUMS for channel 2!<br>`);}
        } else {
            chan2_drums = false;
            sendProgChange(2, 64, 2, instruments[this.value]);
        }
    });


    $('#debug_text_area_btn_clear').click(function(){
        $("#debug_text_area").html('');
    })

    $('#debug_text_area_btn_activate').click(function(){
        if(debug) {
            this.classList.remove("btn-danger");
            this.classList.add("btn-secondary");
            debug = false;
        } else {
            this.classList.remove("btn-secondary");
            this.classList.add("btn-danger");
            debug = true;
        }
    })


//dropdown options
/**
    var options = [];
    options = document.createElement("div");
    options.className = "row";

    for (i = 0; i<5; i++) {
        col = document.createElement("div");
        col.className="col-2";
        options.appendChild(col);
    }

    for (let i in instruments) {
        option = document.createElement("option");
        option.className = "dropdown-item";
        option.value = `${i}`;
        option.text = `${i}`;


        if (Number(instruments[i]) < 10 ) {
            options.childNodes[0].appendChild(option);

        } else if (Number(instruments[i]) < 22 ) {
            options.childNodes[1].appendChild(option);

        } else if (Number(instruments[i]) < 32 ) {
            options.childNodes[2].appendChild(option);

        } else if (Number(instruments[i]) < 42 ) {
            options.childNodes[3].appendChild(option);

        } else if (Number(instruments[i]) < 61 ) {
            options.childNodes[4].appendChild(option);
        }
    }

    for (var l = 0; l <$(".dropdown-instruments").length; l++) {
         $(".dropdown-instruments")[l].appendChild(options);
    } */

    ///MODAL OPTIONS
    for (var l = 0; l <$(".modal-instruments").length; l++) {
         $(".modal-instruments")[l].appendChild(createModal());
    }


});

// Function triggered when WEBMIDI.js is ready
function onEnabled() {

    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
        $("#debug_text_area").append("No device detected.");
    //return;
    }

    $("#debug_text_area").append(`Inputs: `);
    for (i = 0; i<WebMidi.inputs.length; i++) {
        $("#debug_text_area").append(`${WebMidi.inputs[i].name}, `);
    }
    $("#debug_text_area").append(`<br>`);

    $("#debug_text_area").append(`Outputs: `);
    for (i = 0; i<WebMidi.outputs.length; i++) {
        $("#debug_text_area").append(`${WebMidi.outputs[i].name}, `);
    }
    $("#debug_text_area").append(`<br>`);


    mySynthIn = WebMidi.getInputByName("CASIO");
    mySynthOut = WebMidi.getOutputByName("CASIO");

    mySynthIn.addListener("noteon", e => {

        if (debug) {$("#debug_text_area").append(`Note On: ${e.note.identifier}<br>`);}

        if (e.note.number <= splitNote.number) {
            e.note.octave = Number(e.note.octave) + Number(chan1_octave_shift);
            if (chan1_drums) {
                mySynthOut.channels[10].playNote(e.note);
            } else {
                mySynthOut.channels[1].playNote(e.note);
            }

        } else {
            e.note.octave = Number(e.note.octave) + Number(chan2_octave_shift);
            if (chan2_drums) {
                mySynthOut.channels[10].playNote(e.note);
            } else {
                mySynthOut.channels[2].playNote(e.note);
            }
        }
    });

    mySynthIn.addListener("noteoff", e => {

        if (e.note.number <= splitNote.number) {
            e.note.octave = Number(e.note.octave) + Number(chan1_octave_shift)
            if (chan1_drums) {
                mySynthOut.channels[10].stopNote(e.note);
            } else {
                mySynthOut.channels[1].stopNote(e.note);
            }
        }

        else {
            e.note.octave = Number(e.note.octave) + Number(chan2_octave_shift)
            if (chan2_drums) {
                mySynthOut.channels[10].stopNote(e.note);
            } else {
                mySynthOut.channels[2].stopNote(e.note);
            }
        }
    });
}



function createModal() {
    var options = document.createElement("div");
    options.className = "row btn-group";

    for (i = 0; i<6; i++) {
        col = document.createElement("div");
        col.className="col-2 p-0 m-0";
        options.appendChild(col);
    }

    for (let i in instruments) {
        //<button type="button" class="btn btn-info option" data-dismiss="modal">Option 1</button>
        option = document.createElement("button");
        option.type="button";
        option.className = "btn btn-info btn-check btn-block m-0";
        option.setAttribute("data-dismiss", "modal");
        option.textContent = `${i}`;
        option.addEventListener('click', function() {
            const selectedOption = this.textContent;
            this.closest(".voice-selector").querySelector('input[type="radio"]').value = this.textContent;
            this.closest(".voice-selector").querySelector('input[type="radio"]').nextSibling.data = this.textContent;
          });

        if (Number(instruments[i]) < 10 ) {
            options.childNodes[0].appendChild(option);

        } else if (Number(instruments[i]) < 22 ) {
            options.childNodes[1].appendChild(option);

        } else if (Number(instruments[i]) < 32 ) {
            options.childNodes[2].appendChild(option);

        } else if (Number(instruments[i]) < 42 ) {
            options.childNodes[3].appendChild(option);

        } else if (Number(instruments[i]) < 50 ) {
          options.childNodes[4].appendChild(option);
        }
        else if (Number(instruments[i]) < 100 ) {
            options.childNodes[5].appendChild(option);
        }
    }

    return options;
 }



function sendProgChange(msb, lsb, chan, progNum) {
  if (!mySynthOut) return

  try {

    checkValue(lsb, 'Bank LSB')
    checkValue(msb, 'Bank MSB')
    checkChannel(chan)

    if (debug) {$("#debug_text_area").append(`MIDI prog change - lsb:${lsb}, msb:${msb}, progNum:${progNum}, channel:${chan}<br>`);}

    // Send three messages two for bank select and one for prog change
    mySynthOut.send([0xb0 + (chan - 1), 0x00, msb])
    mySynthOut.send([0xb0 + (chan - 1), 0x20, lsb])
    mySynthOut.send([0xc0 + (chan - 1), progNum])
  } catch (err) {
    console.warn('Malformed program change number:', err)
    $("#debug_text_area").append(`Malformed program change number`);

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