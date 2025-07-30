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
        "firstchoice": choice1,
        "firstchoicecount": 0,
        "secondchoice": choice2,
        "secondchoicecount": 0
      }
    }),
  });

  console.log('La question POST', await response.json())
}

document.addEventListener("DOMContentLoaded", function () {
  checkAuth()
});