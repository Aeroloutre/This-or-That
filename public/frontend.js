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
  data = await fetchQuestions();
  console.log(data);

  arraySize = data.length - 1;

  console.log('taille de la liste =', arraySize);
  console.log('data =', data);
  console.log('data[0] =', data[0]);
  console.log('data[1] =', data[1]);

  initialisation(data)

})();

elementNext.addEventListener("click", nextButton);
elementStart.addEventListener("click", initialisation);
    
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function initialisation(data){
  console.log("initialisation")

  content.style.display = "block";
  elementStart.style.display = "none";

  numeroDeQuestion = getRandomInt(0, arraySize);
  console.log('Numéro de la question :', numeroDeQuestion)

  const question = data[numeroDeQuestion];
  const keys = Object.keys(question);
  const values = Object.values(question);

  document.getElementById("this").innerHTML = keys[0];
  document.getElementById("that").innerHTML = keys[1];

  let newVote1 = values[0] + 1;
  let newVote2 = values[1] + 1;

    elementThis.addEventListener("click", async () => {
      displayResult(newVote1, values[1]); // on affiche le résultat
      await updateQuestion(numeroDeQuestion, { [keys[0]]: newVote1 }); // on PUT
    }, { once: true });

    elementThat.addEventListener("click", async () => {
      displayResult(values[0], newVote2); // on affiche
      await updateQuestion(numeroDeQuestion, { [keys[1]]: newVote2 }); // on PUT
    }, { once: true });

  return (newVote1, newVote2);
}

function displayResult(toDisplayVote1, toDisplayVote2) {
  console.log("displayResult")

  console.log('vote1',toDisplayVote1)
  console.log('vote2',toDisplayVote2)
  document.getElementById("this").innerHTML = toDisplayVote1
  document.getElementById("that").innerHTML = toDisplayVote2

  next.style.display = "block";

  elementThis.removeEventListener("click", displayResult)
  elementThat.removeEventListener("click", displayResult)
}

function nextButton() {
  console.log("next button")
  document.getElementById("this").innerHTML = "This";
  document.getElementById("that").innerHTML = "That";
  next.style.display = "none"

  initialisation(data);
}