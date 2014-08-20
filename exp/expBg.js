chrome.windows.create({
    url: 'exp/intro.html'
});

chrome.windows.getLastFocused(function(window) {
	windowId = window.id;
	chrome.windows.update(windowId, {state:"maximized"});
	console.log(windowId);
});

chrome.windows.onFocusChanged.addListener(maintainFocus);

chrome.windows.onRemoved.addListener(confirmClose);

function maintainFocus(newWindowId) {
	console.log(newWindowId);
	// if not alert
	if (newWindowId != -1) {
		chrome.windows.get(newWindowId, function() {
			chrome.windows.get(windowId, function(window) {
				// if window exists and not experiment window
				if (window && newWindowId != windowId) {
					chrome.windows.update(windowId, {focused:true, state:"maximized"});
					alert("You must remain in this window until the study is over. You may close the window if you would like to quit the study.");
				}
			});
		});
	}
}

function confirmClose(closedWindowId) {
	if (closedWindowId==windowId) {
		///!!!!! ??? for testing only
		// uninstall();
	}
}
