const initialState = {
  state: {
    socialSecurityNumber: "",
    email: "",
    phoneNumber: "",
    country: "",
  },
};
export const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SEND_FORM":
      return {
        ...state,
        state: {
          socialSecurityNumber: action.payload.socialSecurityNumber,
          email: action.payload.email,
          phoneNumber: action.payload.phoneNumber,
          country: action.payload.country,
        },
      };
    default:
      return state;
  }
};
