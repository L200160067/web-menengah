class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set noteData(data) {
        const { title, body, createdAt } = data;
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    margin-bottom: 10px;
                }
                h2 {
                    margin: 0 0 10px 0;
                }
                p {
                    margin: 0;
                }
                time {
                    display: block;
                    margin-top: 10px;
                    font-size: 0.8em;
                    color: #666;
                }
            </style>
            <div>
                <h2>${title}</h2>
                <p>${body}</p>
                <time>${new Date(createdAt).toLocaleString()}</time>
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
                    margin-bottom: 20px;
                }
                input, textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    background-color: #6200ea;
                    color: #fff;
                    cursor: pointer;
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
        const createdAt = new Date().toISOString();
        const newNote = { title, body, createdAt, archived: false };

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
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
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
        this.renderNotes();  // Ensure this is only called once
    }

    renderNotes() {
        const notesList = this.shadowRoot.querySelector('#notes-list');
        notesList.innerHTML = '';  // Clear previous notes
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
    if (!document.querySelector('note-app')) {
        const app = document.createElement('note-app');
        document.body.appendChild(app);
    }
});
