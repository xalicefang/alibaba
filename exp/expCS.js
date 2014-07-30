function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// on finish, self uninstall!
// chrome.management.uninstallSelf({showConfirmDialog: false}, callback);

document.addEventListener("DOMContentLoaded", function(event) {
	var modal = document.createElement('div');
	modal.innerHTML = window.localStorage.getItem('taskMsg');
	modal.className = "modal"; 
	modal.setAttribute('id','modal');
	document.body.appendChild(modal);

	var f = document.createElement("form");
	f.setAttribute('method',"post");
	f.setAttribute('id','taskFinish');

	var i = document.createElement("input"); //input element, text
	i.setAttribute('type',"text");
	i.setAttribute('name',"userid");
	// alert("ecs.js: " + window.localStorage.getItem('userID'));
    i.setAttribute('value', window.localStorage.getItem('userID'));
	i.style.visibility = "hidden";

	var i2 = document.createElement("input"); //input element, text
	i2.setAttribute('type',"text");
	i2.setAttribute('name',"url");

	var submitButton = document.createElement("input"); //input element, Submit button
	submitButton.setAttribute('type',"submit");
	submitButton.setAttribute('value',"Submit");

	f.appendChild(i);
	f.appendChild(i2);
	f.appendChild(submitButton);

	modal.appendChild(f);

	var closeButton = document.createElement('button');
	closeButton.innerHTML = "Close";
	modal.appendChild(closeButton);

	// if first time entering into task
	if (getURLParameter('task')!= null) {
		modal.style.visibility = "visible";
		window.localStorage.setItem('task', getURLParameter('task'));
		if (getURLParameter('task') == 1) {
			window.localStorage.setItem('taskMsg', 'Welcome! For your first task, imagine you are shopping for a new vacuum cleaner.');
		} else if (getURLParameter('task') == 2) {
			window.localStorage.setItem('taskMsg', 'Task 2.');
		}
	}

	closeButton.onclick = function() {
		// add toggle functionality!!!
		modal.style.visibility = "hidden";
	}

	$(f).submit(function(){
	   var formData = $(this).serialize();
	   console.log(formData);
	   var url = i2.value;
	   console.log(url);
		// $.ajax({
		//     url: window.localStorage.getItem('submitUrl'),
		//     type: "post",
		//     data: formData,
		//     success: function (data) {
		//         alert(data)
		//     }
		// });

		$.post('http://stanford.edu/~fangx/cgi-bin/alibaba/taskSubmit.php?number='+window.localStorage.getItem('task'), formData, function(response) {
			alert(response);
		});

		// call save csv files, open new window for new task
		chrome.runtime.sendMessage({finishedTask: window.localStorage.getItem('task')});

	    return false;
	});


});

