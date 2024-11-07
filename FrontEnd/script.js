  //*************************Récupérer les projets *************************/
 async function getWorks (){
    // Récupère les données des projets depuis l'API
    let a = await fetch("http://localhost:5678/api/works")
    let data = await a.json()
    return data // Retourne les données pour les utiliser ailleurs
}
getWorks()



//*************************Création des boutons filtres *************************/
const filtres = document.querySelector(".filtres")

async function boutonCategorie(){
    // Récupère les données des catégories depuis l'API
    const reponse = await fetch("http://localhost:5678/api/categories")
    let categories = await reponse.json()
    return categories // Retourne les catégories pour les utiliser ailleurs
}
boutonCategorie()

async function displayCategorieBouton(){
    //création du bouton Tous
    const btnAll = document.createElement("button");
    btnAll.textContent = "TOUS";
    btnAll.id = "0"; // ID spécial pour indiquer que ce bouton affiche tous les projets
    filtres.appendChild(btnAll); // Ajoute le bouton "TOUS" à l'élément des filtres
    
    //création des autres boutons
    const categories = await boutonCategorie() // Récupère les catégories
    categories.forEach((categorie) => {
        const btn = document.createElement("button"); // Crée un nouveau bouton pour la catégorie
        btn.textContent = categorie.name.toUpperCase(); // Met le nom de la catégorie en majuscules pour le texte du bouton
        btn.id = categorie.id; // Attribue l'ID de la catégorie au bouton
        filtres.appendChild(btn); // Ajoute le bouton de catégorie à l'élément des filtres
    });
}
displayCategorieBouton()



 //*************************Affichage des projets *************************/
async function mesProjets(){
    try{
        // Récupère les données des projets
        let data = await getWorks();
        let display = ''
        // Parcourt chaque projet (figure) et crée un bloc HTML pour l'affichage
        for (let figure of data){
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

