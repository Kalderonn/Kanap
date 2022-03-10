let productsData = [];

// Récupération des données de l'API
const getProductsData = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      productsData = data;
    //   console.log(productsData);
    });
};

// Affichage des cards de manière dynamique
const productsDisplay = async () => {
  await getProductsData();
  productsData.forEach(
    (product) =>
      (document.getElementById("items").innerHTML += `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>`)
  );
};

getProductsData();
productsDisplay();
