const gameMode = sessionStorage.getItem('gameMode');
var cursorType = 1;
var cursor1Src = "../images/1-1.svg";
var cursor2Src = "../images/1-2.svg";
var playersName;

function init() {
    // שליפת שמות השחקנים ששחקו עד עכשיו
      playersName = JSON.parse(localStorage.getItem("playersName"))|| [];

    const contentDiv = document.getElementById("content");
    createTitle(contentDiv, "Tic Tac Toe");

    if (gameMode === "one") {
        createPlayerInfo(contentDiv, 1);
    } else {
        createPlayerInfo(contentDiv, 1);
        
        addLineBreaks(contentDiv, 1);
        
        createPlayerInfo(contentDiv, 2);
    }

    addLineBreaks(contentDiv, 1);
    createImagesCursor(contentDiv);
    addLineBreaks(contentDiv, 2);
    createContinueButton(contentDiv);
    
    // Add event listener to radio buttons
    document.querySelectorAll('input[name="gameOption"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            handleCursorTypeChange(event.target.value);
        });
    });
}


function createTitle(parent, text) {
    const title = document.createElement("label");
    title.textContent = text;
    title.classList.add('titleGame');
    parent.appendChild(title);
    parent.appendChild(document.createElement("br"));
}

function createPlayerInfo(parent, playerNumber) {
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('grid-item', 'item1');
    insertImg(imgDiv, playerNumber, "black");
    gridContainer.appendChild(imgDiv);
    
    const selectDiv = document.createElement('div');
    selectDiv.classList.add('grid-item', 'item2');
    
    const select = document.createElement('select');
    select.classList.add('playerName');
    select.classList.add('namesSlt');
    
    var titleOpt = document.createElement('option');
    titleOpt.value = "";
    titleOpt.disabled = true;
    titleOpt.selected = true;
    titleOpt.textContent = "בחר את שמך";
    select.appendChild(titleOpt)
    selectDiv.appendChild(select);

    
    playersName.forEach(name => {
        const opt = document.createElement('option');
        opt.textContent = name;
        select.appendChild(opt);
    });
    
    selectDiv.appendChild(select);
    gridContainer.appendChild(selectDiv);
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('grid-item', 'item3');
    const button = document.createElement('button');
    button.classList.add('addBtn');
    button.textContent = '+';
    
    
    button.addEventListener("click", function() {
        const slcDiv = document.getElementsByClassName("item2")[playerNumber-1];

        const nameTxt = document.createElement("input");
        nameTxt.classList.add('playerName');
        nameTxt.type = "text";
        nameTxt.classList.add('namesTxt');
        nameTxt.placeholder = "הכנס את שמך";
        slcDiv.innerHTML = ''; 
        
        slcDiv.appendChild(nameTxt); 

        button.style.visibility = "hidden";
    });
    
    buttonDiv.appendChild(button);
    gridContainer.appendChild(buttonDiv);

    const colorDiv = document.createElement('div');
    colorDiv.classList.add('grid-item', 'cp_wrapper', 'item4');
    const colorInput = document.createElement('input');
    colorInput.classList.add('cursorColor');
    colorInput.type = 'color';
    colorInput.addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        changeSVGColor(selectedColor, playerNumber);
    });

    colorDiv.appendChild(colorInput);
    gridContainer.appendChild(colorDiv);

    parent.appendChild(gridContainer);
}

function insertImg(container, playerNum, color) {
    var svgContainer = document.createElement("div")
    svgContainer.id = "svgContainer"+playerNum
    svgContainer.classList.add("svgContainer")

    // טעינת התמונה
    fetch((playerNum==1)?cursor1Src:cursor2Src)
    .then(response => response.text())
    .then(svgText => {
            svgContainer.innerHTML = svgText;
            const svgElement = svgContainer.querySelector('svg');
            // קביעת הצבע
            const paths = svgElement.querySelectorAll('path');
            paths.forEach(path => {
                path.style.setProperty('fill', color, 'important');
            });
        });

    container.appendChild(svgContainer)        
}

function changeSVGColor(color, playerNum) {
    const svgContainer = document.getElementById(`svgContainer${playerNum}`);
    const paths = svgContainer.querySelectorAll('svg g path');  

    paths.forEach(path => {
        path.style.setProperty('fill', color, 'important');
    });
}

function addLineBreaks(parent, count) {
    for (let i = 0; i < count; i++) {
        parent.appendChild(document.createElement("br"));
    }
}


function createImagesCursor(parent) {
    const cursorLbl = document.createElement("label");
    cursorLbl.textContent = "תמונות שחקנים :";
    parent.appendChild(cursorLbl);

    const images = [
        { src: '../images/boy-girl.png', value: 1, alt: 'תמונה 1' },
        { src: '../images/dishes.png', value: 2, alt: 'תמונה 2' },
        { src: '../images/animel.png', value: 3, alt: 'תמונה 3' }
    ];

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';

    images.forEach((img, index) => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'gameOption';
        radio.value = img.value;
        if (index === 0) {
            radio.checked = true;
        }

        const label = document.createElement('label');
        label.classList.add("lblImgCursor");
        
        const image = document.createElement('img');
        image.src = img.src;
        image.alt = img.alt;
        
        label.appendChild(radio);
        label.appendChild(image);

        container.appendChild(label);
    });

    parent.appendChild(container);
}

function createContinueButton(parent) {
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "למשחק..";

    const lineSpace = document.createElement("br");
    parent.appendChild(lineSpace);

    const spnError = document.createElement("span");
    spnError.id = "spnError";
    spnError.style.color = "red";
    spnError.style.fontSize = "14px";
    parent.appendChild(spnError);

    continueBtn.addEventListener("click", function() {
        if(checkInfo()) {
            spnError.textContent = "";

            const playersColor = document.querySelectorAll("input[type='color']");

            let player1Name = document.getElementsByClassName("playerName")[0].value;
            let player2Name = "מחשב";
            let player1Color = playersColor[0].value;
            let player2Color = "black";


           
            if(gameMode == "tow") {
                player2Name = document.getElementsByClassName("playerName")[1].value;
                if (player1Name === player2Name) {
                    player1Name += "1";
                    player2Name += "2";
                }
                player2Color = playersColor[1].value;
            }
            addPlayerNameToLocalStorage(player1Name);
            addPlayerNameToLocalStorage(player2Name);

            sessionStorage.setItem("player1Name", player1Name);
            sessionStorage.setItem("player2Name", player2Name);

            sessionStorage.setItem("player1Color", player1Color);
            sessionStorage.setItem("player2Color", player2Color);
            
            
            sessionStorage.setItem("cursorType", cursorType);
            
            window.location.href = "../html/gamePage.html";
        }
    });

    parent.insertBefore(continueBtn, lineSpace);
}


function addPlayerNameToLocalStorage(name){
    if(name == "מחשב")
        return
    if(!playersName.includes(name)){
        playersName.push(name);
        localStorage.setItem('playersName', JSON.stringify(playersName));
    }
}


function handleCursorTypeChange(value) {
    cursorType = parseInt(value);
    cursor1Src = `../images/${value}-1.svg`;
    cursor2Src = `../images/${value}-2.svg`;

    // מחיקת התמונות הקודמות
    document.getElementById("svgContainer1").remove();
    if(gameMode == "tow")
        document.getElementById("svgContainer2").remove();

    // יצירת תמונות חדשות בהתאם לבחירתו
    var imgContainers = document.getElementsByClassName("item1")
    const colorInput = document.querySelectorAll('input[type=color]');
    insertImg(imgContainers[0], 1, colorInput[0].value)
    if(gameMode == "tow")
        insertImg(imgContainers[1], 2, colorInput[1].value)   

}


function hideSpnError() {
    document.getElementById("spnError").innerText = "";
}

function checkInfo() {
    var names = document.getElementsByClassName("playerName")
    for (let i = 0; i < names.length; i++) {
        if ((names[i].value.trim()).length === 0) {
            document.getElementById("spnError").innerText = `שחקן ${i+1} הכנס את שמך.`;
            return false
        }
    }
    hideSpnError()
    return true;
}


