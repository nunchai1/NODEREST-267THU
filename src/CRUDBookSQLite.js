// CRUDBookSQLite.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./Database/Book.sqlite');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT
)`);

// Route to get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

// Route to get a book by id
app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).send('Book not found');
        }
    });
});

// Route to create a new book
app.post('/books', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', 
        [book.title, book.author], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ id: this.lastID });
        }
    });
});

// Route to update a book
app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', 
        [book.title, book.author, req.params.id], function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send('Book updated');
        }
    });
});

// Route to delete a book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send('Book deleted');
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
