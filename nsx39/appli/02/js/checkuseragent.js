/*
* checkUserAgent.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var CheckUserAgent = function() {
    this.userAgent={};
    this.webmidiVersion ={
        "Chrome": 33
    };
    this.os=false;
    this.checkUa=false;
    this.platform=false;
    this.xpStatus=false;
};

CheckUserAgent.prototype={
    getPlatform: function() {
        this.platform=navigator.platform;
    },
    checkXpStatus: function() {
        if (navigator.userAgent.match(/Win(dows )?(NT 5\.1|XP)/)) {
            this.xpStatus=true;
        }
    },
    checkBeforeIE9: function() {
        var t=navigator.userAgent.split(";"), ieV;
        if(typeof t[1]!="undefined" && t[1].match(/MSIE/)!=null) {
            ieV=t[1].split(" ");
            if(parseInt(ieV[2])<9) { 
                document.getElementById("wrap").style.display="none";
                document.getElementById("footer").style.display="none";

                var div0=document.createElement("div");
                div0.style.width="700px";
                div0.style.padding="10px";

                var div1=document.createElement("div");
                div1.style.width="550px";
                div1.style.margin="20px";

                var h3=document.createElement("h3");
                h3.style.padding="0px";
                h3.style.margin="0px 0px 15px 0px";
                h3.innerHTML=document.title;

                var p1=document.createElement("p");
                p1.innerHTML="お客様は Google Chrome 以外（ブラウザ）をご利用してアクセス下さっています。<br><img src=\"images/chrome_icon.png\" style=\"width:20px; margin:3px;\">Google Chrome（Version "+this.webmidiVersion.Chrome+"） 以降でアクセスをお願い致します。 <a href=\"http://www.google.co.jp/intl/ja/chrome/browser/\" target=\"_blank\" class=\"btn btn-default btn-xs\">ダウンロード</a>";

                var br=document.createElement("br");
                
                var p2=document.createElement("p");
                p2.className="credit";
                p2.style.margin="0px 0px 0px 80px";
                p2.style.fontSize="12px";
                p2.innerHTML="Copyright &#169; <span id=\"ccYear\"></span> Yamaha Corporation. All rights reserved. ";

                div1.appendChild(h3);
                div1.appendChild(p1);
                div1.appendChild(br);
                div1.appendChild(p2);
                div0.appendChild(div1);

                document.body.appendChild(div0);
                
            }
        }
    },
    checkChrome: function() {
        this.getPlatform();
        this.checkBeforeIE9();
        this.checkXpStatus();
        var ua=navigator.userAgent.split(" ");
        for(var i=0; i<ua.length; i++) {
            // for OPERA
            if(ua[i].match(/OPR/)!=null) {
                var version=ua[i].replace("OPR/", "").split(".");
                version=parseInt(version[0]);
                this.userAgent={"name":"Opera", "version":version};
                break;
            } else if(ua[i].match(/Chrome/)!=null) {
                var version=ua[i].replace("Chrome/", "").split(".");
                version=parseInt(version[0]);
                this.userAgent={"name":"Chrome", "version":version};
            }
        }
        if(this.userAgent.name!="Chrome" || ( this.userAgent.name=="Chrome" && this.userAgent.version<this.webmidiVersion.Chrome)) {
            var e0=document.createElement("div");
            e0.id="checkChrome";
            e0.style.setProperty("z-index", "1");
            e0.style.setProperty("position", "fixed");
            e0.style.setProperty("top", "0px");
            e0.style.setProperty("left", "0px");
            e0.style.setProperty("width", "100%");
            e0.style.setProperty("height", "100%");
            e0.style.setProperty("background", "rgba(0,0,0,0.9)");
            
            var e1=document.createElement("div");
            e1.style.setProperty("position", "fixed");
            e1.style.setProperty("top", "0px");
            e1.style.setProperty("left", "0px");
            e1.style.setProperty("width", "100%");
            e1.style.setProperty("height", "100%");
            
            var e2=document.createElement("div");
            e2.style.setProperty("position", "relative");
            e2.style.setProperty("width", "800px");
            //e2.style.setProperty("height", "200px");
            e2.style.setProperty("background", "#fff");
            e2.style.setProperty("border-radius", "10px");
            e2.style.setProperty("margin", "60px auto");
            e2.style.setProperty("padding", "20px");
            e2.style.setProperty("opacity", "1.0");
            
            e1.appendChild(e2);
            e0.appendChild(e1);
            
            var h2t=document.createElement("h2");
            h2t.innerHTML="ご利用中のブラウザに関して";
            
            var clr=document.createElement("div");
            clr.style.setProperty("margin-bottom", "30px");
            
            var eP1=document.createElement("p");
            eP1.style.setProperty("margin", "0px");
            if(this.userAgent.name=="Chrome") {
                eP1.innerHTML="お客様は <img src=\"images/chrome_icon.png\" style=\"width:20px; margin:3px;\"> Google Chrome (Version "+ this.userAgent.version +") （ブラウザ）をご利用してアクセスくださっています。";
            } else {
                eP1.innerHTML="お客様は Google Chrome 以外（ブラウザ）をご利用してアクセス下さっています。";
            }
            
            var eP2=document.createElement("p");
            if(this.userAgent.name=="Chrome" && this.userAgent.version<this.webmidiVersion[this.userAgent.name]) {
                eP2.innerHTML="このアプリケーションをご利用いただくには <img src=\"images/chrome_icon.png\" style=\"width:20px; margin:3px;\">Google Chrome （Version "+this.webmidiVersion.Chrome+"）が必要です。<br> 最新版へのアップデートをお願い致します。 <a href=\"http://www.google.co.jp/intl/ja/chrome/browser/\" target=\"_blank\" class=\"btn btn-default btn-xs\">ダウンロード</a>";
            } else {
                eP2.innerHTML="<img src=\"images/chrome_icon.png\" style=\"width:20px; margin:3px;\">Google Chrome （Version "+this.webmidiVersion.Chrome+"） 以降でアクセスをお願い致します。 <a href=\"http://www.google.co.jp/intl/ja/chrome/browser/\" target=\"_blank\" class=\"btn btn-default btn-xs\">ダウンロード</a>";
            }
            
            e2.appendChild(h2t);
            e2.appendChild(clr);
            e2.appendChild(eP1);
            e2.appendChild(eP2);
            
            document.body.appendChild(e0);
        } else {
            this.checkUa=true;
        }
    }
    
};


