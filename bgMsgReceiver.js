function getParameterFromString(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// clean this up and make methods!!

var finished = false;
var minTimePassed = false;

function uninstall() {
	chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs) {
		var tab = tabs[0];
		chrome.tabs.update(tab.id, {url: "/exp/finished.html"});
	});
}

// calculate loading time for same tab address bar, back, refresh, etc. 
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	// click link, open in same tab (new tab covered by onActivated)
	if (request.link) {
		console.log("clicked link same tab");
        clickedLinkSameTab(request.link);
    } 
    // if active tab dom loaded
    else if (request.domLoaded) {
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  	if (tabs.length > 0) {
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

	// store task on start and task message
	else if (request.task) {
		window.localStorage.setItem('task',request.task);
	}

	// get task
	else if (request.getTask) {
	    sendResponse({task: window.localStorage.getItem('task')});
	}

	else if (request.minTimePassed) {
		minTimePassed = true;
	}

	// experimental actions
	else if (request.finishedTask) {

		// check if min conditions reached
		if (request.finishedTask==4 && minTimePassed) {
			finished = true;
	    	sendResponse({finished: true});
	    } else {
	    	sendResponse({finished: false}); 
	    }

	   	var urlParameters = "&task=" + request.finishedTask + "&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition'); 

    	chrome.tabs.update(sender.tab.id, {url: "https://stanforduniversity.qualtrics.com/SE/?SID=SV_07kloZoUYCh74xf" + urlParameters});

		downloadCSVPage();
		downloadCSVLoading();
		downloadCSV();
		downloadCSVNumber();
	} 

	// send userID to content page
	else if (request.getEssentials) {
		//alert("bg " + window.localStorage.getItem('userID'));
	    sendResponse({user: window.localStorage.getItem('userID'), condition: window.localStorage.getItem('condition')});
	} 

	// // ??: do we need to use local storage if just in background page?
	// // stop timer when inactive request
	// else if (request.stopTimer) {
	// 	// how much time left till stop
	// 	var currSec = new Date().getTime() / 1000;
	// 	window.localStorage.setItem(timeLeft, window.localStorage.getItem('stopTime') - currSec);
	// } 

	// // start timer when active request
	// else if (request.startTimer) {
	// 	// reset stop time
	// 	var currSec = new Date().getTime() / 1000;
	// 	var stopTime = currSec + window.localStorage.getItem(timeLeft);
	// 	window.localStorage.setItem('stopTime', stopTime);
	// }

	else if (request.started) {
		console.log(request.started);
	}

	else if (request.sendToUninstall) {
		uninstall();
	}

	else if (request.sendToFinish) {
		finished = true;
		sendResponse({finished: true});
		chrome.tabs.update(sender.tab.id, {url: "https://stanforduniversity.qualtrics.com/SE/?SID=SV_6Rv5tKvvWNtVz7f"});	
	}

	else if (request.checkFinished) {
		if (finished) {
			uninstall();
		}
	}

	// page types
	else if (request.list) {
		var page = request.list - 1;
		if (pagesViewed[page]) {
			pagesViewed[page].count++;
		} else {
			pagesViewed[page] = {'count':1, 'time':0};
		}
		// console.log(pagesViewed[page]);
	}

	else if (request.detail) {
		var id = getParameterFromString(request.detail, 'id');
		var found = false;
		for (var i = 0; i < itemsViewed.length; i++) {
			if (itemsViewed[i].id == id) {
				itemsViewed[i].count++;
				found = true;
				break;
			}
		}
		if (!found) {
			var item = {'id':id, 'count':1, 'time':0};
			itemsViewed.push(item);
		}
		// console.log(itemsViewed);
	}
});

function removeOtherWin(windows) {
	chrome.windows.getLastFocused(function(topWin) {
		alert("Closing all other windows and tabs.");
		for (var i=0; i< windows.length; i++) {
			if (windows[i].id != topWin.id) {
				chrome.windows.remove(windows[i].id);
			}
		}
	});
	// set lastTime etc. before opening new window - put this on load task for first time???!!
	lastTime = Date.now();
	lastInfo = {'type':'list', 'id':1};
}