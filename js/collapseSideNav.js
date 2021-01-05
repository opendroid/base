"use strict";

/**
 * toggleHKNav: Method hides or shows the HTML navigation section id "hk-nav"
 * Uses classes: hk-nav-hide, hk-top-bar-secondary-no-margin and hk-main-no-margin
 */
function toggleHKNav() {
  const classes = document.getElementById("hk-nav").classList;
  if (classes && classes.contains("hk-nav-hide")) { // Show navbar
    document.getElementById("hk-nav").setAttribute("class", "hk-nav");
    document.getElementById("hk-main").setAttribute("class", "hk-main");
    document.getElementById("top-bar-secondary").setAttribute("class", "hk-top-bar-secondary secondary-light");
  } else { // Hide navbar
    document.getElementById("hk-nav").setAttribute("class", "hk-nav-hide");
    document.getElementById("hk-main").setAttribute("class", "hk-main hk-main-no-margin");
    document.getElementById("top-bar-secondary").setAttribute("class", "hk-top-bar-secondary secondary-light hk-top-bar-secondary-no-margin");
  }
}
