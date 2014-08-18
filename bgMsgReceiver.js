function getParameterFromString(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// clean this up and make methods!!

var finished = false;
var minTimePassed = false;
var task = 1;
var taskSeen = false;
var expStartTime;

// calculate loading time for same tab address bar, back, refresh, etc. 
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	function postSurvey() {
		sendResponse({finished: true});
		chrome.tabs.update(sender.tab.id, {url: "https://stanforduniversity.qualtrics.com/SE/?SID=SV_6Rv5tKvvWNtVz7f"});
	}

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
		task = request.task;
	}

	// get task
	else if (request.getTask) {
	    sendResponse({task: task});
	}

	else if (request.minTimePassed) {
		minTimePassed = true;
	}

	// experimental actions
	else if (request.finishedTask) {

		// check if min conditions reached, set finished
		if (request.finishedTask>=4 && minTimePassed) {
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

	else if (request.expStartTime) {
		expStartTime = request.expStartTime;
	}

	else if (request.getStartTime) {
		sendResponse({expStartTime:expStartTime});
	}

	else if (request.checkTaskSeen) {
		if (!taskSeen) {
			sendResponse({setTask:task});
		}
		
	}

	else if (request.sendToUninstall) {
		chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs) {
			var tab = tabs[0];
			chrome.tabs.update(tab.id, {url: "/exp/finished.html"});
		});
	}

	else if (request.sendToFinish) {
		postSurvey();		
	}

	else if (request.redirect) {
		if (finished) {
			postSurvey();
		} else {
			if (task==1) {
				var url = "http://s.taobao.com/search?q=%D3%EA%C9%A1%BA%AB%B9%FA&tianmao=1"
	    	} else if (task==2) {
	    		var url = "http://s.taobao.com/search?q=%C7%AE%B0%FC%B4%B4%D2%E2+&tianmao=1";
	    	} else if (task==3) {
	    		var url = "http://s.taobao.com/search?q=%CD%CF%D0%AC%B4%B4%D2%E2+&tianmao=1"
	    	} else if (task==4) {
				var url = "http://s.taobao.com/search?q=%BF%C9%B0%AE%B1%AD%D7%D3%B4%B4%D2%E2%B4%F8%B8%C7&tianmao=1";
	    	} else if (task==5) {
	    		var url = "http://s.taobao.com/search?q=%CF%F0%C6%A4%B0%FC%D3%CA+%BF%C9%B0%AE+%D1%A7%C9%FA&tianmao=1";
	    	} else if (task==6) {
	    		var url = "http://s.taobao.com/search?q=%C7%A6%B1%CA%BF%C9%B0%AE&tianmao=1";
	    	} else if (task==7) {
	    		var url = "http://s.taobao.com/search?q=%CA%D6%BB%FA%BF%C7%BF%C9%B0%AE&tianmao=1";
	    	} else if (task==8) {
				var url = "http://s.taobao.com/search?q=%B6%FA%BB%FA%BC%AF%CF%DF&tianmao=1";
	    	} else if (task==9) {
	    		var url = "http://s.taobao.com/search?q=%D4%B2%D6%E9%B1%CA%BF%C9%B0%AE&tianmao=1";
	    	}
	    	task++;
	    	chrome.tabs.update(sender.tab.id, {url: url});
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