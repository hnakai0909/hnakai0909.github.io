/*
* app.js v1.0.1 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

// userAgent
var ua=new CheckUserAgent();
ua.checkChrome();
var uaTimerId=false;

// regulation
var tou_url="regulations/miku_webapp.txt";
var dRgl=new DispRegulation();
dRgl.show(tou_url);

document.getElementById("showToUJ").addEventListener("click", function() {
    dRgl.getRegulation(tou_url, dRgl);
    var tTimerId=setInterval(function() {
        if(dRgl.xhrDone==true) {
            clearInterval(tTimerId);
            document.getElementById("regContent").innerHTML=dRgl.regulationText;
        }
    },10);
});

// setUniqId
function setUniqId(uniqId) {
    var span=document.createElement("span");
    span.id="APPID";
    span.innerHTML=uniqId;
    span.style.setProperty("display", "none");
    document.body.appendChild(span);
}
var APPID="MIKU01_"+(new Date).getTime(); // get UnixTime;
setUniqId(APPID);

var selectOneUILen=18;
var wordMikuFs=60;
var maxTextInput=64;
var dispLen={"short":3, "long":13};
var mTimerId, connTimerId;
var wordMiku, lyricsReq, lyricsReqStatus, lyricsReqOrder;
var imeStatus="";
var amActive=true;
var gettingLyrics=false;
var errMsg={
  "AT_LEAST_ONE": "1文字以上入力してね",
  "LETTER_EXCEED": "%%COUNT%%文字多いよ",
  "NG_LETTER": "発音できない文字は確定時に削除するね"
};
// controlCanvas for UI
var cP=new ctrlPanel("#canvasSwBox");
setInterval(function(){
    cP.clearRect();
    cP.drawPanel();
}, 75);

if(ua.checkUa==true) {
    if(connMk.checkWebMidiStatus()==false) {
        $("#chrome_flags").modal("show");
    } else {
        connMk.init();
        connTimerId=setInterval(function(){
            if(ua.checkUa==true) {
                if(dRgl.haveToUAccepted()===true) {
                    document.querySelector("#midi_connection").style.removeProperty("display");
                    document.querySelector("#chrome_flags").style.setProperty("display", "none");
                    displayConnectDialog();
                    clearInterval(connTimerId);
                }
            }
        }, 150);
    }
}
// Connect to Device Dialog
function displayConnectDialog() {
    var type="click";
    var e=document.createEvent('MouseEvent');
    var b=document.querySelector(".midiInSelM");
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);
}

// connection Dialog at first run
mTimerId=setInterval(function(){
    if(connMk.requestStatus===true) {
        connMk.checkMikuConnected();
        clearInterval(mTimerId);
    }
}, 200);
function getLyricsFromDevice() {
    if(gettingLyrics==false) {
        gettingLyrics=true;
        lyricsReq=[];
        lyricsReqOrder=[];
        lyricsReqStatus=false;
        var slotNum=pmk.presetSlot.length;
        var timerId, timerId0, i=0;
        timerId0=setInterval(function(){
            connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0f, i, 0xf7]);
            i++;
            if(i>=slotNum) {
                clearInterval(timerId0);
            }
        }, 10);
        timerId=setInterval(function(){
            if(lyricsReq.length>=slotNum) {
                lyricsReqStatus=true;
                gettingLyrics=false;
                clearInterval(timerId);
            }
        }, 200);
    } else {
        // gettingLyrics is locked
    }
};

// update allSlot and change selcted slot to textarea
function getIJidx(selNum) {
    var iIdx, jIdx;
    if(selNum>10) {
        iIdx=2, jIdx=selNum-10;
    } else if(selNum>5){
        iIdx=1, jIdx=selNum-5;
    } else {
        iIdx=0, jIdx=selNum;
    }
    return [iIdx, jIdx];
}

var btId=false;
function updateAllTextSlot(mode) {
    var selNum;
    switch(mode) {
      case "doremi":
        selNum=0;
        break;
      case "normal":
    default:
        selNum=pmk.lyricsPos[0];
        break;
    }
    var tIdx=getIJidx(selNum);
    var iIdx=tIdx[0], jIdx=tIdx[1];
    var ws=pmk.getAllSlot();
    for(var i=0; i<3; i++) {
        if(i!=iIdx) {
            document.querySelector("#slotG_"+i).className="shortDisp";
        } else {
            document.querySelector("#slotG_"+i).className="LongDisp";
        }
        for(var j=1; j<6; j++) {
            var num=5*i+j;
            var l=pmk.presetSlot[num];
            var cN="textSlot";
            document.querySelector("#lyrics_Bd_"+i+""+j).style.removeProperty("background-color");
            document.querySelector("#lyrics_Bd_"+i+""+j).style.removeProperty("font-weight");
            document.querySelector("#lyrics_Bd_"+i+""+j).style.removeProperty("border-color");
            document.querySelector("#lyrics_"+i+""+j).style.removeProperty("color");
            if(i==iIdx && j==jIdx) {
                document.querySelector("#lyrics_"+iIdx+""+jIdx).innerHTML="<div id=\"input-alert\" class=\"input-alert\" style=\"display:none;\"></div><div id=\"input-info\" class=\"input-info\">残り<span id=\"letter-count\"></span>文字</div><textarea id=\"inputMiku_"+iIdx+""+jIdx+"\" class=\"inputMikuArea\">"+l+"</textarea>";
                document.querySelector("#lyrics_eb_"+iIdx+""+jIdx).style.setProperty("display", "none");
                document.querySelector("#inputMiku_"+iIdx+""+jIdx).focus();
                var inputAcceptable=nsx39.acceptablePhoneticSym(document.querySelector("#inputMiku_"+iIdx+""+jIdx).value);
                var inputLC=inputAcceptable["count"];
                document.querySelector("#letter-count").innerText=maxTextInput-inputLC;
                document.querySelector("#inputMiku_"+iIdx+""+jIdx).addEventListener("keyup", function(event){
                    
                    var iIdxt=this.id.replace("inputMiku_", "").substr(0, 1),
                        jIdxt=this.id.replace("inputMiku_", "").substr(1, 1);
                    // https://github.com/geta6/libime.js
                    var ime = new LibIME("#inputMiku_"+iIdxt+""+jIdxt);
                    ime.onkeyup = function(event) {
                        imeStatus=ime.status;
                    };
                    setTimeout(function(){
                        // for windows Chrome
                        if(ua.platform.match(/Win32|Win16/)!=null) {
                            var updateRestCountTId=setInterval(function(){
                                if(document.querySelector("#inputMiku_"+iIdxt+""+jIdxt)!=null) {
                                    var dispL=document.querySelector("#inputMiku_"+iIdxt+""+jIdxt).value;
                                    var inputA=nsx39.acceptablePhoneticSym(dispL);
                                    var restCount=maxTextInput-(inputA.realCount-inputA.errCount);
                                    document.querySelector("#letter-count").innerText=restCount;
                                } else {
                                    clearInterval(updateRestCountTId);
                                }
                            }, 1000);
                        }

                        if(event.which==13 && imeStatus!=1) {
                            clearInterval(updateRestCountTId);
                            // EnterKeyをおした時
                            var inputAcceptable=nsx39.acceptablePhoneticSym(document.querySelector("#inputMiku_"+iIdxt+""+jIdxt).value);
                            var inputLC=inputAcceptable["count"];
                            var restCount=maxTextInput-inputLC;
                            var alert=false, dispL=document.querySelector("#inputMiku_"+iIdxt+""+jIdxt).value;

                            // display Error Message
                            if(restCount>=maxTextInput) {
                                alert=errMsg["AT_LEAST_ONE"];
                                dispL="";
                            } else if(restCount<0) {
                                alert=errMsg["LETTER_EXCEED"].replace("%%COUNT%%", Math.abs(restCount));
                            }
                            if(alert!=false) {
                                dispAlertInSlot(alert);
                                setTimeout(function() {
                                    document.querySelector("#inputMiku_"+iIdxt+""+jIdxt).value=dispL;
                                }, 10);
                                return;
                            }
                            
                            var id="#lyrics_"+iIdxt+""+jIdxt;
                            var num=5*parseInt(iIdxt)+parseInt(jIdxt);
                            this.value=inputAcceptable.aw;
                            if(pmk.presetSlot[num]!=this.value) {
                                pmk.presetSlot[num]=this.value;
                                
                                // update Gadget's Slot
                                var sysExC=nsx39.getUpdateSysExByText(this.value, num, true);
                                var sysEx=sysExC["sysEx"];
                                connMk.mOut.send(sysEx);
                                pmk.presetSlotOrder[num]=nsx39.createLyricsReqOrder(this.value);
                                
                                var that=pmk;
                                var stId=setInterval(function(){
                                    if(that.statusReport[0]==0) {
                                        pmkUpdatewordMikuArea(that.presetSlot[num]);
                                        that.noteOffUIAction();
                                        clearInterval(stId);
                                    }
                                }, 100);
                                
                            }
                            document.querySelector(id).innerHTML=getDispSlotLetter(this.value, "long");
                            document.querySelector("#lyrics_eb_"+iIdx+""+jIdx).style.removeProperty("display");
                            
                            document.querySelector("#lyrics_Bd_"+iIdx+""+jIdx).style.setProperty("background-color", "#237582");
                            document.querySelector("#lyrics_Bd_"+iIdx+""+jIdx).style.setProperty("font-weight", "bold");
                            document.querySelector("#lyrics_Bd_"+iIdx+""+jIdx).style.setProperty("border-color", "#255f68");
                            document.querySelector("#lyrics_"+iIdx+""+jIdx).style.setProperty("color", "#ffffff");
                        } else if(imeStatus==1 || imeStatus==2) {
                            // Enter 以外
                            setTimeout(function(){
                                var alert=false, dispL=document.querySelector("#inputMiku_"+iIdxt+""+jIdxt).value;
                                var inputAcceptable=nsx39.acceptablePhoneticSym(dispL);
                                var inputLC=inputAcceptable.count;
                                var restCount=maxTextInput-(inputAcceptable.realCount-inputAcceptable.errCount);
                                if((restCount<0 || maxTextInput-restCount<=0 ) && btId==false) {
                                    var cnt=0;
                                    var type="zero";
                                    if(restCount<0){
                                        type="exceed";
                                    }
                                    btId=setInterval(function(){
                                        if(cnt%2) {
                                            document.querySelector("#input-info").style.setProperty("background-color", "#d9534f");
                                        } else {
                                            document.querySelector("#input-info").style.removeProperty("background-color");
                                        }
                                        cnt++;
                                        var dispL=document.querySelector("#inputMiku_"+iIdxt+""+jIdxt).value;
                                        var inputA=nsx39.acceptablePhoneticSym(dispL);
                                        var restCount=maxTextInput-(inputA.realCount-inputA.errCount);
                                        switch(type) {
                                          case "exceed":
                                            if(restCount>=0) {
                                                clearInterval(btId);
                                                document.querySelector("#input-info").style.removeProperty("background-color");
                                                btId=false;
                                            }
                                            break;
                                          case "zero":
                                            if(maxTextInput-restCount>0) {
                                                clearInterval(btId);
                                                document.querySelector("#input-info").style.removeProperty("background-color");
                                                btId=false;
                                            }
                                            break;
                                        }
                                    }, 150);
                                }
                                
                                // display Error Message
                                var ngLetters="";
                                if(inputAcceptable.errCount>0) {
                                    alert="NG_LETTER";
                                }
                                if(alert!=false) {
                                    alert=errMsg["NG_LETTER"];
                                    dispAlertInSlot(alert);
                                }
                                var inputA=nsx39.acceptablePhoneticSym(dispL);
                                restCount=maxTextInput-(inputA.realCount-inputA.errCount);
                                document.querySelector("#letter-count").innerText=restCount;                                
                            }, 5);
                        }
                    }, 5);
                });
            } else {
                if(document.querySelector("#lyrics_eb_"+i+""+j).style.display=="none") {
                    document.querySelector("#lyrics_eb_"+i+""+j).style.removeProperty("display");
                }
                document.querySelector("#lyrics_"+i+""+j).className=cN;
                var dispType="short";
                if(i==iIdx) {
                    dispType="long";
                }
                document.querySelector("#lyrics_"+i+""+j).innerHTML=getDispSlotLetter(l, dispType);
            }
        }
    }
    function dispAlertInSlot(msg) {
        document.querySelector("#input-alert").style.setProperty("display", "block");
        document.querySelector("#input-alert").innerHTML=msg;
        if((document.querySelector("#input-alert").className).match(" fadeout-animation")==null) {
            document.querySelector("#input-alert").className+= " fadeout-animation";
            setTimeout(function(){
                if(document.querySelector("#input-alert")!=null){
                    document.querySelector("#input-alert").style.setProperty("display", "none");
                    document.querySelector("#input-alert").className=document.querySelector("#input-alert").className.replace(/ fadeout-animation/g, "");
                }
            }, 4800);
        }
    }

    return;
}

function getDispSlotLetter(l, type) {
    var out="";
    if(type=="") {
        type="short";
    }
    if(typeof l=="undefined") {
        out="-";
    } else {
        if(l.length>dispLen[type]) {
            out=l.substr(0, dispLen[type]) + "..";
        } else {
            out=l;
        }
    }
    return out;
}

for(var i=0; i<3; i++) {
    for(var j=1; j<6; j++) {
        // E ボタンをおした時
        document.querySelector("#lyrics_eb_"+i+""+j).addEventListener("click", function() {
            var numMatrix=this.id.replace("lyrics_eb_", ""); 
            var iIdx=numMatrix.substr(0,1), jIdx=numMatrix.substr(1,1);
            pmk.doremiMode=false;
            pmk.fModeNormal();
            pmk.lyricsPos[0]=5*parseInt(iIdx)+parseInt(jIdx);
            updateDispButtonClick(pmk.lyricsPos[0]);
            var l=pmk.presetSlot[pmk.lyricsPos[0]];
            updateAllTextSlot("normal");
            pmk.fKashiSlotSel(pmk.lyricsPos[0]);
            pmk.selectOneUISlot();
        });
    }    
}

// checking tab
var interval_id;
$(window).focus(function() {
    var that=pmk;
    interval_id = setInterval(function() {
        if(that.lyricsPos[0]==0 || amActive==false) {
            if(that.doremiMode==true) {
                doReMiUIAction(that.doremiMode, "softB");
            } else {
                that.fModeNormal();
                that.fKashiSlotSel(tmp_lyricsPos[0]);
                that.fKashiPosSel(tmp_lyricsPos[1]);
                updateDispButtonClick(tmp_lyricsPos[0]);
                that.selectOneUISlot();
            }
        }
        amActive=true;
    }, 200);
});
var tmp_lyricsPos;
$(window).blur(function() {
    amActive=false;
    tmp_lyricsPos=pmk.lyricsPos;
    pmk.noteOffUIAction();
    clearInterval(interval_id);
});

function startConnectionAlive() {
    pmk.checkKeepAlive();
    var alive=false;
    var that=pmk;
    var caId=setInterval(function(){
        var now=(new Date).getTime();
        var cN="glyphicon glyphicon-heart gicon-style";
        if(now-that.connectionAlive<3500) {
            if(alive==false) {
                that.fModeNormal();
                getLyricsFromDevice();
                that.fKashiSlotSel(1);
                that.fKashiPosSel(0);
                that.initAllSlot();
            }
                         
            alive=true;
            cN +=" hart-animation";
            document.querySelector("#wrap").className="";
            controlMaskAll("hide");
            
            // checking tab
            if(amActive==false) {
                cN="glyphicon glyphicon-heart gicon-style";
            }
        } else {
            alive=false;
            that.firmWare=false;
            controlMaskAll("show");
            cN="glyphicon glyphicon-heart gicon-style";
        }

        document.querySelector("#connectionAlive").className=cN;
        that.checkKeepAlive();

        if(that.firmWare!=false) {
            document.querySelector("#fv").innerHTML="("+that.firmWare+")";
        }

    }, 1000);
}
function controlMaskAll(type) {
    switch(type) {
      case "show":
        $("#lost-connection").modal("show");
        break;
      case "hide":
        $("#lost-connection").modal("hide");
        break;
    }
}
document.querySelector("#closeSelB").addEventListener("click", function(){
    $("#midiInSelM").modal("hide");
});

// Switch: DoReMi Mode
document.querySelector("#modeDoremi").addEventListener("click", function() {
    if(this.className.match(/btn\-default/)!=null) {
        pmk.doremiMode=true;
    } else {
        pmk.doremiMode=false;
    }
    doReMiUIAction(pmk.doremiMode, "softB");
});
function doReMiUIAction(mode, type) {
    var elem=document.querySelector("#modeDoremi");
    var display;
    switch(mode) {
      case true:
        elem.className="btn btn-xs btn-info";
        elem.style.removeProperty("color");
        var w="ドレミモードだよ";
        updateDispButtonClick(96);
        updateAllTextSlot("doremi");
        pmkUpdatewordMikuArea("ドレミモードだよ");
        document.querySelector("#wordMiku").innerHTML=w;
        document.querySelector("#wordMiku").setAttribute("alt", w);
        if(type=="softB") {
            pmk.fModeDoremi();
        }
        display="none";
        break;
      case false:
        elem.className="btn btn-xs btn-default";
        elem.style.setProperty("color", "rgba(0, 0, 0, 0.3)");
        if(type=="softB") {
            pmk.checkButtonStatus(0, [0, 0]);
            pmk.fModeNormal();
        }
        display="block";
        break;
    }
    // toggle edit button
    for(var i=1; i<pmk.presetSlot.length; i++) {
        var Idx=i;
        var ij=getIJidx(i);
        var elem=document.querySelector("#lyrics_eb_"+ij[0]+ij[1]);
        if(typeof elem=="object") {
            document.querySelector("#lyrics_eb_"+ij[0]+ij[1]).style.setProperty("display", display);
        }
    }

}

// override methods
connMk.closeConnectionDialog=function() {
    $("#midiInSelM").modal("hide");
    setTimeout(function(){document.querySelector("#closeSelB").style.removeProperty("visibility");}, 500);
    pmk.fModeNormal();
    pmk.fKashiSlotSel(1);
    pmk.initAllSlot();
    startConnectionAlive();
    cP.addButtonClick(0);
};
pmk.checkKeepAlive=function() {
    var sysEx=[0xf0, 0x43, 0x79, 0x09, 0x11, 0x01, 0xf7];
    connMk.mOut.send(sysEx);
    
};
pmk.requestLyricsPos=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0e, 0xf7]);
};
// ガジェットのボタンが押された時 from miku.js
pmk.checkButtonStatus=function(d0, dd){
    if(amActive==true) {
        this.lyricsPos=false;
        if(dd[0]==0 && dd[1]==0) { // when buttons are all released
            this.prevBStatu=new Array();
            var self=this;
            this.requestLyricsPos();
            var tId=setInterval(function(){
                if(self.lyricsPos!=false) {
                    if(pmk.doremiMode==true) {
                        doReMiUIAction(pmk.doremiMode, "phisicalB"); //doremiMode
                    } else {
                        doReMiUIAction(pmk.doremiMode, "phisicalB"); //doremiMode
                        updateDispButtonClick(self.lyricsPos[0]);
                        clearInterval(tId);
                        self.selectOneUISlot();
                    }
                }
            }, 50);
        }
    }
};
function updateDispButtonClick(Idx) {
    var clickedList=[];
    if(Idx<=5) {
        clickedList=[Idx-1];
    } else if(Idx<=10) {
        clickedList=["arc", Idx-5-1];
    } else if(Idx<=15) {
        clickedList=["center", Idx-10-1];
    } else if(Idx==96) {
        clickedList=["center", "arc"];
    } else {
        clickedList=[];
    }
    setTimeout(function(){
        cP.removeButtonClick("all");
        for(var i=0; i<clickedList.length; i++) {
            cP.addButtonClick(clickedList[i]);
        }
    }, 10);
}

pmk.initAllSlot=function() {
    var timerId;
    getLyricsFromDevice();
    var self=this;
    timerId=setInterval(function(){
        if(lyricsReqStatus==true) {
            clearInterval(timerId);
            self.presetSlot=lyricsReq;
            self.presetSlotOrder=lyricsReqOrder;
            self.selectOneUISlot();
        }
    }, 200);
};

connMk.onmidimessage=function(event){
    pmk.checkMsg(event.data);
};
pmk.getLyricsBySysEx=function(msg) {
    var out=nsx39.getTextBySysEx(msg);
    if(typeof lyricsReq=="object") lyricsReq.push(out.lyrics);
    if(typeof lyricsReqOrder=="object") lyricsReqOrder.push(out.lyricsOrder);

};
// Display Lyrics in Miku Area
pmk.selectOneUISlot=function() {
    this.lyricsPos=false;
    this.requestLyricsPos();
    var tId, self=this;
    tId=setInterval(function(){
        if(self.lyricsPos!=false) {
            clearInterval(tId);
            var w=self.presetSlot[self.lyricsPos[0]];
            pmkUpdatewordMikuArea(w); 
            updateAllTextSlot("normal");
        }
    },60);
    this.noteOffUIAction();
};
function pmkUpdatewordMikuArea(w) {
    var row=Math.ceil(w.length/selectOneUILen);
    document.querySelector(".arrow_base").style.setProperty("height", (20+row*wordMikuFs)+"px");
    document.querySelector(".textDispArea").style.setProperty("height", 40+row*wordMikuFs+"px");
}
pmk.fModeNormal=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x0a, 0x08, 0x00, 0x00, 0xf7]);
};
pmk.fModeDoremi=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x0a, 0x08, 0x01, 0x00, 0xf7]);
};
pmk.fKashiSlotSel=function(slotNo) {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x09, 0x03, 0x00, 0x00, 0x09, 0x03, 0x00, slotNo, 0xf7]);
};
pmk.fKashiPosSel=function(kashiPos) {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x09, 0x02, 0x00, 0x00, 0x09, 0x02, 0x00, kashiPos, 0xf7]);
};
pmk.fnoteOn=function(noteNo, velocity) {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x08, 0x09, 0x00, 0x00, 0x08, 0x09, noteNo, velocity, 0xf7]);
};
pmk.fnoteOff=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x08, 0x08, 0x00, 0x00, 0xf7]);
};
pmk.noteOnUIAction=function() {
    if(amActive==false){
        return;
    }          
    pmkCreateMikuWordHTML.bind(this)("noteOn");
};
pmk.noteOffUIAction=function() {
    if(amActive==false){
        return;
    }          
    pmkCreateMikuWordHTML.bind(this)("noteOff");
};
function pmkCreateMikuWordHTML(type) {
    var cssType="";
    switch(type) {
      case "noteOn":
        document.querySelector(".textDispArea").style.setProperty("background", "url(\"images/mikuAll.png\")");
        document.querySelector(".textDispArea").style.setProperty("background-repeat", "no-repeat");
        document.querySelector(".textDispArea").style.setProperty("background-position", "right -512px");
        cssType=" noteOn ";
        break;
      case "noteOff":
        document.querySelector(".textDispArea").style.setProperty("background", "url(\"images/mikuAll.png\")");
        document.querySelector(".textDispArea").style.setProperty("background-repeat", "no-repeat");
        document.querySelector(".textDispArea").style.setProperty("background-position", "right top");
        this.lyricsPos=false;
        this.requestLyricsPos();
        break;
    }
    if(pmk.doremiMode==true) {
        return;
    }
    var tId, self=this;
    tId=setInterval(function(){
        if(self.lyricsPos!=false) {
            clearInterval(tId);
            var w=self.presetSlot[self.lyricsPos[0]];
            var o=self.presetSlotOrder[self.lyricsPos[0]];
            pmkUpdatewordMikuArea(w); // for multiple tab
            if(typeof o[self.lyricsPos[1]+1]=="undefined") {
                var n=w.length-o[self.lyricsPos[1]];
            } else {
                var n=o[self.lyricsPos[1]+1]-o[self.lyricsPos[1]];
            }
            var wOut=w.substr(0, o[self.lyricsPos[1]]) + "<span class=\"bigger"+cssType+"\">" + w.substr(o[self.lyricsPos[1]], n) + "</span>" + w.substr(o[self.lyricsPos[1]]+n, w.length);

            if(document.querySelector("#wordMiku").getAttribute("alt")!=w) {
                document.querySelector("#wordMiku").className="wordmiku";
                document.querySelector(".arrow_base").style.setProperty("transition", "0.5s");
                document.querySelector(".textDispArea").style.setProperty("transition", "0.5s");
                setTimeout(function(){
                    document.querySelector(".arrow_base").style.removeProperty("transition");
                    document.querySelector(".textDispArea").style.removeProperty("transition");
                }, 500);
                setTimeout(function(){
                    document.querySelector("#wordMiku").className="wordmiku on";
                }, 100);
            }
            document.querySelector("#wordMiku").setAttribute("alt", w);
            document.querySelector("#wordMiku").innerHTML=wOut;
        }
    },30);
}

