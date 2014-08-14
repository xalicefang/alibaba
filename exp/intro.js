// if (window.localStorage.getItem('task')) {
//     alert("You have already started this experiment. Redirecting to where you left off...");
//     // set timer
//     var seconds = new Date().getTime() / 1000;
//     var totalTime = 720;
//     //var totalTime = 60;
//     window.localStorage.setItem('stopTime',seconds+totalTime); 
//     var a = document.createElement('a');
//     a.href     = "http://www.taobao.com/?task=" + window.localStorage.getItem('task');
//     a.target   = '_self';
//     a.click();
// }

$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/countTotal.php', null, function(total) {
    if (total > 90) {
        var a = document.createElement('a');
        a.href     = "expired.html";
        a.target   = '_self';
        a.click();
    }
});

$("form#intro").submit(function(){
    // add loading animation!!!!!
    var formData = $(this).serialize();

    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/submitIntro.php', formData, function(userID) {
        window.localStorage.setItem('userID', userID);

        var sid = Math.ceil(userID/2);
        
        // get number of condition 1's and condition 2's with completed task 1
        // save condition to database
        var condition;
        if (sid%3==1) {
            condition = 1;
        } else if (sid%3==2) {
            condition = 2;
        } else {
            condition = 3;
        }

        function setCondition() {
            var condData = 'condition=' + condition + '&id=' + parseInt(userID);
            console.log("condData: " + condData);

            $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/countConditions.php', condData, function(count) {
                console.log("count: " + count);
                if (count < 30) {
                    window.localStorage.setItem('condition', condition);
                    $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/updateIntro.php', condData, function() {
                        console.log("condition: " + condition);
                        chrome.windows.getAll(null, chrome.extension.getBackgroundPage().removeOtherWin);

                        // set timer
                        var seconds = new Date().getTime() / 1000;
                        // 10 minutes only
                        var totalTime = 600;
                        //var totalTime = 60;
                        window.localStorage.setItem('stopTime',seconds+totalTime); 

                        var a = document.createElement('a');
                        a.href     = "http://s.taobao.com/search?q=%D0%A1%B1%BE%D7%D3%BF%C9%B0%AE&tianmao=1&task=1";
                        a.target   = '_self';
                        a.click();
                    });
                } else {
                    condition = (condition + 1) % 3;
                    console.log("changed con: " + condition);
                    setCondition();
                }
            });
        }
        setCondition();

    });


    return false;
});