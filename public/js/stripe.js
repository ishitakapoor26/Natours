import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourID) => {
  const stripe = Stripe(
    "pk_test_51QOj8eLJJ4lraAB7b5IxZPAcNFQ9tF8gAEHnSJW5mx4EY8jiZc0AEyN8B8EQ5kSOfURajtZFtPYA47TNXugwzPKB00OUJbrHlI"
  );
  try {
    // 1. Get session from the server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourID}`
    );
    console.log(session);
    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
