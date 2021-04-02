// Web Audio API 周りの参考文献:
// http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/demos/demo-08
// http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/audio

(function () {
  const lyricBgStyleInactive = 'transparent';
  const lyricBgStyleActive = 'rgba(255,0,0,0.5)';

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
  const lyricPieces = [
    "あ❗️ スーモ❗️🌚",
    "ダン💥", "ダン💥", "ダン💥", "シャーン🎶",
    "スモ🌝", "スモ🌚", "スモ🌝", "スモ🌚",
    "スモ🌝", "スモ🌚", "ス〜〜〜モ⤴🌝",
    "スモ🌚", "スモ🌝", "スモ🌚", "スモ🌝",
    "スモ🌚", "スモ🌝", "ス〜〜〜モ⤵🌞"
  ];
  const modes = {
    'normal': 0,
    'random': 1,
    'infinity': 2,
  };
  const noRandomModes = [0];  // 基本的にはランダムモードが追加されていくことを想定

  var song = new Array(suumo.length);
  var lyricsText = "";


  var onDOMContentLoaded = function () {
    let rate = 1;  // デフォルト:等倍速
    let isRateRandom = false;  // デフォルト:再生速度ランダムじゃない
    let volume = 0.7; // デフォルト:70%
    const volumeSlider = document.getElementById('volume_slider');
    const rateSlider = document.getElementById('rate_slider');
    const rateRandomCheckbox = document.getElementById('rate_random_checkbox');
    function updateRateSliderValue() {
      rate = Math.pow(2, parseFloat(rateSlider.value));
      document.getElementById('rate_slider_value').innerText = "x" + rate.toFixed(2);
    }
    function updateRateRandomCheckbox() {
      isRateRandom = rateRandomCheckbox.checked;
      rateSlider.disabled = isRateRandom;
    }
    function updateVolumeSliderValue() {
      volume = volumeSlider.value;
      document.getElementById('volume_slider_value').innerText = Math.round(volume * 100) + "%";
    }
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    try {  // Create the instance of AudioContext
      var context = new AudioContext();
    } catch (error) {
      window.alert(error.message + ' : Please use Chrome or Safari.');
      return;
    }  // for legacy browsers

    context.createGain = context.createGain || context.createGainNode;  // Create the instance of GainNode

    var gain = context.createGain();  // for the instances of AudioBuffer

    var buffers = new Array(suumo.length);  // for the instances of AudioBufferSourceNode
    var lyricElements = new Array(suumo.length);

    var livingSources = [];  // will playing sources
    var sources = [];  // sound players

    var lastModeId = undefined;

    var interval;  // sec

    var event = document.createEvent('Event');  // Create original event
    event.initEvent('complete', true, true);  // Get ArrayBuffer by Ajax

    var load = function (url, index) {
      var xhr = new XMLHttpRequest();

      xhr.timeout = 30000;  // Timeout (30sec)
      xhr.ontimeout = function () {
        window.alert('Timeout.');
      };
      xhr.onerror = function () { };
      xhr.onload = function () {
        if (xhr.status === 200) {
          var arrayBuffer = xhr.response;  // Get ArrayBuffer

          if (arrayBuffer instanceof ArrayBuffer) {  // The 2nd argument for decodeAudioData

            var successCallback = function (audioBuffer) {  // Get the instance of AudioBuffer

              buffers[index] = audioBuffer;  // The loading instances of AudioBuffer has completed ?

              for (var i = 0, len = buffers.length; i < len; i++) {
                if (buffers[i] === undefined) {
                  return;
                }
              }  // dispatch 'complete' event

              document.querySelector('button').dispatchEvent(event);
            };  // The 3rd argument for decodeAudioData

            var errorCallback = function (error) {
              if (error instanceof Error) {
                window.alert(error.message);
              } else {
                window.alert('Error : "decodeAudioData" method.');
              }
            };  // Create the instance of AudioBuffer (Asynchronously)

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

    volumeSlider.addEventListener('input', function () {
      // 音量スライダーを動かしたとき
      updateVolumeSliderValue();

    });

    rateSlider.addEventListener('input', function () {
      // 再生速度スライダーを動かしたとき
      updateRateSliderValue();

    });

    rateRandomCheckbox.addEventListener('input', function () {
      // 再生速度ランダムチェックボックスを操作したとき
      updateRateRandomCheckbox();

    });

    document.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        switch (this.id) {
          case 'tweet2':
            if (lyricsText === "") {
              window.alert("スーモ文字列が空のままです．再生してからツイートすることをおすすめします");
            }
            window.open('http://twitter.com/intent/tweet/?text=' + encodeURIComponent(lyricsText.substring(0, 600)) + '&url=' + encodeURIComponent("http://hnakai0909.github.io/works/suumo/"));
            break;
          case 'stop':
            stopSuumo();
            break;
          case 'rate_reset':
            rateSlider.value = 0;
            updateRateSliderValue();
            break;
          default:  // いずれかのあ！スーモ！再生ボタンのとき
            startSuumo(this.id);
            break;
        }
      }, false);
    });

    // the departure of the suumo
    function startSuumo(modeName) {
      context.resume();

      // Get base time
      const t0 = context.currentTime;
      const modeId = modes[modeName];
      const createSumomi = (modeId !== modes['normal'] || lastModeId !== modes['normal']);  // normalを2回連続で押した場合のみfalse

      gain.gain.value = volumeSlider.value;

      initSuumo(createSumomi, modeId);
      addSuumo(t0, false, createSumomi, modeId);
      activateLyricElement(0);
    }

    function initSuumo(createSumomi, modeId) {
      lyricsText = "";
      sources = [];

      // 歌詞表示リセット
      if (createSumomi) {
        lyricElements = [];
        let element = document.getElementById("box");
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }
      lastModeId = modeId;
    }

    // add suumo executor
    function addSuumo(startTime, withAppearanceAnimation, createSumomi, modeId) {
      initOrder(song, modeId);

      const startIndex = sources.length;
      if (createSumomi) {
        createNextLyrics(startIndex, withAppearanceAnimation);
      }

      registerSources(startTime, startIndex, modeId);
    }

    // init the "song" variable
    function initOrder(array, modeId) {
      // https://bost.ocks.org/mike/shuffle/
      let m = array.length, t, i;
      for (i = 0; i < m; i++) {
        array[i] = i;
      }
      if (!noRandomModes.includes(modeId)) {
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
    }

    function createNextLyrics(startIndex, withAppearanceAnimation) {
      suumo.forEach(function (value, i) {  // 歌詞表示
        let sumomi = document.createElement("span");
        document.getElementById("box").appendChild(sumomi);
        sumomi.innerHTML = "" + suumo[song[i]];
        lyricElements[startIndex + i] = sumomi;
        lyricsText += lyricPieces[song[i]];

        if (withAppearanceAnimation) {
          sumomi.style.transition = "opacity 0.3s linear";
          sumomi.style.opacity = "0";
          setTimeout(function () {
            sumomi.style.opacity = "1";
          }, 0);
        }
      });
    }

    // get speed
    function getCurrentRate() {
      if (!isRateRandom) {
        return rate;
      }
      const sliderMax = parseFloat(rateSlider.max);
      const sliderMin = parseFloat(rateSlider.min);
      return Math.pow(2, Math.random() * (sliderMax - sliderMin) + sliderMin);
    }

    // the timing of additional lyricsText when infinity mode
    function isAlmostFinishOfSuumo(index) {
      return index === sources.length - 4;
    }

    // register sources that manage sound and current position
    function registerSources(startTime, startIndex, modeId) {
      let t0 = startTime;
      suumo.forEach(function (value, i) {
        let source = context.createBufferSource();

        source.start = source.start || source.noteGrainOn;  // noteGrainOn
        source.stop = source.stop || source.noteOff;  // Set the instance of AudioBuffer
        source.buffer = buffers[song[i]];  // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)

        const currentRate = getCurrentRate();  // speed
        source.playbackRate.value = currentRate;
        interval = (source.buffer.duration - 0.045) / currentRate;

        source.connect(gain);
        gain.connect(context.destination);

        source.start(t0);
        t0 += interval;

        source.onended = (function (index) {
          return function () {
            livingSources.splice(livingSources.indexOf(this), 1);

            if (lyricElements[index]) {
              deactivateLyricElement(index);
            }

            if (modeId === modes['infinity'] && isAlmostFinishOfSuumo(index)) {
              addSuumo(t0, true, true, modeId);
            }

            if (index < sources.length - 1) {
              activateLyricElement(index + 1);
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

    function stopSuumo() {
      // 音の再生を止める
      livingSources.forEach(function (source) {
        source.onended = function () { };
        source.stop(0);
      });
      livingSources = [];
      sources = [];
      // 赤反転を消す
      lyricElements.forEach(function (element, index) {
        deactivateLyricElement(index);
      });
    }

    // 赤反転させる
    function activateLyricElement(index) {
      lyricElements[index].style.background = lyricBgStyleActive;
    }

    // 赤反転を消す
    // InactiveにすることをDeactivateといい，DeactiveやInactivateとは言わないそうで．まぎらわしいね
    function deactivateLyricElement(index) {
      lyricElements[index].style.background = lyricBgStyleInactive;
    }
  };
  if ((document.readyState === 'interactive') || (document.readyState === 'complete')) {
    onDOMContentLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded, true);
  }
})();
