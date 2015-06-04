/*
* smf.js v1.0.0 by @yoya
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var SMF = function() {
    this.division = null;
    this.messageArray = null;
    this.messageOffset = 0;
    this.lastT = 0;
    this.tempo = 0.5;
    this.midiEventListener = null;
    this.midiProgressListener = null;
}

SMF.prototype = {
    read: function(smfdata){
        var d = new Uint8Array(smfdata);
        d.substr = function(start, end) { // 
            var s = [];
            while (start < end) {
                s.push(String.fromCharCode(this[start++]));
            }
            return s.join('');
        }
        var o = 0;
        var len = smfdata.byteLength;
        var tracks = [];
        while (o < len) {
            var chunk = d.substr(o, o += 4);
            var chunkLength = (d[o++]<<24) + (d[o++]<<16) + (d[o++]<<8) + d[o++];
            var chunkNext = o + chunkLength;
            var status = 0;
            if (chunk === 'MThd') {
                var format   = (d[o++]<<8) + d[o++];
                var nTracks  = (d[o++]<<8) + d[o++];
                this.division = (d[o++]<<8) + d[o++]; // TODO: MSB
            } else if (chunk === 'MTrk') {
                var advance = 0;
                var prevSysEx; // for continuing SysEx
                while (o < chunkNext) {
                //                    console.debug("o:"+o);
                    var delta = 0;
                    do {
                        delta = (delta<<7) + (d[o]&0x7f);
                    } while (d[o++]&0x80);
                    if (d[o]&0x80) {
                        status = d[o++];
                    } else {
                        ; // prev status.
                    }
                    if (status === 0xFF) { // Meta Event
                        delta = 0;
                    }
                    advance += delta;
                    //console.debug("delta:"+delta+", status:"+status.toString(16));
                    var type = status >> 4;
                    var midi = [status];
                    if (type < 0xF) {
                        if ((type == 0xC) || (type == 0xD)) {
                            midi.push(d[o++]);
                        } else {
                            midi.push(d[o++], d[o++]);
                        }
                    } else {
                        var subtype = status & 0x0F;
                        if (subtype === 0xF) { // Meta Event
                            midi.push(d[o++]); // meta type
                        }
                        var length = 0;
                        do {
                            length = (length<<7) + (d[o]&0x7f);
                        } while (d[o++]&0x80);
                        for (var i=0 ; i < length ; i++) {
                            midi.push(d[o++]);
                        }
                        if (subtype !== 0xF) { // SysEx F0 or F7
                            if (subtype === 0x0) { // SysEx
                                prevSysEx = midi;
                            } else {
                                // merge message to F0
                                for (var i = 1, n = midi.length; i < n ; i++) {
                                    prevSysEx.push(midi[i]);
                                }
                            }
                            if (subtype === 0x7) { // SysEx continuing
                                continue // skip;
                            }
                            midi = prevSysEx;
                        }
                    }
                    tracks.push( {delta:delta, t:advance, midi:midi} );
/*
                    var out=[];
                    for(var i=0; i<midi.length; i++){
                        out.push(midi[i].toString(16));
                    }
                    console.log(out.join(" "));
*/
                }
                o = chunkNext;
            } else {
                console.error('unknown chunk: '+chunk);
                break;
            }
        }
        this.messageArray = tracks.sort(
            function(a, b) { return (a['t']<b['t'])?-1:((a['t']==b['t'])?0:1); }
              );
        this.lastT = this.messageArray[this.messageArray.length - 1].t;
    },
    hasNext: function() {
        return (this.messageOffset < this.messageArray.length);
    },
    getNext: function() {
        if (this.hasNext() === false) {
            return null;
        }
        return this.messageArray[this.messageOffset++];
    },
    peekNext: function() {
        if (this.hasNext() === false) {
            return null;
        }
        return this.messageArray[this.messageOffset];
    },
    play: function() {
        if (this.progressListener !== null) {
            var nextmesg = this.peekNext();
            if (nextmesg !== null) {
                this.progressListener(nextmesg.t, this.lastT);
            }
        }
        do {
            midimesg = this.getNext();
            if (midimesg === null) {
                console.debug("smf send complete!!!");
                return 0;
            }
            var midi = midimesg.midi;
            // midi[0]:status
            if (midi[0] === 0xFF) {
                if (midi[1] == 0x51) { // Set Tempo
                    var tempo = (midi[2]*0x100 + midi[3])*0x100 + midi[4];
                    this.tempo = tempo / 1000000; // seconds
                }
            } else { // SysEx
                if (this.midiEventListener !== null) {
                    this.midiEventListener(midi);
                }
            }
            var nextmesg = this.peekNext();
            if (nextmesg === null) {
                continue;
            }
            deltaTime = (nextmesg.t - midimesg.t) / this.division * this.tempo;
        } while (deltaTime === 0)
        setTimeout(this.play.bind(this), 1000 * deltaTime);
    },
    addMidiEventListener: function(listener) {
        this.midiEventListener = listener;
    },
    addProgressListener: function(listener) {
        this.progressListener = listener;
    }
};
