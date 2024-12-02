//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { connexionApi } from './API.js'

//*************************************************************************************************************************/
//******************************************************* Connexion *******************************************************/
//*************************************************************************************************************************/

/**
 * Gère la soumission du formulaire de connexion.
 * Valide les identifiants, effectue une requête à l'API et gère les réponses.
 */
const connexion = () => {
    const logInFormulaire = document.querySelector(".logInFormulaire")

    if (!logInFormulaire) {
        return
    }

    logInFormulaire.addEventListener("submit", async (event) => {
        event.preventDefault()

        const identifiant = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        }
        try {
            const identification = await connexionApi(identifiant)

            if (identification.ok) {
               const connexion = await identification.json()

                sessionStorage.setItem("userId", connexion.userId)
                sessionStorage.setItem("token", connexion.token)

                location.href = "../../index.html"
            }
        } catch (err) {
            console.error("Une erreur s'est produite lors de la connexion :", err)
            let erreur = document.querySelector(".message-erreur")
            if (!erreur) {
                logInFormulaire.insertAdjacentHTML('beforeend', '<p class="message-erreur">Erreur dans l’identifiant ou le mot de passe</p>')
            }
        }
    })
}

/**
 * Initialise la gestion de la connexion lors du chargement complet de la page.
 * Vérifie la présence du formulaire de connexion dans la page.
 */
window.addEventListener("load", () => {
    const formulaire = document.querySelector(".logInFormulaire")

    if (!formulaire) {
        console.error("Le formulaire de connexion est introuvable dans le DOM")
    } else {
        connexion()
    }
})
