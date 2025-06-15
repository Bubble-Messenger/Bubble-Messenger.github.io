const socket = new WebSocket('ws://127.0.0.1:8080');

document.addEventListener("DOMContentLoaded", function() {
    const _username = localStorage.getItem("username");
    const _userId = localStorage.getItem("bubble_id");
    if (!_username || !_userId)
    {
        window.location.href = "index.html";
    }
    else
    {
        document.getElementById("account_username").textContent = _username;
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
