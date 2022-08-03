import { ToDo } from "./classes/ToDo.js";
const todo = document.getElementById("todo");
const cateogory = document.getElementById("category");
const sttus = document.querySelectorAll("[name=status]");
const container = document.querySelector(".todos");
const updateTodo = document.getElementById("update-todo");
const updateCateogory = document.getElementById("update-category");
const updateSttus = document.querySelectorAll("[name=update]");
const updateId = document.getElementById("update-id");
const toggleModalBtn = document.getElementById("toggle-modal");
const updateForm = document.getElementById("update-form");
const form = document.getElementById("todo-form");
var todos;
renderAll();
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let status;
    sttus.forEach((s) => {
        if (s.checked) {
            status = s.value == "true" ? true : false;
        }
    });
    const todoItem = {
        todo: todo.value,
        category: cateogory.value,
        status: status,
    };
    fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify(todoItem),
        headers: {
            "Content-type": "application/json"
        }
    });
    // renderAll();
    todo.focus();
});
function renderAll() {
    fetch("http://localhost:3000/todos")
        .then(res => res.json())
        .then((datas) => {
        todos = datas;
        container.innerHTML = "";
        if (datas.length > 0) {
            datas.forEach(d => {
                container.innerHTML += ToDo.format(d.id, d.todo, d.category, d.status);
            });
            const deleteBtns = document.querySelectorAll(".delete-btn");
            const toggleBtns = document.querySelectorAll(".toggle-status-btn");
            const updateBtns = document.querySelectorAll(".update-btn");
            deleteBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const target = Number(e.currentTarget.getAttribute("data-target"));
                    if (confirm(`Are you sure to delete?`)) {
                        fetch(`http://localhost:3000/todos/${target}`, {
                            method: "DELETE",
                        });
                    }
                });
            });
            toggleBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    let target = e.target.getAttribute("data-target");
                    let [id, status] = target.split(",");
                    if (confirm("Are you sure to change status?")) {
                        const data = datas.filter(d => {
                            return d.id == Number(id);
                        })[0];
                        fetch(`http://localhost:3000/todos/${id}`, {
                            headers: {
                                "Content-type": "application/json"
                            },
                            method: "PUT",
                            body: JSON.stringify({
                                todo: data.todo,
                                category: data.category,
                                status: status == "true" ? false : true,
                            })
                        });
                    }
                });
            });
            updateBtns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    let target = Number(e.target.getAttribute("data-target"));
                    const data = datas.filter(d => {
                        return d.id == Number(target);
                    })[0];
                    updateTodo.value = `${data.todo}`;
                    updateCateogory.value = data.category;
                    updateId.value = `${data.id}`;
                    // updateSttus.forEach( ( status : Node ) : void => {
                    //     if( ((status as HTMLInputElement).value == "true") == data.status )
                    //     {
                    //         (status as HTMLInputElement).checked;
                    //     }
                    // })
                    toggleModalBtn === null || toggleModalBtn === void 0 ? void 0 : toggleModalBtn.click();
                });
            });
        }
        else {
            container.innerHTML = "<tr class='text-center'><td colspan='5'>There is no todo!</td></tr>";
        }
    });
}
updateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let status;
    updateSttus.forEach((s) => {
        if (s.checked) {
            status = s.value == "true" ? true : false;
        }
    });
    console.log(updateTodo.value);
    fetch(`http://localhost:3000/todos/${Number(updateId.value)}`, {
        headers: {
            "Content-type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({
            todo: updateTodo.value,
            category: updateCateogory.value,
            status: status,
        })
    });
    toggleModalBtn === null || toggleModalBtn === void 0 ? void 0 : toggleModalBtn.click();
    renderAll();
});
