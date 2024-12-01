//Modal

const helpButton = document.querySelector(".help"); 
const modal = document.getElementById("helpModal");  
const closeButton = document.querySelector(".close");  


helpButton.addEventListener("click", () => {
    modal.style.display = "block";
});


closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});


window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

//Notas

const notesContainer = document.getElementById("app");
const addNoteButton = notesContainer.querySelector(".add-note");

getNotes().forEach((note) => {
    const noteElement = createNoteElements(note.id, note.content, note.top, note.left);
    notesContainer.insertBefore(noteElement, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElements(id, content, top = 50, left = 50) {
    const element = document.createElement("textarea");

    element.classList.add("notes");
    element.value = content;
    element.placeholder = "Empty Sticky Note";

    // Posición inicial o restaurada
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;

    // Hacer que las notas sean de solo lectura al iniciar
    element.setAttribute("readonly", true);

    // Eventos para habilitar edición con doble clic
    element.addEventListener("dblclick", () => {
        element.removeAttribute("readonly");
        element.focus();
    });

    // Guardar cambios al salir de la nota
    element.addEventListener("blur", () => {
        element.setAttribute("readonly", true);
        updateNotes(id, element.value, parseInt(element.style.top), parseInt(element.style.left));
    });

    // Eventos para eliminar nota
    element.addEventListener("click", (event) => {
        if (event.ctrlKey) {
            const doDelete = confirm("Are you sure you want to delete this note?");
            if (doDelete) {
                deleteNote(id, element);
            }
        }
    });

    // Drag and drop
    element.addEventListener("mousedown", (event) => {
        event.preventDefault();
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = `${pageX - shiftX}px`;
            element.style.top = `${pageY - shiftY}px`;
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMouseMove);
            updateNotes(id, element.value, parseInt(element.style.top), parseInt(element.style.left));
        }, { once: true });
    });

    return element;
}

function addNote() {
    const notes = getNotes();
    const noteObject = {
        id: Date.now(),
        content: "",
        top: 50,
        left: 50,
    };

    const noteElement = createNoteElements(noteObject.id, noteObject.content, noteObject.top, noteObject.left);
    notesContainer.insertBefore(noteElement, addNoteButton);

    notes.push(noteObject);
    saveNotes(notes);
}

function updateNotes(id, newContent, top, left) {
    const notes = getNotes();
    const targetNote = notes.find((note) => note.id === id);

    if (targetNote) {
        targetNote.content = newContent;
        targetNote.top = top;
        targetNote.left = left;
        saveNotes(notes);
    }
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);
    notesContainer.removeChild(element);
}
