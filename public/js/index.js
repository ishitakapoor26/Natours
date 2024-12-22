import { login, logout, signup } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { addReview } from "./review";
import { showAlert } from "./alerts";
import { deleteTour, createTour } from "./manageTour";

// DOM elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const updateDataForm = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-password");
const logoutBtn = document.querySelector(".nav__el--logout");
const bookBtn = document.getElementById("book-tour");
const reviewForm = document.querySelector(".form--review");
const addTour = document.querySelector(".form--createTour");
const addLocationBtn = document.getElementById("add-location");
const addDates = document.getElementById("add-dates");

document.addEventListener("click", async (e) => {
  const deleteIcon = e.target.closest("#deleteTour");
  if (deleteIcon) {
    const tourId = deleteIcon.dataset.tourId;
    console.log("Tour ID:", tourId);
    if (tourId) await deleteTour(deleteIcon, tourId);
  }
});

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

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage);

let locationIndex = 0;
if (addLocationBtn) {
  addLocationBtn.addEventListener("click", () => {
    const locationsWrapper = document.getElementById("locations-wrapper");

    const newLocationFields = document.createElement("div");
    newLocationFields.classList.add("location-fields", "ma-bt-md");
    newLocationFields.innerHTML = `
      <label class="form__label">Tour Coordinates</label>
      <input class="form__input" type="text" placeholder="Coordinates" id="coordinates-${locationIndex}" required>
      <label class="form__label">Location Description</label>
      <input class="form__input" type="text" placeholder="Description" id="description-${locationIndex}" required>
      <label class="form__label">Location Day</label>
      <input class="form__input" type="number" placeholder="Day" id="day-${locationIndex}" required>
    `;
    locationsWrapper.appendChild(newLocationFields);
    locationIndex++;
  });
}

if (addTour) {
  addTour.addEventListener("submit", async (e) => {
    e.preventDefault();
    let locations = [];
    let startDates = [];

    // Gather location data
    for (let i = 0; i < locationIndex; i++) {
      const coordinates = document
        .getElementById(`coordinates-${i}`)
        .value.split(",")
        .map((coord) => parseFloat(coord.trim()));
      const description = document.getElementById(`description-${i}`).value;
      const day = document.getElementById(`day-${i}`).value;

      if (coordinates && description && day) {
        locations.push({
          type: "Point", // Ensuring proper geospatial format
          coordinates: coordinates, // [longitude, latitude]
          description,
          day: parseInt(day),
        });
      }
    }

    // Gather start dates
    for (let i = 0; i < dateIndex; i++) {
      const date = document.getElementById(`dates-${i}`).value;

      if (date) {
        startDates.push(date); // Push directly into the array
      }
    }

    // Debug logs
    console.log("Locations: ", locations);
    console.log("Start Dates: ", startDates);

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append("name", document.getElementById("tour-name").value);
    formData.append("summary", document.getElementById("tour-summary").value);
    formData.append(
      "description",
      document.getElementById("tour-description").value
    );
    formData.append(
      "difficulty",
      document.getElementById("tour-difficulty").value.toLowerCase()
    );
    formData.append(
      "price",
      parseFloat(document.getElementById("tour-price").value)
    );
    formData.append(
      "duration",
      parseInt(document.getElementById("tour-duration").value)
    );
    formData.append(
      "maxGroupSize",
      parseInt(document.getElementById("tour-groupSize").value)
    );

    // Add locations array as individual objects
    locations.forEach((location, index) => {
      formData.append(`locations[${index}][type]`, location.type);
      formData.append(
        `locations[${index}][coordinates][]`,
        location.coordinates[0]
      );
      formData.append(
        `locations[${index}][coordinates][]`,
        location.coordinates[1]
      );
      formData.append(`locations[${index}][description]`, location.description);
      formData.append(`locations[${index}][day]`, location.day);
    });

    // Add startDates array as individual items
    startDates.forEach((date, index) => {
      formData.append(`startDates[${index}]`, date);
    });

    formData.append(
      "imageCover",
      document.getElementById("tour-cover-image").files[0]
    );
    for (const file of document.getElementById("tour-images").files) {
      formData.append("images", file); // Append multiple images
    }

    formData.append("startLocation", locations[0]);

    // Debug logs to verify FormData
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    // Send the form data
    createTour(formData);
  });
}

let dateIndex = 0;
if (addDates) {
  addDates.addEventListener("click", (e) => {
    e.preventDefault();
    const datesWrapper = document.getElementById("dates-wrapper");
    const newDatesField = document.createElement("div");
    newDatesField.classList.add("date-fields", "ma-bt-md");
    newDatesField.innerHTML = `<label class="form__label">Tour Dates</label>
      <input class="form__input" type="date" placeholder="Coordinates" id="dates-${dateIndex}" required>`;
    datesWrapper.appendChild(newDatesField);
    dateIndex++;
  });
}
