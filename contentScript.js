chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    if (request.get == "readyState") {
      //console.log(document.readyState);
      sendResponse({readyState: document.readyState});
  	} else if (request.browserAction == "clicked") {
      console.log("clicked!");
      modal.style.visibility = "visible";
    }
  });

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.runtime.sendMessage({domLoaded: true});
});

window.onbeforeunload = function() {
  chrome.runtime.sendMessage({unload: true});
};


// add onclick event for all links!
function nodeInsertedCallback(event) {
    // there's repeats with related node, but it covers everything
    var a = event.relatedNode.getElementsByTagName('a');
    for (i=0;i<a.length;i++) { 
        a[i].onclick = function() {
          // if not new tab
          if (history.length > 1)
            chrome.runtime.sendMessage({link: a[i].href});
        };
    }
}

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);