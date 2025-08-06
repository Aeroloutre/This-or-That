async function checkAuth() {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch('/verifyToken', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!res.ok) {
      // Token invalide ou absent → redirection
      window.location.href = '/accountCreation.html'
      return
    }

    const data = await res.json()
    const user = data.user
    return user

  } catch (err) {
    window.location.href = '/accountCreation.html'
  }
}