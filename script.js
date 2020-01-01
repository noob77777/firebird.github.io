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
  const mssg_input = document.getElementById("live-mssg-div");
  if (screen.width > screen.height) {
    btn.innerHTML = "";
  } else {
    panel.innerHTML = "";
    panel.classList.remove("col-4");
    content.innerHTML =
      '<div id="contact-panel" class="col-12"><h2>Contacts</h2>Receivers ID:<br /><input type="text" class="form-control" id="newid" /><button id="newuser" class="btn-info btn">Create New</button><ul id="contacts"></ul></div >';
    inbox.classList.remove("col-8");
    inbox.classList.add("col-12");
    // mssg_input.classList.remove("col-8");
    // mssg_input.classList.add("col-10");
  }
})();
