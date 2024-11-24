//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { getWorks } from './API.js'
import { mesProjets } from './index.js'

//*************************************************************************************************************************/
//********************************************** Ouverture Fermeture Modale ***********************************************/
//*************************************************************************************************************************/

let modale = null // Variable pour stocker la modale actuellement ouverte
const selectionFocusable = 'button, a, input, textarea' // Sélecteurs des éléments focusables
let focusables = [] // Tableau qui contiendra tous les éléments focusables de la modale

const ouvertureModale = function (e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute('href')) // Sélectionne la modale cible via l'attribut href du lien cliqué
    focusables = Array.from(modale.querySelectorAll(selectionFocusable)) // Récupère tous les éléments focusables de la modale
    focusables[0].focus() // Place le focus sur le premier élément focusable de la modale
    modale.style.display = null // Affiche la modale
    modale.removeAttribute("aria-hidden") // Indique que la modale n'est plus cachée
    modale.setAttribute("aria-modal", "true") // Indique que la modale est active et qu’elle bloque l’arrière-plan

    // Ajoute les gestionnaires d'événements pour fermer la modale ou empêcher sa fermeture
    modale.addEventListener('click', fermetureModale) // Ferme la modale lorsqu'on clique en dehors de son contenu
    modale.querySelector('.fermer-modale').addEventListener('click', fermetureModale) // Ferme la modale en cliquant sur le bouton de fermeture
    modale.querySelector('.js-modale-stop').addEventListener('click', stopPropagation) // Empêche la fermeture de la modale lorsqu'on clique sur son contenu
}

const fermetureModale = function (e) {
    if (modale === null) return // Si aucune modale n'est ouverte, ne fait rien
    e.preventDefault()
    modale.style.display = "none" // Cache la modale
    modale.setAttribute("aria-hidden", "true") // Indique que la modale est à nouveau cachée
    modale.removeAttribute("aria-modal") // Retire l'indication que la modale est active
    modale.removeEventListener('click', fermetureModale) // Supprime l'écouteur pour fermer la modale en cliquant à l'extérieur
    modale.querySelector('.fermer-modale').removeEventListener('click', fermetureModale) // Supprime l'écouteur du bouton de fermeture
    modale.querySelector('.js-modale-stop').removeEventListener('click', stopPropagation) // Supprime l'écouteur pour empêcher la fermeture en cliquant dans la modale
    modale = null // Réinitialise la variable modale à null
}

const stopPropagation = function (e) {
    e.stopPropagation() // Empêche l'événement click de se propager à d'autres éléments
}

const focusModale = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modale.querySelector(':focus')) // Trouve l'index de l'élément actuellement focusé dans la liste des éléments focusables
    if (e.shift === true) { // Si la touche Shift est enfoncée (navigation inverse)
        index-- // Décrémente l'index pour aller à l'élément précédent
    } else {
        index++ // Incrémente l'index pour aller à l'élément suivant
    }
    if (index >= focusables.length) { // Si l'index dépasse le dernier élément
        index = 0 // Recommence au premier élément
    }
    if (index < 0) { // Si l'index est inférieur à zéro
        index = focusables.length - 1 // Revient au dernier élément
    }
    focusables[index].focus() // Place le focus sur l'élément calculé
}

document.querySelectorAll('.js-modale').forEach(a => {
    a.addEventListener('click', ouvertureModale) // Ajoute un gestionnaire d'événements pour ouvrir la modale sur tous les liens ayant la classe js-modale
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") { // Si la touche Échap est pressée
        fermetureModale(e) // Ferme la modale
    }
    if (e.key === "Tab" && modale !== null) { // Si la touche Tab est pressée et qu'une modale est ouverte
        focusModale(e) // Gère la navigation au clavier dans la modale
    }
})

//*************************************************************************************************************************/
//************************************************ Supprimer des projets **************************************************/
//*************************************************************************************************************************/

const gallerieModale = document.querySelector('.modale-gallerie')

async function afficherTravauxDansModale() {
    try {
        let works = await getWorks()
        let afficher = ''
        for (let figure of works) {
            console.log(figure)
            afficher += `
                <figure data-id="${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <i class="fa-solid fa-trash-can"></i>
                </figure>
            `
        }
        gallerieModale.innerHTML = afficher // Met à jour le contenu de la galerie modale

        // Ajouter les écouteurs d'événements pour les icônes corbeille
        document.querySelectorAll('.fa-trash-can').forEach(icon => {
            icon.addEventListener("click", function (e) {
                e.preventDefault()
                const workId = e.target.closest('figure').dataset.id
                supprimerWorks(workId)
            })
        })
    } catch (err) {
        console.log(err)
    }
}
afficherTravauxDansModale()

const token = localStorage.getItem("token")

async function supprimerWorks(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!response.ok) throw new Error("Échec de la suppression du travail")
        console.log("Travail supprimé avec succès !")
        await mesProjets() // Met à jour la galerie principale
        await afficherTravauxDansModale() // Met à jour la galerie dans la modale
    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
    }
}