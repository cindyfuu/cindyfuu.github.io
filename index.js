/*
 * Cindy Fu
 * July 30th
 * Section AC
 * This is a index.js page to add behavior to my web page. This file
 * give action to buttons. One button add green onion to the
 * recipe if user like. The other button takes user through steps and
 * pictures to cook the dish. The last button show one user's comment
 * if click once.
 */
'use strict';

(function() {
  const PIC_ARR = ['img/clean.jpeg', 'img/ginger.jpeg', 'img/fry.jpeg', 'img/souce.jpeg',
  'img/water.jpeg', 'img/salt.jpeg'];
  const ALT_ARR = ['clean rib', 'fry ginger', 'fry rib', 'add sauce', 'add water', 'add salt'];
  window.addEventListener('load', init);
  const URL = "https://randomuser.me/api/";
  const COMMENTS = ['"very good"', '"awsome information"', '"love this recipe"', '"taste awsome"',
  '"wish to learn more"', '"this is interesting!"', '"love Chinese fooood!!"',
  '"fantastic tutorial"'];

  /**
   * Gives behavior to two buttons on the web page
   */
  function init() {
    let element = document.getElementById('next');
    let green = document.getElementById('green');
    let button = document.querySelector('#comment button');
    let picPos = 1;
    green.addEventListener('click', append);
    element.addEventListener('click', function() {
      picPos = rotation(picPos);
    });
    button.addEventListener('click', makeRequest);
  }

  /**
   * This function adds "green onion", the element in Optional Ingredient, to
   * Ingredient list when the button is clicked;
   */
  function append() {
    let add = document.querySelector('#sec-lis li');
    document.getElementById('fir-lis').appendChild(add);
  }

  /**
   * Highlights each step in order and change the picture to represent
   * each step in the cooking procedure.
   * @param {Integer} picPos - picture position
   * @returns {Integer} picPos - picture position
   */
  function rotation(picPos) {
    let steps = document.querySelectorAll('ol li');
    let img = document.getElementById('dyn-pic');
    picPos = picPos % PIC_ARR.length;
    img.src = PIC_ARR[picPos];
    img.alt = ALT_ARR[picPos];
    if (picPos === 0) {
      steps[5].classList.remove('current');
    } else {
      steps[picPos - 1].classList.remove('current');
    }
    steps[picPos].classList.add('current');
    picPos++;
    return picPos;
  }

  /**
   * Request information about random user in random user generator API.
   * If system does not retrieving information successfully, display error message.
   */
  async function makeRequest() {
    try {
      let url = URL + "?inc=name,location,picture";
      let response = await fetch(url);
      response = await statusCheck(response);
      response = await response.json();
      updatePage(response);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Request random user's name, location, and picture info from API and
   * update that information and some comments in web
   * @param {Object} response - a random user's information
   */
  function updatePage(response) {
    let newSec = document.createElement('section');
    let newImg = document.createElement('img');
    let section = document.querySelector('#comment section');
    newImg.src = response.results[0].picture.thumbnail;
    newImg.alt = 'user profile image';
    section.appendChild(newSec);
    newSec.appendChild(newImg);
    let user = retrieveUserInfo(response);
    newSec.appendChild(user);
    let newP = document.createElement('p');
    let rand = Math.floor(Math.random() * 8);
    newP.textContent = COMMENTS[rand];
    newSec.appendChild(newP);
  }

  /**
   * Retrive user's name and location for their comments
   * @param {Object} response - a random user's information
   * @returns {HTMLElement} user - user's name and location
   */
  function retrieveUserInfo(response) {
    let first = response.results[0].name.first;
    let last = response.results[0].name.last;
    let country = response.results[0].location.country;
    let state = response.results[0].location.state;
    let user = document.createElement('p');
    user.textContent = first + " " + last + " from " + state + ', ' + country;
    return user;
  }

  /**
   * Handle error when retrieving information from Random User Generator API
   * @param {String} error - error message
   */
  function handleError(error) {
    let section = document.getElementById('comment');
    let message = document.createElement('p');
    let errMes = document.createElement('p');
    message.classList.add('errorMess');
    errMes.classList.add('errorMess');
    message.textContent = 'Sorry, loading comment is failed.';
    errMes.textContent = 'Error message: ' + error;
    section.appendChild(message);
    section.appendChild(errMes);
  }

  /**
   * Check the status when retrieving information form API. Throw error if web
   * status is not okay
   * @param {Object} response - a random user's information
   * @returns {Object} response - a random user's information
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }
})();