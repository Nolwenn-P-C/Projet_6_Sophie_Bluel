 //*************************Bouton Logout/LogIn *************************/
 const logInOutBtn =  document.querySelector(".logInOut")
 const userId = sessionStorage.getItem("userId")
 const token = sessionStorage.getItem("token")
 const btnsCategories = document.querySelectorAll(".boutonsFiltre")
 const btnEdit = document.querySelector(".edit")

 export function login(){
	// Vérifie si le token est présent dans le sessionStorage (signe que l'utilisateur est connecté) 
	if (token) {
		editionMode() // Active le mode édition si le token existe
		logOut() // Configure la déconnexion de l'utilisateur
	}
}
login()

//afficher le mode édition
function editionMode() {
	logInOutBtn.textContent = "logout" // Change le texte du bouton en "logout" pour indiquer la possibilité de se déconnecter
	const bannerEdit = document.createElement("div")
	let banner = ''
    // Déclare la structure HTML du contenu du banner avec un texte et une icône
    banner = `
        <p class="bannerEdition"><i class="fa-regular fa-pen-to-square"></i>Mode édition<p>
        `
    // Insère le banner en haut de la page (dans <body>), juste avant les autres éléments
    // Puis ajoute le contenu HTML défini dans `banner` dans `bannerEdit`
	document.body.prepend(bannerEdit).insertAdjacentHTML("beforeend", banner)
    // Masque tous les boutons de catégorie pour simplifier l'interface en mode édition
    btnsCategories.forEach(btn => {
        btn.style.display = "none";
    });
}


//fonction pour se déconnecter
function logOut() {
	logInOutBtn.addEventListener("click", (event) => {
        // Empêche le comportement par défaut du bouton (pour éviter une redirection non désirée)
        event.preventDefault() 
        // Supprime les données de session (userId et token) pour déconnecter l'utilisateur
		sessionStorage.removeItem("userId")
		sessionStorage.removeItem("token")
        // Redirige l'utilisateur vers la page d'accueil (index.html) après la déconnexion
		window.location.href = "index.html" 
	})
}