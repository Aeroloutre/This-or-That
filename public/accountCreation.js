async function onClickRegisterFormSubmission() {

  //document.getElementById("formSubmissionButton").disabled = true;
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  console.log("nom saisie : ", name);
  console.log("email saisi :", email);
  console.log("password saisi :", password);

  const response = await fetch(`/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // pour que req.body fonctionne
    },
    body: JSON.stringify({
      "newInputUser": {
        "name": name,
        "email": email,
        "password": password,
      }
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.message);
    return;
  }
  const newUser = await response.json()
  console.log(newUser)
  alert("Votre compte a bien été crée !")
  window.location.href = "index.html";
}