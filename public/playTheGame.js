let idDeQuestion
let data
let currentQuestion
let canClick = true

const bannediDs = []
const content = document.getElementById('content')
const elementThis = document.getElementById('this')
const elementThat = document.getElementById('that')
const elementNext = document.getElementById('next')

// C'est une fonction qui GET questions
async function fetchQuestions() {
  try {
    const response = await fetch('/questions', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    const data = await response.json()
    console.log('data :', data)
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des questions', error)
  }
}

// On get les questions au chargement
(async () => {
  data = await fetchQuestions()
  initialisation(data)
})()

elementNext.addEventListener('click', nextButton)
elementThis.addEventListener('click', onClickVal1)
elementThat.addEventListener('click', onClickVal2)

function getRandomIntExcluding(data, excluded) {
  let randomId;
  const allIds = data.map(obj => obj.id);
  do {
    randomId = allIds[Math.floor(Math.random() * allIds.length)];
  } while (excluded.includes(randomId));
  return randomId
}

function initialisation(data) {

  if (data.length === bannediDs.length) {
    location.href = "/submitAQuestion.html";
    return
  }

  idDeQuestion = getRandomIntExcluding(data, bannediDs);

  console.log('Id de la Question choisie', idDeQuestion)

  currentQuestion = data.find(obj => obj.id === idDeQuestion);

  console.log('question choisie', currentQuestion)

  document.getElementById('this').innerHTML = currentQuestion.firstchoice
  document.getElementById('that').innerHTML = currentQuestion.secondchoice

  return (idDeQuestion, currentQuestion)
}

async function onClickVal1() {
  if (canClick === false) return
  canClick = false
  const response = await fetch(`/questions/${currentQuestion.id}/firstchoicecount`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })

  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannediDs.push(idDeQuestion)
  console.log('index bannis', bannediDs)
}

async function onClickVal2() {
  if (canClick === false) return
  canClick = false
  const response = await fetch(`/questions/${currentQuestion.id}/secondchoicecount`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannediDs.push(idDeQuestion)
  console.log('index bannis', bannediDs)
}

function displayResult(currentQuestion) {
  document.getElementById('this').innerHTML = Math.round(((currentQuestion.firstchoicecount / (currentQuestion.firstchoicecount + currentQuestion.secondchoicecount)) * 100) * 10) / 10 + ' %'
  document.getElementById('that').innerHTML = Math.round(((currentQuestion.secondchoicecount / (currentQuestion.secondchoicecount + currentQuestion.firstchoicecount)) * 100) * 10) / 10 + ' %'

  next.style.display = 'block'
}

function nextButton() {
  console.log('next button')
  document.getElementById('this').innerHTML = 'This'
  document.getElementById('that').innerHTML = 'That'
  next.style.display = 'none'
  canClick = true
  initialisation(data)
}