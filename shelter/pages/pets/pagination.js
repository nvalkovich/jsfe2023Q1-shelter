document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('../../../shelter/assets/pets.json');
  const pets = await response.json();
  const petCardsArray = pets.map(createCard);
  const petsPopup = pets.map(createPopup);

  //pagination

  const buttonFirstPage = document.querySelector('.button-paginator_first');
  const buttonPreviousPage = document.querySelector('.button-paginator_prev');
  const currentPageElement = document.querySelector('.current-page');
  const buttonNextPage = document.querySelector('.button-paginator_next');
  const buttonLastPage = document.querySelector('.button-paginator_last');
  const petsCards = document.querySelector('.pets__cards');

  let currentPage;
  let pages;
  let cardsNumber;

  const allCards = generateCards();

  const renderPage = (currentPage) => {
    cardsNumber = getCardsNumber();
    petsCards.innerHTML = '';
    pages[currentPage - 1].forEach((id) => {
      petsCards.innerHTML += petCardsArray[id - 1];
    });
  }

  const renderPaginationElements = (currentPage) => {
    currentPageElement.innerText = currentPage;
    if (currentPage === 1) {
      disableButton(buttonFirstPage);
      disableButton(buttonPreviousPage);
      activateButton(buttonNextPage);
      activateButton(buttonLastPage);
    } else if (currentPage === pages.length) {
      disableButton(buttonNextPage);
      disableButton(buttonLastPage);
      activateButton(buttonFirstPage);
      activateButton(buttonPreviousPage);
    } else {
      activateButton(buttonNextPage);
      activateButton(buttonLastPage);
      activateButton(buttonFirstPage);
      activateButton(buttonPreviousPage);
    }
  }

  const render = (currentPage) => {
    renderPaginationElements(currentPage);
    currentPageElement.innerText = currentPage;
    renderPage(currentPage);
  }

  const initCards = () => {
    petsCards.innerHTML = '';
    cardsNumber = getCardsNumber();
    pages = arrayToChanks(allCards, cardsNumber);
    currentPage = 1;
    render(currentPage);
  }

  initCards();

  buttonNextPage.addEventListener('click', () => {
    currentPage += 1;
    render(currentPage);
  });

  buttonPreviousPage.addEventListener('click', () => {
    currentPage -= 1;
    render(currentPage);
  });

  buttonFirstPage.addEventListener('click', () => {
    currentPage = 1;
    render(currentPage);
  });

  buttonLastPage.addEventListener('click', () => {
    currentPage = pages.length;
    render(currentPage);
  });

  window.addEventListener('resize', () => {
    const newCardsNumber = getCardsNumber();
    if (cardsNumber !== newCardsNumber) {
      initCards();
      cardsNumber = newCardsNumber;
    }
  });

  //popup

  const body = document.querySelector('body');
  const popupWrapper = document.querySelector('.popup__wrapper');
  const buttonClosePopup = document.querySelector('.popup__button');
  const popupContent = document.querySelector('.popup__content');

  const renderPopup = (id) => {
    popupContent.innerHTML = '';
    popupContent.innerHTML += petsPopup[id - 1];
  }

  const closePopup = () => {
    popupWrapper.classList.remove('popup__wrapper_active');
    popupWrapper.classList.remove('blackout');
    body.classList.remove('overflow-hidden');
  }

  petsCards.addEventListener('click', (e) => {
    if (e.target.closest('div').classList.contains('pets__card')) {
      popupWrapper.classList.add('popup__wrapper_active');
      popupWrapper.classList.add('blackout');
      body.classList.add('overflow-hidden');
      renderPopup(e.target.closest('div').id)
    }
  })

  buttonClosePopup.addEventListener('click', () => {
    closePopup();
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup__wrapper_active') || e.target.classList.contains('popup__container')) {
      closePopup();
    }
  })

});


function getCardsNumber () {
  let innerWidth = window.innerWidth;
  if (innerWidth >= 1230) {
    return 8;
  } else if (innerWidth <= 1229 && innerWidth > 634) {
    return 6;
  } else {
    return 3;
  }
}

function generateCards () {
  const baseArray = randomizeArray([...Array(8).keys()].map(key => key + 1));
  const baseChanks = arrayToChanks(baseArray, 3);
  const result = [];
  
  for (let i = 0; i < 6; i++) {
    baseChanks.forEach(chank => {
      const randomizedChank = randomizeArray(chank);
      randomizedChank.forEach(rc => result.push(rc));
    });
  }

  return result;
}  

function disableButton(element) {
  element.classList.remove('button-paginator_active');
  element.classList.add('button-paginator_inactive');
  element.disabled = true;
}

function activateButton(element) {
  element.classList.remove('button-paginator_inactive');
  element.classList.add('button-paginator_active');
  element.disabled = false;
}


function randomizeArray(array) {
  const randomized = [];
  while (randomized.length < array.length) {
    const index = Math.floor(Math.random() * array.length);
    const value = array[index];
    if (!randomized.includes(value)) {
      randomized.push(value);
    }
  }

  return randomized
}

function arrayToChanks(array, chunkSize) {
  const chanks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chanks.push(chunk);
  }

  return chanks;
}

function createCard(pet, id) {
  const html = `<div id="${id + 1}" class="pets__card">
    <img src=${pet.img} alt=${pet.name}>
    <span>${pet.name}</span>
    <button class="button button_bordered">
      Learn more
    </button>
  </div>`;

  return html;
}

function createPopup(pet) {
  const html =
    `<img src=${pet.img} class="popup__image" alt=${pet.name}>
  <div class="popup__pet-description">
    <div class="popup__pet-name">
      <h3>${pet.name}</h3>
      <h4>${pet.type} - ${pet.breed}</h4>
    </div>
    <p>${pet.description}</p>
    <ul class="popup__pet-quality-list">
      <li><span class="bold">Age:</span> ${pet.age}</li>
      <li><span class="bold">Inoculations:</span> ${pet.inoculations}</li>
      <li><span class="bold">Diseases:</span> ${pet.diseases}</li>
      <li><span class="bold">Parasites:</span> ${pet.parasites}</li>
    </ul>
  </div>`;
  return html;
}

