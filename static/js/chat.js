// const id = {{request.user.id}};
// const message_username = {{user}};
// const id = JSON.parse(document.getElementById('json-username').textContent);
// const message_username = JSON.parse(document.getElementById('json-message-username').textContent);


$(".chat-history").stop().animate({ scrollTop: $(".chat-history")[0].scrollHeight}, 1000);

const reciever_id = JSON.parse(document.getElementById('json-username').textContent);
const send_id = JSON.parse(document.getElementById('json-message-username').textContent);
console.log(send_id, reciever_id)
const socket = new WebSocket('ws://'+window.location.host+'/ws/'+reciever_id+'/');


socket.onopen = function(e){
    console.log("CONNECTION ESTABLISHED", 'ws://'+window.location.host+'/ws/'+reciever_id+'/');
}

socket.onclose = function(e){
    console.log("CONNECTION LOST", 'ws://'+window.location.host+'/ws/'+reciever_id+'/');
}

socket.onerror = function(e){
    console.log("ERROR OCCURED", 'ws://'+window.location.host+'/ws/'+reciever_id+'/');
}

socket.onmessage = function(e){
    console.log(e.data.message)
    const data = JSON.parse(e.data);
    var today= new Date();
    time_since = timeSince(today);
    if(data.user_id == reciever_id){
        document.querySelector('#chat-body').innerHTML += 
                                                            `  <li class="clearfix">
                                                                <div class="message-data align-right">
                                                                  <span class="message-data-time">${time_since}</span> &nbsp; &nbsp;                                                      
                                                                </div>
                                                                <div class="message other-message float-right">
                                                                    ${data.message}
                                                                </div>
                                                              </li>`
    }else{
        document.querySelector('#chat-body').innerHTML += 
                                                            ` <li>
                                                                <div class="message-data">
                                                                   <span class="message-data-time">${time_since}</span>
                                                                </div>
                                                                <div class="message my-message">
                                                                ${data.message}
                                                                </div>
                                                              </li>`
    $(".chat-history").stop().animate({ scrollTop: $(".chat-history")[0].scrollHeight}, 1000);
    }


    
}



document.querySelector('#message-to-send').focus();
document.querySelector('#message-to-send').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};




document.querySelector('#chat-message-submit').onclick = function(e){
    const message_input = document.querySelector('#message-to-send');
    const message = message_input.value;
    console.log("This is the message", message_input.value);
    socket.send(JSON.stringify({
        'message':message,
        'username':reciever_id
    }));
    console.log({
        'message':message,
        'username':reciever_id
    });
    message_input.value = '';
}


$("#chat-message-submit").click(function() {
    $(".chat-history").stop().animate({ scrollTop: $(".chat-history")[0].scrollHeight}, 1000);
});




function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
  }
  


function timeSince(date) {

var seconds = Math.floor((new Date() - date) / 1000);

var interval = seconds / 31536000;

if (interval > 1) {
    return Math.floor(interval) + " years";
}
interval = seconds / 2592000;
if (interval > 1) {
    return Math.floor(interval) + " months";
}
interval = seconds / 86400;
if (interval > 1) {
    return Math.floor(interval) + " days";
}
interval = seconds / 3600;
if (interval > 1) {
    return Math.floor(interval) + " hours";
}
interval = seconds / 60;
if (interval > 1) {
    return Math.floor(interval) + " minutes";
}
return Math.floor(seconds) + " seconds";
}