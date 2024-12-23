import { login, logout, signup } from "./login";
import { displayMap } from "./mapbox";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { addReview } from "./review";
import { showAlert } from "./alerts";
import {
  deleteTour,
  createTour,
  deleteBooking,
  updateTourDetails,
} from "./manageTour";

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
const updateTour = document.querySelector(".form--updateTour");

document.addEventListener("click", async (e) => {
  const deleteIcon = e.target.closest("#deleteTour");
  if (deleteIcon) {
    const tourId = deleteIcon.dataset.tourId;
    console.log("Tour ID:", tourId);
    if (tourId) await deleteTour(deleteIcon, tourId);
  }
});

document.addEventListener("click", async (e) => {
  const deleteBookingIcon = e.target.closest("#deleteBooking");
  if (deleteBookingIcon) {
    const tourId = deleteBookingIcon.dataset.tourId;
    console.log("Tour ID:", tourId);
    if (tourId) await deleteBooking(deleteBookingIcon, tourId);
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
      <input class="form__input" type="text" placeholder="Coordinates" id="coordinates-${locationIndex}">
      <label class="form__label">Location Description</label>
      <input class="form__input" type="text" placeholder="Description" id="description-${locationIndex}">
      <label class="form__label">Location Day</label>
      <input class="form__input" type="number" placeholder="Day" id="day-${locationIndex}">
    `;
    locationsWrapper.appendChild(newLocationFields);
    locationIndex++;
  });
}

// Function to gather locations data
function gatherLocationsData(locationIndex) {
  const locations = [];
  for (let i = 0; i < locationIndex; i++) {
    const coordinates = document
      .getElementById(`coordinates-${i}`)
      .value.split(",")
      .map((coord) => parseFloat(coord.trim()));
    const description = document.getElementById(`description-${i}`).value;
    const day = document.getElementById(`day-${i}`).value;

    if (coordinates && description && day) {
      locations.push({
        type: "Point",
        coordinates,
        description,
        day: parseInt(day),
      });
    }
  }
  return locations;
}

// Function to gather start dates
function gatherStartDates(dateIndex) {
  const startDates = [];
  for (let i = 0; i < dateIndex; i++) {
    const date = document.getElementById(`dates-${i}`).value;
    if (date) startDates.push(date);
  }
  return startDates;
}

// Function to create FormData from the tour form
function createFormData(locations, startDates) {
  const formData = new FormData();
  const fields = [
    { id: "tour-name", name: "name" },
    { id: "tour-summary", name: "summary" },
    { id: "tour-description", name: "description" },
    { id: "tour-difficulty", name: "difficulty" },
    { id: "tour-price", name: "price", parse: (value) => parseFloat(value) },
    {
      id: "tour-duration",
      name: "duration",
      parse: (value) => parseInt(value),
    },
    {
      id: "tour-groupSize",
      name: "maxGroupSize",
      parse: (value) => parseInt(value),
    },
  ];

  // Append basic fields to FormData
  fields.forEach(({ id, name, parse }) => {
    const value = document.getElementById(id).value;
    if (value) formData.append(name, parse ? parse(value) : value);
  });

  if (locations) {
    // Append locations data to FormData
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
    // Append startLocation if locations are available
    if (locations.length > 0) {
      formData.append("startLocation", JSON.stringify(locations[0]));
    }
  }

  if (startDates) {
    // Append start dates to FormData
    startDates.forEach((date, index) => {
      formData.append(`startDates[${index}]`, date);
    });
  }

  // Handle files (cover image and tour images)
  const imageCover = document.getElementById("tour-cover-image").files[0];
  if (imageCover) formData.append("imageCover", imageCover);

  const tourImages = document.getElementById("tour-images").files;
  if (tourImages.length > 0) {
    Array.from(tourImages).forEach((file) => formData.append("images", file));
  }

  return formData;
}

// Event listener for adding a tour
if (addTour) {
  addTour.addEventListener("submit", async (e) => {
    e.preventDefault();
    const locations = gatherLocationsData(locationIndex);
    const startDates = gatherStartDates(dateIndex);

    // Debug logs
    console.log("Locations: ", locations);
    console.log("Start Dates: ", startDates);

    // Create FormData and send it
    const formData = createFormData(locations, startDates);
    createTour(formData);
  });
}

// Event listener for adding dates dynamically
let dateIndex = 0;
if (addDates) {
  addDates.addEventListener("click", (e) => {
    e.preventDefault();
    const datesWrapper = document.getElementById("dates-wrapper");
    const newDatesField = document.createElement("div");
    newDatesField.classList.add("date-fields", "ma-bt-md");
    newDatesField.innerHTML = `<label class="form__label">Tour Dates</label>
      <input class="form__input" type="date" placeholder="Coordinates" id="dates-${dateIndex}">`;
    datesWrapper.appendChild(newDatesField);
    dateIndex++;
  });
}

// Event listener for updating a tour
if (updateTour) {
  updateTour.addEventListener("submit", async (e) => {
    e.preventDefault();
    const locations = gatherLocationsData(locationIndex);
    const startDates = gatherStartDates(dateIndex);

    // Debug logs
    console.log("Locations: ", locations);
    console.log("Start Dates: ", startDates);

    // Create FormData and send it
    const formData = createFormData(locations, startDates);
    const updateBtn = document.getElementById("updateBtn");
    const tourId = updateBtn.dataset.tourId;
    for (let [key, value] of formData.entries()) {
      console.log(key, value); // Log all FormData entries
    }
    updateTourDetails(tourId, formData);
  });
}
