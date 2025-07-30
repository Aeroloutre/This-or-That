let users

// C'est une fonction qui GET users -> A supprimer à terme (ne pas afficher la liste des users + password en front)
/*async function fetchUsers() {
  try {
    const response = await fetch('/users')
    const users = await response.json()
    console.log('users :', users)
    return users
  } catch (error) {
    console.error('Erreur lors de la récupération des questions', error)
  }
}

(async () => {
  users = await fetchUsers()
})()
*/

async function onClickLoginFormSubmission() {

  //document.getElementById("formSubmissionButton").disabled = true;

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  console.log("email saisi :", email);
  console.log("password saisi :", password);

  const response = await fetch(`/usersAuth`, {
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
  }
  const objToken = await response.json()
  console.log(objToken.token)
  localStorage.setItem('token', objToken.token)
  alert("Connexion réussie !")
  window.location.href = "playTheGame.html"; // redirection vers le jeu
}

// Faire une fonction qui dit "si on détecte un token correspondant à un user -> On lui sert toutes les pages"
// Et ducoup faire la route backend qui va avec