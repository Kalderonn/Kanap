// Si mon local storage est vide modification du front, sinon parse mon localStorage
const getLocalStorage = () => {
  let basket = localStorage.getItem("basket");
  // si le basket n'éxiste pas getItem retourne un null
  // donc si le panier est vide on retourne un panier vie (tableau vide), s'il n'est pas vide on retoune la valeur associée à la clé basket transformé en objet
  if (basket == null) {
    const cartTitle = document.querySelector("h1");
    const cartPrice = document.querySelector(".cart__price");
    const cartForm = document.querySelector(".cart__order");
    cartPrice.style.display = "none";
    cartForm.style.display = "none";
    cartTitle.textContent = "Votre panier est vide";
    return [];
  } else {
    return JSON.parse(basket);
  }
};

// getLocalStorage();
// console.log(getLocalStorage());
// let productsData = []
// Récupération des données de l'API
const getProductsData = async () => {
    await fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        productsData = data;
      //   console.log(productsData);
      });
  };

// getProductsData()
const iterBasket = async () => {
  let basketData = getLocalStorage();
  await getProductsData();
//   console.log(productsData);
//   console.log(basketData);
  basketData.forEach(product => {
    const foundSameId = productsData.find((id) => product.id === id._id);
    console.log(foundSameId)
      basketDisplayTemplate(product, foundSameId)
  });

};
iterBasket();
// Affichage du panier
const basketDisplayTemplate = (dataBasket, dataApi) => {
  document.getElementById("cart__items").innerHTML += `
        <article class="cart__item" data-id="${dataBasket.id}" data-color="${dataBasket.colorSelected}">
            <div class="cart__item__img">
              <img src="${dataApi.imageUrl} " alt="${dataApi.altTxt} ">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${dataApi.name} </h2>
                <p>${dataBasket.colorSelected} </p>
                <p>${dataApi.price} </p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${dataBasket.quantitySelected}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
        </article>`;
};
