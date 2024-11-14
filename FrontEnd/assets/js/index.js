//*************************************************************************************************************************/
//**************************************************Récupération des API **************************************************/
//*************************************************************************************************************************/

 async function boutonCategorie(){
    // Récupère les données des catégories depuis l'API
    const reponse = await fetch("http://localhost:5678/api/categories")
    let categories = await reponse.json()
    return categories // Retourne les catégories pour les utiliser ailleurs
}
boutonCategorie()


async function getWorks (){
    // Récupère les données des projets depuis l'API
    let a = await fetch("http://localhost:5678/api/works")
    let works = await a.json()
    return works // Retourne les données pour les utiliser ailleurs
}
getWorks()


//*************************************************************************************************************************/
//***************************************************Affichage des projets ************************************************/
//*************************************************************************************************************************/

async function mesProjets(){
    try{
        // Récupère les données des projets
        let works = await getWorks()
        let display = ''
        // Parcourt chaque projet (figure) et crée un bloc HTML pour l'affichage
        for (let figure of works){
            console.log(figure) // Affiche chaque projet dans la console pour vérification
            
            // Ajoute le code HTML de la figure dans la variable `display`
            display += `
                <figure>
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption> ${figure.title} </figcaption>
                </figure>
            `
        }
        document.querySelector('.gallery').insertAdjacentHTML("beforeend", display) // insertion des éléments dans la galerie
    }catch (err) {console.log(err)} // Affiche l'erreur en cas de problème
}
mesProjets()


//*************************************************************************************************************************/
//**********************************************Création des boutons filtres **********************************************/
//*************************************************************************************************************************/

const filtres = document.querySelector(".filtres")

async function displayCategorieBouton(){
    //création du bouton Tous
    const btnAll = document.createElement("button")
    btnAll.textContent = "Tous"
    btnAll.id = "0"; // ID spécial pour indiquer que ce bouton affiche tous les projets
    btnAll.classList.add("boutonsFiltre")
    filtres.appendChild(btnAll); // Ajoute le bouton "TOUS" à l'élément des filtres
    
    //création des autres boutons
    const categories = await boutonCategorie() // Récupère les catégories
    categories.forEach((categorie) => {
        const btn = document.createElement("button") // Crée un nouveau bouton pour la catégorie
        btn.textContent = categorie.name // Met le nom de la catégorie pour le texte du bouton
        btn.classList.add("boutonsFiltre")
        btn.id = categorie.id // Attribue l'ID de la catégorie au bouton
        filtres.appendChild(btn) // Ajoute le bouton de catégorie à l'élément des filtres
    })
} 
displayCategorieBouton()


//*************************************************************************************************************************/
//****************************************Affichage et fonctionnement des filtres *****************************************/
//*************************************************************************************************************************/

 async function filtreCategorie() {
    const works = await getWorks() // Récupère tous les projets pour appliquer les filtres
    const boutons = document.querySelectorAll(".filtres button") // Sélectionne tous les boutons de filtres

    // Parcourt chaque bouton et lui ajoute un écouteur d'événements "click"
    boutons.forEach((bouton) => {
        bouton.addEventListener("click", () => {
            // Récupère l'ID de la catégorie à filtrer
            let btnID = parseInt(bouton.id)
            // Filtre les éléments selon la catégorie
            let filtreWorks
            if (btnID === 0) {
                // Si l'ID est 0, on affiche tous les projets
                filtreWorks = works
            } else {
                // Sinon, on filtre les projets selon la catégorie
                filtreWorks = works.filter(work => work.categoryId === btnID)
            }
            // Mise à jour de la galerie avec les éléments filtrés
            let displayFiltre = ''
            for (let figure of filtreWorks) {
                displayFiltre += `
                    <figure>
                        <img src="${figure.imageUrl}" alt="${figure.title}">
                        <figcaption> ${figure.title} </figcaption>
                    </figure>
                `
            }
            document.querySelector('.gallery').innerHTML = displayFiltre; // Remplace le contenu de la galerie
        });
    });
}
filtreCategorie()


//*************************************************************************************************************************/
//************************************************** Bouton Logout/LogIn **************************************************/
//*************************************************************************************************************************/

const logInOutBtn =  document.querySelector(".logInOut")
const token = localStorage.getItem("token")
const btnsCategories = document.querySelectorAll(".boutonsFiltre")
const btnEdit = document.querySelector(".edit")


// Vérifie si le token est présent dans le localStorage (signe que l'utilisateur est connecté) 
if (token) {
    editionMode() // Active le mode édition si le token existe
    logOut() // Configure la déconnexion de l'utilisateur
}

//afficher le mode édition
function editionMode() {
	logInOutBtn.textContent = "logout" // Change le texte du bouton en "logout" pour indiquer la possibilité de se déconnecter
	const bannerEdition = document.createElement("div")
	let banner = ''
    // Déclare la structure HTML du contenu du banner avec un texte et une icône
    banner = `
        <p class="bannerEdition"><i class="fa-regular fa-pen-to-square"></i>Mode édition<p>
        `
    // Insère le banner en haut de la page (dans <body>), juste avant les autres éléments
    // Puis ajoute le contenu HTML défini dans `banner` dans `bannerEdit`
	document.body.prepend(bannerEdition).insertAdjacentHTML("beforeend", banner)
    // Masque tous les boutons de catégorie pour simplifier l'interface en mode édition
    btnsCategories.forEach(btn => {
        btn.style.display = "none"
    });
}


//fonction pour se déconnecter
function logOut() {
	logInOutBtn.addEventListener("click", (event) => {
        // Empêche le comportement par défaut du bouton (pour éviter une redirection non désirée)
        event.preventDefault() 
        // Supprime les données de session (userId et token) pour déconnecter l'utilisateur
		localStorage.removeItem("token")
        // Redirige l'utilisateur vers la page d'accueil (index.html) après la déconnexion
		window.location.href = "index.html" 
	})
}