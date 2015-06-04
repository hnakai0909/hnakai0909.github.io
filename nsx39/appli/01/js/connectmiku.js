/*
* connectMiku.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

//var mIn, mOut;
var connectMiku=function(){    
    this.webMIDIStatus=false;
    this.requestStatus=false;
    this.midi;
    this.inputs;
    this.outputs;
    this.mIn=false;
    this.mOut=false;
    this.firstConnect=false;
};

connectMiku.prototype={
    onmidimessage: function(event){
        console.log("[connectMiku.js] onmidimessage", event);
    },
    checkWebMidiStatus: function() {
        this.webMIDIStatus=true;
        if(typeof navigator.requestMIDIAccess=="undefined") {
            this.webMIDIStatus=false;
        }
        return this.webMIDIStatus;
    },
    init: function(){
        var self=this;
        $(document).ready(function(){            
            navigator.requestMIDIAccess({sysex: true}).then(scb, ecb);
        });
        function scb(access) {
            if(self.mIn==false && self.mOut==false) {
                this.firstConnect=true;
            }
            self.midi=access;

            if (typeof self.midi.inputs === "function") {
                self.outputs=self.midi.outputs();
                self.inputs=self.midi.inputs();
            } else {
                var inputIterator = self.midi.inputs.values();
                self.inputs = [];
                for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
                    self.inputs.push(o.value);
                }
                var outputIterator = self.midi.outputs.values();
                self.outputs = [];
                for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
                    self.outputs.push(o.value);
                }
            }

            self.requestStatus=true;
            
            // MIDI In
            var mi=document.getElementById("midiInSel");
            for(var i=0; i<self.inputs.length; i++) {
                // in modal
                var deviceName=self.inputs[i]["name"];
                mi.options[i]=new Option(deviceName, i);
                // check miku
                if(deviceName.search(/NSX-39/i)>-1) {
                    mi.options[i].selected=true;
                }
            }

            // MIDI OUT
            var mo=document.getElementById("midiOutSel");
            for(var i=0; i<self.outputs.length; i++) {
                // in modal
                var deviceName=self.outputs[i]["name"];
                mo.options[i]=new Option(deviceName, i);
                // check miku
                if(deviceName.search(/NSX-39/i)>-1) {
                    mo.options[i].selected=true;
                }
            }
            
            if(self.inputs.length==0 || self.outputs.length==0) {
                document.querySelector("#divMidiInSelWarning").style.removeProperty("display");
                document.querySelector("#connectSelB").setAttribute("disabled", "disabled");
                document.querySelector("#divMIDIArea").style.setProperty("display", "none");
            }
            
            // Connect to Device
            document.getElementById("connectSelB").addEventListener("click", function(){
                var selIdx=document.getElementById("midiInSel").selectedIndex;
                self.mIn=false;
                self.mIn = self.inputs[selIdx];
                self.mIn.onmidimessage=function(event) {
                    self.onmidimessage(event);
                };
                
                var selIdx=document.getElementById("midiOutSel").selectedIndex;
                self.mOut=false;
                self.mOut = self.outputs[selIdx];

                self.closeConnectionDialog();
                //self.getLiricsFromDevice();
            });

        }
        
        function ecb() {
            console.log("[ERROR] Connect to Miku.");
        }
        
    },
    
    checkMikuConnected: function() {
    },
    getLiricsFromDevice: function() {
    },
    closeConnectionDialog: function() {
    },
    sysExtoString: function(data) {
        for(var i=0, tmp="", a; i<data.length; i++) {
            a=data[i].toString(16).toUpperCase();
            if(a.length==1) {
                a="0"+a;
            }
            tmp=tmp + " 0x" +a;
        }
        return tmp;
    }

};

var connMk= new connectMiku();


