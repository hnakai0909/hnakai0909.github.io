function init_order(array, option) {
  //https://bost.ocks.org/mike/shuffle/
  var m = array.length, t, i;
  for (i = 0; i < m; i++) {
    array[i] = i;
  }
  if (option == "random") {
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  }
};

(function () {
  const lyricBGStyleNormal = 'transparent';
  const lyricBgStyleCurrent = 'rgba(255,0,0,0.5)';

  const suumo = [
    "あ❗️スーモ❗️<i class='e1'></i>",
    "ダン<i class='e2'></i>", "ダン<i class='e2'></i>",
    "ダン<i class='e2'></i>", "シャーン<i class='e3'></i>",
    "スモ<i class='e4'></i>", "スモ<i class='e1'></i>",
    "スモ<i class='e4'></i>", "スモ<i class='e1'></i>",
    "スモ<i class='e4'></i>", "スモ<i class='e1'></i>",
    "ス〜〜〜モ<i class='e5'></i><i class='e4'></i>",
    "スモ<i class='e4'></i>", "スモ<i class='e1'></i>",
    "スモ<i class='e4'></i>", "スモ<i class='e1'></i>",
    "スモ<i class='e4'></i>", "スモ<i class='e1'></i>",
    "ス〜〜〜モ<i class='e6'></i><i class='e7'></i>"
  ];
  const lyric_pieces = [
    "あ❗️ スーモ❗️🌚",
    "ダン💥", "ダン💥", "ダン💥", "シャーン🎶",
    "スモ🌝", "スモ🌚", "スモ🌝", "スモ🌚",
    "スモ🌝", "スモ🌚", "ス〜〜〜モ⤴🌝",
    "スモ🌚", "スモ🌝", "スモ🌚", "スモ🌝",
    "スモ🌚", "スモ🌝", "ス〜〜〜モ⤵🌞"
  ];
  var song = new Array(suumo.length);
  var lyrics = "";

  // from:http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/demos/demo-08
  // http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/audio

  var onDOMContentLoaded = function () {
    let rate = 1; //デフォルト:等倍速
    let isRateRandom = false; //デフォルト:再生速度ランダムじゃない
    const volumeSlider = document.getElementById('volume_slider');
    const rateSlider = document.getElementById('rate_slider');
    const rateRandomCheckbox = document.getElementById('rate_random_checkbox');
    function updateRateSliderValue(){
      rate = Math.pow(2,parseFloat(rateSlider.value));
      document.getElementById('rate_slider_value').innerText = "x" + rate.toFixed(2);
    }
    function updateRateRandomCheckbox(){
      isRateRandom = rateRandomCheckbox.checked;
    }

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    try {             // Create the instance of AudioContext
      var context = new AudioContext();
    } catch (error) {
      window.alert(error.message + ' : Please use Chrome or Safari.');
      return;
    }          // for legacy browsers

    context.createGain = context.createGain || context.createGainNode;          // Create the instance of GainNode

    var gain = context.createGain();          // for the instances of AudioBuffer

    var buffers = new Array(suumo.length);          // for the instances of AudioBufferSourceNode
    var lyric_elements = new Array(suumo.length);

    var livingSources = [];                           // will playing sources
    var sources = [];
    var interval;  // sec

    var event = document.createEvent('Event');        // Create original event
    event.initEvent('complete', true, true);          // Get ArrayBuffer by Ajax

    var load = function (url, index) {
      var xhr = new XMLHttpRequest();

      xhr.timeout = 30000;                        // Timeout (30sec)
      xhr.ontimeout = function () {
        window.alert('Timeout.');
      };
      xhr.onerror = function () { };
      xhr.onload = function () {
        if (xhr.status === 200) {
          var arrayBuffer = xhr.response;  // Get ArrayBuffer

          if (arrayBuffer instanceof ArrayBuffer) {                         // The 2nd argument for decodeAudioData

            var successCallback = function (audioBuffer) {                             // Get the instance of AudioBuffer

              buffers[index] = audioBuffer;                              // The loading instances of AudioBuffer has completed ?

              for (var i = 0, len = buffers.length; i < len; i++) {
                if (buffers[i] === undefined) {
                  return;
                }
              }                              // dispatch 'complete' event

              document.querySelector('button').dispatchEvent(event);
            };                          // The 3rd argument for decodeAudioData

            var errorCallback = function (error) {
              if (error instanceof Error) {
                window.alert(error.message);
              } else {
                window.alert('Error : "decodeAudioData" method.');
              }
            };                          // Create the instance of AudioBuffer (Asynchronously)

            context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
          }
        }
      };
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
    };

    suumo.forEach(function (value, i) {
      load('./audio/suumo_' + i + ".mp3", i);
    });

    volumeSlider.addEventListener('input', function(){
      //音量スライダーを動かしたとき
    });
    
    rateSlider.addEventListener('input', function(){
      //再生速度スライダーを動かしたとき
      updateRateSliderValue();
      
    });

    rateRandomCheckbox.addEventListener('input', function(){
      //再生速度ランダムチェックボックスを操作したとき
      updateRateRandomCheckbox();
      
    });

    document.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        if (this.id == "tweet2") {
          if (lyrics == "") {
            window.alert("スーモ文字列が空のままです．再生してからツイートすることをおすすめします");
          }
          window.open('http://twitter.com/intent/tweet/?text=' + encodeURIComponent(lyrics.substring(0, 600)) + '&url=' + encodeURIComponent("http://hnakai0909.github.io/works/suumo/"));
          return;
        } else if (this.id == 'stop') {
          //音の再生を止める
          livingSources.forEach(function (source) {
            source.onended = function () { };
            source.stop(0);
          });
          livingSources = [];
          sources = [];
          //赤反転を消す
          lyric_elements.forEach(function (element) {
            element.style.background = lyricBGStyleNormal;
          });
          return;
        } else if (this.id == 'rate_reset') {
          rateSlider.value = 0;
          updateRateSliderValue();
          return;
        }
        //以下，いずれかのあ！スーモ！再生ボタンのとき

        context.resume();

        // Get base time
        var t0 = context.currentTime;

        var mode = this.id;

        lyrics = "";
        sources = [];
        lyric_elements = [];
        var element = document.getElementById("box"); //歌詞表示リセット
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }

        gain.gain.value = volumeSlider.value;

        addSuumo(t0, false);
        lyric_elements[0].style.background = lyricBgStyleCurrent;

        function addSuumo(startTime, withAppearanceAnimation) {
          init_order(song, mode === "normal" ? "normal" : "random");

          var startIndex = sources.length;
          suumo.forEach(function (value, i) { //歌詞表示
            var sumomi = document.createElement("span");
            document.getElementById("box").appendChild(sumomi);
            sumomi.innerHTML = "" + suumo[song[i]];
            lyric_elements[startIndex + i] = sumomi;
            lyrics += lyric_pieces[song[i]];

            if (withAppearanceAnimation) {
              sumomi.style.transition = "opacity 0.3s linear";
              sumomi.style.opacity = "0";
              setTimeout(function () {
                sumomi.style.opacity = "1";
              }, 0);
            }
          });

          var t0 = startTime;

          suumo.forEach(function (value, i) {

            source = context.createBufferSource();

            source.start = source.start || source.noteGrainOn; // noteGrainOn
            source.stop = source.stop || source.noteOff; // Set the instance of AudioBuffer
            source.buffer = buffers[song[i]]; // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
            
            if (isRateRandom){
              const max_rate = Math.pow(2,parseFloat(rateSlider.max));
              const min_rate = Math.pow(2,parseFloat(rateSlider.min));
              const random_rate = Math.random() * (max_rate - min_rate) + min_rate;
              source.playbackRate.value = random_rate;
              interval = (source.buffer.duration - 0.045) / random_rate;
            } else {
              source.playbackRate.value = rate;
              interval = (source.buffer.duration - 0.045) / rate;
            }

            source.connect(gain);
            gain.connect(context.destination);


            source.start(t0);
            t0 += interval;
            source.onended = (function (i) {
              return function () {
                livingSources.splice(livingSources.indexOf(this), 1);

                if (lyric_elements[i]) {
                  lyric_elements[i].style.background = lyricBGStyleNormal;
                }

                if (mode === "infinity" && i === sources.length - 4) {
                  addSuumo(t0, true)
                }

                if (i < sources.length - 1) {
                  lyric_elements[i + 1].style.background = lyricBgStyleCurrent;
                }

                if (livingSources.length === 0) {
                  sources = [];
                }
              }
            })(startIndex + i);
            livingSources.push(source);
            sources.push(source);
          });
        }
      }, false);
    });
  };
  if ((document.readyState === 'interactive') || (document.readyState === 'complete')) {
    onDOMContentLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded, true);
  }
})();
