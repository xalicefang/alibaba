chrome.tabs.onRemoved.addListener(closedDetailTab);

function closedDetailTab(tabId) {
	if (condition=='c') {
		// send to list tab
		console.log(tabId);
		chrome.tabs.sendMessage(listTabId, {closedTab: tabId});
	}
}