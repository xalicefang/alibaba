var finishData = "task=" + window.localStorage.getItem('task') + "&id=" + window.localStorage.getItem('userID');
console.log(finishData);

// id and number of tasks finished
$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/finish.php', finishData, function(r) {
});

//!!! can't do with qualtrics
//chrome.management.uninstallSelf({showConfirmDialog: true});