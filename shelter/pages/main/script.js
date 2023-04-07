'use strict'


document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');
  const burgerWrapper = document.querySelector('.burger-wrapper');
  const burger = document.querySelector('.burger');
  const burgerIcon = document.querySelector('.burger__icon');
  const burgerMenu = document.querySelector('.burger__burger-menu');

  const toggleBurger = () => {
    burgerMenu.classList.toggle('burger__burger-menu_active');
    burgerIcon.classList.toggle('burger__icon_active');
    burgerWrapper.classList.toggle('blackout');
    body.classList.toggle('overflow-hidden');
  }

  burgerIcon.addEventListener('click', toggleBurger);

  document.addEventListener('click', (e) => {
    if (!e.composedPath().includes(burger)) toggleBurger();
  })

  burgerMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('burger-menu__link')) toggleBurger();
  });
});


