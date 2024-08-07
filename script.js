class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set noteData(data) {
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
            </style>
            <div>
                <h2>${data.title}</h2>
                <p>${data.body}</p>
            </div>
        `;
    }
}

class NoteInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
            </style>
            <form id="note-form">
                <input type="text" id="title" placeholder="Title" required>
                <textarea id="body" rows="4" placeholder="Body" required></textarea>
                <button type="submit">Add Note</button>
            </form>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#note-form').addEventListener('submit', this.addNote.bind(this));
    }

    addNote = (event) => {
        event.preventDefault();
        const title = this.shadowRoot.querySelector('#title').value;
        const body = this.shadowRoot.querySelector('#body').value;

        const newNote = { title, body };
        document.querySelector('note-app').addNoteToList(newNote);

        this.shadowRoot.querySelector('#note-form').reset();
    }
}

class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    width: 100%;
                    background-color: #6200ea;
                    color: #fff;
                    padding: 15px;
                    text-align: center;
                    font-size: 1.5em;
                }
            </style>
            <div>
                Note App
            </div>
        `;
    }
}

class NoteApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                #notes-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }
            </style>
            <app-bar></app-bar>
            <main>
                <note-input></note-input>
                <section id="notes-list">
                    <!-- Notes will be appended here -->
                </section>
            </main>
        `;
    }

    connectedCallback() {
        this.renderNotes();
    }

    renderNotes() {
        const notesList = this.shadowRoot.querySelector('#notes-list');
        notesData.forEach(note => {
            const noteItem = document.createElement('note-item');
            noteItem.noteData = note;
            notesList.appendChild(noteItem);
        });
    }

    addNoteToList(note) {
        const notesList = this.shadowRoot.querySelector('#notes-list');
        const noteItem = document.createElement('note-item');
        noteItem.noteData = note;
        notesList.appendChild(noteItem);
    }
}

customElements.define('note-item', NoteItem);
customElements.define('note-input', NoteInput);
customElements.define('app-bar', AppBar);
customElements.define('note-app', NoteApp);

document.addEventListener('DOMContentLoaded', () => {
    const app = document.createElement('note-app');
    document.body.appendChild(app);
});
