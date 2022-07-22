class Todo {
    constructor(name, state) {
        this.name = name;
        this.state = state;
    }
}

const todos = [];
const states = ["active", "inactive", "done"];
const tabs = ["all"].concat(states);

console.log(tabs);

const form = document.getElementById("new-todo-form");
const input = document.getElementById("new-todo-title");

form.onsubmit = event => {
    event.preventDefault(); // meggátoljuk az alapértelmezett működést, ami frissítené az oldalt
    if (input.value && input.value.length) { // ha érvényes érték van benne
        todos.push(new Todo(input.value, "active")); // új to-do-t aktív állapotban hozunk létre
        input.value = ""; // kiürítjük az inputot
        renderTodos();
    }
}

class Button {
    constructor(action, icon, type, title) {
        this.action = action; // a művelet, amit a gomb végez
        this.icon = icon; // a FontAwesome ikon neve (class="fas fa-*")
        this.type = type; // a gomb Bootstrapbeni típusa ("secondary", "danger" stb.)
        this.title = title; // a gomb tooltip szövege
    }
}

const buttons = [ // a gombokat reprezentáló modell objektumok tömbje
    new Button("done", "check", "success", "Mark as done"),
    new Button("active", "plus", "secondary", "Mark as active"),
    // az objektumot dinamikusan is kezelhetjük, ekkor nem a konstruktorral példányosítjuk:
    { action: "inactive", icon: "minus", type: "secondary", title: "Mark as inactive" },
    new Button("remove", "trash", "danger", "Remove"),
];

function createElementFromHTML(html) {
    const virtualElement = document.createElement("div");
    virtualElement.innerHTML = html;
    return virtualElement.childElementCount == 1 ? virtualElement.firstChild : virtualElement.children;
}

function renderTodos() {
    const todoList = document.getElementById("todo-list"); // megkeressük a konténert, ahová az elemeket tesszük
    todoList.innerHTML = ""; // a jelenleg a DOM-ban levő to-do elemeket töröljük
    todos.forEach(todo => { // bejárjuk a jelenlegi todo elemeket (alternatív, funkcionális bejárással)
        const row = createElementFromHTML(
            `<div class="row">
                <div class="col d-flex p-0">
                    <a class="list-group-item flex-grow-1" href="#">
                        ${todo.name}
                    </a>
                    <div class="btn-group action-buttons"></div>
                </div>
            </div>`);

        buttons.forEach(button => { // a gomb modellek alapján legyártjuk a DOM gombokat
            const btn = createElementFromHTML(
                `<button class="btn btn-outline-${button.type} fas fa-${button.icon}" title="${button.title}"></button>`
            );
            if (todo.state === button.action) // azt a gombot letiljuk, amilyen állapotban van egy elem
                btn.disabled = true;

            btn.onclick = () => { // klikk eseményre
                if (button.action === "remove") { // ha törlés
                    if (confirm("Are you sure you want to delete the todo titled '" + todo.name + "'?")) { // megerősítés után
                        todos.splice(todos.indexOf(todo), 1); // kiveszünk a 'todo'-adik elemtől 1 elemet a todos tömbből
                        renderTodos();
                    }
                }
                else { // ha nem törlés
                    todo.state = button.action; // átállítjuk a kiválasztott todo állapotát a gomb állapotára
                    renderTodos();
                }
            }

            row.querySelector(".action-buttons").appendChild(btn); // a virtuális elem gomb konténerébe beletesszük a gombot
        });

        todoList.appendChild(row); // az összeállított HTML-t a DOM-ban levő #todo-list elemhez fűzzük
    });

    document.querySelector(".todo-tab[data-tab-name='all'] .badge").innerHTML = todos.length || "";

    for (let state of states)
        document.querySelector(`.todo-tab[data-tab-name='${state}'] .badge`).innerHTML = todos.filter(t => t.state === state).length || "";
}

renderTodos(); // kezdeti állapot kirajzolása

let currentTab; // a jelenleg kiválasztott fül

function selectTab(type) {
    currentTab = type; // eltároljuk a jelenlegi fül értéket
    for (let tab of document.getElementsByClassName("todo-tab")) {
        tab.classList.remove("active"); // az összes fülről levesszük az .active osztályt
        if (tab.getAttribute("data-tab-name") == type) // ha ez a fül van épp kiválasztva
            tab.classList.add("active"); // erre az egyre visszatesszük az .active osztályt
    }

    renderTodos(); // újrarajzolunk mindent
}

selectTab("all"); // app indulásakor kiválasztjuk az "all" fület