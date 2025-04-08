var menu = document.querySelector(".hamburger")
var nav_m = document.querySelector("nav")
var nav  = document.querySelector(".nav")
menu.addEventListener("click",  () => {
    menu.classList.toggle("active");
    nav.classList.toggle("active");
    nav_m.classList.toggle("gradient-border-mask");
  })


function dropdown(dropdown_btn){
    dropdown_btn.classList.toggle("active");
}
var dropdown_btns = document.querySelectorAll(".dropdown__menu");

dropdown_btns.forEach(element => {
  element.addEventListener("click", () => {
    dropdown_btns.forEach(btn => {
      if (btn !== element) btn.classList.remove("active");
    });
    element.classList.toggle("active");
  });
});