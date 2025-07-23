let numeroDeQuestion
let data

const bannedIndex = []
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
  data = (await fetchQuestions())
  initialisation(data, numeroDeQuestion)
})()  

elementNext.addEventListener('click', nextButton)

function getRandomIntExcluding(min, max, excluded) {
  let rand;
  do {
    rand = Math.floor(Math.random() * (max - min)) + min;
  } while (excluded.includes(rand));
  return rand
}

function initialisation (data) {

  if (data.length === bannedIndex.length){
    location.href = "/submitAQuestion.html";
    console.log('Ho');
    return
  }

  numeroDeQuestion = getRandomIntExcluding(0, data.length, bannedIndex);

  console.log('Numéro de Question', numeroDeQuestion)

  const question = data[numeroDeQuestion]

  console.log('question',question)
  document.getElementById('this').innerHTML = question.firstchoice
  document.getElementById('that').innerHTML = question.secondchoice

  elementThis.addEventListener('click', () => onClickVal1(question), { once: true })
  elementThat.addEventListener('click', () => onClickVal2(question), { once: true })

  return (numeroDeQuestion, question)
}

async function onClickVal1 (question) {
  console.log(question.id)
  const response = await fetch(`/questions/${question.id}/firstchoicecount`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannedIndex.push(numeroDeQuestion)
  console.log('index bannis', bannedIndex)
}

async function onClickVal2 (question) {
  console.log(question.id)
  const response = await fetch(`/questions/${question.id}/secondchoicecount`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannedIndex.push(numeroDeQuestion)
  console.log('index bannis', bannedIndex)
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