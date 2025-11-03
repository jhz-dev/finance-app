import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_SEEN = "tour_seen";

export const useTour = () => {
  const startTour = (steps) => {
    const driverObj = driver({
      showProgress: true,
      steps,
      onDestroyed: () => {
        localStorage.setItem(TOUR_SEEN, "true");
      },
    });

    driverObj.drive();
  };

  const hasSeenTour = () => {
    return localStorage.getItem(TOUR_SEEN) === "true";
  };

  return { startTour, hasSeenTour };
};
