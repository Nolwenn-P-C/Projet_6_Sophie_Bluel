//*************************************************************************************************************************/
//**************************************************blabla **************************************************/
//*************************************************************************************************************************/
let modale = null
const selectionFocusable = 'button, a, input, textarea'
let focusables = []

const ouvertureModale = function (e) {
    e.preventDefault() 
    modale = document.querySelector(e.target.getAttribute('href'))
    focusables = Array.from(modale.querySelectorAll(selectionFocusable))
    focusables[0].focus()
    modale.style.display = null 
    modale.removeAttribute("aria-hidden")
    modale.setAttribute("aria-modal","true")
    
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


const focusModale = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modale.querySelector(':focus'))
    if (e.shift === true){
        index--
    } else{
        index ++  
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index <0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll('.js-modale').forEach(a => {
    a.addEventListener('click', ouvertureModale)
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        fermetureModale(e)
    }
    if (e.key ==="Tab" && modale !==null) {
        focusModale(e)
    }
})