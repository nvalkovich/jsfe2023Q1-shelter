'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');
  const burgerWrapper = document.querySelector('.burger-wrapper');
  const burgerIcon = document.querySelector('.burger-icon');
  const burgerMenu = document.querySelector('.burger__burger-menu');

  const toggleBurger = () => {
    burgerMenu.classList.toggle('burger__burger-menu_active');
    burgerIcon.classList.toggle('burger-icon_active');
    burgerWrapper.classList.toggle('burger-wrapper_active');
    burgerWrapper.classList.toggle('blackout');
    body.classList.toggle('overflow-hidden');
  }

  burgerIcon.addEventListener('click', toggleBurger);

  burgerMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('burger-menu__link')) toggleBurger();
  });

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(burgerMenu) 
    && !e.composedPath().includes(burgerIcon) 
    && burgerMenu.classList.contains('burger__burger-menu_active')) {
      toggleBurger();
    }
  })
});
