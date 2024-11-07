async function mesProjets(){
    try{
        let a = await fetch("http://localhost:5678/api/works")
        let data = await a.json()
        let display = ''
        for (let figure of data){
            console.log(figure)
            display += `
                <figure>
                    <img src="${figure.imageUrl}" alt="${figure.title}">
                    <figcaption> ${figure.title} </figcaption>
                </figure>
            `
        }
        document.querySelector('.gallery').innerHTML = display
        //document.querySelector('.gallery').insertAdjacentHTML("beforeend", display)
    }catch (err) {console.log(err)}
}
mesProjets()