export async function boutonCategorie(){
    // Récupère les données des catégories depuis l'API
    const reponse = await fetch("http://localhost:5678/api/categories")
    let categories = await reponse.json()
    return categories // Retourne les catégories pour les utiliser ailleurs
}
boutonCategorie()


export async function getWorks (){
    // Récupère les données des projets depuis l'API
    let a = await fetch("http://localhost:5678/api/works")
    let works = await a.json()
    return works // Retourne les données pour les utiliser ailleurs
}
getWorks()

export async function supprimerTravauxApi(id){
    const token = localStorage.getItem("token")
    // Récupère les données des projets depuis l'API
    const supprimer = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!supprimer.ok) throw new Error("Échec de la suppression du travail") // Vérifie si la réponse est OK, sinon lance une erreur
    return supprimer // Retourne les données pour les utiliser ailleurs
}
