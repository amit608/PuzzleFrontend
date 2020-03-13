import { func } from "prop-types";

const URL = 'http://127.0.0.1:5000';
const IMGPATH = "img/";
var level, timer, board, username = "";

// retrieve a get variable
function getVar(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (let i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

window.addEventListener('load', function() {
    initializeListeners();
    loginNav();
    level = 'e';
});

function httpGet(url)
{ 
    return fetch(url, {
        method: 'GET',
        },
        ).then(response => {
        if (response.ok) {
            return response.json().then(json => {
               return json;
            });
        }
        });
}

function httpPost(url, object)
{ 
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(object)
        },
        ).then(response => {
            return response.status;
        });
}

function getElement(id) {
    return document.getElementById(id);
}

function showElement(x) {
    x.style.display = "";
}

function hideElement(x) {
    x.style.display = "none";
}

function loginNav() {
    hideElement(getElement('score'));
    hideElement(getElement('chooseBoardDiv'));
    showElement(getElement('login'));
    hideElement(getElement('board'));

    if(username == "") {
        hideElement(getElement('logged'));
        showElement(getElement('enterName'));
    } else {
        showElement(getElement('logged'));
        hideElement(getElement('enterName'));
    }
}

function playNav() {
    if(username == "") {
        alert("you must log in first in order to play!");
        loginNav();
    } else {
    hideElement(getElement('score'));
    showElement(getElement('chooseBoardDiv'));
    hideElement(getElement('login'));
    hideElement(getElement('board'));
    }
}

function scoreNav() {
    showElement(getElement('score'));
    hideElement(getElement('chooseBoardDiv'));
    hideElement(getElement('login'));
    hideElement(getElement('board'));
}

function boardChoose(x) {
    level =x;
    initBoard(level);
}

// timer class
var Stopwatch = function(elem) {
    var timer  = createTimer(),
        offset,
        clock;
  
    // append elements  
    if(elem.hasChildNodes()) {
        elem.replaceChild(timer, elem.childNodes[0]);
    } else {
        elem.appendChild(timer);
    }
  
    // initialize
    reset();
    start();

    this.getTime = function() {
        return clock;
    }

    // private functions
    function createTimer() {
      return document.createElement("span");
    }
  
    function start() {
        offset   = Date.now();
        var interval = setInterval(update);
    }

    function reset() {
        clock = 0;
        render();
      }
  
    function update() {
      clock += delta();
      render();
    }
  
    function render() {
    var seconds = Math.floor((clock/1000)%60);
    var minutes = Math.floor(clock/(1000*60));

    // extra zero for pretty view
    if(seconds < 10) {
        seconds= "0"+seconds;
    }
    if(minutes < 10) {
        minutes= "0"+minutes;
    }
      timer.innerHTML = minutes+":"+seconds; 
    }
  
    function delta() {
      var now = Date.now(),
          d   = now - offset;
  
      offset = now;
      return d;
    }
  };

  // board class
  var gameBoard = function() {

    // function that shuffles a given array
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    // define the shuffle
    var locationToPiece = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    if(getVar("demo")) {
        locationToPiece[7] = 4; locationToPiece[4] = 5; locationToPiece[5] = 7; 
    } else {
        locationToPiece = shuffle(locationToPiece);
    }

    // init board
    this.board = new Array();

    for (let i=0;i<9;i++) {
        // a hack to clear old listeners
        getElement(i).parentNode.replaceChild(getElement(i).cloneNode(), getElement(i));
        
        let piece= {
            element: document.getElementById(i),
            location: i,
            piece: locationToPiece[i],
        };
        piece.element.src = IMGPATH+level+"_"+piece.piece+".jpg";
        piece.element.addEventListener('click', ()=>{ this.clk(i); });
        this.board.push(piece);

        // update blank piece
        if(locationToPiece[i] == 8) {
            this.blank = i; 
        }
    }

    // board piece clicked function
    this.clk = function(id) 
    {
        let flag = false;
        // check if can move in column
        if((this.blank % 3 == id % 3) && (this.blank - id == 3 || this.blank - id == -3)) {
            flag = true;
        }
        // check if can move in row
        if((Math.floor(this.blank / 3) == Math.floor(id / 3)) && (this.blank - id == 1 || this.blank - id == -1)) {
            flag = true;
        }
        if(!flag) {
            return;
        }
        let temp = {src: this.board[id].element.src, piece: this.board[id].piece }
        this.board[id].element.src = this.board[this.blank].element.src;
        this.board[id].piece = this.board[this.blank].piece;

        this.board[this.blank].element.src = temp.src;
        this.board[this.blank].piece = temp.piece;
        this.blank = id;

        // check success
        flag = true;
        for (let i=1;i<9;i++) {
            if(this.board[i-1].piece > this.board[i].piece){
                flag = false;
            }
        }
        if(flag) {
            win();
        }
    }

    // win function
    function win() {
        // you won message
        setTimeout(function(){ alert("You Won! your time is: "+document.getElementById("timeCounter").innerText); 

        // post the record
        var params = {username: username, time: timer.getTime(), viewTime: getElement("timeCounter").firstChild.innerHTML};
        if(httpPost(URL, params) == "200") {
            alert("your time has been successfully stored and you can view your rank in the hall of fame");
        } else {
            alert("there has been an error storing your time");
        }
    }, 300);


    }
  };


function initializeListeners() {
    // nav buttons listeners
    getElement('loginNav').addEventListener('click', loginNav);
    getElement('playNav').addEventListener('click', playNav);
    getElement('scoreNav').addEventListener('click', scoreNav);

    // board picks listeners
    getElement('easyChoose').addEventListener('click', ()=> {boardChoose('e')});
    getElement('mediumChoose').addEventListener('click', ()=> {boardChoose('m')});
    getElement('hardChoose').addEventListener('click', ()=> {boardChoose('h')});

    //login listeners
    getElement('usernameButton').addEventListener('click', login);
    getElement('disconButton').addEventListener('click', logout);
}

function initBoard() {
    hideElement(getElement('chooseBoardDiv'));
    board = new gameBoard(level);
    timer = new Stopwatch(getElement("timeCounter"));
    showElement(getElement('board'));
} 

function login() {
    username = getElement('username').value;
    if(username == "") {
        getElement("err").innerHTML= "empty username, please enter a valid name!";
    } else {
        getElement("err").innerHTML= "";
        getElement("user").appendChild(document.createTextNode(username));
        loginNav();
    }
}

function logout() {
    username = "";
    loginNav();
}