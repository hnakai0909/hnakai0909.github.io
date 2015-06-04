/*
* nsx39.js v1.0.1 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var Nsx39=function(){
    this.sysExPrefix=[ 0xF0, 0x43, 0x79, 0x09, 0x11 ];
    this.sysExSuffix=[ 0xF7 ];
    this.devide=64;
    this.textMap={
        1: {
            "あ": 0x00, "い": 0x01, "う": 0x02, "え": 0x03, "お": 0x04, "か": 0x05, "き": 0x06, "く": 0x07, 
            "け": 0x08, "こ": 0x09, "が": 0x0A, "ぎ": 0x0B, "ぐ": 0x0C, "げ": 0x0D, "ご": 0x0E,
            "さ": 0x15, "す": 0x17, 
            "せ": 0x18, "そ": 0x19, "ざ": 0x1A, "ず": 0x1C, "ぜ": 0x1D, "ぞ": 0x1E,  
            "づ": 0x1C, 
            "し": 0x20, "じ": 0x25, 
            "た": 0x29, "て": 0x2C, "と": 0x2D, "だ": 0x2E,  
            "で": 0x31, "ど": 0x32, "ち": 0x36, 
            "つ": 0x3C, "な": 0x3F, 
            "に": 0x40, "ぬ": 0x41, "ね": 0x42, "の": 0x43, "は": 0x47, 
            "ひ": 0x48, "ふ": 0x49, "へ": 0x4A, "ほ": 0x4B, "ば": 0x4C, "び": 0x4D, "ぶ": 0x4E, "べ": 0x4F, 
            "ぼ": 0x50, "ぱ": 0x51, "ぴ": 0x52, "ぷ": 0x53, "ぺ": 0x54, "ぽ": 0x55,  
            "ま": 0x64, "み": 0x65, "む": 0x66, "め": 0x67, 
            "も": 0x68, "や": 0x6C, "ゆ": 0x6D, "よ": 0x6E, "ら": 0x6F, 
            "り": 0x70, "る": 0x71, "れ": 0x72, "ろ": 0x73, "わ": 0x77, 
            "ん": 0x7B, //, "ん": 0x7C, "ん": 0x7D, "ん": 0x7E, "ん": 0x7F
            "を": 0x7A
        },
        2: {
            "きゃ": 0x0F,
            "きゅ": 0x10, "きょ": 0x11, "ぎゃ": 0x12, "ぎゅ": 0x13, "ぎょ": 0x14,  
            "すぃ": 0x16,
            "ずぃ": 0x1B,
            "づぇ": 0x1D, "づぉ": 0x1E, "しゃ": 0x1F,
            "づぁ": 0x1A, "づぃ": 0x1B,
            "しゅ": 0x21, "しぇ": 0x22, "しょ": 0x23, "じゃ": 0x24,
            "じゅ": 0x26, "じぇ": 0x27,
            "じょ": 0x28, "てぃ": 0x2A, "とぅ": 0x2B,
            "でぃ": 0x2F,
            "どぅ": 0x30,             
            "てゅ": 0x33, "でゅ": 0x34, "ちゃ": 0x35,
            "ちゅ": 0x37,
            "ちぇ": 0x38, "ちょ": 0x39, "つぁ": 0x3A, "つぃ": 0x3B,
            "つぇ": 0x3D, "つぉ": 0x3E, 
            "にゃ": 0x44, "にゅ": 0x45, "にょ": 0x46,
            "ひゃ": 0x56, "ひゅ": 0x57,
            "ひょ": 0x58, "びゃ": 0x59, "びゅ": 0x5A, "びょ": 0x5B, "ぴゃ": 0x5C, "ぴゅ": 0x5D, "ぴょ": 0x5E, "ふぁ": 0x5F, 
            "ふぃ": 0x60, "ふゅ": 0x61, "ふぇ": 0x62, "ふぉ": 0x63,
            "みゃ": 0x69, "みゅ": 0x6A, "みょ": 0x6B, 
            "りゃ": 0x74, "りゅ": 0x75, "りょ": 0x76,
            "うぃ": 0x78, "うぇ": 0x79, "うぉ": 0x7A
        }
    };
    // create Phonetic Symbol's RegExp 
    for(var i=1, rexp=[]; i<=2; i++) {
        for(var key in this.textMap[i]) {
            rexp.push(key);
        }
    };
    this.pRegExp=rexp;
};

Nsx39.prototype={
    addd0: function(d0) {
        this.sysExPrefix.push( d0 );
    },
    deleted0: function() {
        this.sysExPrefix.splice(this.sysExPrefix.length-1, 1);
    },
    setDevide: function(devide) {
        this.devide=devide;
    },
    getUpdateSysExByText: function(ls, Idx, chop) {
        this.addd0( 0x0A );
        var errCount=0;
        var outTmp=[], out=[];
        var devide=this.devide;
        outTmp=[];
        outTmp.push(Idx);
        
        var tmp=ls;
        if(chop==true) {
            tmp=ls.substr(0, devide);
        }

        if(ls.substr(devide-1, 2).length==2 && typeof this.textMap[2][ls.substr(devide-1, 2)]!="undefined") {
            tmp=ls.substr(0, devide+1);
        }
        
        var re= new RegExp("^"+tmp);
        ls=ls.replace(re, "");
        
        for(var j=0; j<tmp.length; j++) {
            var t;
            t=this.textMap[2][tmp.substring(j, j+2)];
            if(typeof t==="undefined") {
                t=this.textMap[1][tmp.substring(j, j+1)];
            } else {
                j++;
            }
            if(typeof t==="undefined") {
                errCount++;
            } else {
                outTmp.push(t);
            }
        }
        out=this.sysExPrefix.concat(outTmp, this.sysExSuffix);

        for(var i=0, tmp=""; i<out.length; i++) {
            tmp=tmp + "0x" + out[i].toString(16) + " " ;
        }
        this.deleted0();
        return {"sysEx": out, "errCount": errCount};
    },
    getTextBySysEx: function(msg, Idx) {
        var out="", breakF=false;
        this.addd0( 0x1F );
        for(var i=0; i<this.sysExPrefix.length; i++) {
            if(i!=5 && msg[i]!=this.sysExPrefix[i]) {
                this.deleted0();
                return false;
            }
        }
        for(var i=this.sysExPrefix.length+1; i<msg.length-1; i++) {
            for(var val0 in this.textMap ) {
                for(var val1 in this.textMap[val0]) {
                    if(this.textMap[val0][val1]==msg[i]) {
                        out = out + val1;
                        breakF=true;
                        break;
                    }
                }
                if(breakF==true) {
                    breakF=false;
                    break;
                }
            }
        }
        var arOut=this.createLyricsReqOrder(out);
        this.deleted0();
        return {"lyrics": out, "lyricsOrder":arOut};
    },
    createLyricsReqOrder: function(w){
        for(var i=0, arOut=[]; i<w.length; i++) {
            arOut.push(i);
            if(w.substr(i+1, 1).match(/ぁ|ぃ|ぅ|ぇ|ぉ|ゃ|ゅ|ょ|っ/)!=null) {
                i++;
            }
        }
        return arOut;
    },
    acceptablePhoneticSym: function(w) {
        var sysExC=this.getUpdateSysExByText(w, 0, false);
        var sysEx=sysExC.sysEx;
        var aw=this.getTextBySysEx(sysEx, 0);
        // -2: d0, slotNo
        var count=sysEx.length-this.sysExPrefix.length-this.sysExSuffix.length-2;
        return {"count": parseInt(count), "aw": aw.lyrics, "errCount":sysExC.errCount, realCount:w.length};
    }

};


var nsx39=new Nsx39();
