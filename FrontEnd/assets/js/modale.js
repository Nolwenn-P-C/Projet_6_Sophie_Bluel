//*************************************************************************************************************************/
//**************************************************blabla **************************************************/
//*************************************************************************************************************************/

const modale = document.querySelector("#modale")
const lienModale = document.querySelector(".lien-modale")

lienModale.addEventListener ("click", () => {

    let modaleContenuGalleyPhoto = `
        <aside id="modale" class="modal js-modal" aria-hidden="true" aria-labelledby="title_modal">
            <div class="modale-conteneur">
                <i class="fa-solid fa-xmark modale-fermer"></i>
                <h3 id="modale-titre">Galerie Photos</h3>
            <div class="modale-gallerie" id="modaleGallerie">
        </aside>
    `
    modale.insertAdjacentHTML('beforeend', modaleContenuGalleyPhoto)
})