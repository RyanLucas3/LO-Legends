

document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();
  
    let guessedWords = [[]];
    let availableSpace = 1;
  
    let word;
    let guessedWordCount = 0;

    const ChosenChampions = []
  
    const keys = document.querySelectorAll(".keyboard-row button");
  
    function getNewWord() {
      fetch(
        `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "<YOUR_KEY_GOES_HERE>",
          },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          word = res.word;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  
    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }
  
    function updateGuessedWords(letter) {
      const currentWordArr = getCurrentWordArr();
  
      if (currentWordArr && currentWordArr.length < 5) {
        currentWordArr.push(letter);
  
        const availableSpaceEl = document.getElementById(String(availableSpace));
  
        availableSpace = availableSpace + 1;
        availableSpaceEl.textContent = letter;
      }
    }


    

  
    function getTileColor(letter, index) {
      const isCorrectLetter = word.includes(letter);
  
      if (!isCorrectLetter) {
        return "rgb(58, 58, 60)";
      }
  
      const letterInThatPosition = word.charAt(index);
      const isCorrectPosition = letter === letterInThatPosition;
  
      if (isCorrectPosition) {
        return "rgb(83, 141, 78)";
      }
  
      return "rgb(181, 159, 59)";
    }
  
    function handleSubmitWord() {
      const currentWordArr = getCurrentWordArr();
      if (currentWordArr.length !== 5) {
        window.alert("Word must be 5 letters");
      }
  
      const currentWord = currentWordArr.join("");
  
      fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "61c5e3986dmsh20c1bee95c2230dp18d1efjsn4668bbcfc1b3",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw Error();
          }
  
          const firstLetterId = guessedWordCount * 5 + 1;
          const interval = 200;
          currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
              const tileColor = getTileColor(letter, index);
  
              const letterId = firstLetterId + index;
              const letterEl = document.getElementById(letterId);
              letterEl.classList.add("animate__flipInX");
              letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
          });
  
          guessedWordCount += 1;
  
          if (currentWord === word) {
            window.alert("Congratulations!");
          }
  
          if (guessedWords.length === 6) {
            window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
          }
  
          guessedWords.push([]);
        })
        .catch(() => {
          window.alert("Word is not recognised!");
        });
    }
  
    function createSquares() {
      const gameBoard = document.getElementById("board");
  
      for (let index = 0; index < 20; index++) {


        if (index == 5 || index == 6 || index == 7|| index == 8 || index == 9){
            let square = document.createElement("div");
            square.classList.add("lowersquare");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }

        else if (index == 0 || index == 1 || index == 2|| index == 3 || index == 4){
            let square = document.createElement("div");
            square.classList.add("bluesquare");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
        

        else if (index == 15 || index == 16 || index == 17|| index == 18 || index == 19){
            let square = document.createElement("div");
            square.classList.add("redlowersquare");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
        else {
          let square = document.createElement("div");
          square.classList.add("redsquare");
          square.classList.add("animate__animated");
          square.setAttribute("id", index + 1);
          gameBoard.appendChild(square);
      }
 
      }
    }
  
    function handleDeleteLetter() {
      const currentWordArr = getCurrentWordArr();
      const removedLetter = currentWordArr.pop();
  
      guessedWords[guessedWords.length - 1] = currentWordArr;
  
      const lastLetterEl = document.getElementById(String(availableSpace - 1));
  
      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({ target }) => {
        const letter = target.getAttribute("data-key");
  
        if (letter === "enter") {
          handleSubmitWord();
          return;
        }
  
        if (letter === "del") {
          handleDeleteLetter();
          return;
        }
  
        updateGuessedWords(letter);
      };
    }
  });

  function showAll(id){
    var x= document.getElementById(id);
    for(i=0; i<x.options.length;i++){
      x.options[i].hidden = false;
    }
  };

  function hideShow(value, color) {
    if (color === "blue"){
      showAll("blue_select");
      const myArray = value.split("_");
      let i = myArray[1];
      document.getElementById("b_"+i).hidden = true;
    }else{
      showAll("red_select");
      const myArray = value.split("_");
      let i = myArray[1];
      document.getElementById("r_"+i).hidden = true;
    }
    
  };


  function blueSelect() {
    var selection = document.getElementById("blue_select");
    var x = document.getElementById("blue_select").value;
    if (x != ""){
      document.getElementById("red_select").disabled = false;
    };
    id_selected = (selection.options[selection.selectedIndex].id);
    hideShow(id_selected, "red");
  };


  function redSelect() {
    var selection = document.getElementById("red_select");
    var x = document.getElementById("red_select").value;
    if (x != ""){
      document.getElementById("model_select").disabled = false;
    };
    id_selected = (selection.options[selection.selectedIndex].id);
    hideShow(id_selected, "blue");
  };


  function modelSelect() {
    var b = document.getElementById("blue_select");
    var r = document.getElementById("red_select");
    var m = document.getElementById("model_select").value;
    read_results(b,r,m);
  };


  function set_image(index, champ){
    let square = document.getElementById(index);
    let image = document.createElement("img");
    image.src = "./tiles/"+champ+".jpg";
    square.appendChild(image);
  }

  function show(data){
    set_image("1", data.blue_select1);
    set_image("2", data.blue_select2);
    set_image("3", data.blue_select3);
    set_image("4", data.blue_select4);
    set_image("5", data.blue_select5);

    set_image("6", data.blue_ban1);
    set_image("7", data.blue_ban2);
    set_image("8", data.blue_ban3);
    set_image("9", data.blue_ban4);
    set_image("10", data.blue_ban5);


    set_image("11", data.red_select1);
    set_image("12", data.red_select2);
    set_image("13", data.red_select3);
    set_image("14", data.red_select4);
    set_image("15", data.red_select5);

    set_image("16", data.red_ban1);
    set_image("17", data.red_ban2);
    set_image("18", data.red_ban3);
    set_image("19", data.red_ban4);
    set_image("20", data.red_ban5);
    
  };

  


  function read_results(blue_team, red_team, model){
    let datax;
    fetch("https://amjedbel.github.io/test.json").then((response) => response.json()).then((data) =>show(data));
    console.log(blue_team);
    console.log(red_team);
    console.log(model);
  };