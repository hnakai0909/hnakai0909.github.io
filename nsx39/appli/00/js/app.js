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
var APPID="MIKU03_"+(new Date).getTime(); // get UnixTime;
setUniqId(APPID);

var mTimerId, connTimerId;
var maxTextInput=50;
var amActive=true;
var mTimerId, connTimerId;
var gettingLyrics=false;
var btId=false;
var imeStatus;
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

function startConnectionAlive() {
    pmk.checkKeepAlive();
    var alive=false;
    var that=pmk;
    var caId=setInterval(function(){
        var now=(new Date).getTime();
        var cN="glyphicon glyphicon-heart gicon-style";
        if(that.statusReport[0]==1) { // when pokemiku is working hard.
            console.debug("[Pokemiku is working hard now ^^ Wait a bit, please.]");
            that.connectionAlive=now;
            return;
        }
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

// checking tab
var interval_id;
$(window).focus(function() {
    interval_id = setInterval(function() {
        amActive=true;
    }, 200);
});
$(window).blur(function() {
    amActive=false;
    clearInterval(interval_id);
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

connMk.onmidimessage=function(event){
    pmk.checkMsg(event.data);
};

// button [BEGIN]

function fireEventBySelector(type, selector) {
    var e=document.createEvent('MouseEvent');
    var b=document.querySelector(selector);
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);
}

// add config tag
window.addEventListener("polymer-ready-dmy", function(event){
    var out=createConfigLabels(event);
    document.getElementById(out.id+"_list_add").innerHTML=out.add;
    document.getElementById(out.id+"_list_remove").innerHTML=out.remove;
});
document.addEventListener("show-modal", function(event){
    var cl=document.getElementById("config_list_add");
    while(cl.childNodes.length>0) {
        cl.removeChild(cl.childNodes.item(cl.childNodes.length-1));
    }
	  document.getElementById("confirmation_title_add").style.setProperty("display", "none");
    var cl=document.getElementById("config_list_remove");
    while(cl.childNodes.length>0) {
        cl.removeChild(cl.childNodes.item(cl.childNodes.length-1));
    }
	  document.getElementById("confirmation_title_remove").style.setProperty("display", "none");

    var xp=document.getElementById(event.detail.id);
    if(!xp.isClassContainsInButton("on")) {
        var out=createConfigLabels(event);
        document.getElementById("config_list_add").innerHTML=out.add;
        document.getElementById("config_list_remove").innerHTML=out.remove;
        // label title show/hide
        for(var i=0, lst=["add", "remove"]; i<lst.length; i++) {
	          var add_remove = lst[i];
	          if (typeof document.getElementById(event.detail.id).get(add_remove)[0] !="undefined") {
	              document.getElementById("confirmation_title_"+add_remove).style.setProperty("display", "block");
            }
        }
    }

    document.getElementById("confirmation").style.setProperty("display", "block");
    document.getElementById("updating").style.setProperty("display", "none");
    document.getElementById("modalupdatebutton").style.setProperty("display", "block");

    $("#smf-sending").modal("show");
    var id=event.detail.id;
    document.getElementById("acceptupdate").addEventListener("mousedown", acceptupdate);
    function acceptupdate() {
        document.getElementById("confirmation").style.setProperty("display", "none");
        document.getElementById("updating").style.setProperty("display", "block");
        document.getElementById("modalupdatebutton").style.setProperty("display", "none");
        document.getElementById(id).sendSmfToDevice(connMk.mOut, "miku-mouth", "smf-progressstatus");
        document.getElementById("acceptupdate").removeEventListener("mousedown", arguments.callee);
    }
    
    $('#smf-sending').on('hide.bs.modal', function (event) {
        document.getElementById("updateprogress").style.setProperty("width", "0%");
        document.getElementById("progresspercent").innerHTML="0%";
    });
    document.getElementById("cancelupdate").addEventListener("mousedown", function (event) {
        document.getElementById("acceptupdate").removeEventListener("mousedown", acceptupdate);
    });
});
document.addEventListener("miku-mouth", function(event){
    var mm=event.detail.midimsg;
    if(mm[0]==0x90 && mm[2]!=0x00) {
        document.querySelector(".update-progress").style.setProperty("background-position", "center -512px");
    }
    if(mm[0]==0x80 || mm[0]==0x90 && mm[2]==0x00) {
        document.querySelector(".update-progress").style.setProperty("background-position", "center top");
    }
});
document.addEventListener("smf-progressstatus", function(event){
    var id=event.detail.id;
    var ratio=event.detail.ratio;
    document.querySelector(".progress-bar").style.setProperty("width", ratio+"%");
    document.querySelector(".progress-bar-text").innerHTML = ratio+"%";
    if(ratio>=100) {
        document.querySelector(".update-progress").style.setProperty("background-position", "center top");
        setTimeout(function(){
            $("#smf-sending").modal("hide");
            
            // replace label <-> description
            var ct=document.getElementById("contents00_"+id);
            if(ct.classList.contains("hidden-all")) {
                ct.className=ct.className.replace("hidden-all", "");
            } else {
                ct.className+=" hidden-all";
            }
            var ct=document.getElementById("contents01_"+id);
            if(ct.classList.contains("hidden-all")) {
                ct.className=ct.className.replace("hidden-all", "");
            } else {
                ct.className+=" hidden-all";
            }

        }, 1000);
    }
});

function createConfigLabels(event) {
    var out={};
    for(var i=0, lst=["add", "remove"]; i<lst.length; i++) {
        var data=document.getElementById(event.detail.id).get(lst[i]);
        var lbl;
        if(lst[i]=="add") {
            lbl="label label-success label-space";
        } else if(lst[i]=="remove") {
            lbl="label label-default label-space";
        }
        if(data!=null) {
            out[lst[i]]=createAddSpan(data,  lbl);
        }
    }
    function createAddSpan( data, className ) {
        var labels="";
        for(var i=0; i<data.length; i++) {
            labels+="<span class=\""+lbl+"\">"+data[i]+"</span> ";
        }
        return labels;
        //document.getElementById(id).innerHTML=labels;
    }
    out.id=event.detail.id;
    return out;
}

// button [END]

function openAccordion(event) {
    var e=event.target;
    var en=event.target.nextElementSibling;
    if(e.classList.contains("open")) {
        e.className="accordion-title";
        en.className="accordion-description";
    } else {
        e.className+=" open";
        en.className+=" open";
    }
    event.preventDefault();
}

window.addEventListener("load", function(event) {
    var ac=document.querySelectorAll(".accordion-title");
    for(var i=0; i<ac.length; i++) {
        ac[i].addEventListener("mousedown", openAccordion, false);
        ac[i].addEventListener("touchstart", openAccordion, false);
    }
});
