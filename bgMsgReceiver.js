function getParameterFromString(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// clean this up and make methods!!

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
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_07kloZoUYCh74xf&task=1&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==2) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_bPnyBWH7pbSX2lL&task=2&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==3) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_41wjS5Ai6ggQcWp&task=3&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==4) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_55D6IfUw5tdfGrb&task=4&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==5) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_5cqbxpNnBkhBM1f&task=5&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==6) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_bfoBWdObyhAaDw9&task=6&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==7) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_0NboCD7XNWOSPPv&task=7&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==8) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_6g72RUs0VgYfAl7&task=8&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==9) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_cwn64eVsuBjVSJL&task=9&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
	    	} else if (request.finishedTask==10) {
	    		var url = "https://stanforduniversity.qualtrics.com/SE/?SID=SV_d6vFeH4c4Sl39HL&task=10&userID=" + window.localStorage.getItem('userID') + '&condition=' + window.localStorage.getItem('condition');
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

		downloadCSVPage();
		downloadCSVLoading();
		downloadCSV();
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
				//chrome.windows.remove(windows[i].id);
			}
		}
	});
	// set lastTime etc. before opening new window - put this on load task for first time???!!
	lastTime = Date.now();
	lastInfo = {'type':'list', 'id':1};
}