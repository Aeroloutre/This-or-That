let arraySize;
let randomInt;
let numeroDeQuestion;
let data;

const content = document.getElementById("content");
const next = document.getElementById("next");
const elementStart = document.getElementById("start");
const elementThis = document.getElementById("this");
const elementThat = document.getElementById("that");
const elementNext = document.getElementById("next");

content.style.display = "none";
next.style.display = "none";

//C'est une fonction qui GET questions
async function fetchQuestions() {
  try {
    const response = await fetch('/questions');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des questions', error);
  }
}

//C'est une fonction qui PUT question
async function updateQuestion(index, updatedFields) {
  try {
    const response = await fetch(`/questions/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields) // Exemple : { question: "Nouvelle question", reponse: "42" }
    });

    const result = await response.json();
    console.log('Mise à jour réussie :', result);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la question', error);
  }
}

//Appel de la fonction qui fait le GET
(async () => {
  data = (await fetchQuestions()).questions;

  arraySize = data.length - 1;

  console.log('taille de la liste =', arraySize);
  console.log('Les data qui sont get =', data);
  initialisation(data, numeroDeQuestion);
  console.log('clef 1 =', data[numeroDeQuestion].key1);
  console.log('valeur de la clef 1 =', data[numeroDeQuestion].value1);
})();

elementNext.addEventListener("click", nextButton);
elementStart.addEventListener("click", startDisplay);
    
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function startDisplay(){
  content.style.display = "block";
  elementStart.style.display = "none";
}

function initialisation(data){
  console.log("initialisation")

  numeroDeQuestion = getRandomInt(0, arraySize);
  console.log('Numéro de la question :', numeroDeQuestion)

  let question = data[numeroDeQuestion];

  document.getElementById("this").innerHTML = question.key1;
  document.getElementById("that").innerHTML = question.key2;

    elementThis.addEventListener("click", async () => {
      const response = await fetch(`/questions/${numeroDeQuestion}/value1`, {method: "PUT"});
      const data = await response.json();
      console.log("data après le PUT", data);
      displayResult(data);
      question = data;
    }, { once: true });

    elementThat.addEventListener("click", async () => {
      const response = await fetch(`/questions/${numeroDeQuestion}/value2`, {method: "PUT"});
      const data = await response.json();
      console.log("data après le PUT", data);
      displayResult(data); 
      question = data;
    }, { once: true });

  return (numeroDeQuestion, question);
}

function displayResult(question, numeroDeQuestion) {
  console.log("displayResult")
  console.log('vote1', question.value1);
  console.log('vote2', question.value2);
  document.getElementById("this").innerHTML = question.value1;
  document.getElementById("that").innerHTML = question.value2;

  next.style.display = "block";

  elementThis.removeEventListener("click", displayResult);
  elementThat.removeEventListener("click", displayResult);
}

function nextButton() {
  console.log("next button")
  document.getElementById("this").innerHTML = "This";
  document.getElementById("that").innerHTML = "That";
  next.style.display = "none"

  initialisation(data);
}