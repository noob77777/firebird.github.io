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

function hash(str) {
  var res = 0,
    i,
    chr;
  if (str.length === 0) return res;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    res = (res << 5) - res + chr;
    res |= 0; // Convert to 32bit integer
  }
  return res;
}

// console.log(hash("pass"));

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
    btn.classList.add("btn", "btn-outline-info", "contact-width");
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
        if (snap.val().password == hash(password)) {
          flag = true;
        }
      }

      //
      // IF LOGIN
      //
      if (flag) {
        const node = document.getElementById("loginmenu");
        node.innerHTML =
          "<h1 id='header' class='text-info'>Welcome to FireBird.</h1>";
        SendTag.innerHTML = UserId;
        RTag.innerHTML = receiver;

        function local_reader(snap) {
          flag = snap.exists();
          if (!flag) {
            dbRef.child(UserId).set({
              inbox: INBOX,
              contacts: CONTACTS,
              password: hash(password)
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
  try {
    btn.onclick = login;
  } catch {}
  // console.log("here");

  //
  //
  // SIGNUP
  //
  //

  const signupbtn = document.getElementById("signup-button");

  function signup() {
    const UserId = document.getElementById("signup-inputID").value;
    var email = document.getElementById("signup-inputEmail").value;
    const password = document.getElementById("signup-inputPassword").value;
    const cpass = document.getElementById("inputPasswordConfirm").value;

    if (UserId == "" || email == "" || password == "") {
      const node = document.getElementById("signup-fail");
      node.innerHTML = "Blank fields not accepted.";
      return;
    }

    Z = email.split(".");
    email = "";
    for (i = 0; i < Z.length; i++) {
      email += Z[i];
      email += "|";
    }

    // console.log(email);

    function local_reader(snap) {
      if (snap.exists()) {
        const node = document.getElementById("signup-fail");
        node.innerHTML = "Username already exists.";
      } else {
        function local_reader2(snap) {
          if (snap.exists()) {
            const node = document.getElementById("signup-fail");
            node.innerHTML =
              "Email already taken.<br>Contact Database admin if issue persists.";
          } else {
            if (password != cpass || password == "") {
              const node = document.getElementById("signup-fail");
              node.innerHTML = "Passwords do not match.";
              return;
            }

            const checkbox = document.getElementById("customCheck2").checked;
            if (!checkbox) {
              const node = document.getElementById("signup-fail");
              node.innerHTML =
                "Accepting terms & conditions is mandatory.<br>Read storage policies below.";
              return;
            }

            dbRef.child(UserId).set({
              inbox: INBOX,
              contacts: CONTACTS,
              password: hash(password)
            });
            dbRef
              .child("EmailDataBase")
              .child(email)
              .set(UserId);

            window.open("index.html", "_self");
          }
        }
        dbRef
          .child("EmailDataBase")
          .child(email)
          .once("value", local_reader2);
      }
    }

    dbRef.child(UserId).once("value", local_reader);
  }
  try {
    signupbtn.onclick = signup;
  } catch {}

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

    temp.classList.add("btn", "btn-outline-info", "contact-width");

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
  try {
    newIdBtn.onclick = createNewChat;
  } catch {}
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
  try {
    SEND.onclick = sendMessage;
  } catch {}
})();
