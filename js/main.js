const form = document.getElementById('shopping-list__form');
const productInput = document.getElementById('shopping-list__product-input');
const productTypeSelector = document.getElementById('product-type-selector');
const shoppingListElement = document.getElementById('shopping-list');
const sectionsContainer = document.getElementById('shopping-list__sections-container');
const sections = document.querySelectorAll('.list__section');
const deleteAllBtn = document.getElementById('delete-all-button');

const getShoppingList = () => JSON.parse(localStorage.getItem('shoppingList'));
const getProductTypes = () => JSON.parse(localStorage.getItem('productTypes'));

if (!getProductTypes()) localStorage.setItem('productTypes', JSON.stringify([]));

if (!getShoppingList()) localStorage.setItem('shoppingList', JSON.stringify([]));

const createProductTypeOption = (value) => {
  const option = document.createElement('option');
  option.innerText = value;
  productTypeSelector.appendChild(option);
};

const createProductTypeSection = (value) => {
  const section = document.createElement('section');
  section.classList.add('list__section');
  section.setAttribute('id', value);
  const h2 = document.createElement('h2');
  h2.classList.add('section__title');
  h2.innerText = value;
  section.appendChild(h2);
  const ul = document.createElement('ul');
  ul.classList.add('ul');
  section.appendChild(ul);
  // si el ul no tiene ningun item oculta la seccion
  if (!ul.firstElementChild) section.classList.add('hidden');
  sectionsContainer.appendChild(section);
};

const createShoppingListItem = (newItem) => {
  const li = document.createElement('li');
  li.classList.add('list__item');
  if (newItem.done === true) li.classList.add('done');
  li.innerHTML = `
    ${newItem.product}<button class="icon-button delete-button"><i class="fas fa-trash-alt"></i></button>
  `;

  // agrega funcionalidad para marcar item como comprado/conseguido
  li.addEventListener('click', () => {
    const shoppingList = getShoppingList();
    const updatedShoppingList = shoppingList.map(item => {
      if (item.product === newItem.product) {
        item.done = !item.done;
        li.classList.toggle('done');
      };
      return item;
    });
    localStorage.setItem('shoppingList', JSON.stringify(updatedShoppingList));
  });
  
  // agrega funcionalidad al boton de borrar de cada item nuevo que se agrega
  const deleteBtn = li.querySelector('.delete-button');
  deleteBtn.addEventListener('click', () => {
    const shoppingList = getShoppingList();
    const updatedShoppingList = shoppingList.filter(item => (item.product !== newItem.product));
    localStorage.setItem('shoppingList', JSON.stringify(updatedShoppingList));
    li.remove();
    const listSection = document.getElementById(`${newItem.type}`);
    // si el item esta en una seccion especifica y al eliminarlo no queda ningun otro, se oculta esa seccion
    if (listSection) {
      const sectionUl = listSection.childNodes[1];
      if (!sectionUl.firstElementChild) listSection.classList.add('hidden');
    }
  });
  
  // si el item nuevo no pertenece a ninguna seccion especifica lo agrega a la primer lista sin titulo
  if (!newItem.type) {
    shoppingListElement.appendChild(li);
  } else {
    const listSection = document.getElementById(`${newItem.type}`);
    // el ul es el seguno hijo de las secciones especificas (el primero es el h2), por eso el .childNodes[1]
    const sectionUl = listSection.childNodes[1];
    if (listSection.classList.contains('hidden')) listSection.classList.remove('hidden');
    sectionUl.appendChild(li);
  }
 
  productInput.value = "";
};

const storeNewItem = () => {
  const shoppingList = getShoppingList();

  if (productInput.value === '') return;
  
  const newItem = {
    product: productInput.value,
    type: productTypeSelector.value,
    done: false
  }

  // si algun item ya existe en alguna lista se retorna la funcion sin crear un nuevo item
  if (shoppingList.some(item => item.product === newItem.product)) return;

  const updatedShoppingList = [...shoppingList, newItem];
  localStorage.setItem('shoppingList', JSON.stringify(updatedShoppingList));

  createShoppingListItem(newItem);
};

// agrega todas las secciones e items al html al cargar la pagina
window.onload = () => {
  const productTypes = getProductTypes();
  productTypes.forEach(type => {
    createProductTypeOption(type);
    createProductTypeSection(type);
  });
  const shoppingList = getShoppingList();
  shoppingList.forEach(item => {
    createShoppingListItem(item);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  storeNewItem();
});

deleteAllBtn.addEventListener('click', () => {
  const shoppingList = [];
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  const allItems = document.querySelectorAll('.list__item');
  allItems.forEach(item => {
    item.remove();
  });
  const allSections = document.querySelectorAll('.list__section');
  allSections.forEach((section, index) => {
    if (index !== 0) section.classList.add('hidden');
  });
});