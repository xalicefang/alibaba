/* 
MESSAGE RECEIVER
*/
chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {
    if (request.get == "readyState") {
      sendResponse({readyState: document.readyState});
  	} 

    // For color tab case, if closed tab, deactivate the colored item box
    else if (request.closedTab) {
      console.log("closed tab request received");
      deactivateItemBox(request.closedTab);
    }
  }
);

/* 
MESSAGE SENDER
*/
// Tell bg script when page is done loading, to pass onto log
document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
      chrome.runtime.sendMessage({domLoaded: true});
  }
}

//Tell bg script when page is unloading (back, new address), to pass onto log
window.onbeforeunload = function() {
  chrome.runtime.sendMessage({unload: true});
};
