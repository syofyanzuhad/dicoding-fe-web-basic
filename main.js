(() => {
  let bookShelf = [];
  function addBook(event) {
    event.preventDefault();
    const title = document.querySelector("#inputBookTitle"),
      author = document.querySelector("#inputBookAuthor"),
      year = document.querySelector("#inputBookYear"),
      isComplete = document.querySelector("#inputBookIsComplete"),
      book = {
        id: +new Date(),
        title: title.value,
        author: author.value,
        year: year.value,
        isComplete: isComplete.checked,
      };
    console.log(book),
      bookShelf.push(book),
      document.dispatchEvent(new Event("bookChanged"));
  }
  function searchBook(event) {
    event.preventDefault();
    const keyword = document.querySelector("#searchBookTitle");
    (query = keyword.value),
      query
        ? utils(
            bookShelf.filter(function (book) {
              return book.title.toLowerCase().includes(query.toLowerCase());
            })
          )
        : utils(bookShelf);
  }
  function completeRead(event) {
    const target = Number(event.target.id),
      index = bookShelf.findIndex(function (book) {
        return book.id === target;
      });
    -1 !== index &&
      ((bookShelf[index] = { ...bookShelf[index], isComplete: !0 }),
      document.dispatchEvent(new Event("bookChanged")));
  }
  function uncompleteRead(event) {
    const target = Number(event.target.id),
      index = bookShelf.findIndex(function (book) {
        return book.id === target;
      });
    -1 !== index &&
      ((bookShelf[index] = { ...bookShelf[index], isComplete: !1 }),
      document.dispatchEvent(new Event("bookChanged")));
  }
  function deleteBook(event) {
    let bookTitle = '', bookYear = '', author = '';
    const target = Number(event.target.id),
      index = bookShelf.findIndex(function (book) {
        bookTitle = book.title;
        bookYear = book.year;
        author = book.author;
        return book.id === target;
      });
    if (
      confirm(
        `Apakah Anda ingin menghapus buku ${bookTitle} (${author} - ${bookYear})?`
      )
    ) {
      -1 !== index &&
        (bookShelf.splice(bookShelf, 1),
        document.dispatchEvent(new Event("bookChanged")));
    }
  }
  function utils(e) {
    const incompleteBook = document.querySelector("#incompleteBookshelfList"),
      completeBook = document.querySelector("#completeBookshelfList");
    (incompleteBook.innerHTML = ""), (completeBook.innerHTML = "");
    for (const book of e) {
      const article = document.createElement("article");
      article.classList.add("book_item");
      const title = document.createElement("h2");
      title.innerText = book.title;
      const author = document.createElement("p");
      author.innerText = "Penulis: " + book.author;
      const year = document.createElement("p");
      if (
        ((year.innerText = "Tahun: " + book.year),
        article.appendChild(title),
        article.appendChild(author),
        article.appendChild(year),
        book.isComplete)
      ) {
        const incompleteBook = document.createElement("div");
        incompleteBook.classList.add("action");
        const unButton = document.createElement("button");
        (unButton.id = book.id),
          (unButton.innerText = "Belum Selesai dibaca"),
          unButton.classList.add("green"),
          unButton.addEventListener("click", uncompleteRead);
        const delButton = document.createElement("button");
        (delButton.id = book.id),
          (delButton.innerText = "Hapus buku"),
          delButton.classList.add("red"),
          delButton.addEventListener("click", deleteBook),
          incompleteBook.appendChild(unButton),
          incompleteBook.appendChild(delButton),
          article.appendChild(incompleteBook),
          completeBook.appendChild(article);
      } else {
        const container = document.createElement("div");
        container.classList.add("action");
        const complButton = document.createElement("button");
        (complButton.id = book.id),
          (complButton.innerText = "Selesai dibaca"),
          complButton.classList.add("green"),
          complButton.addEventListener("click", completeRead);
        const delButton = document.createElement("button");
        (delButton.id = book.id),
          (delButton.innerText = "Hapus buku"),
          delButton.classList.add("red"),
          delButton.addEventListener("click", deleteBook),
          container.appendChild(complButton),
          container.appendChild(delButton),
          article.appendChild(container),
          incompleteBook.appendChild(article);
      }
    }
  }
  function save() {
    var e;
    (e = bookShelf),
      localStorage.setItem("books", JSON.stringify(e)),
      utils(bookShelf);
  }
  function isStorageExist() {
    return (
      void 0 !== typeof Storage ||
      (alert("Browser kamu tidak mendukung local storage"), !1)
    );
  }
  document.addEventListener("DOMContentLoaded", function () {
    const formInput = document.querySelector("#inputBook"),
      search = document.querySelector("#searchBook");
    formInput.addEventListener("submit", addBook),
      search.addEventListener("submit", searchBook),
      document.addEventListener("bookChanged", save),
      isStorageExist() &&
        ((bookShelf = JSON.parse(localStorage.getItem("books")) || []),
        utils(bookShelf));
  });
})();
