// var startLink = document.getElementById("startExperiment");
// startLink.onclick = function() {
// 	chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);
// };


$("form#data").submit(function(){
    var formData = $(this).serialize();
    console.log(formData);

    // $.ajax({
    //     url: "http://stanford.edu/~fangx/cgi-bin/alibaba/submitIntro.php",
    //     type: "post",
    //     data: formData,
    //     success: function (data) {
    //         alert(data)
    //     }
    // });

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/submitIntro.php', formData, function(response) {
        var id = Math.ceil(response/2);
        if (id%3==1) {
            window.localStorage.setItem('condition',1);
        } else if (id%3==2) {
            window.localStorage.setItem('condition',2);
        } else {
            window.localStorage.setItem('condition',3);
        }

        window.localStorage.setItem('userID', response);
        //alert("intro " + window.localStorage.getItem('userID'));

        chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);

        // set timer
        var seconds = new Date().getTime() / 1000;
        var totalTime = 720;
        //var totalTime = 15;
        window.localStorage.setItem('stopTime',seconds+totalTime); 

        var a = document.createElement('a');
        a.href     = "http://www.taobao.com/?task=1";
        a.target   = '_self';
        a.click();
    });

    return false;
});