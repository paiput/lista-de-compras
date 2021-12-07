const form = document.getElementById('product-type-form');
const selectionInput = document.getElementById('section-input');
const productTypesUl = document.getElementById('product-types-list');

const getShoppingList = () => JSON.parse(localStorage.getItem('shoppingList'));
const getProductTypes = () => JSON.parse(localStorage.getItem('productTypes'));

const createTypeItem = (type) => {
  const li = document.createElement('li');
  li.classList.add('list__item');
  li.innerHTML = `
    ${type} <button class="icon-button delete-button"><i class="fas fa-trash-alt"></i></button>
  `;

  // agrega funcionalidad al boton que borra el item
  const deleteBtn = li.querySelector('.delete-button');
  deleteBtn.addEventListener('click', () => {
    const productTypes = getProductTypes();
    const updatedProductTypes = productTypes.filter(item => item !== type);
    localStorage.setItem('productTypes', JSON.stringify(updatedProductTypes));
    const shoppingList = getShoppingList();
    const updatedShoppingList = shoppingList.filter(item => item.type !== type);
    localStorage.setItem('shoppingList', JSON.stringify(updatedShoppingList));
    li.remove();
  });

  productTypesUl.appendChild(li);
};

const storeNewProductType = () => {
  const newType = selectionInput.value;
  if (newType === '') return;
  
  // si ya existe el tipo retorna la funcion
  const productTypes = getProductTypes();
  if (productTypes.some(type => type === newType)) return;

  const updatedProductTypes = [...productTypes, newType];
  localStorage.setItem('productTypes', JSON.stringify(updatedProductTypes));

  createTypeItem(newType);
  
  selectionInput.value = "";
};

// agrega todos los items al html al cargar la pagina
window.onload = () => {
  const productTypes = getProductTypes();
  productTypes.forEach(type => {
    createTypeItem(type);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  storeNewProductType();
});