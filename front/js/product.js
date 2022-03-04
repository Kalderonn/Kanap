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
  // récupération des infos de mon produit par l'appel de ma fonction getProductData
  await getProductData();
  // j'injecte mon HTML
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

// recupération des éléments HTML
const productQuantity = document.getElementById("quantity");
const addToBasketBtn = document.getElementById("addToCart");

// Sauvegarde du panier dans le localStorage avec en paramètre le panier que je souhaite enregistrer (ici basket)
const saveLocalStorage = (basket) => {
  localStorage.setItem("basket", JSON.stringify(basket));
}
// retourne la valeur associée à la clé basket transformé en objet
const getLocalStorage = () => {
  let basket = localStorage.getItem("basket");
  // si le basket n'éxiste pas getItem retourne un null
  // donc si le panier est vide on retourne un panier vie (tableau vide), s'il n'est pas vide on retoune la valeur associée à la clé basket transformé en objet
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}
// Ajout au panier
const addToBasket = () => {
  // on écoute les evenements au clic du bouton "ajouter au panier"
  addToBasketBtn.addEventListener(`click`, (e) => {
    console.log(e);
    // on récupère les valeurs de quantité et couleur
    let quantity = productQuantity.value;
    let color = productOptions.value;
    // console.log(color)
    // création de l'objet produit qui sera push dans le LocalStorage
    let product = {
      id : addArticleId,
      colorSelected : color,
      quantitySelected : quantity,
    }
    // récupération du panier
    let basket = getLocalStorage()
    // je rajoute une condition pour ne pas stocker dans le LocalStorage un produit qui à 0 quantité et sans couleur sélectionnée
    if (quantity == 0 || color == "") {
      alert('veuillez choisir une quantité et une couleur')
    } else {
      // Ajout d'une variable contenant le résultat de la recherche en fonction de la condition
    const resultFindIdAndColor = basket.find((p) => p.id == addArticleId && p.colorSelected == color);
    // Si On trouve un produit qui a déjà la même ID et couleur on ajout la nouvelle quantité avec celle déjà présente
    if (resultFindIdAndColor) {
      let newQuantity = parseInt(quantity) + parseInt(resultFindIdAndColor.quantitySelected);
      resultFindIdAndColor.quantitySelected = newQuantity;
      // console.log(newQuantity);
    } else {
      // Je push le product dans le panier = tableau
      basket.push(product);
    }
    // Je sauvegarde le panier
    saveLocalStorage(basket);
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