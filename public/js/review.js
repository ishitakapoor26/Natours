import axios from "axios";
import { showAlert } from "./alerts";

export const addReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
    });
    // console.log(res);
    if (res.status === 201) {
      showAlert("success", "Review posted successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
