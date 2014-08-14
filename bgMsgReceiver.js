function getParameterFromString(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
}

window.localStorage.setItem(itemsViewed,[]);

// clean this up and make methods!!

// calculate loading time for same tab address bar, back, refresh, etc. 
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	// click link, open in same tab (new tab covered by onActivated)
	if (request.link) {
	  // be sure to match url with permissions!!!!!!!!!
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        // i don't think i need the if anymore. remove???!!
        if (tab.id==sender.tab.id) {
          clickedLink(request.link);
        }
      });
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

	// experimental actions
	else if (request.finishedTask) {
		makeRow("finished task " + request.finishedTask);

		// add progress points!! halfway there!

		// check if time reached
		var currSec = new Date().getTime() / 1000;
		if (currSec > window.localStorage.getItem('stopTime')) {
	    	sendResponse({finished: true});
			chrome.windows.create({url: '/exp/finished.html'});
	    	chrome.windows.getAll(null, removeOtherWin);
	    } else {
	    	sendResponse({finished: false}); 
	    	if (request.finishedTask==1) {
	    		var url = "http://s.taobao.com/search?q=%D4%B2%D6%E9%B1%CA%BF%C9%B0%AE&tianmao=1&task=2";
	    	} else if (request.finishedTask==2) {
	    		var url = "http://s.taobao.com/search?q=%C7%A6%B1%CA%BF%C9%B0%AE&tianmao=1&task=3";
	    	} else if (request.finishedTask==3) {
	    		var url = "http://s.taobao.com/search?q=%CF%F0%C6%A4%BF%C9%B0%AE&tianmao=1&task=4";
	    	} else if (request.finishedTask==4) {
	    		var url = "http://s.taobao.com/search?q=%B6%FA%BB%FA%BC%AF%CF%DF&tianmao=1&task=5";
	    	} else if (request.finishedTask==5) {
	    		var url = "http://s.taobao.com/search?q=%CD%CF%D0%AC%B4%B4%D2%E2+&tianmao=1&task=6";
	    	} else if (request.finishedTask==6) {
	    		var url = "http://s.taobao.com/search?q=%C7%AE%B0%FC%B4%B4%D2%E2+&tianmao=1&task=7";
	    	} else if (request.finishedTask==7) {
	    		var url = "http://s.taobao.com/search?q=%CA%D6%BB%FA%BF%C7%BF%C9%B0%AE&tianmao=1&task=8";
	    	} else if (request.finishedTask==8) {
	    		var url = "http://s.taobao.com/search?q=%BF%C9%B0%AE%B1%AD%D7%D3%B4%B4%D2%E2%B4%F8%B8%C7&tianmao=1&task=9";
	    	} else if (request.finishedTask==9) {
	    		var url = "http://s.taobao.com/search?q=%D3%EA%C9%A1%B4%B4%D2%E2&tianmao=1&task=10";
	    	} else {
	    		// for testing only!!
				sendResponse({finished: true});
				var url = '/exp/finished.html';
	    	}
	    	chrome.windows.create({url: url});
	    	// QUALTRICS!!
	    	//var qualtricsURL = 'https://stanforduniversity.qualtrics.com/SE/?SID=SV_4YqyXNcsWvyB26x&userID='+ window.localStorage.getItem('userID') +'&task='+ request.finishedTask +'&condition=' + window.localStorage.getItem('condition');
            //chrome.windows.create({url: qualtricsURL});
		    chrome.windows.getAll(null, removeOtherWin);
		}

		downloadCSV();
		downloadCSVLoading();
		downloadCSVNumber();
	} 

	// send userID to content page
	else if (request.user) {
		//alert("bg " + window.localStorage.getItem('userID'));
	    sendResponse({user: window.localStorage.getItem('userID'), condition: window.localStorage.getItem('condition')});
	} 

	// ??: do we need to use local storage if just in background page?
	// stop timer when inactive request
	else if (request.stopTimer) {
		// how much time left till stop
		var currSec = new Date().getTime() / 1000;
		window.localStorage.setItem(timeLeft, window.localStorage.getItem('stopTime') - currSec);
	} 

	// start timer when active request
	else if (request.startTimer) {
		// reset stop time
		var currSec = new Date().getTime() / 1000;
		var stopTime = currSec + window.localStorage.getItem(timeLeft);
		window.localStorage.setItem('stopTime', stopTime);
	}

	else if (request.started) {
		console.log(request.started);
	}

	else if (request.sendToFinish) {
		chrome.tabs.query({"active":true, "lastFocusedWindow":true}, function(tabs) {
			var tab = tabs[0];
			chrome.tabs.update(tab.id, {url: "/exp/finished.html"});
		});
		
	}

	// page types
	else if (request.list) {
		console.log("list: " + request.list);
		getParameterFromString(request.list, 's');
	}

	else if (request.detail) {
		console.log("detail: " + request.detail);
		getParameterFromString(request.detail, 'id');
		var items = window.localStorage.getItem('itemsViewed');
		// !!!
	}
});

function removeOtherWin(windows) {
	chrome.windows.getLastFocused(function(topWin) {
		alert("Closing all other windows and tabs.");
		for (var i=0; i< windows.length; i++) {
			if (windows[i].id != topWin.id) {
				//!!!!!!!!
				//chrome.windows.remove(windows[i].id);
			}
		}
	});
}