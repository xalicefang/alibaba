// clean this up and make methods!!

// calculate loading time for same tab address bar, back, refresh, etc. 
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	// click link, open in same tab (new tab covered by onActivated)
	if (request.link) {
		// be sure to match url with permissions!!!!!!!!!
    	  chrome.tabs.query({active: true, currentWindow: true, url: "http://*/*"}, function(tabs) {
        var tab = tabs[0];
        // open new tab in background will trigger this too! for loading time it doesn't matter. but for logging it does.
        if (tab.id==sender.tab.id) {
          clickedLink(request.link);
        }
      });
    } 
    // if active tab dom loaded
    else if (request.domLoaded) {
	  chrome.tabs.query({active: true, currentWindow: true, url: "http://*/*"}, function(tabs) {
	  	if (tabs.length>0) {
		 	var tab = tabs[0];
	 		if (tab.id==sender.tab.id) {
	 			var loadingTime = Date.now() - startTime;
		 		console.log("yes, current tab is loaded!" + loadingTime);
		 		makeRowLoading(loadingTime,tab.id,tab.index,tab.windowId,tab.url);
		 		startTime = Number.NEGATIVE_INFINITY;
		 	}
		 	// else calculate background loading time? too hard... later, if time!
		}
	  });
	}

	// if click back/ forward/ refresh/ address bar change
    else if (request.unload) {
    	startTime = Date.now();
    	chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs) {
	      var tab = tabs[0];
	      makeRow("unload",tab.id,tab.index,tab.windowId,tab.url);
	    });
	}

	// experimental actions
	else if (request.finishedTask) {
		makeRow("finished task " + request.finishedTask);

		// add progress points!! halfway there!
		
		// check if time reached
		var currSec = new Date().getTime() / 1000;
		if (currSec > window.localStorage.getItem('stopTime')) {
			chrome.windows.create({url: '/exp/finished.html'});
	    	chrome.windows.getAll(null, removeOtherWin);
	    } else {
		   	var nextURL = "http://www.taobao.com/?task=" + ++request.finishedTask;
			console.log("next " + nextURL);
		    chrome.windows.create({url: nextURL});
		    chrome.windows.getAll(null, removeOtherWin);
		}

		downloadCSV();
		downloadCSVLoading();
		downloadCSVNumber();
	} else if (request.user) {
		//alert("bg " + window.localStorage.getItem('userID'));
	    sendResponse({user: window.localStorage.getItem('userID')});
	}
});

function removeOtherWin(windows) {
	chrome.windows.getLastFocused(function(topWin) {
		alert("Submitted! Now closing all other windows and tabs.");
		for (var i=0; i< windows.length; i++) {
			if (windows[i].id != topWin.id) {
				//chrome.windows.remove(windows[i].id);
			}
		}
	});
}