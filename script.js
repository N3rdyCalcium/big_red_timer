function preview() {
    const minRaw = document.getElementById('min').value;
    const secRaw = document.getElementById('sec').value;
    const min = String(minRaw).padStart(2, "0");
    const sec = String(secRaw).padStart(2, "0");
    const timerPreview = document.getElementById('timerPreview');
    const title = document.getElementById('title');
    const hiddenInputMin = document.getElementById('hiddenMin');
    const hiddenInputSec = document.getElementById('hiddenSec');
    const hiddenFlash = document.getElementById("hiddenFlash");
    const beepAlertValue = document.getElementById("beepAlertValue");
    const beepCountdownValue = document.getElementById("beepCountdownValue");
    const shareLink = document.getElementById('shareLink');
    const visible = document.getElementById('visible');

    timerPreview.textContent = min+":"+sec;
    title.value = timerPreview.textContent;
    hiddenInputMin.value = min;
    hiddenInputSec.value = sec;

    visible.style.display = "block";
}

//detect Enter key on input
function triggerPreviewOnEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();   // prevent form submit/refresh
        preview();    // trigger button click
    }
}

// attach listener to both inputs
document.getElementById("min").addEventListener("keydown", triggerPreviewOnEnter);
document.getElementById("sec").addEventListener("keydown", triggerPreviewOnEnter);

// default state
let flash = false;
let beepAlert = false;
let beepCountdown = false;

// reference to checkbox
const toggleFlash = document.getElementById("toggleFlash");
const beepCountdownCheck = document.getElementById("beepCountdown");
const beepAlertCheck = document.getElementById("beepAlert");

// listen for changes
toggleFlash.addEventListener("change", function() { // normal function to use 'this'
    flash = this.checked;        // true if checked, false if unchecked
    hiddenFlash.value = flash;   // update hidden input
    console.log(hiddenFlash.value);          // debug
});

// The Beep function (for check sound purposes only)
let audioCtx = null;    // AudioContext, created on first user gesture
let intervalId = null;  // to store setInterval ID

// Function to play one short beep
function beep() {
  if (!audioCtx) return;  // safety check

  const oscillator = audioCtx.createOscillator();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

// Checkbox listener
document.getElementById("beepToggle").addEventListener("change", function() {
  if (!audioCtx) {
    // Create AudioContext on first user gesture
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Resume AudioContext if it is suspended (required in most browsers)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (this.checked) {
    // Start beeping every second
    if (intervalId === null) {
      beep(); // play first beep immediately
      intervalId = setInterval(beep, 1000);
    }
  } else {
    // Stop beeping
    clearInterval(intervalId);
    intervalId = null;
  }
});

beepAlertCheck.addEventListener("change", function() { // normal function to use 'this'
    beepAlertValue.value = this.checked;          // true if checked, false if unchecked

    // show/hide the div containing beepCountdown
    if (this.checked) {
        beepCheck.style.display = "block";
    } else {
        beepCheck.style.display = "none";
        beepCountdownCheck.checked = false;      // optional: uncheck beepCountdown
    }

    console.log(beepAlertValue.value);           // debug
});

beepCountdownCheck.addEventListener("change", function() { // normal function to use 'this'
    beepCountdownValue.value = this.checked;        // true if checked, false if unchecked  
    console.log(beepCountdownValue.value);          // debug
});

function refresh() {
  location.reload();
}

shareLink.value = "https://pro70crazy.wuaze.com/HTMLtest/big_red_timer/timer.php?beepAlert=" + beepAlertValue.value + "&beepCountdown=" + beepCountdownValue.value + "&min=" + min.value + "&sec=" + sec.value + "&flashBool=" + hiddenFlash.value + "&title=" + min.value + ":" + sec.value;
function copyLink() {
  // Get the text field
  var copyText = document.getElementById("shareLink");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  string.innerText = "Copied to Clipboard!"
  setTimeout(() => {
    string.innerText = "Copy Link"
  }, 1000);
}

// This is the code for the PHP, it will not run on PHP. It needs to be run inside the PHP file inside the <script>
function enterFullscreen() {
  console.log("Button clicked");
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fsBtn.innerText = "Exit Fullscreen";
  } else {
    document.exitFullscreen();
    fsBtn.innerText = "Fullscreen";
  }
}
document.getElementById("fsBtn").addEventListener("click", enterFullscreen);