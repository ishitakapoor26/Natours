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
