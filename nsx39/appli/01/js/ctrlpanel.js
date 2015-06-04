/*
* ctrlPanel.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var ctrlPanel=function(elemId){
    this.pi = Math.PI;
    this.buttons={};
    this.offset={"x":10.5, "y":15.5};
    this.cAngle={
        "a": {"s": 0 * this.pi / 180, "e": 90 * this.pi / 180},
        "b": {"s": 90 * this.pi / 180, "e": 360 * this.pi / 180}
    };
    this.radius={"A": this.offset.x+70, "B":this.offset.x+100, "C":this.offset.x+35, "button": 140};
    this.buttonSize=40;
    this.mouse={
        "over":{},
        "clicked":{}
    };
    this.numOfButton=4;
    
    // Refferd URL: http://devlabo.blogspot.jp/2010/03/javascriptcanvas.html
    // l: left, t: top, w: width, h: height, r: radius, rotate
    function fillRoundRect(type, l, t, w, h, r, rotate) {
        if(typeof rotate!="number") rotate=0;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rotate( rotate * this.pi / 180 );
        this.ctx.arc(l + r, t + r, r, - this.pi, - 0.5 * this.pi, false);
        this.ctx.arc(l + w - r, t + r, r, - 0.5 * this.pi, 0, false);
        this.ctx.arc(l + w - r, t + h - r, r, 0, 0.5 * this.pi, false);
        this.ctx.arc(l + r, t + h - r, r, 0.5 * this.pi, this.pi, false);
        this.ctx.closePath();
        switch(type) {
          case "fill":
            this.ctx.fill();
            break;
          case "stroke":
            this.ctx.stroke();
            break;
        }
        this.ctx.restore();
    };

    this.canvas=document.querySelector(elemId);
    this.ctx=this.canvas.getContext("2d");
    this.ctx.fillRoundRect=fillRoundRect.bind(this);
    this.ctx.width=200; this.ctx.height=210;
    this.ctx.transform(1, 0, 0, -1, 0, this.ctx.height); // transform
    
    this.color={
        "button":{
            "fill": "#efffef", //"#dcdcdc",
            "stroke": "#a9a9a9",
            "mOver": "#fffafa",
            "mClick": "#7fffd4",
            "shadow": "#afafaf"
        }
    };
};

ctrlPanel.prototype={
    drawPanel: function() {
        this.ctx.fillStyle=this.color.button.fill; // "#dcdcdc";
        this.ctx.strokeStyle=this.color.button.stroke; // "#a9a9a9";
        for(var i=0; i<5; i++) {
            var d=90-i*90/4;
            var pos={"x": ~~(this.radius.button*Math.cos(d/180*this.pi)), "y": ~~(this.radius.button*Math.sin(d/180*this.pi))};
            this.ctx.beginPath();
            this.ctx.fillStyle=this.color.button.fill; // "#dcdcdc";
            if(this.mouse.over[i]==true) {
                this.ctx.fillStyle=this.color.button.mOver; // "#fffafa";
            }
            if(this.mouse.clicked[i]==true) {
                this.ctx.fillStyle=this.color.button.mClick; // "#7fffd4";
            }
            // cancel shadow
            if(this.mouse.clicked[i]==true) {
                this.ctx.shadowBlur = 0;
                this.ctx.shadowColor = this.color.button.shadow;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
            }
            this.ctx.strokeStyle=this.color.button.stroke; // "#a9a9a9";
            this.ctx.fillRoundRect("fill", this.offset.x+pos.x, this.offset.y+pos.y, this.buttonSize, this.buttonSize, 13, 0);
            this.ctx.fillRoundRect("stroke", this.offset.x+pos.x, this.offset.y+pos.y, this.buttonSize, this.buttonSize, 13, 0);
            this.buttons[i]={"x":[this.offset.x+pos.x, this.offset.x+pos.x+this.buttonSize], "y":[this.offset.y+pos.y, this.offset.y+pos.y+this.buttonSize]};
            this.ctx.closePath();

            // set shadow
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.color.button.shadow;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = -2;
        }

        // center
        var tKey="center";
        this.ctx.beginPath();
        this.ctx.fillStyle=this.color.button.fill; // "#dcdcdc";
        this.ctx.strokeStyle=this.color.button.stroke; // "#a9a9a9";
        if(this.mouse.over[tKey]==true) {
            this.ctx.fillStyle=this.color.button.mOver; // "#fffafa";
        }
        if(this.mouse.clicked[tKey]==true) {
            this.ctx.fillStyle=this.color.button.mClick; // "#7fffd4";
        }
        // cancel shadow
        if(this.mouse.clicked[tKey]==true) {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = this.color.button.shadow;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        //this.ctx.fillRoundRect("fill", this.offset.x, this.offset.y, this.buttonSize, this.buttonSize, 2, 0);
        //this.ctx.fillRoundRect("stroke", this.offset.x, this.offset.y, this.buttonSize, this.buttonSize, 2, 0);
        this.ctx.moveTo(this.offset.x, this.offset.y);
        this.ctx.lineTo(this.offset.x+this.radius.C, this.offset.y);
        this.ctx.arc(this.offset.x, this.offset.y, this.radius.C, this.cAngle.b.e, this.cAngle.b.s, false);
        this.buttons[tKey]={"x":[this.offset.x, this.offset.x+this.radius.C], "y":[this.offset.y, this.offset.y+this.radius.C]};
        this.ctx.lineTo(this.offset.x, this.offset.y);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();

        // set shadow
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.color.button.shadow;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = -2;
        
        // arc
        var tKey="arc";
        this.ctx.fillStyle=this.color.button.fill; // "#dcdcdc";
        this.ctx.strokeStyle=this.color.button.stroke; // "#a9a9a9";
        if(this.mouse.over[tKey]==true) {
            this.ctx.fillStyle=this.color.button.mOver; // "#fffafa";
        }
        if(this.mouse.clicked[tKey]==true) {
            this.ctx.fillStyle=this.color.button.mClick; // "#7fffd4";
        }
        // cancel shadow
        if(this.mouse.clicked[tKey]==true) {
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = this.color.button.shadow;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        this.ctx.beginPath();
        this.ctx.arc(this.offset.x, this.offset.y, this.radius.A, this.cAngle.a.s, this.cAngle.a.e, false);
        this.ctx.lineTo(this.offset.x, this.offset.y+this.radius.A+20);
        this.ctx.arc(this.offset.x, this.offset.y, this.offset.y+this.radius.A+20, this.cAngle.b.s, this.cAngle.b.e, true);
        this.ctx.lineTo(this.offset.x+this.radius.A, this.offset.y);
        this.ctx.fill();
        this.ctx.stroke();
        this.buttons[tKey]={"x":[this.offset.x+this.radius.A, this.offset.x+this.radius.B], "y":[this.offset.y+this.radius.A, this.offset.y+this.radius.B]};
        this.ctx.closePath();

        // set shadow
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.color.button.shadow;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = -2;
        
        
        // // write text(begin)
        this.ctx.beginPath();
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = this.color.button.shadow;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.transform(1, 0, 0, -1, 0, this.ctx.height); // transform

        this.ctx.font="20px Arial";
        this.ctx.fillStyle="#137a7f";
        this.ctx.fillText("A", 24, 42);
        this.ctx.fillText("I", 80, 52);
        this.ctx.fillText("U", 121, 84);
        this.ctx.fillText("E", 153, 129);
        this.ctx.fillText("O", 163, 182);

        this.ctx.transform(1, 0, 0, 1, 0, this.ctx.height); // transform
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.color.button.shadow;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = -2;
        this.ctx.closePath();
        // // write text(end)


    },
    clearRect: function(){
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.stroke();
    },
    checkPos: function(x, y) {
        var hit=false, overNow=false;
        for(var i=0; i<Object.keys(this.buttons).length; i++) {
            var key=Object.keys(this.buttons)[i];
            var val=this.buttons[key];
            if(( x>val.x[0] && x<val.x[1] ) &&
               ( y>val.y[0] && y<val.y[1])
              ) {
                this._addButtonOver(key);
                hit=true;
                overNow=key;
                continue;
            }
        }
        
        // arc
        var distance=Math.sqrt(Math.pow(x-this.offset.x, 2)+Math.pow(y-this.offset.y, 2));
        if(this.radius.A<=distance && this.radius.B>=distance) {
            hit=true;
            overNow=key;
            this._addButtonOver("arc");
        }

        if(hit==false) {
            this._removeButtonOver("all");
        }

        return overNow;
        
    },
    _addButtonOver: function(key) {
        this.mouse.over[key]=true;
    },
    _removeButtonOver: function(key) {
        if(key=="all") {
            for(var i=0; i<Object.keys(this.buttons).length; i++) {
                this.mouse.over[Object.keys(this.buttons)[i]]=false;
            }
        } else if(typeof key=="number") {
            this.mouse.over[key]=false;
        }
    },
    addButtonClick: function(key) {
        this.mouse.clicked[key]=true;
    },
    removeButtonClick: function(key) {
        if(key=="all") {
            for(var i=0; i<Object.keys(this.buttons).length; i++) {
                this.mouse.clicked[Object.keys(this.buttons)[i]]=false;
            }
        } else if(typeof key=="number") {
            this.mouse.clicked[key]=false;
        }
    }

};

