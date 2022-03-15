// Sauvegarde du panier dans le localStorage avec en paramètre le panier que je souhaite enregistrer (ici basket)
const saveLocalStorage = (basket) => {
  localStorage.setItem("basket", JSON.stringify(basket));
};

// Si mon local storage est vide modification du front, sinon parse mon localStorage
const getLocalStorage = () => {
  let basket = localStorage.getItem("basket");
  // si le basket n'éxiste pas getItem retourne un null
  // donc si le panier est vide on retourne un panier vide (tableau vide), s'il n'est pas vide on retoune la valeur associée à la clé basket transformé en objet
  if (basket == null || basket == "[]") {
    const cartTitle = document.querySelector("h1");
    const cartPrice = document.querySelector(".cart__price");
    const cartForm = document.querySelector(".cart__order");
    cartPrice.style.display = "none";
    cartForm.style.display = "none";
    cartTitle.textContent = "Votre panier est vide";
    return [];
    // sinon Je parse mon panier
  } else {
    return JSON.parse(basket);
  }
};
getLocalStorage();
// Récupération des données de l'API
const getProductsData = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      productsData = data;
    });
};

// Récupération des données basket + Api et injection dans la fonction basketDisplayTemplate
const basketDisplay = async () => {
  // je récupère les données de mon localStorage
  let basketData = getLocalStorage();
  console.log(basketData);
  // Je récupère les données de l'Api
  await getProductsData();
  // Pour chaque produit dans le LocalStorage
  basketData.forEach((product) => {
    // Je fais un find sur productsDada(Api) des produits avec la meme Id pour récupérer les données et les stocker
    const foundSameId = productsData.find((id) => product.id === id._id);
    console.log(foundSameId);
    // J'injecte les données du localStorage et de l'Api en paramètre dans la fonction basketDisplayTemplate
    basketDisplayTemplate(product, foundSameId);
  });
  removeProductbasket();
  modifyQuantity();
};

basketDisplay();

// affichage des éléments du panier
const basketDisplayTemplate = (product, foundSameId) => {
  document.getElementById("cart__items").innerHTML += `
        <article class="cart__item" data-id="${product.id}" data-color="${product.colorSelected}">
            <div class="cart__item__img">
              <img src="${foundSameId.imageUrl} " alt="${foundSameId.altTxt} ">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${foundSameId.name} </h2>
                <p>${product.colorSelected} </p>
                <p>${foundSameId.price} </p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantitySelected}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
        </article>`;
};
// basketProductData();

// Supprimer un produit
const removeProductbasket = () => {
  // je récupère mon panier
  let basket = getLocalStorage();
  // console.log(basket);
  // je sélectionne dans le DOM le boutton supprimer
  const deleteBtn = document.querySelectorAll(".deleteItem");
  // console.log(deleteBtn);
  // Pour chaque boutton supprimer
  deleteBtn.forEach((btn) => {
    // je stocke les données de l'élément parent article
    const deleteBtnParent = btn.closest("article");
    console.log(deleteBtnParent);
    // J'ajoute un eventListener au click de tous les bouttons supprimer
    btn.addEventListener(`click`, (e) => {
      const productDeleted = basket.find(
        (product) =>
          product.id === deleteBtnParent.dataset.id &&
          product.colorSelected === deleteBtnParent.dataset.color
      );
      console.log(productDeleted);
      if (productDeleted) {
        // saveLocalStorage(newBasket);
        deleteBtnParent.remove();
      }
      // Je filtre le panier du LocalStorage pour qu'il me renvoie un nouveau tableau qui remplit cette condition et je le stocke
      basket = basket.filter(
        (productsInBasket) =>
          productsInBasket.id !== deleteBtnParent.dataset.id ||
          productsInBasket.colorSelected !== deleteBtnParent.dataset.color
      );
      console.log(e);
      console.log(basket);
      // Je sauvegarde mon nouveau panier que j'injecte dans la fonction saveLocalStorage
      saveLocalStorage(basket);
      getLocalStorage();
      //Refresh
      // location.reload();
    });
  });
};

// Modifier la quantité
const modifyQuantity = () => {
  let basket = getLocalStorage();
  // basket.forEach((product) =>{
  //   product.quantitySelected += product.quantitySelected;
  //   console.log(product.quantitySelected);
  // })

  const inputQuantity = document.querySelectorAll(".itemQuantity");
  console.log(inputQuantity);
  inputQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const quantityChange = e.target.value;

      // let quantityProductBasket = basket.quantitySelected;
      // console.log(quantityProductBasket);
      console.log(quantityChange);
      // console.log(e.inputQuantity.value)
    });
  });
};

// const productDeleted = basket.find(
//   (product) =>
//     product.id === deleteBtnParent.dataset.id &&
//     product.colorSelected === deleteBtnParent.dataset.color
// );
// console.log(productDeleted);
// if (productDeleted) {
//   saveLocalStorage(newBasket);
//   deleteBtnParent.remove();
// }
// console.log(e);
