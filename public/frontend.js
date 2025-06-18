let arraySize
let numeroDeQuestion
let data

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
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des questions', error)
  }
}

// Appel de la fonction qui fait le GET
(async () => {
  data = (await fetchQuestions()).questions
  arraySize = data.length - 1
  initialisation(data, numeroDeQuestion)
})()

elementNext.addEventListener('click', nextButton)
elementStart.addEventListener('click', startDisplay)

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function startDisplay () {
  content.style.display = 'block'
  elementStart.style.display = 'none'
}

function initialisation (data) {
  numeroDeQuestion = getRandomInt(0, arraySize)

  const question = data[numeroDeQuestion]

  document.getElementById('this').innerHTML = question.key1
  document.getElementById('that').innerHTML = question.key2

  elementThis.addEventListener('click', onClickVal1, { once: true })

  elementThat.addEventListener('click', onClickVal2, { once: true })

  return (numeroDeQuestion, question)
}

async function onClickVal2 () {
  const response = await fetch(`/questions/${numeroDeQuestion}/value2`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
}

async function onClickVal1 () {
  const response = await fetch(`/questions/${numeroDeQuestion}/value1`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
}

function displayResult (question) {
  document.getElementById('this').innerHTML = Math.round(((question.value1/(question.value1+question.value2))*100)*10)/10 + ' %'
  document.getElementById('that').innerHTML = Math.round(((question.value2/(question.value2+question.value1))*100)*10)/10 + ' %'

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
  const Question1 = document.getElementById("Question1").value
  const Question2 = document.getElementById("Question2").value
  const response = await fetch(`/questions`, {
          method: 'POST',
          body: {
            "question": {
              "key1": Question1,//La première question
              "value1": "0",
              "key2": Question2, //La deuxième question
              "value2": "0"
            }
          },
        });
  console.log('La question POST', response)
}

