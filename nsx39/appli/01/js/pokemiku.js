/*
* pokeMiku.js v1.0.1 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var PokeMiku=function() {
    this.sysExPrefix=[ 0xF0, 0x43, 0x79, 0x09, 0x11 ];
    this.sysExSuffix=[ 0xF7 ];
    this.textSlotSelected="";
    this.lyricsPos=false;
    this.connectionAlive=false;
    this.statusReport=[0];
    this.firmWare=false;
    this.doremiMode=false;
    this.swStatus=[
        false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false
    ];
    this.swMax=0;
    this.bStatus={"prev":"0000000000000000", "now":"0000000000000000", "maxCount":0};
    this.presetSlot=[
        "-",
        "-", "-", "-", "-", "-",
        "-", "-", "-", "-", "-",
        "-", "-", "-", "-", "-"
    ];
    this.presetSlotOrder=[
        [],
        [], [], [], [], [],
        [], [], [], [], [],
        [], [], [], [], []
    ];
};

PokeMiku.prototype={
    exportAllLyricsInSlot: function(){
    },
    importAllLyricsToSlot: function(event){
    },
    getAllSlot: function(){
        return this.presetSlot;
    },
    updateOneSlot: function(idx, text) {
        this.presetSlot[idx]=text;
    },
    updateOneUISlot: function() {
    },
    OneUISlot: function() {
    },
    selectOneUISlot: function() {
    },
    noteOnUIAction: function() {
    },
    noteOffUIAction: function() {
    },
    initAllSlot: function() {
    },
    requestLyricsPos: function() {
    },
    fModeNormal: function() {
    },
    fModeDoReMi: function() {
    },
    fKashiSlotSel: function() {
    },
    fKashiPosSel: function() {
    },
    checkMsg: function(msg){
        if(msg[msg.length-1]==this.sysExSuffix[0]) {
            for(var i=0, count=0; i<this.sysExPrefix.length; i++) {
                if(msg[i]==this.sysExPrefix[i]) {
                    count++;
                }
            }
            if(count==this.sysExPrefix.length) {
                var d0=msg[this.sysExPrefix.length];
                var dd=[];
                for(var i=this.sysExPrefix.length+1; i<msg.length-1; i++) {
                    dd.push(msg[i]);
                }
                switch(d0) {
                  case 0x0A:
                    console.log("[Input Words]", dd);
                    break;
                  case 0x0B:
                    console.log("[Command Slot Request]", dd);
                    break;
                  case 0x1B:
                    console.log("[Command Slot Response]", dd, msg);
                    break;
                  case 0x0c:
                    console.log("[Command Slot Input]", dd);
                    break;
                  case 0x01:
                    console.log("[Version Request]", dd);
                    break;
                  case 0x11:
                    this.connectionAlive=(new Date).getTime(); // get UnixTime
                    if(this.firmWare==false) {
                        this.firmWare=dd.join(".");
                    }
                    //console.log("[Version Response]", dd);
                    break;
                  case 0x0E:
                    console.log("[Lyrics Position Request]", dd);
                    break;
                  case 0x1E:
                    this.lyricsPos=dd;
                    //console.log("[Lyrics Position Response]", dd);
                    break;
                  case 0x0F:
                    console.log("[Lyrics Request]", dd);
                    break;
                  case 0x1F:
                    this.getLyricsBySysEx(msg);
                    //console.log("[Lyrics Response]", dd, msg);
                    break;
                  case 0x20:
                    var d=(dd[0]<<8)+dd[1];
                    var dBin=("0000000000000000"+d.toString(2)).slice(-16);
                    // 7:VolUp, 6:VolDown
                    if(dd[0]!=0 || dd[1]!=0) {
                        var ct=0;
                        for(var i=10; i<dBin.length; i++) {
                            ct+=parseInt(dBin[i]);
                        }
                        if(ct>this.bStatus.maxCount) {
                            this.bStatus.maxCount=ct;
                        }
                        this.bStatus.prev=this.bStatus.now;
                        this.bStatus.now=dBin;
                        if ((this.bStatus.now.substr(7, 1)==0 && this.bStatus.now.substr(6, 1)==0)
                            && (this.bStatus.prev.substr(7, 1)==0 && this.bStatus.prev.substr(6, 1)==0)) {
                            if(this.bStatus.now.substr(9, 2)=="11") {
                                this.doremiMode=true;
                            } else {
                                var sum=0;
                                for(var i=10; i<dBin.length; i++) {
                                    sum+=parseInt(dBin[i]);
                                }
                                if(sum>0) {
                                    this.doremiMode=false;
                                }
                            }
                        }
                    } else if(this.bStatus.maxCount<3) {
                        this.checkButtonStatus(d0, dd);
                        this.bStatus.maxCount=0;
                    } else if(this.bStatus.maxCount>=3 && this.bStatus.prev.substr(9, 2)=="11" ) {
                        this.doremiMode=true;
                        this.checkButtonStatus(d0, dd);
                        this.bStatus.maxCount=0;
                    }
                    //console.log("[Button Status]", d, dd);
                    break;
                  case 0x21:
                    this.statusReport=dd;
                    //console.log("[Status Report]", dd);
                    break;
                  case 0x70:
                    console.log("[eVocaloid Data Input]", dd);
                    break;
                  case 0x71:
                    console.log("[eVocaloid Data Response]", dd);
                    break;
                default:
                    console.log("[unrecognize SysEx]", d0, dd);
                    break;
                }
            }
        } else { // check SysEx
            switch(msg[0]) {
              case 0x80:
                //console.log("[NoteOff] ", msg[1], msg[2]);
                this.noteOffUIAction();
                break;
              case 0x90:
                //console.log("[NoteOn] ", msg[1], msg[2]);
                this.noteOnUIAction();
                break;
              case 0xe0:
                //console.log("[PitchBend] ", msg[1]);
                break;
                
            }
            //console.log(msg);
        }
    },
    getLyricsBySysEx: function(msg) {
    },
    checkButtonStatus: function(d0, dd) {
    }
};

var pmk=new PokeMiku();
