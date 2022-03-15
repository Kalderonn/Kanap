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
  // je sélectionne dans le DOM le boutton supprimer
  const deleteBtn = document.querySelectorAll(".deleteItem");
  // Pour chaque boutton supprimer
  deleteBtn.forEach((btn) => {
    // je stocke les données de l'élément parent article
    const deleteBtnParent = btn.closest("article");
    // J'ajoute un eventListener au click de tous les bouttons supprimer
    btn.addEventListener(`click`, (e) => {
      // Je fais un find pour récupérer uniquement le produit que je souhaite supprimer du DOM
      const productDeleted = basket.find(
        (product) =>
          product.id === deleteBtnParent.dataset.id &&
          product.colorSelected === deleteBtnParent.dataset.color
      );
      // S'il le trouve, il le supprime du DOM
      if (productDeleted) {
        deleteBtnParent.remove();
      }
      // Je filtre le panier du LocalStorage pour qu'il me renvoie un nouveau tableau qui remplit cette condition
      basket = basket.filter(
        (productsInBasket) =>
          productsInBasket.id !== deleteBtnParent.dataset.id ||
          productsInBasket.colorSelected !== deleteBtnParent.dataset.color
      );
      // Je sauvegarde mon nouveau panier que j'injecte dans la fonction saveLocalStorage
      saveLocalStorage(basket);
      getLocalStorage();
    });
  });
};

// Modifier la quantité
const modifyQuantity = () => {
  // je récupère mon localStarage
  let basket = getLocalStorage();
  // Je cible l'input du DOM qui dans  lequel l'utilisateur change la quantité
  const inputQuantity = document.querySelectorAll(".itemQuantity");
  // Pour chaque input
  inputQuantity.forEach((input) => {
    // Je récupère les éléments <article> parents
    const inputQuantityParent = input.closest("article");
    // J'écoute mes input au changement
    input.addEventListener("change", (e) => {
      // Je stocke la valeur modifée de l'input sélectionné
      let quantityChange = e.target.value;
      // Dans mon Basket, je récupère les données de mon produit par un find qui respecte cette condition
      const resultFindIdAndColor = basket.find((p) => p.id == inputQuantityParent.dataset.id && p.colorSelected == inputQuantityParent.dataset.color);
      // S'il le trouve, je modifie sa quantité avec la nouvelle valeur de l'input
      if (resultFindIdAndColor) {
        resultFindIdAndColor.quantitySelected = quantityChange
      }
      // Et je sauve dans mon localStorage
      saveLocalStorage(basket)
    });
  });
};

  // basket.forEach((product) =>{
  //   product.quantitySelected += product.quantitySelected;
  //   console.log(product.quantitySelected);
  // })
