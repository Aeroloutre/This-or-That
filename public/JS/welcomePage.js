let users

async function onClickLoginFormSubmission() {

  document.getElementById("formSubmissionButton").disabled = true;

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  console.log("email saisi :", email);
  console.log("password saisi :", password);

  const response = await fetch(`/userAuth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // pour que req.body fonctionne
    },
    body: JSON.stringify({
      "inputUser": {
        "email": email,
        "password": password,
      }
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.message); // Affiche "--- incorrect" à l'utilisateur
    return;
  }
  const objToken = await response.json()
  console.log(objToken.token)
  localStorage.setItem('token', objToken.token)
  alert("Connexion réussie !")
  window.location.href = "/playTheGame.html"; // redirection vers le jeu
}