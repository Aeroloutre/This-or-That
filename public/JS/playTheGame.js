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
const elementDisconnect = document.getElementById('disconnect')

// C'est une fonction qui GET questions
async function fetchQuestions() {
  try {
    const response = await fetch('/questions', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
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
    return bannedQuestions
  } catch (error) {
  }
}

function getRandomQuestionNotAlreadySeen(data, bannedQuestions) {
  const bannedIds = bannedQuestions.map(bq => bq.questionid);
  const filteredQuestions = data.filter(q => !bannedIds.includes(q.id));

  //On choisit une question aléatoires parmis celles qu'il reste
  if (filteredQuestions.length === 0) {
    location.href = "/submitAQuestion.html";
    alert("Nous n'avons plus de question en stock, créez la votre !")
    return null
  }
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
  const randomQuestion = filteredQuestions[randomIndex]


  return (randomQuestion)
}

function initialisation(data, bannedQuestions) {

  currentQuestion = getRandomQuestionNotAlreadySeen(data, bannedQuestions)

  elementPercentageThat.style.visibility = 'hidden'
  elementPercentageThis.style.visibility = 'hidden'
  elementThis.innerHTML = currentQuestion.firstChoice
  elementThat.innerHTML = currentQuestion.secondChoice

  elementNext.style.visibility = 'hidden'
  elementNext.disabled = true

  return (idDeQuestion, currentQuestion)
}

async function onClickVal1() {
  if (canClick === false) return
  canClick = false

  removeBgClasses(elementThis);
  removeBgClasses(elementPercentageThis);

  removeBgClasses(elementThat);
  removeBgClasses(elementPercentageThat);

  elementThat.classList.add("bg-gray-500");
  elementPercentageThat.classList.add("bg-gray-500");

  elementThis.classList.add("bg-green-400");
  elementPercentageThis.classList.add("bg-green-400");

  const userId = user.id
  const response = await fetch(`/questions/${currentQuestion.id}/${userId}/firstChoiceCount`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })

  const data = await response.json()
  displayResult(data)
}

async function onClickVal2() {
  if (canClick === false) return
  canClick = false

  removeBgClasses(elementThis);
  removeBgClasses(elementPercentageThis);

  removeBgClasses(elementThat);
  removeBgClasses(elementPercentageThat);

  elementThat.classList.add("bg-green-400");
  elementPercentageThat.classList.add("bg-green-400");

  elementThis.classList.add("bg-gray-500");
  elementPercentageThis.classList.add("bg-gray-500");

  const userId = user.id
  const response = await fetch(`/questions/${currentQuestion.id}/${userId}/secondChoiceCount`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
  const data = await response.json()
  displayResult(data)
}

function displayResult(currentQuestion) {
  elementPercentageThis.style.visibility = 'visible'
  elementPercentageThat.style.visibility = 'visible'
  elementPercentageThis.innerHTML = Math.round(((currentQuestion.firstChoiceCount / (currentQuestion.firstChoiceCount + currentQuestion.secondChoiceCount)) * 100) * 10) / 10 + ' %'
  elementPercentageThat.innerHTML = Math.round(((currentQuestion.secondChoiceCount / (currentQuestion.secondChoiceCount + currentQuestion.firstChoiceCount)) * 100) * 10) / 10 + ' %'

  elementNext.disabled = false
  elementNext.style.visibility = 'visible'
}

async function nextButton() {

  elementNext.style.visibility = 'hidden'

  canClick = true

  removeBgClasses(elementThat);
  removeBgClasses(elementThis);
  removeBgClasses(elementPercentageThat);
  removeBgClasses(elementPercentageThis);

  elementThat.classList.add("bg-blue-500", "hover:bg-blue-700");
  elementPercentageThat.classList.add("bg-blue-500", "hover:bg-blue-700");
  elementThis.classList.add("bg-blue-500", "hover:bg-blue-700");
  elementPercentageThis.classList.add("bg-blue-500", "hover:bg-blue-700");

  data = await fetchQuestions()
  bannedQuestions = await fetchBannedQuestions()
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
}

function disconnectUser() {
  localStorage.removeItem("token");
  location.reload();
  alert('Vous avez été déconnecté !')
}

function removeBgClasses(el) {
  if (!el || !el.classList) return;

  const NON_COLOR_PREFIXES = [
    'bg-clip-', 'bg-blend-', 'bg-opacity-', 'bg-origin-',
    'bg-repeat', 'bg-no-repeat', 'bg-fixed', 'bg-local', 'bg-scroll',
    'bg-auto', 'bg-cover', 'bg-contain',
    'bg-center', 'bg-top', 'bg-bottom', 'bg-left', 'bg-right',
    'bg-gradient-to-'
  ];

  const isNonColor = (base) => NON_COLOR_PREFIXES.some(p => base.startsWith(p));

  const toRemove = [];
  for (const cls of el.classList) {
    const base = cls.split(':').pop(); // dernière partie après les variants
    if (base && base.startsWith('bg-') && !isNonColor(base)) {
      toRemove.push(cls); // ex: "md:hover:bg-red-500/50"
    }
  }
  toRemove.forEach(c => el.classList.remove(c));
}

document.addEventListener("DOMContentLoaded", async function () {
  elementNext.addEventListener('click', nextButton)
  elementThis.addEventListener('click', onClickVal1)
  elementThat.addEventListener('click', onClickVal2)
  elementResetQuestions.addEventListener('click', resetQuestions)
  elementDisconnect.addEventListener('click', disconnectUser)

  user = await checkAuth()
  document.getElementById("user").innerHTML = user.name
  bannedQuestions = await fetchBannedQuestions()
  data = await fetchQuestions()
  initialisation(data, bannedQuestions)
  return (user)
});