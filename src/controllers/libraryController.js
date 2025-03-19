const Library = require("../models/library");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Library.find().populate("borrowedBy", "name email");
    return res.status(200).json({
        status: "success",
        message: "Books retrieved successfully",
        data: books
    });
});

// Get a single book
const getBookById = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const book = await Library.findById(bookId).populate("borrowedBy", "name email");

    if (!book) {
        return res.status(404).json({ status: "error", message: "Book not found" });
    }

    return res.status(200).json({
        status: "success",
        message: "Book retrieved successfully",
        data: book
    });
});

// Add a new book
const addBook = asyncHandler(async (req, res) => {
    const { title, author, genre, year, description, imageUrl, stock } = req.body;
console.log(req.body);

    const book = await Library.create({
        title,
        author,
        genre,
        year,
        description,
        imageUrl,
        stock,
        available: stock > 0
    });

    return res.status(201).json({
        status: "success",
        message: "Book added successfully",
        data: book
    });
});

// Update book details
const updateBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { title, author, genre, year, description, imageUrl, stock } = req.body;

    const book = await Library.findById(bookId);

    if (!book) {
        return res.status(404).json({ status: "error", message: "Book not found" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.year = year || book.year;
    book.description = description || book.description;
    book.imageUrl = imageUrl || book.imageUrl;
    book.stock = stock !== undefined ? stock : book.stock;
    book.available = book.stock > 0;

    await book.save();

    return res.status(200).json({
        status: "success",
        message: "Book updated successfully",
        data: book
    });
});

// Delete a book
const deleteBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const book = await Library.findByIdAndDelete(bookId);

    if (!book) {
        return res.status(404).json({ status: "error", message: "Book not found" });
    }

    return res.status(200).json({
        status: "success",
        message: "Book deleted successfully",
        data: book
    });
});

// Borrow a book
const borrowBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { userId, returnDate } = req.body;

    const book = await Library.findById(bookId);
    if (!book) {
        return res.status(404).json({ status: "error", message: "Book not found" });
    }

    if (!book.available || book.stock === 0) {
        return res.status(400).json({ status: "error", message: "Book is not available for borrowing" });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }

    book.borrowedBy = userId;
    book.borrowedAt = new Date();
    book.returnDate = returnDate;
    book.stock -= 1;
    book.available = book.stock > 0;

    await book.save();

    return res.status(200).json({
        status: "success",
        message: "Book borrowed successfully",
        data: {
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            borrowedBy: user.name,
            borrowedAt: book.borrowedAt,
            returnDate: book.returnDate,
            stock: book.stock,
            available: book.available
        }
    });
});

// Return a book
const returnBook = asyncHandler(async (req, res) => {
    const { bookId } = req.params;

    const book = await Library.findById(bookId);
    if (!book) {
        return res.status(404).json({ status: "error", message: "Book not found" });
    }

    if (!book.borrowedBy) {
        return res.status(400).json({ status: "error", message: "Book is not currently borrowed" });
    }

    book.borrowedBy = null;
    book.borrowedAt = null;
    book.returnDate = null;
    book.stock += 1;
    book.available = true;

    await book.save();

    return res.status(200).json({
        status: "success",
        message: "Book returned successfully",
        data: book
    });
});

module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
};
