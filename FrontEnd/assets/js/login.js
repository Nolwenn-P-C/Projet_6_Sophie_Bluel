//*************************************************************************************************************************/
//************************************************* Récupération des API **************************************************/
//*************************************************************************************************************************/

import { connexionApi } from './API.js'

//*************************************************************************************************************************/
//******************************************************* Connexion *******************************************************/
//*************************************************************************************************************************/

/**
 * Fonction pour gérer la connexion.
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

            if (!identification.ok) {
                let erreur = document.querySelector(".message-erreur")

                if (!erreur) {
                    logInFormulaire.insertAdjacentHTML('beforeend', '<p class="message-erreur">Erreur dans l’identifiant ou le mot de passe</p>')
                }
            } else {
                const connexion = await identification.json()

                sessionStorage.setItem("userId", connexion.userId)
                sessionStorage.setItem("token", connexion.token)

                location.href = "../../index.html"
            }
        } catch (err) {
            console.error("Une erreur s'est produite lors de la connexion :", err)
            let erreur = document.querySelector(".message-erreur")
            if (!erreur) {
                erreur = document.createElement("p")
                erreur.textContent = "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
                erreur.classList.add("message-erreur")
                logInFormulaire.appendChild(erreur)
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const formulaire = document.querySelector(".logInFormulaire")

    if (!formulaire) {
        console.error("Le formulaire de connexion est introuvable dans le DOM")
    } else {
        connexion()
    }
})
