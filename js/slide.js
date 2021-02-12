const db = firebase.firestore();

const menu1 = document.getElementById("menu1");
const menu2 = document.getElementById("menu2");
const menu3 = document.getElementById("menu3");

const section1 = document.getElementById("section-1");
const section2 = document.getElementById("section-2");
const section3 = document.getElementById("section-3");


let id = '';

const getTasks = () => db.collection("precios").get();
const onGetTasks = (callback) => db.collection("precios").onSnapshot(callback);
const getTask = (id) => db.collection("precios").doc(id).get();

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    menu1.innerHTML = "";
    menu2.innerHTML = "";
    menu3.innerHTML = "";
    
    var cont = 1;
    querySnapshot.forEach((doc) => {
      const task = doc.data();

      if(cont < 10){
        menu1.innerHTML += `<tr>
            <td>${task.producto}</td>
            <td>${task.precio}</td>
        </tr>`;
      }
      if(cont >= 10 && cont < 20){
        menu2.innerHTML += `<tr>
            <td>${task.producto}</td>
            <td>${task.precio}</td>
        </tr>`;
      }
      if(cont >= 20 && cont < 30) {
        menu3.innerHTML += `<tr>
            <td>${task.producto}</td>
            <td>${task.precio}</td>
        </tr>`;
      }
      ++cont;

    });

  });
});