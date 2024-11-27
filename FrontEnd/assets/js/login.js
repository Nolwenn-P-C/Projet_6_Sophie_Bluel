//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { connexionApi } from './API.js'

//*************************************************************************************************************************/
//******************************************************* Connexion *******************************************************/
//*************************************************************************************************************************/

// Fonction pour gérer la connexion
function connexion() {
    const logInFormulaire = document.querySelector(".logInFormulaire")
    // Vérifie si le formulaire existe
    if (!logInFormulaire) {
        // Log une erreur si le formulaire n'est pas trouvé
        console.error("Le formulaire de connexion est introuvable dans le DOM")
        return
    }
    // Ajoute un écouteur d'événements sur le formulaire pour détecter la soumission
    logInFormulaire.addEventListener("submit", async (event) => {
        event.preventDefault()
        // Création de l'objet identifiant avec les données saisies dans les champs email et mot de passe
        const identifiant = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        }
        try {
            const identification = await connexionApi(identifiant) // Appel à l'API pour tenter une connexion
            // Vérifie si la réponse est valide
            if (!identification.ok) {
                // Sélectionne l'élément d'erreur dans le DOM
                let erreur = document.querySelector(".message-erreur")
                // Si aucun message d'erreur n'est présent, crée un nouvel élément pour afficher l'erreur
                if (!erreur) {
                    logInFormulaire.insertAdjacentHTML('beforeend', '<p class="message-erreur">Erreur dans l’identifiant ou le mot de passe</p>')
                }
            } else {
                // Récupération des données de la réponse en JSON si la connexion est réussie
                const data = await identification.json()
                console.log("Connexion réussie :", data) // Log les données de la réponse
                // Stocke le token et l'ID utilisateur dans le localStorage
                localStorage.setItem("userId", data.userId)
                localStorage.setItem("token", data.token)
                // Redirige vers la page d'accueil
                location.href = "../../index.html"
            }
        } catch (err) {
            console.error("Une erreur s'est produite lors de la connexion :", err) // Log l'erreur dans la console
            // Afficher un message d'erreur générique en cas d'échec de la requête
            let erreur = document.querySelector(".message-erreur")
            if (!erreur) {
                erreur = document.createElement("p")
                erreur.textContent = "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
                erreur.classList.add("message-erreur")
                logInFormulaire.appendChild(erreur) // Ajoute le message d'erreur au formulaire
            }
        }
    })
}

// Attend que le DOM soit complètement chargé avant d'exécuter la fonction connexion
document.addEventListener("DOMContentLoaded",  () => {
    // Sélectionne le formulaire de connexion dans le DOM
    const formulaire = document.querySelector(".logInFormulaire")
    // Vérifie si le formulaire existe
    if (!formulaire) {
        console.error("Le formulaire de connexion est introuvable dans le DOM") // Log une erreur si le formulaire n'est pas trouvé
    } else {
        console.log("Formulaire trouvé", formulaire) // Log que le formulaire a été trouvé
        connexion() // Appelle la fonction connexion
    }
})
