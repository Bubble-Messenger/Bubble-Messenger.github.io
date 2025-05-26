// Made by MaxxTheLightning, 2025
function login() {
    let username = document.getElementById('username_place').value;
    if (username.trim() === "") {
        alert("Please enter username");
        return;
    }
    localStorage.setItem("username", username);

    let account_password = document.getElementById('password').value;
    if (account_password.trim() === "") {
        alert("Please enter your password");
        return;
    }

    let ip = document.getElementById('ip-address').value;
    if (ip.trim() === "") {
        alert("Please enter IP-Address");
        return;
    }
    localStorage.setItem("ip-address", ip);

    const server = `http://${ip}`;

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
    postData(`${server}/login`, { name: username,  password: account_password})
        .then((data) => {
            console.log(data); 
        });
}
