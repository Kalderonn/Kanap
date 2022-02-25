// recupération de l'ID (comment mettre dans une fonction?)

const searchArticleId = window.location.search;
const urlParams = new URLSearchParams(searchArticleId);
const addArticleId = urlParams.get("id");
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
console.log(productDescription);

// Affichage du produit

const productDisplay = async () => {
  await getProductData();
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
