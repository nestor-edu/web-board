const db = firebase.firestore();

const taskForm = document.getElementById("form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} producto the title of the Task
 * @param {string} precio the description of the Task
 */
const saveTask = (producto, precio) =>
  db.collection("precios").doc().set({
    producto,
    precio,
  });

const getTasks = () => db.collection("precios").get();

const onGetTasks = (callback) => db.collection("precios").onSnapshot(callback);

const deleteTask = (id) => db.collection("precios").doc(id).delete();

const getTask = (id) => db.collection("precios").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('precios').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      
      tasksContainer.innerHTML += `<tr>
        <td>${task.producto}</td>
        <td>${task.precio}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-delete" data-id="${doc.id}">Eliminar</button>
        </td>
        <td>
          <button class="btn btn-success btn-sm btn-edit" data-id="${doc.id}">Actualizar</button>
        </td>
      </tr>`;
      
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-producto"].value = task.producto;
          taskForm["task-precio"].value = task.precio;

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Actualizar Producto";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const producto = taskForm["task-producto"];
  const precio = taskForm["task-precio"];

  try {
    if (!editStatus) {
      await saveTask(producto.value, precio.value);
    } else {
      await updateTask(id, {
        producto: producto.value,
        precio: precio.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Agregar Producto';
    }
    
    taskForm.reset();
    producto.focus();
  } catch (error) {
    console.log(error);
  }
});
