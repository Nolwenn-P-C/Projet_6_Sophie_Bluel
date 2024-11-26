// Fonction pour récupérer les catégories depuis l'API
export async function categoriesApi() {
    try {
        // Fait une requête GET à l'API pour obtenir les catégories
        const reponse = await fetch("http://localhost:5678/api/categories")
        // Vérifie si la réponse est OK
        if (!reponse.ok) throw new Error("Erreur lors de la récupération des catégories")
        const categories = await reponse.json() // Convertit la réponse en JSON
        return categories // Retourne les catégories
    } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err) // Log l'erreur dans la console
        throw err // Relance l'erreur pour gestion côté appelant
    }
}

// Fonction pour récupérer les projets depuis l'API
export async function getWorks() {
    try {
        // Fait une requête GET à l'API pour obtenir les projets
        const response = await fetch("http://localhost:5678/api/works")
        // Vérifie si la réponse est OK
        if (!response.ok) throw new Error("Erreur lors de la récupération des projets")
        const works = await response.json() // Convertit la réponse en JSON
        return works // Retourne les projets
    } catch (err) {
        // Log l'erreur dans la console
        console.error("Erreur lors de la récupération des projets :", err)
        throw err // Relance l'erreur pour gestion côté appelant
    }
}

// Fonction pour se connecter à l'API avec les identifiants fournis
export async function connexionApi(identifiant) {
    // Convertit l'objet identifiant en chaîne JSON pour l'envoi
    const chargeUtile = JSON.stringify(identifiant)
    console.log("Charge utile envoyée :", chargeUtile) // Log le payload envoyé
    try {
        // Fait une requête POST à l'API pour se connecter
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: chargeUtile,
        })
        // Vérifie si la réponse est OK
        if (!response.ok) throw new Error("Erreur lors de la connexion")
        return response // Retourne la réponse
    } catch (err) {
        console.error("Erreur lors de la connexion :", err) // Log l'erreur dans la console
        throw err // Relance l'erreur pour gestion côté appelant
    }
}

// Fonction pour supprimer un travail depuis l'API
export async function supprimerTravauxApi(id) {
    // Récupère le token depuis le localStorage
    const token = localStorage.getItem("token")
    try {
        // Fait une requête DELETE à l'API pour supprimer un travail
        const supprimer = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!supprimer.ok) throw new Error("Échec de la suppression du travail") // Vérifie si la réponse est OK
        return supprimer // Retourne la réponse
    } catch (err) {
        console.error("Erreur lors de la suppression du travail :", err) // Log l'erreur dans la console
        throw err // Relance l'erreur pour gestion côté appelant
    }
}

