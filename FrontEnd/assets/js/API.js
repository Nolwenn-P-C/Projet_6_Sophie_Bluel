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


