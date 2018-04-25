const gTagForm = document.getElementById('gTagForm')
const gTagInput = document.getElementById('gTagInput')
const gTagSubmit = document.getElementById('gTagSubmit')

gTagSubmit.addEventListener('click', function (e) {
  if (!gTagInput.value) {
    e.preventDefault()
    gTagInput.classList.add('error')
    gTagInput.setAttribute('placeholder', 'You forgot a gamertag...')
  }
  let gTag = gTagInput.value
  gTagForm.setAttribute('action', '/' + gTag)
})
