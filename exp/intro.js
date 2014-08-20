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
        var expired = document.createElement('a');
        expired.href     = "expired.html";
        expired.target   = '_self';
        expired.click();
    }
});

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function formValidate() {
    var noErrors = true;
    if ($('#nameField')[0].value=="") {
        $('.errors')[0].innerHTML += "Please enter your name.</br>";
        noErrors = false;
    } 
    if (!validateEmail($('#emailField')[0].value)) {
        $('.errors')[0].innerHTML += "Please enter a valid email address.</br>";
        noErrors = false;
    } 
    if (!noErrors) {
        $('.errors')[0].style.display = "block";
    }
    return noErrors;
}

$("form#intro").submit(function(e){
    e.preventDefault();
    $('.errors')[0].innerHTML = "";
    $('.errors')[0].style.display = "none";
    if (formValidate()) {
        $('#startBtn')[0].setAttribute('disabled',true);
        $('#startBtn')[0].innerHTML = "Loading...";
        var formData = $(this).serialize();

        $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/submitIntro.php', formData, function(userID) {
            window.localStorage.setItem('userID', userID);

            var sid = Math.ceil(userID/2);
            
            // get number of group 1's and group 2's with completed task 1
            // save group to database
            var group;
            if (sid%3==1) {
                group = 1;
            } else if (sid%3==2) {
                group = 2;
            } else {
                group = 3;
            }

            function setGroup() {
                var groupData = 'group=' + group + '&id=' + parseInt(userID);

                $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/countGroups.php', groupData, function(count) {
                    if (count < 30) {
                        window.localStorage.setItem('group', group);
                        $.post('http://stanford.edu/~fangx/cgi-bin/alibaba/updateIntro.php', groupData, function() {

                            var a = document.createElement('a');
                            a.href     = "http://stanford.edu/~fangx/cgi-bin/alibaba/redirect.html";
                            a.target   = '_self';
                            a.click();
                        });
                    } else {
                        group = (group + 1) % 3;
                        setGroup();
                    }
                });
            }
            setGroup();

        });


        return false;
    }
});