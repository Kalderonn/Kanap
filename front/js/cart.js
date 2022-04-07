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
      modifyQuantity();
      totalQuantity();
      totalPrice();
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
    // J'écoute mes inputs au changement
    input.addEventListener("change", (e) => {
      // Je stocke la valeur modifée de l'input "en focus"
      let quantityChange = e.target.value;
      // Dans mon Basket, je récupère les données de mon produit par un find qui respecte cette condition
      const resultFindIdAndColor = basket.find(
        (p) =>
          p.id === inputQuantityParent.dataset.id &&
          p.colorSelected === inputQuantityParent.dataset.color
      );
      // S'il le trouve, je modifie sa quantité avec la nouvelle valeur de l'input
      if (resultFindIdAndColor) {
        resultFindIdAndColor.quantitySelected = parseInt(quantityChange);
      }
      // Et je sauve dans mon localStorage
      saveLocalStorage(basket);
      getLocalStorage();
      totalQuantity();
      totalPrice();
    });
  });
};

// Calcule du nombre total d'articles
const totalQuantity = () => {
  const basket = getLocalStorage();
  const totalProduct = document.getElementById("totalQuantity");
  console.log(totalProduct);
  let quantityTotal = 0;
  basket.forEach((product) => {
    quantityTotal += parseInt(product.quantitySelected);
  });
  totalProduct.innerText = quantityTotal;
  console.log(quantityTotal);
};
totalQuantity();

// Calcule du prix total
const totalPrice = async () => {
  const basket = getLocalStorage();
  await getProductsData();
  const priceBasket = document.getElementById("totalPrice");
  let total = 0;
  basket.forEach((product) => {
    const foundSameId = productsData.find((id) => product.id === id._id);
    total += parseInt(product.quantitySelected) * parseInt(foundSameId.price);
  });
  priceBasket.innerText = total;
  console.log(total);
};

totalPrice();

// Envoi des infos client
const postForm = () => {
  // Je pointe mon formulaire
  const form = document.querySelector(".cart__order__form");

  // je récupère les données du formulaire dans un objet
  const infosClient = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };

  // Je récupère mon panier
  const basket = getLocalStorage();

  // Construction du tableau d'Id du panier
  let productsId = [];
  basket.forEach((product) => {
    productsId.push(product.id);
  });

  // La requète POST doit contenir un objet contact et un tableau d'Id de produits
  const contactAndProducts = {
    contact: infosClient,
    products: productsId,
  };

  // requète POST API
  const postApi = () => {
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(contactAndProducts),
    })
      .then((res) => res.json())
      .then((orderData) => {
        // redirection vers la page de confirmation en injectant l'ID de commande dans l'URL
        window.location.href = `confirmation.html?orderId=${orderData.orderId}`;
      })
      .catch((err) => {
        alert(
          "Notre service de commande est temporairement indisponible, veuillez nous contacter par téléphone ou par mail"
        );
        console.log(err);
      });
  };
  postApi();
};

// Validation du formulaire
const validForm = () => {
  // Récupération du formulaire
  const form = document.querySelector(".cart__order__form");
  // Ecoute des evenements du bouton submit
  form.addEventListener("submit", (e) => {
    // Désactivation du comportement par défaut
    e.preventDefault();

    // récupération des valeurs des différents inputs du formulaire
    const firstNameInput = form.firstName.value;
    const lastNameInput = form.lastName.value;
    const addressInput = form.address.value;
    const cityInput = form.city.value;
    const emailInput = form.email.value;

    // Création RegExp pour l'email
    const emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
    // Création RegExp pour firstName, lastName, city
    const noNumberRegExp = new RegExp("^[A-Za-z-À-ÖØ-öø-ÿ]{3,}$");
    // Création RegExp pour l'address
    const addressRegExp = new RegExp("^([0-9]*)([a-zA-ZÀ-ÖØ-öø-ÿ,-. ]{3,})([0-9]{5})$");

    // récupération des résultats des tests RegExp
    const testFirstName = noNumberRegExp.test(firstNameInput);
    const testLastName = noNumberRegExp.test(lastNameInput);
    const testAddress = addressRegExp.test(addressInput);
    const testCity = noNumberRegExp.test(cityInput);
    const testEmail = emailRegExp.test(emailInput);

    // Validation du prénom
    const errorFirstNameMsg = document.getElementById("firstNameErrorMsg");
    if (testFirstName === true) {
      errorFirstNameMsg.innerHTML = "";
    } else {
      errorFirstNameMsg.innerHTML = "veuillez saisir votre prénom svp.";
    }

    // Validation du Nom
    const errorLastNameMsg = document.getElementById("lastNameErrorMsg");
    if (testLastName === true) {
      errorLastNameMsg.innerHTML = "";
    } else {
      errorLastNameMsg.innerHTML = "veuillez saisir votre nom svp.";
    }

    // Validation de l'adresse
    const errorAddressMsg = document.getElementById("addressErrorMsg");
    if (testAddress === true) {
      errorAddressMsg.innerHTML = "";
    } else {
      errorAddressMsg.innerHTML =
        "veuillez saisir votre adresse avec votre code postal svp.";
    }

    // validation de la ville
    const errorCityMsg = document.getElementById("cityErrorMsg");
    if (testCity === true) {
      errorCityMsg.innerHTML = "";
    } else {
      errorCityMsg.innerHTML = "veuillez saisir votre ville svp.";
    }

    // Validation de l'email
    const errorEmailMsg = document.getElementById("emailErrorMsg");
    if (testEmail === true) {
      errorEmailMsg.innerHTML = "";
    } else {
      errorEmailMsg.innerHTML = "veuillez saisir votre email svp.";
    }

    if ((testFirstName && testLastName && testAddress && testCity && testEmail) === true) {
      postForm();
    }
  });
};
validForm();
