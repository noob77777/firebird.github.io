//script
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "50vw";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

(function() {
  const inbox = document.getElementById("inbox");
  const btn = document.getElementById("contact-open");
  const panel = document.getElementById("remove");
  const content = document.getElementById("side-content");
  if (screen.width > screen.height) {
    btn.innerHTML = "";
  } else {
    panel.innerHTML = "";
    content.innerHTML =
      "<div id='contact-panel' class='col-4'><h2>Contacts</h2></div >";
    inbox.classList.add("col-12");
  }
})();
