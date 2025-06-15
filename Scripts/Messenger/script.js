const socket = new WebSocket('ws://127.0.0.1:8080');
let _userId;
let _username;
let _ip;
let _password;
let _userAvatar;

let avatar_place = document.getElementById("account_avatar");

const postData = async (url = '', data = {}) => {

    const response = await fetch(url, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

    });
    return response.json(); 
}

document.addEventListener("DOMContentLoaded", function() {
    _username = localStorage.getItem("username");
    _userId = localStorage.getItem("bubble_id");
    _ip = localStorage.getItem("ip-address");
    _password = localStorage.getItem("bubble-password");
    if (_username == "" || _userId == "" || _ip == "" || _password == "")
    {
        window.location.href = "index.html";
    }
    else
    {
        document.getElementById("account_username").textContent = _username;
    }
});

let _server = `https://${_ip}`;

postData(`${_server}/get_user`, { id: _userId,  password: _password})
    .then((data) => {
        const json = JSON.parse(data);
        if (json.response == "Success.")
        {
            avatar_place.src = json.avatar;
        }
        else
        {
            console.error(json.response);
        }
    });

socket.onopen = () =>
{
    const message =
    {
        user_id: _userId,
        action: 'connected'
    };

    console.log("Connected to server successfully.")

    socket.send(JSON.stringify(message));
};

socket.onmessage = (event) =>
{
    try
    {
        const data = JSON.parse(event.data);
    
        console.log(data);
    } 
    catch (error)
    {
        console.error('Invalid message from server:', event.data, error);
    }
};

socket.onclose = () =>
{
    alert("Lost connection to server.");
    window.location.href = 'index.html';
};

window.addEventListener("unload", function() {
    const message =
    {
        user_id: _userId,
        action: 'disconnected'
    };

    socket.send(JSON.stringify(message));
});

socket.onerror = (error) =>
{
    console.error('WebSocket error:', error);
};
