UserId = "";
receiver = "undefined";
(function() {
  // Your web app's Firebase configuration
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

  // function read(snap) {
  //   const node = document.getElementById("live_mssg");
  //   node.innerHTML = snap.val().name;
  // }

  // dbRef.on("value", read);

  const btn = document.getElementById("submit_button");
  const input = document.getElementById("user");
  const SendTag = document.getElementById("sender");
  const RTag = document.getElementById("receiver");

  INBOX = ["begin"];

  function login() {
    UserId = input.value;
    const node = document.getElementById("loginmenu");
    // node.style.visibility = "hidden";
    node.innerHTML = "<h1>Welcome to FireBird</h1>";
    SendTag.innerHTML = UserId;
    RTag.innerHTML = receiver;

    function local_reader(snap) {
      flag = snap.exists();
      if (!flag) {
        dbRef.child(UserId).set({
          inbox: INBOX
        });
      }
      if (flag) {
        console.log("Exists");
      }

      const node2 = document.getElementById("interface");
      node2.style.visibility = "visible";
    }

    IN = dbRef.child(UserId).once("value", local_reader);

    function live_inbox_feed(snap) {
      list = snap.val();
      const ul = document.getElementById("live_inbox");
      for (i = 1; i < list.length; i++) {
        var li = document.createElement("li");
        li.innerText = JSON.stringify(list[i]);
        ul.appendChild(li);
      }
    }
    dbRef
      .child(UserId)
      .child("inbox")
      .on("value", live_inbox_feed);
  }
  btn.onclick = login;

  const newIdBtn = document.getElementById("newuser");
  const inputNewUser = document.getElementById("newid");

  function selectChat() {
    receiver = this.innerHTML;
    RTag.innerHTML = receiver;
  }

  function createNewChat() {
    var li = document.createElement("li");
    var temp = document.createElement("button");
    temp.onclick = selectChat;
    temp.innerHTML = inputNewUser.value;
    li.appendChild(temp);
    var ul = document.getElementById("list");
    ul.appendChild(li);
  }

  newIdBtn.onclick = createNewChat;

  const SEND = document.getElementById("send_mssg");
  function sendMessage() {
    const text = document.getElementById("live_mssg").value;
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
        list.push({ sender: UserId, message: text });
        // console.log(list);

        dbRef
          .child(receiver)
          .child("inbox")
          .set(list);
      }

      if (flag) {
        console.log("OK");
        dbRef
          .child(receiver)
          .child("inbox")
          .once("value", update_inbox);
      }
    }

    IN = dbRef.child(receiver).once("value", local_reader);

    document.getElementById("live_mssg").value = "";
  }
  SEND.onclick = sendMessage;
})();
