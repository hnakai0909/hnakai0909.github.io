/*
* app.js v1.0.0 by @ryoyakawai
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
var APPID="MIKU02_"+(new Date).getTime(); // get UnixTime;
setUniqId(APPID);

var mTimerId, connTimerId;
var lyricsReq, lyricsReqStatus, lyricsReqOrder;
var maxTextInput=50;
var amActive=true;
var mTimerId, connTimerId;
var gettingLyrics=false;
var revoiceStatus=false;
var btId=false;
var imeStatus;
var errMsg={
  "AT_LEAST_ONE": "1文字以上入力してね",
  "LETTER_EXCEED": "%%COUNT%%文字多いよ",
  "NG_LETTER": "発音できない文字は確定時に削除するね"
};
var touchStart=false;

nsx39.setDevide=50;
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
        lyricsReq=new Array();
        lyricsReqOrder=new Array();
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
    }
};

// checking tab
var interval_id;
$(window).focus(function() {
    if (!interval_id) {
        interval_id = setInterval(function() {
            amActive=true;
            if(typeof connMk.mOut=="object") pmk.lyricsPos=false;
            if(typeof connMk.mOut=="object") pmk.requestLyricsPos();
            var tId=setInterval(function(){
                if(pmk.lyricsPos!=false) {
                    if(pmk.lyricsPos[0]!=0) {
                        pmk.fKashiSlotSel(0);
                    }
                    clearInterval(tId);
                }
            }, 50);

        }, 200);
    };
});
$(window).blur(function() {
    amActive=false;
    clearInterval(interval_id);
    interval_id = 0;
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
                that.fKashiSlotSel(0);
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
            that.firmWare=false;
            controlMaskAll("show");
            alive=false;
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


// overrides
connMk.closeConnectionDialog=function() {
    $("#midiInSelM").modal("hide");
    setTimeout(function(){document.querySelector("#closeSelB").style.removeProperty("visibility");}, 500);
    pmk.fKashiSlotSel(0);
    startConnectionAlive();
};
pmk.checkKeepAlive=function() {
    var sysEx=[0xf0, 0x43, 0x79, 0x09, 0x11, 0x01, 0xf7];
    connMk.mOut.send(sysEx);
    
};
pmk.requestLyricsPos=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0e, 0xf7]);
};

pmk.initAllSlot=function() {
    var timerId;
    getLyricsFromDevice();
    var self=this;
    timerId=setInterval(function(){
        if(lyricsReqStatus==true) {
            clearInterval(timerId);
            self.presetSlot=lyricsReq;
            for(var i=0; i<self.presetSlot.length; i++) {
                var sysEx=nsx39.getUpdateSysExByText(self.presetSlot[i], i+1);
                connMk.mOut.send(sysEx);
                self.updateOneUISlot(i);
                // 画面に表示
                //document.querySelector("#id_text_"+i).innerHTML=self.presetSlot[i];
                console.log(i+" : "+self.presetSlot[i]);
            }
            self.updateOneUISlot(0);
            noteOnCnt=0;
        }
    }, 10);
};
connMk.onmidimessage=function(event){
    pmk.checkMsg(event.data);
};
pmk.getLyricsBySysEx=function(msg) {
    nsx39.getTextBySysEx(msg);
};
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
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x09, 0x04, 0x00, 0x00, 0x09, 0x04, 0x00, kashiPos, 0xf7]);
};
pmk.fnoteOn=function(noteNo, velocity) {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x08, 0x09, 0x00, 0x00, 0x08, 0x09, noteNo, velocity, 0xf7]);
};
pmk.fRevoice=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x08, 0x01, 0x00, 0x00, 0xf7]);
};
pmk.fnoteOff=function() {
    connMk.mOut.send([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0d, 0x08, 0x08, 0x00, 0x00, 0xf7]);
};
pmk.noteOnUIAction=function() {
    //mkCreateMikuWordHTML.bind(this)("noteOn");
};
pmk.noteOffUIAction=function() {
    //mkCreateMikuWordHTML.bind(this)("noteOff");
};


// canvas [BEGIN]
var cList=["#canvasAiueoBox01", "#canvasAiueoBox02", "#canvasAiueoBox03", "#canvasAiueoBox04", "#canvasAiueoBox05"];
var aBox=new aiueoBox(cList);
var previousSend;

// // for tab
var tabStatus={"t_aiueo01":true, "t_aiueo02":false,"t_aiueo03":false, "t_aiueo04":false, "t_aiueo05":false};
$('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
    var tabId=parseInt(event.target.id.replace("t_aiueo", ""));
    tabStatus[event.target.id]=true; // activated tab
    document.querySelector("#t_aiueo05_menu").style.setProperty("display", "none");
    if(event.target.id=="t_aiueo05") {
        document.querySelector("#t_aiueo05_menu").style.setProperty("display", "block");
    }
    // recover play mode
    if(tabId<5) {
        fireEventBySelector("mousedown", "#doneEdit");
    }
    tabStatus[event.relatedTarget.id]=false; // previous tab
});

setInterval(function() {
    aBox.drawAiueo(tabStatus);
}, 120);

function getPosition(event, height) {
    var out=[];
    var rect = event.target.getBoundingClientRect();

    if(event.type.match(/mouse/)!=null) {
        out.push({
            "x": event.clientX - rect.left,
            "y": event.clientY - rect.top
        });
    } else if(event.type.match(/touch/)!=null) {
        for(var i=0; i<event.touches.length; i++) {
            out.push({
                "x": event.touches[i].clientX-rect.left,
                "y": event.touches[i].clientY-rect.top
            });
        }
    } else {
        console.log("EVENT: ether mouse event nor touch event.");
    }
    return out[0];
}
for(var i=0; i<cList.length; i++) {
    var id=cList[i];
    var cIdx=i+1;
    document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("touchstart", function(event){
        mouseMove.bind(this)(event);
        event.preventDefault();
    });
    document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("touchmove", function(event){
        mouseMove.bind(this)(event);
        event.preventDefault();
    });
    document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("touchend", function(event){
        event.preventDefault();
    });
    document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("mousemove", function(event){
        mouseMove.bind(this)(event);
    });
    function mouseMove(event) {
        var Idx=parseInt(this.id.replace("canvasAiueoBox", ""));
        var pos=getPosition(event, this.height);
        var overNow=aBox.getPosIdx(Idx, pos.x, pos.y);
        aBox.pointerPos=pos;
        if(typeof connMk.mOut=="object") {
            if(overNow.key!=false && previousSend!=overNow.key) {
                previousSend=overNow.key;
                
                var out=nsx39.getUpdateSysExByText(overNow.key, 0);
                if(aBox.uiMode=="Play") {
                    connMk.mOut.send(out.sysEx);
                }

                if(aBox.uiMode=="Play" && revoiceStatus==true) {
                    pmk.fRevoice();
                }
            }
            if(overNow.key==false) {
                document.body.style.setProperty("cursor", "default");
            } else {
                document.body.style.setProperty("cursor", "pointer");
            }
        } 
    }

    if(cIdx==5) {
        document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("touchstart", function(event){
            mouseDown5.bind(this)(event);
            event.preventDefault();
        });
        document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("touchmove", function(event){
            if(aBox.uiMode=="Play") {
                mouseDown5.bind(this)(event);
            }
            event.preventDefault();
        });
        document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("touchend", function(event){
            aBox.drag={ "click": false, "Idx": false } ;
        });
        document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("mousedown", function(event){
            mouseDown5.bind(this)(event);
        });
        function mouseDown5(event) {
            var tmp00=getPosition(event, this.height);
            var tmp01=aBox.getPosIdx(5, tmp00.x, tmp00.y);
            if(tmp01.Idx!==false) {
                aBox.drag={ "click": true, "key": tmp01.key, "Idx": tmp01.Idx } ;
            }
        }
        document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("mouseup", function(event){
            aBox.drag={ "click": false, "Idx": false } ;
        });
        document.querySelector("#canvasAiueoBox0"+cIdx).addEventListener("mouseout", function(event){
            aBox.drag={ "click": false, "Idx": false } ;
        });
    }
}
// canvas [END]

// button [BEGIN]
document.querySelector("#revoice-b").addEventListener("click", function() {
    switch(revoiceStatus) {
      case false:
        revoiceStatus=true;
        this.className="btn btn-info";
        this.style.removeProperty("color");
        break;
      case true:
        revoiceStatus=false;
        this.className="btn btn-default";
        this.style.setProperty("color", "rgba(0, 0, 0, 0.3)");
        break;
    }
});


document.querySelector("#addblock").addEventListener("click", addBlock);
document.querySelector("#moveblock").addEventListener("click", moveBlock);
document.querySelector("#deleteblock").addEventListener("click", deleteBlock);
function addBlock() {
    aBox.sandboxType="add";
    document.querySelector("#add-available").style.setProperty("display", "none");
    document.querySelector("#add-not-available").style.setProperty("display", "none");
    $("#addblock-dialog").modal("show");
    if(aBox.getAvailableLetterCount(5)<=0) {
        document.querySelector("#add-not-available").style.setProperty("display", "block");
        return;
    } else {
        document.querySelector("#add-available").style.setProperty("display", "block");
    }
    
    
    setTimeout(function(){
        fireEventBySelector("click", "#t_aiueo05");
        document.querySelector("#addletters").focus();
    }, 500);

    
    document.querySelector("#letter-count").innerHTML=aBox.getAvailableLetterCount(5);
    document.querySelector("#addletters").addEventListener("keyup", function(event){
        
        // https://github.com/geta6/libime.js
        var ime = new LibIME("#addletters");
        ime.onkeyup = function(event) {
            imeStatus=ime.status;
        };
        setTimeout(function(){
            // for windows Chrome
            if(ua.platform.match(/Win32|Win16/)!=null) {
                var updateRestCountTId=setInterval(function(){
                    if(document.querySelector("#addletters")!=null) {
                        var inputAcceptable=nsx39.acceptablePhoneticSym(document.querySelector("#addletters").value);
                        var inputLC=inputAcceptable["count"];
                        var restCount=aBox.getAvailableLetterCount(5)-inputLC;
                        document.querySelector("#letter-count").innerText=restCount;
                    } else {
                        clearInterval(updateRestCountTId);
                    }
                }, 1000);
            }
            
            if(event.which==13 && imeStatus!=1) {
                clearInterval(updateRestCountTId);
                // EnterKeyをおした時
                var inputAcceptable=nsx39.acceptablePhoneticSym(document.querySelector("#addletters").value);
                var inputLC=inputAcceptable["count"];
                var restCount=aBox.getAvailableLetterCount(5)-inputLC;
                var alert=false, dispL=document.querySelector("#addletters").value;
                
                // display Error Message
                if(restCount<0) {
                    alert=errMsg["LETTER_EXCEED"].replace("%%COUNT%%", Math.abs(restCount));
                }
                if(alert!=false) {
                    dispAlertInSlot(alert);
                    setTimeout(function() {
                        document.querySelector("#addletters").value=dispL;
                    }, 10);
                    return;
                }
                fireEventBySelector("click", "#submitaddletters"); // close dialog
            } else if(imeStatus==1 || imeStatus==2) {
                // Enter 以外
                setTimeout(function(){
                    var alert=false, dispL=document.querySelector("#addletters").value;
                    var inputAcceptable=nsx39.acceptablePhoneticSym(dispL);
                    var inputLC=inputAcceptable.count;
                    var restCount=aBox.getAvailableLetterCount(5)-inputLC;
                    if(restCount<0 && btId==false) {
                        var cnt=0;
                        var type="exceed";
                        btId=setInterval(function(){
                            if(cnt%2) {
                                document.querySelector("#input-info").style.setProperty("background-color", "#d9534f");
                            } else {
                                document.querySelector("#input-info").style.removeProperty("background-color");
                            }
                            cnt++;
                            var dispL=document.querySelector("#addletters").value;
                            var inputA=nsx39.acceptablePhoneticSym(dispL);
                            var restCount=aBox.getAvailableLetterCount(5)-inputA.count;
                            switch(type) {
                              case "exceed":
                                if(restCount>=0) {
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
                    restCount=aBox.getAvailableLetterCount(5)-inputA.count;
                    document.querySelector("#letter-count").innerText=restCount;                                
                }, 5);
            }
            function dispAlertInSlot(msg) {
                document.querySelector("#input-alert").style.setProperty("visibility", "visible");
                document.querySelector("#input-alert").innerHTML=msg;
                if((document.querySelector("#input-alert").className).match(" fadeout-animation")==null) {
                    document.querySelector("#input-alert").className+= " fadeout-animation";
                    setTimeout(function(){
                        if(document.querySelector("#input-alert")!=null){
                            document.querySelector("#input-alert").style.setProperty("visibility", "hidden");
                            document.querySelector("#input-alert").className=document.querySelector("#input-alert").className.replace(/ fadeout-animation/g, "");
                        }
                    }, 4800);
                }
            }
        }, 5);
    });
    


    
    document.querySelector("#submitaddletters").addEventListener("click", function(){
        var Idx=0;
        var w0=document.querySelector("#addletters").value;
        var w1=nsx39.getUpdateSysExByText(w0, Idx, false);
        var w2=nsx39.getTextBySysEx(w1.sysEx, Idx);
        var w=w2.lyrics;
        for(var i=0; i<w2.lyricsOrder.length; i++) {
            for(var j=0; j<aBox.bPosition[5].length; j++) {
                var k=Object.keys(aBox.bPosition[5][j]);
                if(k=="d0") {
                    var iOrder=w2.lyricsOrder[i];
                    var lttrCnt=0;
                    var t=w.substr(iOrder);
                    if(typeof w2.lyricsOrder[i+1]!="undefined") {
                        lttrCnt=w2.lyricsOrder[i+1]-w2.lyricsOrder[i];
                        t=w.substr(iOrder, lttrCnt);
                    }

                    delete aBox.bPosition[5][j].d0;
                    var x=Math.random()*300, y=Math.random()*100;
                    aBox.bPosition[5][j][t]={"x":x, "y":y};
                    break;
                }
            }
            
        }
        $("#addblock-dialog").modal("hide");
        fireEventBySelector("click", "#t_aiueo05");
        document.querySelector("#addletters").value="";

    });
    
}
function moveBlock() {
    aBox.uiMode="Move";
    setTimeout(function(){fireEventBySelector("click", "#t_aiueo05");}, 0);
    var cN=document.querySelector("#doneEditArea").className;
    document.querySelector("#doneEditArea").style.removeProperty("height");
    document.querySelector("#doneEditArea").className=cN+" expand-animation";
    setTimeout(function(){
        document.querySelector("#doneEdit").innerHTML=" えんそうにもどる ";
        document.querySelector("#doneEdit").style.setProperty("display", "block");
    }, 400 );
    setTimeout(function(){
        document.querySelector("#doneEdit").style.setProperty("height", "30px");
    }, 700 );
}
function deleteBlock() {
    aBox.uiMode="Delete";
    setTimeout(function(){fireEventBySelector("click", "#t_aiueo05");}, 0);
    document.querySelector("#doneEditArea").style.removeProperty("height");
    document.querySelector("#doneEditArea").className=" expand-animation";
    setTimeout(function(){
        document.querySelector("#doneEdit").innerHTML=" えんそうにもどる ";
        document.querySelector("#doneEdit").style.setProperty("display", "block");
    }, 400 );
    setTimeout(function(){
        document.querySelector("#doneEdit").style.setProperty("height", "30px");
    }, 700 );
}
function fireEventBySelector(type, selector) {
    var e=document.createEvent('MouseEvent');
    var b=document.querySelector(selector);
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);
}
// button [END]
var bCount=0;
document.querySelector(".change-setting").addEventListener("mousedown", function(event){
    bCount+=2;
    changeFontSize(event);
});
document.querySelector(".change-setting").addEventListener("mouseup", function(event){
    bCount=0;
});
document.querySelector(".change-setting").addEventListener("touchstart", function(event){
    bCount++;
    changeFontSize(event);
});
document.querySelector(".change-setting").addEventListener("touchend", function(event){
});
function changeFontSize(event) {
    var cN="";
    if(bCount>2) {
        return;
    } else if(bCount==1) {
        cN="dditem";
    }
    var idList=["addblock", "moveblock", "deleteblock", "fImport", "fExport"];
    for(var i=0; i<idList.length; i++) {
        document.getElementById(idList[i]).className=cN;
    }
}

document.querySelector("#doneEdit").addEventListener("touchstart", function(event){
    doneEdit.bind(this)();
    event.preventDefault();
});
document.querySelector("#doneEdit").addEventListener("mousedown", function(event){
    doneEdit.bind(this)();
});
function doneEdit() {
    document.querySelector("#doneEditArea").className=" shrink-animation";
    setTimeout(function(){
        document.querySelector("#doneEdit").style.setProperty("display", "none");
    }, 400 );
    setTimeout(function(){
        document.querySelector("#doneEdit").innerHTML="";
        document.querySelector("#doneEdit").style.setProperty("height", "0px");
        document.querySelector("#doneEditArea").className="";
    }, 700 );
    aBox.uiMode="Play";
}

document.querySelector("#aiueo05").addEventListener("touchstart", function(event){
    touchStart=true;
    aiueo05mouseDown.bind(this)(event);
    event.preventDefault();
});
document.querySelector("#aiueo05").addEventListener("touchend", function(event){
    touchStart=false;
    event.preventDefault();
});
document.querySelector("#aiueo05").addEventListener("mousedown", function(event){
    aiueo05mouseDown.bind(this)(event);
});
function aiueo05mouseDown(event) {
    var canvasIdx=parseInt(this.id.replace("aiueo", ""));
    var pos=getPosition(event, this.height);
    var oN=aBox.getPosIdx(canvasIdx, pos.x, pos.y);
    switch(aBox.uiMode) {
      case "Delete":
        aBox.deleteBlock(canvasIdx, [oN.Idx]);
        break;
      case "Move":
        break;
    }
}
document.querySelector("#aiueo05").addEventListener("touchmove", function(event){
    aiueo05mouseMove.bind(this)(event);
    event.preventDefault();
});
document.querySelector("#aiueo05").addEventListener("mousemove", function(event){
    aiueo05mouseMove.bind(this)(event);
});
function aiueo05mouseMove(event) {
    switch(aBox.uiMode) {
      case "Move":
        if(aBox.drag.click==true) {
            var canvasIdx=parseInt(this.id.replace("aiueo", ""));
            var pos=getPosition(event, this.height);
            aBox.setButtonPos(5, pos.x, pos.y);
        }
        break;
    }
}
document.querySelector("#fileExport").addEventListener("mousedown", function() {
    var Idx=5;
    aBox.exportSandbox(Idx);
});
aBox.exportSandbox=function(Idx) {
    var content=JSON.stringify({ idx:Idx, buttons: this.bPosition[Idx]});
    var blob = new Blob([ content ], { "type" : "text/plain" });
    
    var objectURL = (window.URL || window.webkitURL).createObjectURL(blob);
    var e = document.createEvent('MouseEvent');
    var a = document.createElement('a');
    
    //create element of "a" and set file name in download attribute
    var now = new Date();
    var m=now.getMonth()+1; if(m<10) {
        m=0+""+m; }
    var d=now.getDate(); if(d<10) {
        d=0+""+d; }
    var h=now.getHours(); if(h<10) {
        s=0+""+h; }
    var i=now.getMinutes(); if(i<10) {
        i=0+""+i; }
    var s=now.getSeconds(); if(s<10) {
        s=0+""+s; }
    a.download = "PokeMikuApp02_"+now.getFullYear() +""+ m +""+d+"_"+h+""+i+""+s;
    a.href = objectURL;
    
    //fire click event
    e.initEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};
document.querySelector("#importSandboxButton").addEventListener("click", function() {
    var Idx=5;
    aBox.importSandbox(event, Idx);
});
aBox.importSandbox=function(event, Idx){
    $("#fileImport").modal("hide");
    var files=document.querySelector("#import").files;
    if(files.length==0) {
        return;
    }
    var out=null;
    
    var self=aBox;
    var reader=new FileReader();
    reader.onload=function() {
        var contents=JSON.parse(reader.result);
        self.bPosition[contents.idx]=contents.buttons;
    };
    document.querySelector("#import").files=new Array();
    reader.readAsText(files[0], "utf-8");
};
document.querySelector("#addletters").addEventListener("focus", function(){
    document.querySelector("#outside-addletters").className="inputtextfocus";
});
document.querySelector("#addletters").addEventListener("focusout", function(){
    document.querySelector("#outside-addletters").className="";
});

/*
// change tab by mouseover  
var moTid=false, setId=false;
for(var i=1; i<=5; i++) {
    document.querySelector("#t_aiueo0"+i).addEventListener("mouseover", function(event){
        setId=event.target.id.replace("t_aiueo0", "");
        moTid=setTimeout(function(){
            var targetId="#t_aiueo0"+setId;
            fireEventBySelector(targetId);
        }, 500);
    });
    document.querySelector("#t_aiueo0"+i).addEventListener("mouseout", function(event){
        clearInterval(moTid);
        moTid=false;
        setId=false;
    });
}
*/


// into REVOICE
fireEventBySelector("click", "#revoice-b");
fireEventBySelector("click", "#t_aiueo05");
