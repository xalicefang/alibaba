// var startLink = document.getElementById("startExperiment");
// startLink.onclick = function() {
// 	chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);
// };

$("form#data").submit(function(){
    var formData = $(this).serialize();

    $.ajax({
        url: 'http://stanford.edu/~fangx/cgi-bin/alibaba/submitIntro.php',
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            alert(data)
        },
        cache: false,
        contentType: false,
        processData: false
    });

	chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);

    return false;
});