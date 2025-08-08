let user
const elementResetQuestions = document.getElementById('resetQuestions')
const elementProposalThis = document.getElementById('Question1')
const elementProposalThat = document.getElementById('Question2')

elementResetQuestions.addEventListener('click', resetQuestions)

async function onClickQuestionFormSubmission() {
  document.getElementById("formSubmissionButton").disabled = true;
  const choice1 = elementProposalThis.value;
  const choice2 = elementProposalThat.value;
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

  elementProposalThis.value = '';
  elementProposalThat.value = '';

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