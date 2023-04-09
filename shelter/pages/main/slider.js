document.addEventListener('DOMContentLoaded', async function () {
  const response = await fetch('../../../shelter/assets/pets.json');
  const pets = await response.json();
  const petCards = pets.map(createCard);

  const buttonPrev = document.querySelector('.button-arrow_prev');
  const buttonNext = document.querySelector('.button-arrow_next');
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
