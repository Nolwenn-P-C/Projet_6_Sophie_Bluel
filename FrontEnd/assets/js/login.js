 //*************************Connexion *************************/
function connexion(){
    const logInFormulaire = document.querySelector(".logInFormulaire")
     
    // Ajoute un écouteur d'événements sur le formulaire pour détecter la soumission
    logInFormulaire.addEventListener("submit", event => {
        event.preventDefault(); // Empêche le comportement par défaut de rechargement de la page lors de la soumission du formulaire 

        // Création de l'objet identifiant avec les données saisies dans les champs email et mot de passe 
        const identifiant = {
            email: event.target.querySelector("[name=email").value,
            password: event.target.querySelector("[name=password]").value,
        }
        // Convertit l'objet identifiant en chaîne JSON pour envoi
        const chargeUtile= JSON.stringify(identifiant)
        console.log(chargeUtile)

        // Appel à l'API pour vérifier les identifiants de connexion
        fetch ("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: chargeUtile
        })
        .then (data =>{
            console.log(data);  // Affiche la réponse du serveur
            if (data.ok){
                localStorage.setItem("token", data.token);
                // Redirection vers la page modèle
                location.href = "../../index.html";
                console.log(data.token);
            } else{
                // Vérifie si un message d'erreur est déjà affiché, pour éviter les doublons
                let erreur = document.querySelector(".message-erreur");
                
                // Si aucun message d'erreur n'est présent, crée un nouvel élément pour afficher l'erreur
                if (!erreur) {
                erreur = document.createElement("p")
                erreur.textContent = "Erreur dans l’identifiant ou le mot de passe"
                erreur.classList.add("message-erreur")
                const form = document.querySelector("form")
                form.appendChild(erreur) 
                }
            } 
        }) .catch((err) => {
            console.log(err);
          });
    }) 
    
}
connexion()
 
