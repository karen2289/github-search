// Obtener el formulario
const form = document.getElementById("form");

//Obtener la barra de busqueda
const search = document.getElementById("search");

//Obtener el widget del usuario
const userCard = document.getElementById("usercard");

//Escuchar el evento submit del form
// e = evento

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = search.value;
  getUserData(username);
  search.value = "";
});

// Obtener la info del usuario en GitHub
// Usamos "try - catch" para que capture el error
async function getUserData(username) {
  const API = "https://api.github.com/users/";

  try {
    const userRequest = await fetch(API + username);

    // Si hay un algun error entramos en el catch
    //Obtenemos User
    if (!userRequest.ok) {
        //lanzamos el STATUS
        throw new Error(userRequest.status);
    }

    const userData = await userRequest.json();

    //Obtenemos repos
    if (userData.public_repos) {
      const reposRequest = await fetch(API + username + "/repos");
      const reposData = await reposRequest.json();

      userData.repos = reposData;
    }

    showUserData(userData);

  } catch (error) {
      showError(error.message);
  }
}

// Funcion para componer e hidratar el HTML del widget
// Cambien const por let
function showUserData(userData){
    let userContent = `
            <img src="${userData.avatar_url}" alt="">
            <h1>${userData.name}</h1>
            <p>${userData.bio}</p>

            <section class="data">
                <ul>
                    <li>Followers: ${userData.followers}</li>
                    <li>Following: ${userData.following}</li>
                    <li>Repos: ${userData.public_repos}</li>
                </ul>
            </section>

            
        `;

    if(userData.repos){
        userContent += `<section class="repos">`;
        
        //Slice() sirve para decirle un inicio y un final y no que nos muestre todos los repos que tenemos
        userData.repos.slice(0, 7).forEach(repo => {
            userContent += `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        });

        userContent +=`</section>`;
    }


        userCard.innerHTML = userContent;
}

//Hay que crear una funcion para gestionar los errores
function showError(error){

    let errorContent = `<h1>Error ⚠ ${error}</h1>`;

    userCard.innerHTML = errorContent;
};