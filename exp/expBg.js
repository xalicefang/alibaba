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
					alert("You must stay in this experiment until the time is up.");
				}
			});
		});
	}
}

function confirmClose(closedWindowId) {
	if (closedWindowId==windowId) {
		uninstall();
	}
}

function openModal() {
	console.log("clicked!");
	// match URL!!!!
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs.length==1) {
			var tab = tabs[0];
			console.log(tab.id);
			chrome.tabs.sendMessage(tab.id, {browserAction: 'clicked'}, function(response) {
			});
		}
	});	
}

chrome.browserAction.onClicked.addListener(openModal);