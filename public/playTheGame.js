let idDeQuestion
let data

const bannediDs = []
const content = document.getElementById('content')
const elementThis = document.getElementById('this')
const elementThat = document.getElementById('that')
const elementNext = document.getElementById('next')

// C'est une fonction qui GET questions
async function fetchQuestions () {
  try {
    const response = await fetch('/questions')
    const data = await response.json()
    console.log('data :',data)
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des questions', error)
  }
}

// Appel de la fonction qui fait le GET
(async () => {
  data = await fetchQuestions()
  initialisation(data)
})()

elementNext.addEventListener('click', nextButton)

function getRandomIntExcluding(data, excluded) {
  let randomId;
  const allIds = data.map(obj => obj.id);
  console.log('liste des id', allIds)
  do {
  randomId = allIds[Math.floor(Math.random() * allIds.length)];
  console.log("ID aléatoire :", randomId);
  } while (excluded.includes(randomId));
  return randomId
}

function initialisation (data) {

  if (data.length === bannediDs.length){
    location.href = "/submitAQuestion.html";
    console.log('Ho');
    return
  }

  idDeQuestion = getRandomIntExcluding(data, bannediDs);

  console.log('Numéro de Question', idDeQuestion)

  const question = data.find(obj => obj.id === idDeQuestion);

  console.log('question',question)
  document.getElementById('this').innerHTML = question.firstchoice
  document.getElementById('that').innerHTML = question.secondchoice

  elementThis.addEventListener('click', () => onClickVal1(question), { once: true })
  elementThat.addEventListener('click', () => onClickVal2(question), { once: true })

  return (idDeQuestion, question)
}

async function onClickVal1 (question) {
  console.log(question.id)
  const response = await fetch(`/questions/${question.id}/firstchoicecount`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannediDs.push(idDeQuestion)
  console.log('index bannis', bannediDs)
}

async function onClickVal2 (question) {
  console.log(question.id)
  const response = await fetch(`/questions/${question.id}/secondchoicecount`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannediDs.push(idDeQuestion)
  console.log('index bannis', bannediDs)
}

function displayResult (question) {
  document.getElementById('this').innerHTML = Math.round(((question.firstchoicecount/(question.firstchoicecount+question.secondchoicecount))*100)*10)/10 + ' %'
  document.getElementById('that').innerHTML = Math.round(((question.secondchoicecount/(question.secondchoicecount+question.firstchoicecount))*100)*10)/10 + ' %'

  next.style.display = 'block'

  elementThis.removeEventListener('click', onClickVal1)
  elementThat.removeEventListener('click', onClickVal2)
}

function nextButton () {
  console.log('next button')
  document.getElementById('this').innerHTML = 'This'
  document.getElementById('that').innerHTML = 'That'
  next.style.display = 'none'

  initialisation(data)
}