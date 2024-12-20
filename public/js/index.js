import { login, logout, signup } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { addReview } from "./review";

// DOM elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const updateDataForm = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-password");
const logoutBtn = document.querySelector(".nav__el--logout");
const bookBtn = document.getElementById("book-tour");
const reviewForm = document.querySelector(".form--review");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // console.log(email, password);
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirm-password").value;
    // console.log(email, password, password, passwordConfirm);
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm-password").value = "";
    signup(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (updateDataForm) {
  updateDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    // console.log(form);
    await updateSettings(form, "Account Details");
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating.....";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "Save Password";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", async (e) => {
    e.target.textContent = "Processing....";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the button that was clicked using a query selector
    const submitButton = document.querySelector(".btn--submit-review");

    // Fetch the tourId from the data attribute
    const tourId = submitButton.dataset.tourId; // Fetch from the button's `data-tour-id`
    // console.log("Tour ID:", tourId);

    if (!tourId) {
      console.error("Tour ID is undefined!");
      return;
    }

    // Get the review and rating values
    const review = document.getElementById("review").value;
    const rating = document.getElementById("rating").value;

    // Update button text to indicate loading
    submitButton.textContent = "Posting Review...";

    // Call the addReview function with tourId, review, and rating
    await addReview(tourId, review, rating);
  });
}
