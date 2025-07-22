let numeroDeQuestion
let data

const bannedIndex = []
const content = document.getElementById('content')
const next = document.getElementById('next')
const elementStart = document.getElementById('start')
const elementThis = document.getElementById('this')
const elementThat = document.getElementById('that')
const elementNext = document.getElementById('next')

content.style.display = 'none'
next.style.display = 'none'

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
elementStart.addEventListener('click', startDisplay)

function startDisplay () {
  content.style.display = 'block'
  elementStart.style.display = 'none'
}

function getRandomIntExcluding(min, max, excluded) {
  let rand;
  do {
    rand = Math.floor(Math.random() * (max - min)) + min;
  } while (excluded.includes(rand));
  return rand
}

function initialisation (data) {

  if (data.length === bannedIndex.length){
    location.href = "/index2.html";
    console.log('Ho');
    return
  }

  numeroDeQuestion = getRandomIntExcluding(0, data.length, bannedIndex);

  console.log('Numéro de Question', numeroDeQuestion)

  const question = data.find(question => question.id === numeroDeQuestion)

  document.getElementById('this').innerHTML = question.firstchoice
  document.getElementById('that').innerHTML = question.secondchoice

  elementThis.addEventListener('click', onClickVal1, { once: true })

  elementThat.addEventListener('click', onClickVal2, { once: true })

  return (numeroDeQuestion, question)
}

async function onClickVal1 () {
  console.log(numeroDeQuestion)
  const response = await fetch(`/questions/${numeroDeQuestion}/firstchoicecount`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  bannedIndex.push(numeroDeQuestion)
  console.log('index bannis', bannedIndex)
}

async function onClickVal2 () {
  console.log(numeroDeQuestion)
  const response = await fetch(`/questions/${numeroDeQuestion}/secondchoicecount`, { method: 'PUT' })
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

async function onClickQuestionFormSubmission () {
  const Choix1 = document.getElementById("Question1").value
  const Choix2 = document.getElementById("Question2").value
  const response = await fetch(`/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // pour que req.body fonctionne
          },
          body: JSON.stringify({
            "question": {
              "firstchoice": "Question1",
              "firstchoicecount": 0,
              "secondchoice": "Question2",
              "secondchoicecount": 0
            }
          }),
        });
  console.log('La question POST', response)
}

