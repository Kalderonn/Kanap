// recupération de l'ID 
const getId = (idParams) => {
  const searchArticleId = window.location.search;
  const urlParams = new URLSearchParams(searchArticleId);
  return urlParams.get(idParams);
}

const addArticleId = getId("id");
// console.log(addArticleId);

// récupération des infos du produit en fonction de l'ID
const getProductData = async () => {
  await fetch(`http://localhost:3000/api/products/${addArticleId}`)
    .then((res) => res.json())
    .then((data) => {
      productData = data;
      console.log(productData);
    });
  };

// getProductData()

// Les éléments HTML
const productImg = document.querySelector(".item__img");
const productTitle = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productOptions = document.getElementById("colors");

// console.log(productOptions)

// Affichage du produit

const productDisplay = async () => {
  await getProductData();
  document.title = productData.name;
  productImg.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altText} ">`;
  productTitle.innerText = `${productData.name}`;
  productPrice.innerText = `${productData.price}`;
  productDescription.innerText =`${productData.description}`;
  productData.colors.forEach(color => {
    productOptions.innerHTML += 
    `<option value="${color}">${color}</option>`
  });
};

productDisplay();


//  Ajout des produits au panier:

// Le panier est un array avec ID du produit, quantité et couleur
// Utiliser local storage pour garder ses valeurs
// Faire une condition si le produit n'est pas présent dans l'array, on l'ajoute (ID et couleur)
// Faire une condition si le produit est déjà présent alors on incrémente la quantité dans l'array

// recupération des evenements au clique du bouton "ajouter au panier"
const productQuantity = document.getElementById("quantity");
const addToBasketBtn = document.getElementById("addToCart");

// sauvegarde du panier
const saveLocalStorage = (basket) => {
  localStorage.setItem("basket", JSON.stringify(basket));
}

const getLocalStorage = () => {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}

const addToLocalStorage = (product) => {
  let basket = getLocalStorage();
  basket.push(product);
  saveLocalStorage(basket);
}

const addToBasket = () => {
  addToBasketBtn.addEventListener(`click`, (e) => {
    console.log(e);
    let quantity = productQuantity.value;
    let color = productOptions.value;
    // console.log(color)
    let product = {
      id : addArticleId,
      colorSelected : color,
      quantitySelected : Number(quantity),
    }
    let basket = getLocalStorage()
    // Ajout d'une variable contenant le résultat de la recherche
    const resultFindIdAndColor = basket.find((el) => el.id === addArticleId && el.colorSelected === color);
    if (resultFindIdAndColor) {
      let newQuantity = parseInt(quantity) + parseInt(resultFindIdAndColor.quantitySelected);
      resultFindIdAndColor.quantitySelected = newQuantity;
      localStorage.setItem("basket", JSON.stringify(basket));
      console.log(newQuantity);

    } if (color = "" || quantity == 0) {

    } else {
      addToLocalStorage(product)
    }
    
  });
}

addToBasket();
// récupération de la valeur de la couleur
// productOptions.addEventListener(`change`, (e) =>{
//   console.log(e.target.value);
// })

// productQuantity.addEventListener(`input`, (e) =>{
//   console.log(e.target.value)
// })
// const saveProductStorage = async () => {
//   await getProductData();
//   const objet = {
//     quantite: 234,
//     nom: `${productData.name}`
//   };
//   console.log(objet)
//   let basket = [objet]
//   const objet2 = {
//     quantite: 235,
//     nom: `${productData.name}`
//   };
//     basket = [...basket, objet2];
//   localStorage.setItem("basket", JSON.stringify(basket));
// }

// const getProductStorage = async () => {
//   await saveProductStorage();
//   JSON.parse(localStorage.getItem("basket"));
//   console.log(JSON.parse(localStorage.getItem("basket")));
// }

// saveProductStorage()
// getProductStorage()