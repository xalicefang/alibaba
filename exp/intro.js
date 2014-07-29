// var startLink = document.getElementById("startExperiment");
// startLink.onclick = function() {
// 	chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);
// };

$("form#data").submit(function(){
    var formData = $(this).serialize();
    console.log(formData);

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/submitIntro.php', formData, function(response) {
        // log the response to the console
        alert("Response: "+response);
    });

	chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);

    var a = document.createElement('a');
    a.href     = "http://www.taobao.com/?task=1";
    a.target   = '_self';
    a.click();

    return false;
});