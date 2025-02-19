const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

app.use(express.json());

// เชื่อมต่อฐานข้อมูล SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './Database/SQBooks.sqlite'
});

// กำหนด Model หนังสือ
const Book = sequelize.define('book', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// สร้างตาราง
sequelize.sync({ force: false }); // ทำให้ไม่ลบข้อมูลเก่า

// ดึงข้อมูลหนังสือทั้งหมด
app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while fetching books');
    }
});

// ดึงข้อมูลหนังสือจาก ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while fetching the book');
    }
});

// สร้างหนังสือใหม่
app.post('/books', async (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Title and author are required');
    }
    try {
        const book = await Book.create(req.body);
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while creating the book');
    }
});

// อัปเดตข้อมูลหนังสือ
app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await book.update(req.body);
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while updating the book');
    }
});

// ลบหนังสือ
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await book.destroy();
        res.send({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error while deleting the book');
    }
});

// เริ่มเซิร์ฟเวอร์
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
