function watchTopic(name) {
    if (!window.WebSocket) {
        alert("This won't work in your browser. Try Chrome or a gooder version of Safari.");
    }
    else {
        if (!window.ws || window.ws.readyState != WebSocket.OPEN) {
            window.ws = new WebSocket("ws://" + location.host + "/topics/" + name + "/websocket");

            window.ws.onopen = function(event) {
                console.log("WebSocket opened!");
                $('.progress-bar').addClass('active');
            };
            window.ws.onmessage = function(event) {
                console.log(event);
                var data = $.parseJSON(event.data);
                var messages = $('#messages');
                var el_id = Math.floor(Math.random() * 1000000);
                var el = "<div id='" + el_id + "' class='list-group-item'>" + data.raw + "<br/><div id='" +  el_id + "_b64' style='display:none;'><pre>" + data.b64 + "</pre></div>";
                messages.prepend(el);
                $("#" + el_id).click(function(ev) {
                    $("#"+el_id+'_b64').show();
                });

                // Let's only keep the last 25
                if (messages.children().size() > 25) {
                    messages.children().last().remove();
                }
            };
            window.ws.onclose = function(event) {
                $('.progress-bar').removeClass('active');
                var timer = setTimeout(function() {
                    console.log("Retrying connection...");
                    watchTopic(name);
                    if (window.ws.readyState == WebSocket.OPEN) {
                        clearTimeout(timer);
                    }
                }, 1000);
            };
        }
    }
}
