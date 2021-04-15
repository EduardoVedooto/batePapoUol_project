let username = "";

function toggleSidebar() {
    let sidebar = document.querySelector("nav");
    sidebar.classList.toggle("display_sidebar");
    sidebar = document.querySelector("nav .sidebar");
    sidebar.classList.toggle("slide_sidebar");
}

function login() {
    username = document.querySelector(".login input").value
    const request = { name: username};
    const response = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", request);
    
    response.then(enterChat);
    response.catch(serverError);
    
}

function enterChat() {
    getMessages();
    getParticipants();
    setInterval(getMessages, 3000);
    setInterval(getParticipants, 5000);
    const screen = document.querySelector(".login");
    screen.classList.add("hidden");
    setInterval(status, 5000);

}

function serverError() {
    const img = document.querySelector(".login img");
    img.setAttribute("src","images/http-cats/400.jfif");
    setTimeout(() => {
        const img = document.querySelector(".login img");
        img.setAttribute("src", "images/login_logo.png");
    }, 3000);
    const input = document.querySelector(".login input");
    input.value = "";
    setTimeout(() => {
        alert("Usuário já existente");
    }, 100);
}

function status() {
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", {name: username})
    promisse.then(statusOK);
}

function statusOK() {
    console.log("Online");
}

function getMessages() {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages");
    promisse.then(updateScreen);
}

function updateScreen(response) {
    const message = response.data;
    const ul = document.querySelector("main ul");
    ul.innerHTML = "";
    for (let i = 0; i < message.length; i++) {
        if(message[i].type === "status"){
            ul.innerHTML += `
                <li class="chat notification">
                    <span class="time">${message[i].time}</span>  <span class="name">${message[i].from}</span> ${message[i].text}
                </li>
            `;
        }
        else if(message[i].type === "message"){
            ul.innerHTML += `
                <li class="chat">
                    <span class="time">${message[i].time}</span>  <span class="name">${message[i].from}</span> para <span class="name">${message[i].to}</span>: ${message[i].text}
                </li>
            `;
        } else {
            ul.innerHTML += `
                <li class="chat private">
                    <span class="time">${message[i].time}</span> <span class="name">${message[i].from}</span> reservadamente para <span class="name">${message[i].to}</span>:  ${message[i].text}
                </li>
            `;
        }
        
    }
}

function sendMessage() {
    const inputText = document.querySelector("footer input").value;
    const request = {
        from: username,
        to: "Todos",
        text: inputText,
        type: "message"
    }
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", request);
    promisse.catch(messageSentError);
}


function messageSentError(error) {
    alert(error.respone.code);
}

function getParticipants() {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    promisse.then(updateParticipants);
    
}

function updateParticipants(response) {
    const participants = response.data;
    
    const ul = document.querySelector("ul.participants");
    ul.innerHTML = `
        <li class="selected" onclick="selectPerson(this)">
            <ion-icon name="people"></ion-icon><span>Todos</span>
            <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
        </li>
    `;
    
    for (let i = 0; i < participants.length; i++) {
        ul.innerHTML += `
            <li onclick="selectPerson(this)">
                <ion-icon name="person-circle"></ion-icon><span>${participants[i].name}</span>
            </li>
        `;

    }
}

function selectPerson(li) {
    const previousLi = document.querySelector(".selected");
    previousLi.classList.remove("selected");
    li.classList.add("selected");
}