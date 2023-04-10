document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('../../../shelter/assets/pets.json');
  const pets = await response.json();
  const petCards = pets.map(createCard);
  const petsPopup = pets.map(createPopup);

  //carousel

  const buttonPrev = document.querySelector('.button-arrow_prev');
  const buttonNext = document.querySelector('.button-arrow_next');
  const petsCarouselWrapper = document.querySelector('.pets__carousel_wrapper')
  const petsCarousel = document.querySelector('.pets__carousel');
  const previousCardsContainer = document.querySelector('.cards_previous');
  const currentCardsContainer = document.querySelector('.cards_current');
  const nextCardsContainer = document.querySelector('.cards_next');

  let previousCards = [];
  let currentCards = [];
  let nextCards = [];
  let currentCardsNumber;

  const getCardsNumber = () => {
    let innerWidth = window.innerWidth;
    if (innerWidth > 1199) {
      return 3;
    } else if (innerWidth <= 1199 && innerWidth > 767) {
      return 2;
    } else {
      return 1;
    }
  }

  const generateCards = (forbiddenCards) => {
    const cards = getCardsNumber();
    const newCards = [];
    for (let i = 0; newCards.length < cards; i++) {
      let number = Math.floor(Math.random() * (9 - 1) + 1);
      if (!forbiddenCards?.includes(number) && !newCards.includes(number)) {
        newCards.push(number);
      }
    }
    return newCards;
  }

  const renderCards = (container, cards) => {
    container.innerHTML = '';
    cards.forEach((id) => {
      container.innerHTML += petCards[id - 1];
    });
    return container;
  }

  const removeCards = (container) => {
    container.innerHTML = '';
    return container;
  }

  const initCards = () => {
    removeCards(previousCardsContainer);
    removeCards(currentCardsContainer);
    removeCards(nextCardsContainer);

    currentCards = generateCards();
    previousCards = generateCards(currentCards);
    nextCards = generateCards(currentCards);

    renderCards(previousCardsContainer, previousCards);
    renderCards(currentCardsContainer, currentCards);
    renderCards(nextCardsContainer, nextCards);
  }

  initCards();

  window.addEventListener('resize', () => {
    const newCardsNumber = getCardsNumber();
    if (currentCardsNumber !== newCardsNumber) {
      initCards();
      currentCardsNumber = newCardsNumber;
    }
  });

  const moveBackward = () => {
    petsCarousel.classList.add('transition-backward');
    buttonPrev.removeEventListener('click', moveBackward);
    buttonNext.removeEventListener('click', moveForward);
  }

  const moveForward = () => {
    petsCarousel.classList.add('transition-forward');
    buttonNext.removeEventListener('click', moveForward);
    buttonNext.removeEventListener('click', moveForward);
  }

  buttonPrev.addEventListener('click', moveBackward);
  buttonNext.addEventListener('click', moveForward);

  const backward = () => {
    nextCards.splice(0, nextCards.length);
    nextCards = currentCards.splice(0, currentCards.length);
    currentCards = previousCards.splice(0, previousCards.length);
    previousCards = generateCards(currentCards);
  }

  const forward = () => {
    previousCards.splice(0, previousCards.length);
    previousCards = currentCards.splice(0, currentCards.length);
    currentCards = nextCards.splice(0, nextCards.length);
    nextCards = generateCards(currentCards);
  }

  petsCarousel.addEventListener('animationend', (animationEvent) => {
    if (animationEvent.animationName === "move-backward") {
      petsCarousel.classList.remove('transition-backward');
      backward();
    } else {
      petsCarousel.classList.remove('transition-forward');
      forward();
    }

    renderCards(previousCardsContainer, previousCards);
    renderCards(currentCardsContainer, currentCards);
    renderCards(nextCardsContainer, nextCards);

    buttonPrev.addEventListener('click', moveBackward);
    buttonNext.addEventListener('click', moveForward);
  })

  //popup

  const body = document.querySelector('body');
  const popupWrapper = document.querySelector('.popup__wrapper');
  const buttonClosePopup = document.querySelector('.popup__button');
  const popupContent = document.querySelector('.popup__content');

  const renderPopup = (id) => {
    popupContent.innerHTML = '';
    popupContent.innerHTML += petsPopup[id - 1];
  }

  const closeCarousel = () => {
    popupWrapper.classList.remove('popup__wrapper_active');
    popupWrapper.classList.remove('blackout');
    body.classList.remove('overflow-hidden');
  }

  petsCarouselWrapper.addEventListener('click', (e) => {
    if (e.target.closest('div').classList.contains('pets__card')) {
      popupWrapper.classList.add('popup__wrapper_active');
      popupWrapper.classList.add('blackout');
      body.classList.add('overflow-hidden');
      renderPopup(e.target.closest('div').id)
    }
  })

  buttonClosePopup.addEventListener('click', () => {
    closeCarousel();
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup__wrapper_active') || e.target.classList.contains('popup__container')) {
      closeCarousel();
    }
  })

});

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
