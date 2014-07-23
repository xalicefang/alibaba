function list(windows) {
  var numWindows = windows.length;
  console.log("numWindows " + numWindows);

  for (var i = 0; i < numWindows; i++) {
    var win = windows[i];
    console.log("numTabs " + win.tabs);

    var windowDiv = document.createElement("div");
    windowDiv.innerHTML = "window: " + win.id;
    document.body.appendChild(windowDiv);

    var numTabs = win.tabs.length;

    for (var j = 0; j < numTabs; j++) {
      var tab = win.tabs[j];
      var tabDiv = document.createElement("div");
      console.log("tab" + tab.index + ": " + tab.title);
      tabDiv.innerHTML = "tab" + tab.index + ": " + tab.title;
      document.body.appendChild(tabDiv);
    }
  }
}

function downloadInnerHtml(filename, mimeType) {
    var elHtml = document.body.innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}

// Run script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  chrome.windows.getAll({"populate" : true}, list);
  var download = document.getElementById('downloadLink');
  document.body.innerHTML = "<a href='#' id='downloadLink'>Download log as txt</a>";
  download.onclick = function() { 
    downloadInnerHtml('log.txt', 'text/html');
  }
});