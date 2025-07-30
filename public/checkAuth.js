async function checkAuth() {
  const token = localStorage.getItem('token')
  await fetch('/protected', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) {
        // Token invalide ou absent → rediriger
        window.location.href = '/accountCreation.html'
      }
    })
    .catch(() => {
      window.location.href = '/accountCreation.html'
    })
}