let arraySize
let randomInt
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

// C'est une fonction qui PUT question
async function updateQuestion (index, updatedFields) {
  try {
    const response = await fetch(`/questions/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields) // Exemple : { question: "Nouvelle question", reponse: "42" }
    })

    const result = await response.json()
    console.log('Mise à jour réussie :', result)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la question', error)
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
  question = data
}

async function onClickVal1 () {
  const response = await fetch(`/questions/${numeroDeQuestion}/value1`, { method: 'PUT' })
  const data = await response.json()
  console.log('data après le PUT', data)
  displayResult(data)
  question = data
}

function displayResult (question, numeroDeQuestion) {
  document.getElementById('this').innerHTML = question.value1
  document.getElementById('that').innerHTML = question.value2

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
