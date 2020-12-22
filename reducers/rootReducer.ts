const initialState = {
  state: {
    socialSecurityNumber: "",
    phoneNumber: "",
    email: "",
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
          phoneNumber: action.payload.phoneNumber,
          email: action.payload.email,
          country: action.payload.country,
        },
      };
    default:
      return state;
  }
};
