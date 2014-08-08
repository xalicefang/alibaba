var timeoutID;


function startActiveWatch() {
    console.log("started!");
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);
 
    startTimer();
}

function stopActiveWatch() {
    this.removeEventListener("mousemove", resetTimer, false);
    this.removeEventListener("mousedown", resetTimer, false);
    this.removeEventListener("keypress", resetTimer, false);
    this.removeEventListener("DOMMouseScroll", resetTimer, false);
    this.removeEventListener("mousewheel", resetTimer, false);
    this.removeEventListener("touchmove", resetTimer, false);
    this.removeEventListener("MSPointerMove", resetTimer, false);
}
 
function startTimer() {
    // wait 2 seconds before calling goInactive
    timeoutID = window.setTimeout(goInactive, 2000);
}
 
function resetTimer(e) {
    window.clearTimeout(timeoutID);
 
    goActive();
}
 
function goInactive() {
    // stop exp timer
    chrome.runtime.sendMessage({stopTimer: true});
    alert("Are you still there? The Taobao experiment takes 15 minutes and requires that you are active for this period of time. Please click 'okay' to resume the timer.");
}
 
function goActive() {
    // start exp timer
    chrome.runtime.sendMessage({startTimer: true});

    startTimer();
}