import axios from "axios";
import { showAlert } from "./alerts";

export const deleteTour = async (deleteIcon, tourId) => {
  // console.log("deleteTour function called with ID:", tourId);
  try {
    const res = await axios({
      method: "DELETE",
      url: `api/v1/tours/${tourId}`,
      data: null,
    });
    console.log(res);

    if (res.status === 204) {
      showAlert("success", "Tour Deleted Successfully!");
      // window.setTimeout(() => {
      //   location.assign("/");
      // }, 1500);
      //  Fade out and remove the card
      const tourCard = deleteIcon.closest(".card");
      if (tourCard) {
        tourCard.style.transition = "opacity 0.5s";
        tourCard.style.opacity = "0";
        setTimeout(() => {
          tourCard.remove();
        }, 500);
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const createTour = async (data) => {
  try {
    // console.log(data);
    const res = await axios({
      method: "POST",
      url: "/api/v1/tours/",
      data,
    });
    console.log(res);
    if (res.status === 201) {
      showAlert("success", "Tour Created Successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.deleteBooking = async (deleteBookingIcon, tourId) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `api/v1/booking/${tourId}/tour`,
      data: null,
    });
    console.log(res);

    if (res.status === 204) {
      showAlert("success", "Booking Deleted Successfully!");
      // window.setTimeout(() => {
      //   location.assign("/");
      // }, 1500);
      //  Fade out and remove the card
      const tourCard = deleteBookingIcon.closest(".card");
      if (tourCard) {
        tourCard.style.transition = "opacity 0.5s";
        tourCard.style.opacity = "0";
        setTimeout(() => {
          tourCard.remove();
        }, 500);
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

exports.updateTourDetails = async (tourId, data) => {
  try {
    for (let [key, value] of data.entries()) {
      console.log(key, value); // Log all FormData entries
    }
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/tours/${tourId}`,
      data,
    });
    console.log(res);
    if (res.status === 201) {
      window.setTimeout(() => {
        showAlert("success", "Tour Updated Successfully!");
        location.assign("/manage-tours");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
