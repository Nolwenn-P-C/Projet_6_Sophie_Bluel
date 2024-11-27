//*******************************************************************************************************************/
//******************************************************* Init **********************************************************/
//***********************************************************************************************************************/

let modale = null // Variable pour stocker la modale actuellement ouverte
const selectionFocusable = 'button, a, input, textarea' // Sélecteurs des éléments focusables
let focusables = [] // Tableau qui contiendra tous les éléments focusables de la modale
const gallerieModale = document.querySelector('.modale-gallerie')
const modaleSupprimerTravaux = document.querySelector('#modale1')
const modaleAjouterTravaux = document.querySelector('#modale2')
const fichierImage = document.getElementById("fichier-image")
const voirImage = document.getElementById("voir-image")
const ajouterPhotoTexte = document.querySelector(".ajouter-une-photo")
const typeTailleFichierInfo = document.querySelector(".type-taille-fichier")
const imageIconeModale2 = document.getElementById("image-icone-modale2")
const titreProjetModale = document.getElementById('modale-titre-ajout')
const categorieProjetModale = document.getElementById('modale-2-categorie')
const validationModale2 = document.getElementById('modale-validation-ajout-photo')

//***********************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//***********************************************************************************************************************/

import { categoriesApi, getWorks, supprimerTravauxApi, ajouterProjetApi } from './API.js'
import { mesProjets } from './index.js'

//***********************************************************************************************************************/
//********************************************** Ouverture Fermeture Modale ***********************************************/
//***********************************************************************************************************************/

const ouvertureModale = function (e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute('href')) // Sélectionne la modale cible via l'attribut href du lien cliqué
    if (!modale) return // Si la modale n'existe pas, ne fait rien
    focusables = Array.from(modale.querySelectorAll(selectionFocusable)) // Récupère tous les éléments focusables de la modale
    focusables[0].focus() // Place le focus sur le premier élément focusable de la modale
    modale.style.display = null // Affiche la modale
    modale.removeAttribute("aria-hidden") // Indique que la modale n'est plus cachée
    modale.setAttribute("aria-modal", "true") // Indique que la modale est active et qu’elle bloque l’arrière-plan

    // Ajoute les gestionnaires d'événements pour fermer la modale ou empêcher sa fermeture
    modale.addEventListener('click', fermetureModale) // Ferme la modale lorsqu'on clique en dehors de son contenu
    modale.querySelectorAll('.fermer-modale').forEach(btn => btn.addEventListener('click', fermetureModale)) // Ferme la modale en cliquant sur le bouton de fermeture
    modale.querySelectorAll('.js-modale-stop').forEach(btn => btn.addEventListener('click', stopPropagation)) // Empêche la fermeture de la modale lorsqu'on clique sur son contenu
}

const fermetureModale = function (e) {
    if (modale === null) return // Si aucune modale n'est ouverte, ne fait rien
    e.preventDefault()
    modale.style.display = "none" // Cache la modale
    modale.setAttribute("aria-hidden", "true") // Indique que la modale est à nouveau cachée
    modale.removeAttribute("aria-modal") // Retire l'indication que la modale est active
    modale.removeEventListener('click', fermetureModale) // Supprime l'écouteur pour fermer la modale en cliquant à l'extérieur
    modale.querySelectorAll('.fermer-modale').forEach(btn => btn.removeEventListener('click', fermetureModale)) // Supprime l'écouteur du bouton de fermeture
    modale.querySelectorAll('.js-modale-stop').forEach(btn => btn.removeEventListener('click', stopPropagation)) // Supprime l'écouteur pour empêcher la fermeture en cliquant dans la modale
    modale = null // Réinitialise la variable modale à null
}

const stopPropagation = function (e) {
    e.stopPropagation() // Empêche l'événement click de se propager à d'autres éléments
}

const focusModale = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modale.querySelector(':focus')) // Trouve l'index de l'élément actuellement focusé dans la liste des éléments focusables
    if (e.shiftKey) { // Si la touche Shift est enfoncée (navigation inverse)
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

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc") { // Si la touche Échap est pressée
        fermetureModale(e) // Ferme la modale
    }
    if (e.key === "Tab" && modale !== null) { // Si la touche Tab est pressée et qu'une modale est ouverte
        focusModale(e) // Gère la navigation au clavier dans la modale
    }
})

//***********************************************************************************************************************/
//********************************************** Supprimer des projets **************************************************/
//***********************************************************************************************************************/

async function afficherTravauxDansModale() {
    try {
        modaleAjouterTravaux.style.display = "none"
        let works = await getWorks() // Récupère les travaux depuis l'API
        let afficher = '' // Initialise une chaîne vide pour construire le HTML
        for (let figure of works) {
            console.log(figure) // Affiche chaque travail dans la console pour vérification
            afficher += `
                <figure data-id="${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <i class="fa-solid fa-trash-can"></i>
                </figure>
            `
        }
        // Vide la galerie modale avant d'ajouter les nouveaux éléments
        while (gallerieModale.firstChild) {
            gallerieModale.removeChild(gallerieModale.firstChild)
        }
        gallerieModale.insertAdjacentHTML("beforeend", afficher) // Insertion des éléments dans la galerie

        // Ajouter les écouteurs d'événements pour les icônes corbeille
        document.querySelectorAll('.fa-trash-can').forEach(icon => {
            icon.addEventListener("click", function (e) {
                e.preventDefault()
                const workId = e.target.closest('figure').dataset.id
                supprimerWorks(workId) // Appelle la fonction pour supprimer le travail
            })
        })
    } catch (err) {
        console.log(err) // Affiche l'erreur en cas de problème
    }
}
afficherTravauxDansModale()

async function supprimerWorks(id) {
    try {
        await supprimerTravauxApi(id) // Appelle la fonction API pour supprimer le travail
        console.log("Travail supprimé avec succès !") // Affiche un message de succès dans la console
        await afficherTravauxDansModale() // Met à jour la galerie dans la modale
        await mesProjets() // Met à jour la galerie principale
    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
    }
}

//***********************************************************************************************************************/
//********************************************** Changement de modale **************************************************/
//***********************************************************************************************************************/

function modaleSuivante() {
    const btnAjouterPhoto = document.querySelector('#ajout-photo-modale')
    btnAjouterPhoto.addEventListener("click", function (e) {
        e.preventDefault()
        modaleSupprimerTravaux.style.display = "none"
        modaleAjouterTravaux.style.removeProperty("display")
    })
}
modaleSuivante()

function modalePrécédente() {
    const btnModalePrécédente = document.querySelector('.modale-précédente')
    btnModalePrécédente.addEventListener("click", function (e) {
        e.preventDefault()
        modaleAjouterTravaux.style.display = "none"
        modaleSupprimerTravaux.style.removeProperty("display")
        afficherTravauxDansModale()
    })
}
modalePrécédente()

//***********************************************************************************************************************/
//********************************************** Ajout projet Modale 2 **************************************************/
//***********************************************************************************************************************/

function gererApercuImage() {
    // Ajoute un écouteur d'événement pour détecter les changements dans le fichier image
    fichierImage.addEventListener("change", (event) => {
        console.log("Événement change détecté")
        const file = event.target.files[0] // Récupère le fichier sélectionné
        if (file) {
            const lecturePhoto = new FileReader() // Crée une instance de FileReader pour lire le fichier
            // Définit la fonction à exécuter lorsque le fichier est lu avec succès
            lecturePhoto.onload = (e) => {
                console.log("Fichier lu avec succès")
                // Affiche l'image d'aperçu
                voirImage.src = e.target.result
                voirImage.style.display = "block"
                // Masque les éléments de sélection de l'image
                ajouterPhotoTexte.style.display = "none"
                typeTailleFichierInfo.style.display = "none"
                imageIconeModale2.style.display = "none"
                // Vérifie l'état des champs après le changement de l'image
                activationBoutonValidationModale2()
            }
            // Lit le fichier en tant qu'URL de données
            lecturePhoto.readAsDataURL(file)
        }
    })
}

async function gererCategories() {
    // Récupère l'élément de sélection des catégories
    const selectionCategorie = document.getElementById("modale-2-categorie")
    if (!selectionCategorie) {
        console.error("Erreur lors de la récupération des catégories")
        return
    }
    // Ajoute une option vide par défaut
    selectionCategorie.insertAdjacentHTML("beforeend", '<option value="">Sélectionnez une catégorie</option>')
    try {
        const categories = await categoriesApi() // Récupère les catégories depuis l'API
        // Ajoute chaque catégorie en tant qu'option dans le select
        categories.forEach((categorie) => {
            const optionApi = `<option value="${categorie.id}">${categorie.name}</option>`
            selectionCategorie.insertAdjacentHTML("beforeend", optionApi)
        })
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    }
}

function champsComplets() {
    const nouvelleImageProjetModale = voirImage.src !== "" && voirImage.src !== "#" // Vérifie si l'image du projet n'est pas vide, ni une valeur par défaut
    const NouveauTitreProjetModale = titreProjetModale.value !== "" // Vérifie si le titre du projet est défini
    const nouvelleCategorieProjetModale = categorieProjetModale.value !== "" // Vérifie si la catégorie du projet est définie
    // Retourne vrai si tous les champs sont remplis
    return nouvelleImageProjetModale && NouveauTitreProjetModale && nouvelleCategorieProjetModale
}

// Fonction pour activer ou désactiver le bouton de validation
function activationBoutonValidationModale2() {
    // validationModale2.disabled = !champsComplets() // Désactive le bouton si les champs ne sont pas tous remplis
    validationModale2.style.backgroundColor = champsComplets() ? "#1D6154" : "#A7A7A7" // Change la couleur de fond du bouton en fonction de l'état des champs
}

// Ajoute un écouteur d'événement pour la saisie du titre
titreProjetModale.addEventListener("input", activationBoutonValidationModale2)

// Ajoute un écouteur d'événement pour la sélection de la catégorie
categorieProjetModale.addEventListener("change", activationBoutonValidationModale2)

// Appelle les fonctions initiales
gererApercuImage()
gererCategories()
activationBoutonValidationModale2()

document.getElementById("formulaire-ajout-travaux").addEventListener("submit", async function (e) {
    e.preventDefault() // Empêche le comportement par défaut du formulaire
    if (!champsComplets()) {
        console.error("Tous les champs ne sont pas remplis.")
        return; // Arrête l'exécution si les champs ne sont pas remplis
    }
    try {
        await ajouterProjetApi(e) // Appelle l'API pour ajouter le projet
        modaleAjouterTravaux.style.display = "none" // Ferme la modale actuelle
        modaleSupprimerTravaux.style.removeProperty("display") // Affiche la modale précédente
        await afficherTravauxDansModale() // Recharge les projets dans la galerie
    } catch (err) {
        console.error("Erreur lors de l'ajout :", err)
    }
})
