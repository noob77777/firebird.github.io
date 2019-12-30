UserId = "";
receiver = "undefined";

//
// FIREBASE INIT
var firebaseConfig = {
  apiKey: "AIzaSyA6wxeT-E28I87gZG2X1lKdv52X5GF2BIU",
  authDomain: "firebird-2204b.firebaseapp.com",
  databaseURL: "https://firebird-2204b.firebaseio.com",
  projectId: "firebird-2204b",
  storageBucket: "firebird-2204b.appspot.com",
  messagingSenderId: "182608640887",
  appId: "1:182608640887:web:652f17a5cd1ab4fd6bbf72"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const dbRef = firebase
  .database()
  .ref()
  .child("Root");

//
//
//

function clean(list) {
  var set = new Set();
  set.add(undefined);
  set.add("");
  var newlist = [];
  for (i = 0; i < list.length; i++) {
    if (!set.has(list[i])) {
      set.add(list[i]);
      newlist.push(list[i]);
    }
  }
  return newlist;
}

function formatted(obj, flag) {
  type = "";
  if (obj.sender == UserId) {
    type = "right";
  } else {
    type = "left";
  }
  if (flag) {
    return `<h6 id=${type}>${obj.message} <span class="text-danger css-sm">~${obj.sender}</span></h6>`;
  }
  return `<h6 id=${type}>${obj.message} <span class="text-secondary css-sm">~${obj.sender}</span></h6>`;
}

function live_inbox_feed(snap) {
  list = snap.val();
  const ul = document.getElementById("live-inbox");
  ul.innerHTML = "";

  var counter = 0;
  var idx = 1;
  for (i = list.length - 1; i > 0; i--) {
    if (
      list[i].receiver == receiver ||
      list[i].sender == receiver ||
      receiver == "undefined"
    ) {
      counter++;
      if (counter == 8) {
        idx = i;
        break;
      }
    }
  }

  for (i = idx; i < list.length; i++) {
    var li = document.createElement("li");
    if (
      list[i].receiver == receiver ||
      list[i].sender == receiver ||
      receiver == "undefined"
    ) {
      flag = 0;
      if (receiver == "undefined") {
        flag = 1;
      }

      if (receiver == "undefined" && list[i].sender == UserId) {
        continue;
      }

      li.innerHTML = formatted(list[i], flag); //JSON.stringify(list[i]);
      ul.appendChild(li);
    }
  }
}

function selectChat() {
  const SendTag = document.getElementById("sender");
  const RTag = document.getElementById("receiver");
  receiver = this.innerHTML;
  RTag.innerHTML = receiver;

  const node3 = document.getElementById("sending-utility");
  node3.style.visibility = "visible";

  dbRef
    .child(UserId)
    .child("inbox")
    .on("value", live_inbox_feed);
}

function update_contacts(list) {
  const node = document.getElementById("contacts");
  list = clean(list);

  node.innerHTML = "";
  for (i = 1; i < list.length; i++) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.classList.add("btn", "btn-outline-info");
    btn.onclick = selectChat;
    btn.innerHTML = list[i];
    li.appendChild(btn);
    node.appendChild(li);
  }
}

(function() {
  const btn = document.getElementById("submit-button");
  const input = document.getElementById("inputEmail");
  const pass = document.getElementById("inputPassword");
  const SendTag = document.getElementById("sender");
  const RTag = document.getElementById("receiver");

  INBOX = ["begin"];
  CONTACTS = ["begin"];

  //
  //
  // LOGIN
  // BAD CODE DO NOT TOUCH
  //
  //
  function login() {
    UserId = input.value;
    password = pass.value;

    // console.log([UserId, password]);

    function local_reader(snap) {
      flag = false;
      // console.log();
      if (snap.exists()) {
        if (snap.val().password == password) {
          flag = true;
        }
      } else {
        flag = true;
      }

      // console.log(flag);

      //
      // IF LOGIN
      //
      if (flag) {
        const node = document.getElementById("loginmenu");
        node.innerHTML = "<h1 id='header'>Welcome to FireBird.</h1>";
        SendTag.innerHTML = UserId;
        RTag.innerHTML = receiver;

        function local_reader(snap) {
          flag = snap.exists();
          if (!flag) {
            dbRef.child(UserId).set({
              inbox: INBOX,
              contacts: CONTACTS,
              password: password
            });
          }
          if (flag) {
            list = [];
            function local_reader(snap) {
              list = snap.val();
              update_contacts(list);
            }
            dbRef
              .child(UserId)
              .child("contacts")
              .once("value", local_reader);
          }

          const node2 = document.getElementById("interface");
          node2.style.visibility = "visible";
          const node3 = document.getElementById("sending-utility");
          node3.style.visibility = "hidden";
        }

        dbRef.child(UserId).once("value", local_reader);
        dbRef
          .child(UserId)
          .child("inbox")
          .on("value", live_inbox_feed);
      }
      //
      // AUTH FAIL
      //
      else {
        const node = document.getElementById("AuthFail");
        node.innerHTML = "Invalid Username or Password";
      }
    }
    dbRef.child(UserId).once("value", local_reader);
  }
  btn.onclick = login;

  //
  //
  // ADD CONTACTS
  //
  //
  const newIdBtn = document.getElementById("newuser");
  const inputNewUser = document.getElementById("newid");
  function createNewChat() {
    var li = document.createElement("li");
    var temp = document.createElement("button");

    temp.classList.add("btn", "btn-outline-info");

    temp.onclick = selectChat;
    temp.innerHTML = inputNewUser.value;
    li.appendChild(temp);
    var ul = document.getElementById("contacts");
    ul.appendChild(li);

    function local_reader(snap) {
      list = snap.val();
      list.push(inputNewUser.value);
      dbRef
        .child(UserId)
        .child("contacts")
        .set(list);
    }
    dbRef
      .child(UserId)
      .child("contacts")
      .once("value", local_reader);
  }
  newIdBtn.onclick = createNewChat;

  //
  //
  // THE SEND BUTTON
  //
  //
  const SEND = document.getElementById("send-mssg");
  function sendMessage() {
    const text = document.getElementById("live-mssg").value;
    dbRef
      .child(UserId)
      .child(receiver)
      .set(text);

    function local_reader(snap) {
      // console.log(snap.val());
      flag = snap.exists();

      list = [];
      function update_inbox(snap) {
        list = snap.val();
        // console.log(list);
        list.push({ sender: UserId, message: text, receiver: receiver });
        // console.log(list);

        dbRef
          .child(receiver)
          .child("inbox")
          .set(list);
      }

      function update_inbox_self(snap) {
        list = snap.val();
        // console.log(list);
        list.push({ sender: UserId, message: text, receiver: receiver });
        // console.log(list);

        dbRef
          .child(UserId)
          .child("inbox")
          .set(list);
      }

      if (flag) {
        // console.log("OK");
        dbRef
          .child(receiver)
          .child("inbox")
          .once("value", update_inbox);

        dbRef
          .child(UserId)
          .child("inbox")
          .once("value", update_inbox_self);
      }
    }

    dbRef.child(receiver).once("value", local_reader);
    document.getElementById("live-mssg").value = "";
  }
  SEND.onclick = sendMessage;
})();
