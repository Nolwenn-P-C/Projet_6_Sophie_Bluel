const baseURL = 'http://localhost:5678/api'

/**
 * Récupère les catégories depuis l'API.
 * @async
 * @returns {Promise<Array>} Les catégories récupérées.
 * @throws {Error} Si la récupération des catégories échoue.
 */
export const categoriesApi = async () => {
    try {
        const reponse = await fetch(baseURL + "/categories")

        if (!reponse.ok) throw new Error("Erreur lors de la récupération des catégories")
        const categories = await reponse.json()
        return categories
    } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err)
        throw err
    }
}

/**
 * Récupère les travaux depuis l'API.
 * @async
 * @returns {Promise<Array>} Les travaux récupérés.
 * @throws {Error} Si la récupération des travaux échoue.
 */
export const getWorks = async () => {
    try {
        const reponse = await fetch(baseURL + "/works")

        if (!reponse.ok) throw new Error("Erreur lors de la récupération des projets")
        const works = await reponse.json()
        return works
    } catch (err) {
        console.error("Erreur lors de la récupération des projets :", err)
        throw err
    }
}

/**
 * Effectue la connexion de l'utilisateur via l'API.
 * @async
 * @param {Object} identifiant - Les identifiants de connexion.
 * @returns {Promise<Response>} La réponse de l'API.
 * @throws {Error} Si la connexion échoue.
 */
export const connexionApi = async (identifiant) => {
    const chargeUtile = JSON.stringify(identifiant)
    try {
        const reponse = await fetch(baseURL + "/users/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: chargeUtile,
        })

        if (!reponse.ok) throw new Error("Erreur lors de la connexion")
        return reponse
    } catch (err) {
        console.error("Erreur lors de la connexion :", err)
        throw err
    }
}

/**
 * Supprime un travail via l'API.
 * @async
 * @param {number} id - L'identifiant du travail à supprimer.
 * @returns {Promise<Response>} La réponse de l'API.
 * @throws {Error} Si la suppression du travail échoue.
 */
export const supprimerTravauxApi = async (id) => {
    const token = sessionStorage.getItem("token")
    try {
        const supprimer = await fetch(baseURL + `/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!supprimer.ok) throw new Error("Échec de la suppression du travail")
        return supprimer
    } catch (err) {
        console.error("Erreur lors de la suppression du travail :", err)
        throw err
    }
}

/**
 * Ajoute un projet via l'API.
 * @async
 * @param {Event} e - L'événement de soumission du formulaire.
 * @returns {Promise<void>}
 * @throws {Error} Si l'ajout du projet échoue.
 */
export const ajouterProjetApi = async (e) => {
    e.preventDefault()
    const formulaireAjoutTravaux = document.getElementById("formulaire-ajout-travaux")

    if (!formulaireAjoutTravaux) {
        return
    }
    const formData = new FormData(formulaireAjoutTravaux)
    try {
        const token = sessionStorage.getItem("token")

        const response = await fetch(baseURL + "/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

    } catch (err) {
        console.error("Erreur pour l'ajout du travail :", err)
        throw err
    }
}
