import "./App.css";
import { Book, BookInformation, Review, User } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./components/Card";

// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы, автор книги и автор отзыва.
// Данные об отзывах и пользователях можно получить при помощи асинхронных
// функций getUsers, getReviews

// функция getBooks возвращает Promise<Book[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>

// В объектах реализующих интерфейс Book указаны только uuid
// пользователей и обзоров

// // В объектах реализующих интерфейс BookInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.
const toBookInformation = (book: Book, users: User[], reviews: Review[]): BookInformation => {
  if (users && reviews) {
    const user = users.find((u) => u.id === book.authorId);
    const bookReviews = reviews
      .filter((review) => book.reviewIds.includes(review.id))
      .map((review) => {
        const reviewUser = users.find((user) => user.id === review.userId);
        return {
          id: review.id,
          user: reviewUser!,
          text: review.text,
        };
      });
    return {
      id: book.id,
      name: book.name || "Книга без названия",
      author: { name: user?.name || "Test Author", id: user?.id || "id" },
      reviews: bookReviews,
      description: book.description
    };
  }
  return {
    id: book.id,
    name: book.name || "Книга без названия",
    author: { name: "Test Author", id: "id" },
    reviews: [
      { id: "test", text: "test text", user: { id: "sdf", name: "Reviewer" } }
    ],
    description: book.description
  };
};

const App: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const fetchedBooks = await getBooks();
      const fetchedUsers = await getUsers();
      const fetchedReviews = await getReviews();
      setBooks(fetchedBooks);
      setUsers(fetchedUsers);
      setReviews(fetchedReviews);
      setIsLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        books.map((b) => <Card key={b.id} book={toBookInformation(b, users, reviews)} />)}
    </div>
  );
};

export default App;

