//***********************************************************************************************************************/
//******************************************************* Init **********************************************************/
//***********************************************************************************************************************/

const filtres = document.querySelector(".filtres")
const logInOutBtn = document.querySelector(".logInOut")
const token = localStorage.getItem("token")
const lienModale = document.querySelector(".lien-modale")

//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { getWorks, categoriesApi } from './API.js'

//*************************************************************************************************************************/
//************************************************** Affichage des projets ************************************************/
//*************************************************************************************************************************/

/**
 * Affiche les projets en récupérant les travaux depuis l'API et en les injectant dans la galerie.
 * @async
 * @returns {Promise<void>}
 */
export const mesProjets = async () => {
    try {
        let works = await getWorks()
        let afficher = ''

        for (let figure of works) {
            afficher += `
                <figure>
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption> ${figure.title} </figcaption>
                </figure>
            `
        }
        const gallery = document.querySelector('.gallery')
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild)
        }
        gallery.insertAdjacentHTML("beforeend", afficher)
    } catch (err) {
        console.error("Erreur lors de l'affichage des projets :", error)
    }
}
mesProjets()

//***********************************************************************************************************************/
//******************************************* Création des boutons filtres **********************************************/
//***********************************************************************************************************************/

/**
 * Crée les boutons de filtres en fonction des catégories récupérées depuis l'API.
 * @async
 * @returns {Promise<void>}
 */
const categoriesBoutons = async () => {
    // Vérifier si les boutons de filtre existent déjà
    if (document.querySelectorAll(".boutonsFiltre").length > 0) {
        return
    }

    filtres.insertAdjacentHTML("beforeend", '<button id="0" class="boutonsFiltre">Tous</button>')

    const categories = await categoriesApi()
    categories.forEach((categorie) => {
        const btnHTML = `<button id="${categorie.id}" class="boutonsFiltre">${categorie.name}</button>`
        filtres.insertAdjacentHTML("beforeend", btnHTML)
    })
    filtreCategorie()
}

//***********************************************************************************************************************/
//************************************* Affichage et fonctionnement des filtres *****************************************/
//***********************************************************************************************************************/

/**
 * Filtre les projets en fonction des boutons de filtres cliqués.
 * @async
 * @returns {Promise<void>}
 */
const filtreCategorie = async () => {
    const works = await getWorks()
    const boutons = document.querySelectorAll(".filtres button")
    const gallery = document.querySelector('.gallery')

    boutons.forEach((bouton) => {
        bouton.addEventListener("click", () => {
            let btnID = parseInt(bouton.id)
            let filtreWorks
            if (btnID === 0) {
                filtreWorks = works
            } else {
                filtreWorks = works.filter(work => work.categoryId === btnID)
            }
            while (gallery.firstChild) {
                gallery.removeChild(gallery.firstChild)
            }
            let displayFiltre = ''
            for (let figure of filtreWorks) {
                displayFiltre += `
                    <figure>
                        <img src="${figure.imageUrl}" alt="${figure.title}">
                        <figcaption> ${figure.title} </figcaption>
                    </figure>
                `
            }
            gallery.insertAdjacentHTML('beforeend', displayFiltre)
        })
    })
}

//*************************************************************************************************************************/
//************************************************** Bouton Logout/LogIn **************************************************/
//*************************************************************************************************************************/

/**
 * Fonction principale qui gère l'affichage en fonction de la présence du token.
 * @async
 * @returns {Promise<void>}
 */
const main = async () => {
    if (token) {
        editionMode()
        logOut()
    } else {
        categoriesBoutons()
    }
}
window.addEventListener("load", main)

/**
 * Active le mode édition en modifiant l'interface utilisateur.
 */
const editionMode = () => {
    logInOutBtn.textContent = "logout"
    const bannerEdition = document.createElement("div")

    document.body.prepend(bannerEdition)

    const banner = `
        <p class="banner-edition"><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>
    `

    bannerEdition.insertAdjacentHTML("beforeend", banner)

    document.body.classList.add("banner-active")
    lienModale.insertAdjacentHTML('beforeend', '<i class="fa-regular fa-pen-to-square"></i> modifier')
}

/**
 * Gère la déconnexion en supprimant le token et en redirigeant l'utilisateur vers la page d'accueil.
 */
const logOut = () => {
    logInOutBtn.addEventListener("click", (event) => {
        event.preventDefault()

        localStorage.removeItem("token")
        localStorage.removeItem("userId")

        window.location.href = "index.html"

        logInOutBtn.textContent = "login"
    })
}
