import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function (state = initialState, action) {
  // Type is mandatory, and payload is data
  const { type, payload } = action; // Destructure action

  switch (type) {
    case SET_ALERT: // To set an alert
      return [...state, payload]; // Need to include any other state and add our new alert
    case REMOVE_ALERT: // To remove an alert by its id by filtering through it
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
