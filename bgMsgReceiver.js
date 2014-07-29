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
    	// write to csv here too!!!!!!
	}

	// experimental actions
	else if (request.finishedTask) {
		console.log("finished " + request.finishedTask);
	    if (request.finishedTask == 1) {
	    	chrome.windows.create({url: 'http://www.taobao.com/?task=2'});
	    	chrome.windows.getAll(null, removeOtherWin);
	    } else if (request.finishedTask == 2) {
	    	chrome.windows.create({url: 'http://www.taobao.com/?task=3'});
	    	chrome.windows.getAll(null, removeOtherWin);
	    }

		downloadCSV();
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