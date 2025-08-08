let idDeQuestion
let data
let currentQuestion
let canClick = true
let user
let bannedQuestions

const content = document.getElementById('content')
const elementThis = document.getElementById('this')
const elementThat = document.getElementById('that')
const elementPercentageThis = document.getElementById('%this')
const elementPercentageThat = document.getElementById('%that')
const elementNext = document.getElementById('next')
const elementResetQuestions = document.getElementById('resetQuestions')

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

// C'est une fonction qui GET bannedQuestions
async function fetchBannedQuestions() {
  try {
    const userId = user.id
    const response = await fetch(`/bannedQuestions/${userId}`, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    const bannedQuestions = await response.json()
    console.log('bannedQuestions :', bannedQuestions)
    return bannedQuestions
  } catch (error) {
    console.error('Erreur lors de la récupération des bannedQuestions', error)
  }
}

function getRandomQuestionNotAlreadySeen(data, bannedQuestions) {
  const bannedIds = bannedQuestions.map(bq => bq.questionid);
  const filteredQuestions = data.filter(q => !bannedIds.includes(q.id));

  //On choisit une question aléatoires parmis celles qu'il reste
  console.log("questions bannis reçu dans get random", bannedQuestions)
  console.log("filtered question : ", filteredQuestions)
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

function initialisation(data, bannedQuestions) {

  currentQuestion = getRandomQuestionNotAlreadySeen(data, bannedQuestions)
  
  elementPercentageThat.style.display = 'none'
  elementPercentageThis.style.display = 'none'
  elementThis.innerHTML = currentQuestion.firstChoice
  elementThat.innerHTML = currentQuestion.secondChoice
  
  next.style.display = 'none'
  elementNext.disabled = true

  return (idDeQuestion, currentQuestion)
}

async function onClickVal1() {
  if (canClick === false) return
  canClick = false
  elementThis.style = 'background-color: green'
  elementThat.style = 'background-color: gray'
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
}

async function onClickVal2() {
  if (canClick === false) return
  canClick = false
  elementThat.style = 'background-color: green'
  elementThis.style = 'background-color: gray'
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
}

function displayResult(currentQuestion) {
  elementPercentageThis.style.display = 'block'
  elementPercentageThat.style.display = 'block'
  elementPercentageThis.innerHTML = Math.round(((currentQuestion.firstChoiceCount / (currentQuestion.firstChoiceCount + currentQuestion.secondChoiceCount)) * 100) * 10) / 10 + ' %'
  elementPercentageThat.innerHTML = Math.round(((currentQuestion.secondChoiceCount / (currentQuestion.secondChoiceCount + currentQuestion.firstChoiceCount)) * 100) * 10) / 10 + ' %'
  
  elementNext.disabled = false
  elementNext.style.display = 'block'
}

async function nextButton() {
  next.style.display = 'none'
  canClick = true
  elementThat.style = 'background-color: blue'
  elementThis.style = 'background-color: blue'
  data = await fetchQuestions()
  bannedQuestions = await fetchBannedQuestions()
  console.log('index bannis', bannedQuestions)
  initialisation(data, bannedQuestions)
}

async function resetQuestions() {
  const userId = user.id
  const response = await fetch(`/resetQuestions/${userId}`, { 
    method: 'DELETE',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })

  const deletedBannedQuestions = await response.json()
  alert('Vous pouvez désormais revoir ' + deletedBannedQuestions + " questions !")
  console.log('Vous pouvez désormais revoir :' + deletedBannedQuestions + " questions !")
}

document.addEventListener("DOMContentLoaded", async function () {
  elementNext.addEventListener('click', nextButton)
  elementThis.addEventListener('click', onClickVal1)
  elementThat.addEventListener('click', onClickVal2)
  elementResetQuestions.addEventListener('click', resetQuestions)
  user = await checkAuth()
  document.getElementById("user").innerHTML = user.name
  bannedQuestions = await fetchBannedQuestions()
  data = await fetchQuestions()
  initialisation(data, bannedQuestions)
  return (user)
});