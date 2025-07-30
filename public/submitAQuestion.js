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
  alert("Merci pour votre question !")
  ;

  console.log('La question POST', await response.json())
}

document.addEventListener("DOMContentLoaded", async function () {
  const user = await checkAuth()
  console.log('utilisateur connecté', user)
  console.log("nom de l'user", user.name)
  document.getElementById("user").innerHTML = user.name
});