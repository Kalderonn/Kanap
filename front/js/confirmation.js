// Je vide mon local Storage
// localStorage.clear();

// recupération de l'ID de commande dans l'URL
const getId = (idParams) => {
  const searchOrderId = window.location.search;
  const urlParams = new URLSearchParams(searchOrderId);
  return urlParams.get(idParams);
};
// Je stocke l'ID de commande
const addOrderId = getId("orderId");
console.log(addOrderId);

const displayOrderId = () =>{
    // récupération de l'élément du DOM à modifier
    const order = document.getElementById("orderId")
    // Injection du contenu
    order.innerText = addOrderId
}
displayOrderId()