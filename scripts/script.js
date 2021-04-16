let username = "";
let to = "Todos"; // Variável que guardará o nome do perfil que desejo enviar a mensagem;
let type = "message";

function toggleSidebar() {
    let sidebar = document.querySelector("nav");
    sidebar.classList.toggle("display-sidebar");
    sidebar = document.querySelector("nav .sidebar");
    sidebar.classList.toggle("slide-sidebar");
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
    promisse.catch(statusError);
}

function statusOK() {
    console.log("Online");
}

function statusError(error) {
    alert("Status code: " + error.response.status + "A página será recarregada!");
    window.location.reload();
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
            if(message[i].to === username || message[i].from === username){ // Condição para carregar apenas as mensagens privadas que o meu usuário enviou ou que foram enviadas para o meu usuário
                ul.innerHTML += `
                    <li class="chat private">
                        <span class="time">${message[i].time}</span> <span class="name">${message[i].from}</span> reservadamente para <span class="name">${message[i].to}</span>:  ${message[i].text}
                    </li>
                `;
            }
        }
        
    }
    const lastLi = document.querySelector("main ul li:last-child");
    lastLi.scrollIntoView();
}

function sendMessage() {
    const inputValue = document.querySelector("footer input").value;
    document.querySelector("footer input").value = "";
    const request = {
        from: username,
        to: to,
        text: inputValue,
        type: type
    }
    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", request);
    promisse.then(getMessages);
    promisse.catch(messageSentError);
}


function messageSentError() {
    window.location.reload();
}

function getParticipants() {
    const promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants");
    promisse.then(updateParticipants);
    
}

function updateParticipants(response) {
    const participants = response.data;
    
    const ul = document.querySelector("ul.participants");
    console.log(ul.children);

    if(to !== "Todos"){
        ul.innerHTML = `
            <li onclick="selectProfile(this)">
                <ion-icon name="people"></ion-icon><span>Todos</span>
                <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
            </li>
        `;    
    } else {
        ul.innerHTML = `
            <li class="selected" onclick="selectProfile(this)">
                <ion-icon name="people"></ion-icon><span>Todos</span>
                <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
            </li>
        `;
    }

    
    updateTo(participants);
    console.log(to);
    for (let i = 0; i < participants.length; i++) {
        if(participants[i].name === to) {
            ul.innerHTML += `
                <li class="selected" onclick="selectProfile(this)">
                    <ion-icon name="person-circle"></ion-icon><span>${participants[i].name}</span>
                    <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
                </li>
            `;
        } else {
            ul.innerHTML += `
                <li onclick="selectProfile(this)">
                    <ion-icon name="person-circle"></ion-icon><span>${participants[i].name}</span>
                    <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
                </li>
            `;
        }
    }
    
}

function selectProfile(li) {
    const previousLi = document.querySelector("li.selected");
    previousLi.classList.remove("selected");
    li.classList.add("selected");
    to = li.children[1].innerHTML;
    
    
    showLabel();
}


function selectVisibility(div) {
    const previousDiv = document.querySelector("div.selected");
    previousDiv.classList.remove("selected");
    div.classList.add("selected");
    console.log(to);
    showLabel();
    updateType();
}

function showLabel() {
    const label = document.querySelector("footer label");
    const input = document.querySelector("footer input");
    const private = document.querySelector(".sidebar div:last-of-type");

    if(to === "Todos" && !(private.classList.contains("selected"))) {
        label.classList.remove("display");
        input.classList.remove("up");
        return;
    }
    label.innerHTML = `Enviando para ${to}`;
    
    label.classList.add("display");
    input.classList.add("up");
    if(private.classList.contains("selected")){
        label.innerHTML += " (reservadamente)";
    }
}

function updateType() {
    const private = document.querySelector(".sidebar div:last-of-type");
    if(private.classList.contains("selected")){
        type = "private_message";
    } else {
        type = "message";
    }
    console.log(type);
}

function updateTo(participants) {
    for (let i = 0; i < participants.length; i++) {
        if(participants[i].name === to) return; // Se achar o participante destinatário, não faz nada
    }
    to = "Todos";
    showLabel();
}