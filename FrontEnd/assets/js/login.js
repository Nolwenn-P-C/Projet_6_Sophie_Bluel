//*************************************************************************************************************************/
//******************************************************* Connexion *******************************************************/
//*************************************************************************************************************************/

 function connexion() {
    const logInFormulaire = document.querySelector(".logInFormulaire")
    // Ajoute un écouteur d'événements sur le formulaire pour détecter la soumission

    

    logInFormulaire.addEventListener("submit", async (event) => {
        // Empêche le comportement par défaut de rechargement de la page lors de la soumission du formulaire
        event.preventDefault()
        // Création de l'objet identifiant avec les données saisies dans les champs email et mot de passe
        const identifiant = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        // Convertit l'objet identifiant en chaîne JSON pour l'envoi
        const chargeUtile = JSON.stringify(identifiant)
        console.log(chargeUtile)
        try {
            // Envoi de la requête à l'API avec fetch et attente de la réponse
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: chargeUtile,
            });
            // Vérifie si la réponse est valide
            if (!response.ok) {
                // Affiche un message d'erreur si les identifiants sont incorrects
                let erreur = document.querySelector(".message-erreur")
                // Si aucun message d'erreur n'est présent, crée un nouvel élément pour afficher l'erreur
                if (!erreur) {
                    erreur = document.createElement("p")
                    erreur.textContent = "Erreur dans l’identifiant ou le mot de passe";
                    erreur.classList.add("message-erreur")
                    logInFormulaire.appendChild(erreur) // Ajoute le message d'erreur au formulaire
                }
            } else {
                // Récupération des données de la réponse en JSON si la connexion est réussie
                const data = await response.json()
                console.log(data)
                // Stocke le token dans le localStorage
                localStorage.setItem("userId", data.userId)
                localStorage.setItem("token", data.token)
                // Redirige vers la page d'accueil
                location.href = "../../index.html"
                console.log(userId.token)
                console.log(data.token)
            }
        } catch (err) {
            console.log("Une erreur s'est produite :", err)
        }
    })
}
connexion()

document.addEventListener("DOMContentLoaded", function () {
    const formulaire = document.querySelector(".logInFormulaire")
    if (!formulaire) {
        console.error("Le formulaire de connexion est introuvable dans le DOM")
    } else {
        console.log("Formulaire trouvé", formulaire)
    }
})