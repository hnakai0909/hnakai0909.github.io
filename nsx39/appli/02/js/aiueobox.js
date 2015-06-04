/*
* aiueoBox.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var aiueoBox = function(arElemId) {
    this.pi = Math.PI;
    this.offset={"x":10.5, "y":10.5};
    this.button={"Size": 78, "Space": 8, "bdrRadius": 10};
    this.mOverNow={"key":false, "Idx":false};
    this.canvas=[];
    this.ctx=[];
    this.cursor="default";
    this.closeImg=new Image();
    this.closeImg.src="images/close.png";
    this.dragImg=new Image();
    this.dragImg.src="images/drag.png";
    this.drag={"click":false, "Idx":false};
    this.pointerPos={"x":0, "y":0};
    
    for(var i=0; i<arElemId.length; i++) { 
        var Idx=i+1;
        this.canvas[Idx]=document.querySelector(arElemId[i]);
        this.ctx[Idx]=this.canvas[Idx].getContext("2d");
    }

    this.color={
        "button":{
            "fill":        "#efffef", //"#dcdcdc",
            "text":        "#137a7f",
            "guideText":   "#000000",
            "stroke":      "#d7e0d7",//#bbc6bb", //"#a9a9a9",
            "strokeClick": "#bbc6bb", //"#a9a9a9",
            "mOver":       "#fffafa",
            "bDelete":     "rgba(232, 230, 227, 0.83)",
            "bMove":       "rgba(76, 212, 125, 0.84)",
            "bMoveOver":   "rgba(76, 212, 125, 0.20)",
            "mClick":      "#7fffd4",
            "shadow":      "#afafaf"
        }
    };
    this.uiMode="Play"; // play, edit, add, move
    this.bPosition=[
        [],
        [
            {"わ": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"を": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"ん": {"x":0, "y":0} },
            {"ら": {"x":0, "y":0} }, {"り": {"x":0, "y":0} }, {"る": {"x":0, "y":0} }, {"れ": {"x":0, "y":0} }, {"ろ": {"x":0, "y":0} },
            {"や": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"ゆ": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"よ": {"x":0, "y":0} },
            {"ま": {"x":0, "y":0} }, {"み": {"x":0, "y":0} }, {"む": {"x":0, "y":0} }, {"め": {"x":0, "y":0} }, {"も": {"x":0, "y":0} },
            {"は": {"x":0, "y":0} }, {"ひ": {"x":0, "y":0} }, {"ふ": {"x":0, "y":0} }, {"へ": {"x":0, "y":0} }, {"ほ": {"x":0, "y":0} },
            {"な": {"x":0, "y":0} }, {"に": {"x":0, "y":0} }, {"ぬ": {"x":0, "y":0} }, {"ね": {"x":0, "y":0} }, {"の": {"x":0, "y":0} },
            {"た": {"x":0, "y":0} }, {"ち": {"x":0, "y":0} }, {"つ": {"x":0, "y":0} }, {"て": {"x":0, "y":0} }, {"と": {"x":0, "y":0} },
            {"さ": {"x":0, "y":0} }, {"し": {"x":0, "y":0} }, {"す": {"x":0, "y":0} }, {"せ": {"x":0, "y":0} }, {"そ": {"x":0, "y":0} },
            {"か": {"x":0, "y":0} }, {"き": {"x":0, "y":0} }, {"く": {"x":0, "y":0} }, {"け": {"x":0, "y":0} }, {"こ": {"x":0, "y":0} },
            {"あ": {"x":0, "y":0} }, {"い": {"x":0, "y":0} }, {"う": {"x":0, "y":0} }, {"え": {"x":0, "y":0} }, {"お": {"x":0, "y":0} }
        ],
        [
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"ぱ": {"x":0, "y":0} }, {"ぴ": {"x":0, "y":0} }, {"ぷ": {"x":0, "y":0} }, {"ぺ": {"x":0, "y":0} }, {"ぽ": {"x":0, "y":0} },
            {"ば": {"x":0, "y":0} }, {"び": {"x":0, "y":0} }, {"ぶ": {"x":0, "y":0} }, {"べ": {"x":0, "y":0} }, {"ぼ": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"だ": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"で": {"x":0, "y":0} }, {"ど": {"x":0, "y":0} },
            {"ざ": {"x":0, "y":0} }, {"じ": {"x":0, "y":0} }, {"ず": {"x":0, "y":0} }, {"ぜ": {"x":0, "y":0} }, {"ぞ": {"x":0, "y":0} },
            {"が": {"x":0, "y":0} }, {"ぎ": {"x":0, "y":0} }, {"ぐ": {"x":0, "y":0} }, {"げ": {"x":0, "y":0} }, {"ご": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }
        ],
        [
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"じゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"じゅ": {"x":0, "y":0} }, {"じぇ": {"x":0, "y":0} }, {"じょ": {"x":0, "y":0} },
            {"しゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"しゅ": {"x":0, "y":0} }, {"しぇ": {"x":0, "y":0} }, {"しょ": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"てゅ": {"x":0, "y":0} }, {"でゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"とぅ": {"x":0, "y":0} }, {"どぅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"づぁ": {"x":0, "y":0} }, {"づぃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"づぇ": {"x":0, "y":0} }, {"づぉ": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"すぃ": {"x":0, "y":0} }, {"ずぃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"きゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"きゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"きょ": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"うぃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"うぇ": {"x":0, "y":0} }, {"うぉ": {"x":0, "y":0} }
        ],
        [
            {"りゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"りゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"りょ": {"x":0, "y":0} },
            {"みゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"みゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"みょ": {"x":0, "y":0} },
            {"にゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"にゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"にょ": {"x":0, "y":0} },
            {"ふぁ": {"x":0, "y":0} }, {"ふぃ": {"x":0, "y":0} }, {"ふぅ": {"x":0, "y":0} }, {"ふぇ": {"x":0, "y":0} }, {"ふぉ": {"x":0, "y":0} },
            {"ぴゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ぴゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ぴょ": {"x":0, "y":0} },
            {"びゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"びゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"びょ": {"x":0, "y":0} },
            {"ひゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ひゅ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ひょ": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"てぃ": {"x":0, "y":0} }, {"でぃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"つぁ": {"x":0, "y":0} }, {"つぃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"つぇ": {"x":0, "y":0} }, {"つぉ": {"x":0, "y":0} },
            {"ちゃ": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ちゅ": {"x":0, "y":0} }, {"ちぇ": {"x":0, "y":0} }, {"ちょ": {"x":0, "y":0} }
        ],
        [
            {"こ":{"x":5,"y":6}},     {"の":{"x":90,"y":6}},    {"の":{"x":388,"y":6}},     {"ぼ":{"x":502,"y":7}},   {"た":{"x":584,"y":6}},
            {"ん":{"x":666,"y":7}},   {"は":{"x":773,"y":4}},   {"つ":{"x":63,"y":122}},    {"い":{"x":28,"y":238}},  {"か":{"x":228,"y":130}},
            {"さ":{"x":404,"y":131}}, {"く":{"x":489,"y":126}}, {"じょ":{"x":576,"y":121}}, {"い":{"x":143,"y":124}}, {"ど":{"x":109,"y":238}},
            {"う":{"x":608,"y":236}}, {"が":{"x":325,"y":232}}, {"じ":{"x":445,"y":244}},   {"ゆ":{"x":528,"y":240}}, {"う":{"x":187,"y":242}},
            {"に":{"x":761,"y":224}}, {"お":{"x":113,"y":346}}, {"こ":{"x":191,"y":346}},   {"な":{"x":275,"y":344}}, {"え":{"x":357,"y":341}},
            {"ま":{"x":438,"y":340}}, {"す":{"x":519,"y":339}}, {"た":{"x":200,"y":7}},     {"ぶ":{"x":282,"y":5}},   {"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}}
        ]
    ];
    this.bPositionT=[  [], [], [], [], []  ];
    // init position
    var btnSpace=this.button.Space;
    var btnSize=this.button.Size;
    for(var ii=0; ii<this.bPosition.length-1; ii++) {
        var Idx=ii+1;
        var count=0, k;
        for(var i=0; i<10; i++) {
            for(var j=0; j<5; j++) {
                k=Object.keys(this.bPosition[Idx][count])[0];
                if(k.match(/^d0/)==null) {
                    switch(Idx){
                      case 5:
                        if(this.bPosition[Idx][count][k].x==0 && this.bPosition[Idx][count][k].y==0) {
                            this.bPosition[Idx][count][k].x=this.offset.x + i*(btnSpace+btnSize);
                            this.bPosition[Idx][count][k].y=this.offset.y + j*(btnSpace+btnSize);
                        }
                        break;
                    default:
                        this.bPosition[Idx][count][k].x=this.offset.x + i*(btnSpace+btnSize);
                        this.bPosition[Idx][count][k].y=this.offset.y + j*(btnSpace+btnSize);
                        break;
                    }
                }
                count++;
            }
        }
    }
};

aiueoBox.prototype={
    spliceReplace: function(idx){
        this.bPositionT[idx]=new Array();
        for(var i=0; i<this.bPosition[idx].length; i++) {
            var k=Object.keys(this.bPosition[idx][i])[0];
            if( k!="d0" ) {
                this.bPositionT[idx].push(this.bPosition[idx][i]);
            }
        }
        while(this.bPositionT[idx].length<50) {
            this.bPositionT[idx].push({"d0": {"x":0, "y":0} });
        }
        this.bPosition[idx]=this.bPositionT[idx];
    },
    getAvailableLetterCount: function(idx){
        var count=0;        
        for(var i=0; i<this.bPosition[idx].length; i++) {
            var k=Object.keys(this.bPosition[idx][i])[0];
            if( k=="d0" ) {
                count++;
            }
        }
        return count;
    },

    drawAiueo: function(tabStatus) {
        var btnSpace=this.button.Space;
        var btnSize=this.button.Size;
        this.spliceReplace(5);
        
        for(var ii=0; ii<this.ctx.length; ii++) {
            var Idx=ii+1;
            var tabName="t_aiueo0"+Idx;
            if(tabStatus[tabName]==true) {
                this.ctx[Idx].beginPath();
                this.ctx[Idx].clearRect(0, 0, this.canvas[Idx].width, this.canvas[Idx].height);
                this.ctx[Idx].stroke();
                
                this.ctx[Idx].beginPath();
                var count=0, k;
                for(var i=0; i<10; i++) {
                    for(var j=0; j<5; j++) {
                        k=Object.keys(this.bPosition[Idx][count])[0];
                        if(k.match(/^d0/)==null) {
                            var btnPos=this.bPosition[Idx][count][k];
                            drawBlock.bind(this)(this.ctx[Idx], btnPos.x, btnPos.y, k, count);
                        }
                        count++;
                    }
                }
                this.ctx[Idx].closePath();
            }
        }
        
        function drawBlock(context, x, y, k, dNum) {
            // set shadow
            switch(this.uiMode) {
              case "Move":
              case "Delete":
                break;
              case "Play":
                context.shadowBlur = 10;
                context.shadowColor = this.color.button.shadow;
                context.shadowOffsetX = 2;
                context.shadowOffsetY = -2;
                break;
            }
            
            context.fillStyle=this.color.button.fill; // "#dcdcdc";
            if(this.mOverNow.Idx==dNum && this.drag.click==false) {
                switch(this.uiMode) {
                  case "Play":
                    context.fillStyle=this.color.button.mOver; // "#dcdcdc";
                    break;
                  case "Delete":
                    context.fillStyle=this.color.button.bDelete;
                    break;
                  case "Move":
                    context.fillStyle=this.color.button.bMoveOver;
                    break;
                }
            } else if(this.drag.Idx==dNum && this.drag.click==true) {
                switch(this.uiMode) {
                  case "Play":
                    context.fillStyle=this.color.button.mOver; // "#dcdcdc";
                    break;
                  case "Move":
                    context.fillStyle=this.color.button.bMove;
                    break;
                }
            }
            context.strokeStyle=this.color.button.stroke;
            var shake={ "x":0, "y":0 };
            switch(this.uiMode){
              case "Move":
              case "Delete":
                var r={"a":Math.floor(Math.random() * 3), "b": Math.floor(Math.random() * 3)};
                shake={ "x": r.a-r.b, "y": r.b-r.a};
                break;
            }
            
            this.fillRoundRect(context, "fill", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
            this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
            
            context.shadowBlur = 0;
            context.shadowColor = this.color.button.shadow;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            // text
            context.fillStyle=this.color.button.text;
            context.font="25px Arial";
            context.strokeStyle=this.color.button.strokeClick;
            var xPos=x+btnSize/2-0.34*btnSize;
            var yPos=y+btnSize-0.6*btnSize;
            if(this.mOverNow.Idx==dNum && this.drag.click==false) {
                switch(this.uiMode) {
                default:
                  case "Play":
                    this.cursor="default";
                    context.font="Bold 32px Arial";
                    xPos-=8; yPos+=5;
                    break;
                  case "Delete":
                    var dMsg="クリックでけす";
                    context.fillStyle=this.color.button.guideText;
                    context.font="Bold 10px Arial";
                    context.fillText(dMsg, xPos-2.5+shake.x, yPos+35.5+shake.y);
                    context.font="25px Arial";
                    context.drawImage(this.closeImg, x+25.5+shake.x, y+30.5+shake.y);
                    context.fillStyle=this.color.button.text;
                    this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
                    break;
                  case "Move":
                    var dMsg="ドラッグでうごかす";
                    this.cursor="pointer";
                    context.fillStyle=this.color.button.guideText;
                    context.font="Bold 9px Arial";
                    context.fillText(dMsg, xPos-8.5+shake.x, yPos+35.5+shake.y);
                    context.font="25px Arial";
                    context.drawImage(this.dragImg, x+25.5+shake.x, y+30.5+shake.y);
                    context.fillStyle=this.color.button.guideText;
                    this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
                    break;
                }
            } else if(this.drag.Idx==dNum && this.drag.click==true) {
                switch(this.uiMode) {
                default:
                  case "Play":
                    this.cursor="default";
                    context.font="Bold 32px Arial";
                    xPos-=8; yPos+=5;
                    break;
                  case "Move":
                    var dMsg="ドラッグで移動";
                    this.cursor="pointer";
                    context.fillStyle=this.color.button.guideText;
                    context.font="Bold 10px Arial";
                    context.fillText(dMsg, xPos-8.5+shake.x, yPos+35.5+shake.y);
                    context.font="25px Arial";
                    context.drawImage(this.dragImg, x+25.5+shake.x, y+30.5+shake.y);
                    context.fillStyle=this.color.button.guideText;
                    this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
                    break;
                }
            }
            context.fillText(k, xPos+shake.x, yPos+shake.y); 
        }
    },

    setButtonPos: function(Idx, x, y) {
        var offset=this.button.Size/2;
        this.bPosition[Idx][this.drag.Idx][this.drag.key]={"x":x-offset, "y":y-offset};
    },
    
    // Refferd URL: http://devlabo.blogspot.jp/2010/03/javascriptcanvas.html
    // l: left, t: top, w: width, h: height, r: radius, rotate
    fillRoundRect: function(context, type, l, t, w, h, r, rotate) {
        var pi = this.pi;
        if(typeof rotate!="number") rotate=0;
        context.save();
        context.beginPath();
        context.rotate( rotate * this.pi / 180 );
        context.arc(l + r, t + r, r, - this.pi, - 0.5 * this.pi, false);
        context.arc(l + w - r, t + r, r, - 0.5 * this.pi, 0, false);
        context.arc(l + w - r, t + h - r, r, 0, 0.5 * this.pi, false);
        context.arc(l + r, t + h - r, r, 0.5 * this.pi, this.pi, false);
        context.closePath();
        switch(type) {
          case "fill":
            context.fill();
            break;
          case "stroke":
            context.stroke();
            break;
        }
        context.restore();
    },

    getPosIdx: function(bPIdx, x, y) {
       var out={"key":false, "Idx":false};
        for(var i=this.bPosition[bPIdx].length-1; i>=0; i--) {
            var key=Object.keys(this.bPosition[bPIdx][i])[0];
            var pos=this.bPosition[bPIdx][i][key];
            if( (key!="d0" &&
                 x>pos.x && x<pos.x+this.button.Size) &&
                (y>pos.y && y<pos.y+this.button.Size) ) {
                out={"key": key, "Idx":i};
                this.mOverNow=out;
                break;
            }
        }
        return out;
    },

    deleteBlock: function(canvasIdx, arrIdx) {
        for(var i=0; i<arrIdx.length; i++) {
            delete this.bPosition[canvasIdx][arrIdx[i]];
            this.bPosition[canvasIdx][arrIdx[i]]={"d0": {"x":0, "y":0} };
        }
    },

    exportSandbox: function() {
    }
    
};

