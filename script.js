//script

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "50vw";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function responsive(mediaQuery) {
  const inbox = document.getElementById("inbox");
  const btn = document.getElementById("contact-open");
  const panel = document.getElementById("remove");
  const content = document.getElementById("side-content");
  const CONTACTS = document.getElementById("contact-panel");

  if (!mediaQuery.matches) {
    btn.innerHTML = "";
    panel.innerHTML = "";
    content.innerHTML = "";

    panel.classList.add("col-4");
    CONTACTS.classList.remove("col-12");
    panel.appendChild(CONTACTS);

    inbox.classList.add("col-8");
    inbox.classList.remove("col-12");
  } else {
    btn.innerHTML = "☰";
    panel.innerHTML = "";
    content.innerHTML = "";

    panel.classList.remove("col-4");
    CONTACTS.classList.add("col-12");
    content.appendChild(CONTACTS);

    inbox.classList.remove("col-8");
    inbox.classList.add("col-12");
  }
}

var mediaQuery = window.matchMedia("(max-width: 700px)");
responsive(mediaQuery);
mediaQuery.addListener(responsive);
