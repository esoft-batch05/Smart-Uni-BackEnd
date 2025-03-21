const express = require("express");
const {
   getAllBooks,
   getBookById,
   addBook,
   updateBook,
   deleteBook,
   borrowBook,
   returnBook
} = require("../controllers/libraryController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getAllBooks",  getAllBooks);
router.get("/getBookById/:bookId", protect, getBookById);
router.post("/addBook",protect, addBook);
router.post("/updateBook/:bookId", protect, updateBook);
router.delete("/deleteBook/:bookId", protect, deleteBook);
router.post("/borrowBook/:bookId", protect, borrowBook);
router.post("/returnBook/:bookId", protect, returnBook);

module.exports = router;