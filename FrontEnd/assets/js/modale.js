//*************************************************************************************************************************/
//**************************************************blabla **************************************************/
//*************************************************************************************************************************/
let modale = null

const ouvertureModale = function (e) {
    e.preventDefault() 
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null 
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal","true")
    modale = target
    modale.addEventListener('click', fermetureModale)
    modale.querySelector('.fermer-modale').addEventListener('click', fermetureModale)
    modale.querySelector('.js-modale-stop').addEventListener('click', stopPropagation)
}

const fermetureModale = function (e) {
    if (modale === null) return
    e.preventDefault() 
    modale.style.display = "none" 
    modale.setAttribute("aria-hidden","true")
    modale.removeAttribute("aria-modal")
    modale.removeEventListener('click', fermetureModale)
    modale.querySelector('.fermer-modale').removeEventListener('click', fermetureModale)
    modale.querySelector('.js-modale-stop').removeEventListener('click', stopPropagation)
    modale = null
}

const stopPropagation = function (e){
    e.stopPropagation()
}

document.querySelectorAll('.js-modale').forEach(a => {
    a.addEventListener('click', ouvertureModale)
})
