let idDeQuestion
let data
let currentQuestion
let canClick = true
let user

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

elementNext.addEventListener('click', nextButton)
elementThis.addEventListener('click', onClickVal1)
elementThat.addEventListener('click', onClickVal2)

function getRandomQuestionNotAlreadySeen(data) {
  //Filtrer les questions NON bannies pour cet utilisateur
  const filteredQuestions = data.filter(question => {
    return !(question.bannedUserId).includes(user.id)
  })

  //Choisir une question aléatoire
  if (filteredQuestions.length === 0) {
    console.log("Aucune question disponible pour cet utilisateur")
    location.href = "/submitAQuestion.html";
    alert("Nous n'avons plus de question en stock, créez la votre !")
    return null
  }
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
  const randomQuestion = filteredQuestions[randomIndex]

  console.log("Question choisie :", randomQuestion)

  return (randomQuestion)
}

function initialisation(data) {

  currentQuestion = getRandomQuestionNotAlreadySeen(data, user)

  document.getElementById('this').innerHTML = currentQuestion.firstChoice
  document.getElementById('that').innerHTML = currentQuestion.secondChoice

  elementNext.disabled = true

  return (idDeQuestion, currentQuestion)
}

async function onClickVal1() {
  if (canClick === false) return
  canClick = false
  const userId = user.id
  const response = await fetch(`/questions/${currentQuestion.id}/${userId}/firstChoiceCount`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })

  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  console.log('index bannis', data.bannedUserId)
}

async function onClickVal2() {
  if (canClick === false) return
  canClick = false
  const userId = user.id
  const response = await fetch(`/questions/${currentQuestion.id}/${userId}/secondChoiceCount`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  console.log('index bannis', data.bannedUserId)
}

function displayResult(currentQuestion) {
  document.getElementById('this').innerHTML = Math.round(((currentQuestion.firstChoiceCount / (currentQuestion.firstChoiceCount + currentQuestion.secondChoiceCount)) * 100) * 10) / 10 + ' %'
  document.getElementById('that').innerHTML = Math.round(((currentQuestion.secondChoiceCount / (currentQuestion.secondChoiceCount + currentQuestion.firstChoiceCount)) * 100) * 10) / 10 + ' %'
  
  elementNext.disabled = false
  elementNext.style.display = 'block'
}

async function nextButton() {
  console.log('next button')
  document.getElementById('this').innerHTML = 'This'
  document.getElementById('that').innerHTML = 'That'
  next.style.display = 'none'
  canClick = true
  data = await fetchQuestions()
  initialisation(data)
}

document.addEventListener("DOMContentLoaded", async function () {
  user = await checkAuth()
  document.getElementById("user").innerHTML = user.email
  data = await fetchQuestions()
  initialisation(data, user)
  return (user)
});