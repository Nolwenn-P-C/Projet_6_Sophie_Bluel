//***********************************************************************************************************************/
//******************************************************* Init **********************************************************/
//***********************************************************************************************************************/

let modale = null
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

//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { categoriesApi, travauxApi, supprimerTravauxApi, ajouterProjetApi } from './API.js'
import { mesProjets } from './index.js'

//*************************************************************************************************************************/
//********************************************** Ouverture Fermeture Modale ***********************************************/
//*************************************************************************************************************************/

/**
 * Ouvre la modale.
 * @param {Event} e - L'événement de clic.
 */
const ouvertureModale = (e) => {
    e.preventDefault()
    modale = document.querySelector('#modale')
    if (!modale) return

    modale.style.display = null
    modale.removeAttribute("aria-hidden")
    modale.setAttribute("aria-modal", "true")

    modale.addEventListener('click', fermetureModale)
    modale.querySelectorAll('.fermer-modale').forEach(btn => btn.addEventListener('click', fermetureModale))
    modale.querySelector('.js-modale-stop')?.addEventListener('click', stopPropagation)
}

// Ajout des événements pour ouvrir ou fermer la modale
document.querySelector('.js-modale').addEventListener('click', ouvertureModale)

/**
 * Ferme la modale.
 * @param {Event} e - L'événement de clic.
 */
const fermetureModale = (e) => {
    if (modale === null) return
    e.preventDefault()
    modale.style.display = "none"
    modale.setAttribute("aria-hidden", "true")
    modale.removeAttribute("aria-modal")
    modale.removeEventListener('click', fermetureModale)
    modale.querySelectorAll('.fermer-modale').forEach(btn => btn.removeEventListener('click', fermetureModale))
    modale.querySelector('.js-modale-stop').removeEventListener('click', stopPropagation)
    modale = null
}

/**
 * Empêche la propagation de l'événement.
 * @param {Event} e - L'événement de clic.
 */
const stopPropagation = (e) => {
    e.stopPropagation()
}

// Fermeture de la modale avec le clavier
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        fermetureModale(e)
    }
})

//***********************************************************************************************************************/
//********************************************** Supprimer des projets **************************************************/
//***********************************************************************************************************************/

/**
 * Affiche les travaux dans la modale.
 * @async
 * @returns {Promise<void>}
 */
const afficherTravauxDansModale = async () => {
    try {
        modaleAjouterTravaux.style.display = "none"
        let works = await travauxApi()
        let afficher = ''

        for (let figure of works) {
            afficher += `
                <figure data-id="${figure.id}">
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <i class="fa-solid fa-trash-can"></i>
                </figure>
            `
        }

        for (let i = gallerieModale.children.length - 1; i >= 0; i--) {
            gallerieModale.removeChild(gallerieModale.children[i])
        }

        gallerieModale.insertAdjacentHTML("beforeend", afficher)

        document.querySelectorAll('.fa-trash-can').forEach(icon => {
            icon.addEventListener("click", (e) => {
                e.preventDefault()
                const workId = e.target.closest('figure').dataset.id
                supprimerWorks(workId)
            })
        })
    } catch (err) {
        console.error("Erreur lors de l'affichage de la galerie dans la modale :", err)
    }
}
afficherTravauxDansModale()

/**
 * Supprime un projet via son identifiant.
 * @async
 * @param {number} id - L'identifiant du travail à supprimer.
 * @returns {Promise<void>}
 */
const supprimerWorks = async (id) => {
    try {
        await supprimerTravauxApi(id)
        await afficherTravauxDansModale()
        await mesProjets()
    } catch (error) {
        console.error("Erreur lors de la suppression :", error)
    }
}

//***********************************************************************************************************************/
//********************************************** Changement de modale ***************************************************/
//***********************************************************************************************************************/

/**
 * Passe à la modale suivante lorsque l'utilisateur clique sur le bouton "ajouter".
 */
const modaleSuivante = () => {
    const btnAjouterPhoto = document.querySelector('#ajout-photo-modale')
    btnAjouterPhoto.addEventListener("click", (e) => {
        e.preventDefault()
        modaleSupprimerTravaux.style.display = "none"
        modaleAjouterTravaux.style.removeProperty("display")
    })
}
modaleSuivante()

/**
 * Revient à la modale précédente.
 */
const modalePrécédente = () => {
    const btnModalePrécédente = document.querySelector('.modale-précédente')
    btnModalePrécédente.addEventListener("click", (e) => {
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

/**
 * Gère l'aperçu de l'image sélectionnée.
 */
const gererApercuImage = () => {
    fichierImage.addEventListener("change", (event) => {
        const file = event.target.files[0]
        if (file) {
            const lecturePhoto = new FileReader()

            lecturePhoto.onload = (e) => {
                voirImage.src = e.target.result
                voirImage.style.display = "block"

                ajouterPhotoTexte.style.display = "none"
                typeTailleFichierInfo.style.display = "none"
                imageIconeModale2.style.display = "none"

                activationBoutonValidationModale2()
            }

            lecturePhoto.readAsDataURL(file)
        }
    })
}

/**
 * Charge les catégories dans le formulaire.
 * @async
 * @returns {Promise<void>}
 */
const gererCategories = async () => {
    const selectionCategorie = document.getElementById("modale-2-categorie")
    if (!selectionCategorie) {
        console.error("Erreur lors de la récupération des catégories")
        return
    }

    selectionCategorie.insertAdjacentHTML("beforeend", '<option value="">Sélectionnez une catégorie</option>')
    try {
        const categories = await categoriesApi()

        categories.forEach((categorie) => {
            const optionApi = `<option value="${categorie.id}">${categorie.name}</option>`
            selectionCategorie.insertAdjacentHTML("beforeend", optionApi)
        })
    } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
    }
}

/**
 * Vérifie si tous les champs du formulaire sont remplis.
 * @returns {boolean}
 */
const champsComplets = () => {
    const nouvelleImageProjetModale = voirImage.src !== "" && voirImage.src !== "#"
    const NouveauTitreProjetModale = titreProjetModale.value.trim() !== ""
    const nouvelleCategorieProjetModale = categorieProjetModale.value.trim() !== ""

    return nouvelleImageProjetModale && NouveauTitreProjetModale && nouvelleCategorieProjetModale
}

/**
 * Active ou désactive le bouton de validation en fonction de l'état des champs du formulaire.
 */
const activationBoutonValidationModale2 = () => {
    validationModale2.style.backgroundColor = champsComplets() ? "#1D6154" : "#A7A7A7"
}

// Gestion des événements liés au formulaire
titreProjetModale.addEventListener("input", activationBoutonValidationModale2)
categorieProjetModale.addEventListener("change", activationBoutonValidationModale2)

gererApercuImage()
gererCategories()
activationBoutonValidationModale2()

/**
 * Une fois le projet ajouté, la modale se réinitialise.
 */
document.getElementById("formulaire-ajout-travaux").addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!champsComplets()) {
        console.error("Tous les champs ne sont pas remplis.")
        return
    }
    try {
        await ajouterProjetApi(e)

        e.target.reset()

        voirImage.src = ""
        voirImage.style.display = "none"
        ajouterPhotoTexte.style.display = "block"
        typeTailleFichierInfo.style.display = "block"
        imageIconeModale2.style.display = "block"

        await mesProjets()
    } catch (err) {
        console.error("Erreur lors de l'ajout :", err)
    }
})
