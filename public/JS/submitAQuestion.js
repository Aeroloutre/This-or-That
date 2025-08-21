let user
let bannedQuestions

const elementProposalThis = document.getElementById('Question1')
const elementProposalThat = document.getElementById('Question2')
const elementDisconnect = document.getElementById('disconnect')
const elementResetQuestions = document.getElementById('resetQuestions')

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

function disconnectUser() {
  localStorage.removeItem("token");
  location.reload();
  alert('Vous avez été déconnecté !')
}

document.addEventListener("DOMContentLoaded", async function () {
  elementDisconnect.addEventListener('click', disconnectUser)
  elementResetQuestions.addEventListener('click', resetQuestions)

  user = await checkAuth()
  document.getElementById("user").innerHTML = user.name
  return (user)
});