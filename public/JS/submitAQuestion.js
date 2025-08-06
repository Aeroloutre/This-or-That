let user
const elementResetQuestions = document.getElementById('resetQuestions')

elementResetQuestions.addEventListener('click', resetQuestions)

async function onClickQuestionFormSubmission() {
  document.getElementById("formSubmissionButton").disabled = true;
  const choice1 = document.getElementById("Question1").value
  const choice2 = document.getElementById("Question2").value
  const response = await fetch(`/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',// pour que req.body fonctionne
      authorization: 'Bearer ' + localStorage.getItem('token')
    },

    body: JSON.stringify({

      "question": {
        "firstChoice": choice1,
        "firstChoiceCount": 0,
        "secondChoice": choice2,
        "secondChoiceCount": 0
      }
    }),
  })
  alert("Merci pour votre question !");

  console.log('La question POST', await response.json())
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
  user = await checkAuth()
  document.getElementById("user").innerHTML = user.name
  return(user)
});