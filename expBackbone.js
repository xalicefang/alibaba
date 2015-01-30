/****** EXPERIMENT LOGISTICS & BACKBONE background page******/

/* 
on extension load, open the introduction page! 
*/
chrome.windows.create({
    url: 'exp/intro.html'
});

/* 
get and store the experiment window id, in anticipation of error cases below 
*/
chrome.windows.getLastFocused(function(window) {
	windowId = window.id;
	chrome.windows.update(windowId, {state:"maximized"});
});


/* 
WHAT TO DO IF USER CHANGES FOCUSED WINDOW OR CLOSES EXPERIMENT WINDOW
Listen for changing window and closing experiment window
*/
chrome.windows.onFocusChanged.addListener(maintainFocus);
chrome.windows.onRemoved.addListener(confirmClose);

/* 
Called when user changes window. 
Brings back experiment window and gives alert.
*/
function maintainFocus(newWindowId) {
	// if not alert
	if (newWindowId != -1) {
		chrome.windows.get(newWindowId, function() {
			chrome.windows.get(windowId, function(window) {
				// if window exists and not experiment window
				if (window && newWindowId != windowId) {
					chrome.windows.update(windowId, {focused:true, state:"maximized"});
					//alert("You must remain in this window until the study is over. You may close the window if you would like to quit the study.");
					alert("您必须留在这个窗口中，直到研究结束。如果您想退出，可以关闭该窗口。");
				}
			});
		});
	}
}

/* 
Called when user closes experiment window. 
Brings back experiment window and gives alert.
*/
function confirmClose(closedWindowId) {
	if (closedWindowId==windowId) {
		uninstall();
	}
}

/* 
blurg - what does this do?
*/
function saveListTabId() {
	chrome.tabs.query({url:"*://www.aliexpress.com/*", currentWindow: true}, function(tabs) {
		listTabId = tabs[0].id;
	});
}