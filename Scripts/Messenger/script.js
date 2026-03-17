const socket = new WebSocket('ws://127.0.0.1:8080');
let _userId;
let _username;
let _ip;
let _password;
let _userAvatar;

let avatar_place = document.getElementById("account_avatar");

function add_user(username, avatar)
{
    let chatlist = document.getElementById("chatlist");

    let new_chat = `<div class="chat-preview">
                      <img src="${avatar}"/>
                      <div class="chat-text">
                        <strong>${username}</strong>
                        <p>No messages</p>
                      </div>
                    </div>`

    chatlist.insertAdjacentHTML('beforeend', new_chat);
}

//  Шаблон отправки данных на сервер

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

//  Получаем сохранённые поля из localstorage клиента

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

//  Получаем id пользователя от сервера

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
    }
);

//  Отображаем текущие чаты

postData(`${_server}/get_users`, { id: _userId})
    .then((data) => {
        const json = JSON.parse(data);
        
        (json.users).forEach(user => {
            add_user(user.username, user.avatar);
        });
    }
);

//  Открытие сокета

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

//  Получение сообщения через сокет

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

//  Закрытие сокета

socket.onclose = () =>
{
    alert("Lost connection to server.");
    window.location.href = 'index.html';
};

//  Если пользователь закрыл вкладку, отправляем инфо на сервер

window.addEventListener("unload", function() {
    const message =
    {
        user_id: _userId,
        action: 'disconnected'
    };

    socket.send(JSON.stringify(message));
});

//  Обработка ошибок сокета

socket.onerror = (error) =>
{
    console.error('WebSocket error:', error);
};
