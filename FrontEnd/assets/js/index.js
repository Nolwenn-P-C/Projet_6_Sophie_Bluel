//*************************************************************************************************************************/
//********************************************************* Init **********************************************************/
//*************************************************************************************************************************/

const filtres = document.querySelector(".filtres")
const logInOutBtn =  document.querySelector(".logInOut")
const token = localStorage.getItem("token")
const userId = localStorage.getItem("userId")
const lienModale = document.querySelector(".lien-modale")


//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { getWorks, boutonCategorie } from './API.js'

//*************************************************************************************************************************/
//************************************************** Affichage des projets ************************************************/
//*************************************************************************************************************************/

export async function mesProjets(){
    try{
        // Récupère les données des projets
        let works = await getWorks()
        let afficher = ''
        // Parcourt chaque projet (figure) et crée un bloc HTML pour l'affichage
        for (let figure of works){
            console.log(figure) // Affiche chaque projet dans la console pour vérification
            
            // Ajoute le code HTML de la figure dans la variable `afficher`
            afficher += `
                <figure>
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption> ${figure.title} </figcaption>
                </figure>
            `
        }
        document.querySelector('.gallery').insertAdjacentHTML("beforeend", afficher) // insertion des éléments dans la galerie
    }catch (err) {
        console.log(err)
    } // Affiche l'erreur en cas de problème
}
mesProjets()


//*************************************************************************************************************************/
//********************************************* Création des boutons filtres **********************************************/
//*************************************************************************************************************************/

async function displayCategorieBouton(){
    
    // Vérifier si les boutons de filtre existent déjà
    if (document.querySelectorAll(".boutonsFiltre").length > 0) {
        console.log("Les boutons de filtre existent déjà. Aucun ajout.")
        return // Ne pas recréer les boutons
    }
    
    //création du bouton Tous
    const btnAll = document.createElement("button")
    btnAll.textContent = "Tous"
    btnAll.id = "0"; // ID spécial pour indiquer que ce bouton affiche tous les projets
    btnAll.classList.add(".boutonsFiltre")
    filtres.appendChild(btnAll); // Ajoute le bouton "TOUS" à l'élément des filtres
    
    // Création des autres boutons
    const categories = await boutonCategorie(); // Récupère les catégories depuis l'API
    categories.forEach((categorie) => {
        const btnHTML = `<button id="${categorie.id}" class="boutonsFiltre">${categorie.name}</button>`;
        filtres.insertAdjacentHTML("beforeend", btnHTML); // Ajoute chaque bouton de catégorie
    });
} 


//*************************************************************************************************************************/
//*************************************** Affichage et fonctionnement des filtres *****************************************/
//*************************************************************************************************************************/

async function filtreCategorie() {
    const works = await getWorks() // Récupère tous les projets pour appliquer les filtres
    const boutons = document.querySelectorAll(".filtres button") // Sélectionne tous les boutons de filtres
    const gallery = document.querySelector('.gallery') // Sélectionne la galerie

    // Parcourt chaque bouton et lui ajoute un écouteur d'événements "click"
    boutons.forEach((bouton) => {
        bouton.addEventListener("click", () => {
            // Récupère l'ID de la catégorie à filtrer
            let btnID = parseInt(bouton.id)
            // Filtre les éléments selon la catégorie
            let filtreWorks;
            if (btnID === 0) {
                // Si l'ID est 0, on affiche tous les projets
                filtreWorks = works
            } else {
                // Sinon, on filtre les projets selon la catégorie
                filtreWorks = works.filter(work => work.categoryId === btnID)
            }
            // Supprime tous les enfants existants de la galerie
            while (gallery.firstChild) {
                gallery.removeChild(gallery.firstChild)
            }
            // Mise à jour de la galerie avec les éléments filtrés
            let displayFiltre = ''
            for (let figure of filtreWorks) {
                displayFiltre += `
                    <figure>
                        <img src="${figure.imageUrl}" alt="${figure.title}">
                        <figcaption> {figure.title}" </figcaption>
                    </figure>
                `
            }
            gallery.insertAdjacentHTML('beforeend', displayFiltre)
        })
    })
}

filtreCategorie()

//*************************************************************************************************************************/
//************************************************** Bouton Logout/LogIn **************************************************/
//*************************************************************************************************************************/

async function main() {
    if (token) {
        editionMode(); // Active le mode édition si nécessaire
        logOut()
    }
    else displayCategorieBouton() // Ne sera exécutée que si le mode édition n'est pas activé
}
main();

//afficher le mode édition
function editionMode() {
	logInOutBtn.textContent = "logout" // Change le bouton en "logout"
	const bannerEdition = document.createElement("div")
    // Insère le banner en haut de la page (dans <body>)
    document.body.prepend(bannerEdition)
    // Ajoute le contenu HTML défini dans banner à l'intérieur de bannerEdition
    const banner = `
        <p class="banner-edition"><i class="fa-regular fa-pen-to-square "></i> Mode édition</p>
    `
    //Ajoute le contenu HTML défini dans banner dans bannerEdit
    bannerEdition.insertAdjacentHTML("beforeend", banner) 
    // Ajoute une classe au body pour signaler que la bannière est présente
    document.body.classList.add("banner-active")
    lienModale.style.visibility = "visible"
}

//fonction pour se déconnecter
function logOut() {
	logInOutBtn.addEventListener("click", (event) => {
        // Empêche le comportement par défaut du bouton (pour éviter une redirection non désirée)
        event.preventDefault() 
        // Supprime les données de session (userId et token) pour déconnecter l'utilisateur
		localStorage.removeItem("token")
        localStorage.removeItem("userId")
        // Redirige l'utilisateur vers la page d'accueil (index.html) après la déconnexion
		window.location.href = "index.html" 
        // Si l'utilisateur n'est pas connecté, assure que le bouton est bien en "login"
        logInOutBtn.textContent = "login"
	})
}