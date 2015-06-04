/*
* regulation.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var DispRegulation = function() {
    this.timerId=null;
    this.title="エンドユーザー使用許諾契約書";
    this.keyName="MIKUAPP01";
    this.instructions=[
        'ご読了頂くと <strong>同意します</strong> ボタンが有効になります。',
        'ご読了を確認致しました。<strong>同意します</strong> ボタンをクリックしお楽しみください！'
    ];
    this.xhrDone=false;
    this.localStorage=window.localStorage;
    this.regulationText;
    this.defaultNavbarBsClass;
};

DispRegulation.prototype = {
    haveToUAccepted: function(){
        if(this.localStorage.getItem(this.keyName)=="true") {
            return true;
        }
        return false;
    },

    show: function(url) {
        // check ToU accept
        if(this.haveToUAccepted()===true) {
            return;
        }

        var nbBs=document.getElementById("navbar.bs");
        this.defaultNavbarBsClass=nbBs.className;
        nbBs.removeAttribute("class");
        
        var ToU=document.createElement("div");
        ToU.id="ToU";
        
        var opMask=document.createElement("div");
        opMask.id="opMask";
        opMask.style.setProperty("position", "fixed");
        opMask.style.setProperty("top", "0px");
        opMask.style.setProperty("left", "0px");
        opMask.style.setProperty("width", "100%");
        opMask.style.setProperty("height", "100%");
        opMask.style.setProperty("background", "#000");
        opMask.style.setProperty("filter", "alpha(opacity=60)");
        opMask.style.setProperty("opacity", "0.4");
        
        var overLayer00=document.createElement("div");
        overLayer00.id="overLayer00";
        overLayer00.style.setProperty("position", "fixed");
        overLayer00.style.setProperty("top", "0px");
        overLayer00.style.setProperty("left", "0px");
        overLayer00.style.setProperty("width", "100%");
        overLayer00.style.setProperty("height", "100%");
        
        var overLayer01=document.createElement("div");
        overLayer01.id="overLayer01";
        overLayer01.style.setProperty("position", "relative");
        overLayer01.style.setProperty("width", "700px");
        overLayer01.style.setProperty("height", "460px");
        overLayer01.style.setProperty("background", "#fff");
        overLayer01.style.setProperty("border-radius", "10px");
        overLayer01.style.setProperty("margin", "60px auto");
        overLayer01.style.setProperty("padding", "20px");
        
        var hDiv=document.createElement("div");
        var h2Title=document.createElement("span");
        h2Title.innerText=this.title;
        h2Title.style.setProperty("font-weight", "bold");
        h2Title.style.setProperty("font-size", "30px");
        h2Title.style.setProperty("padding", "20px 0px");
        h2Title.style.setProperty("margin", "10px 30px");
        hDiv.appendChild(h2Title);
        
        var instruction=document.createElement("div");
        instruction.id="instruction";
        instruction.style.setProperty("margin", "0px 0px 0px 30px");
        instruction.style.setProperty("padding", "10px 0px 10px 0px");
        instruction.className="text-info";
        instruction.innerHTML=this.instructions[0];
        
        var regulation=document.createElement("textarea");
        regulation.id="regulation";
        regulation.style.setProperty("width", "600px");
        regulation.style.setProperty("height", "260px");
        regulation.style.setProperty("margin-top", "10px");
        regulation.style.setProperty("margin-left", "30px");
        regulation.style.setProperty("border", "1px solid #cccccc");
        regulation.style.setProperty("padding", "13px");
        regulation.style.setProperty("border-top-left-radius", "10px");
        regulation.style.setProperty("border-bottom-right-radius", "10px");
        regulation.style.setProperty("resize", "none");

        
        this.getRegulation(url, this);
        // getRegulationText
        var self=this;
        var tTimerId=setInterval(function() {
            if(self.xhrDone==true) {
                clearInterval(tTimerId);
                regulation.innerHTML=self.regulationText;
            }
        },10);
        
        var ctrlToU1=document.createElement("div");
        ctrlToU1.className="ctrlToU";
        ctrlToU1.innerHTML='<input type="button" id="accept" class="btn btn-info" value="同意します" disabled="disabled">';
        ctrlToU1.style.setProperty("width", "100%");
        ctrlToU1.style.setProperty("margin", "30px 0px");
        ctrlToU1.style.setProperty("text-align", "center");
        
        overLayer01.appendChild(hDiv);
        overLayer01.appendChild(instruction);
        overLayer01.appendChild(regulation);
        overLayer01.appendChild(ctrlToU1);
        
        overLayer00.appendChild(overLayer01);

        ToU.appendChild(opMask);
        ToU.appendChild(overLayer00);
        
        document.body.appendChild(ToU);
        var self=this;

        // adding eventListeners
        document.getElementById("accept").addEventListener("click", function(){
            var ToU=document.getElementById("ToU");
            document.getElementById("accept").removeAttribute("disabled");
            ToU.style.setProperty("visibility", "hidden");
            ToU.style.setProperty("display", "none");
            self.localStorage.setItem(self.keyName, "true"); // set accept to LocalStorage
            document.getElementById("navbar.bs").setAttribute("class", self.defaultNavbarBsClass);
            // check ToU accept
            if(self.haveToUAccepted()===true) {
                return;
            }
        });
        
        // polling Terms of Use Area
        self.timerId=setInterval(function(){
            if(self.xhrDone==true && textareaAtEnd(document.getElementById("regulation"))===true) {
                clearInterval(self.timerId);
                document.getElementById("accept").removeAttribute("disabled");
                document.getElementById("instruction").innerHTML=self.instructions[1];
            }
            function textareaAtEnd(area) {
                return ((area.scrollTop + area.offsetHeight) > area.scrollHeight);
            }
        }, 300);
        
    },

    getRegulation: function(url, self) {
        if(self.regulationText!=null) {
            return;
        }
        var xhr=new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function() {
            if(xhr.readyState==4 && xhr.status==200) {
                self.regulationText=xhr.responseText;
                //regulation.innerText=xhr.responseText;
                self.xhrDone=true;
            }
        };
        xhr.send(null);
    }
    
};
