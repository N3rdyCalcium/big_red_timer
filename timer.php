<?php
$min = isset($_REQUEST['min']) && $_REQUEST['min'] !== "" ? (int)$_REQUEST['min'] : 0;
$sec = isset($_REQUEST['sec']) && $_REQUEST['sec'] !== "" ? (int)$_REQUEST['sec'] : 0;
$title = isset($_REQUEST['title']) ? $_REQUEST['title'] : "timer";
$flash = isset($_REQUEST['flashBool']) && ($_REQUEST['flashBool'] === 'true' || $_REQUEST['flashBool'] === '1');
$beep = isset($_REQUEST['beepAlert']) ? ($_REQUEST['beepAlert'] === 'true' || $_REQUEST['beepAlert'] === '1') : false;
$beepCountdown = isset($_REQUEST['beepCountdown']) ? ($_REQUEST['beepCountdown'] === 'true' || $_REQUEST['beepCountdown'] === '1') : false;
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $title," timer"; ?></title>
        <link rel=stylesheet href="style2.css">
    </head>
    <body>
    <div class="timer-container">
        <div class="timer" id="timer"></div>
    </div>
    <br>
    <button onclick=enterFullscreen() id=fsBtn>Fullscreen</button>
    </body>
    <script>
// get starting values from PHP
let minutes = <?php echo $min; ?>;
let seconds = <?php echo $sec; ?>;
let flashBool = <?php echo json_encode($flash); ?>;
let beep = <?php echo json_encode($beep); ?>;
let beepCountdown = <?php echo json_encode($beepCountdown); ?>;

const timer = document.getElementById('timer');
const container = document.querySelector('.timer-container');

function startFlash() {
    container.classList.add('flash');
    timer.classList.add('flash');
}

function longBeep() {
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}

function shortBeep() {
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function updateTimer() {
    // Display MM:SS
    timer.textContent = String(minutes).padStart(2,'0') + ":" + String(seconds).padStart(2,'0');

    // Flash logic: trigger in the last 5 seconds
    if (minutes === 0 && seconds <= 5 && seconds > 0) {
        if (flashBool) {
            startFlash();
        } 
        if (beep) {
            shortBeep();
        }
    }

    if (minutes === 0 && seconds === 0) {
        if (beep) {
            longBeep();
        }
        setTimeout(() => {
            alert("Time's up!"); // alert when timer ends
        }, 1000);
        return;
    }

    // Countdown logic
    if (seconds === 0) {
        if (minutes > 0) {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    if (beepCountdown) {
        shortBeep();
    }
    setTimeout(updateTimer, 1000); // repeat every second
}

// Start the timer
updateTimer();

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
</script>
</html>