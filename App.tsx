import React from "react";
import { createStore } from "redux";
import { Form } from "./form/Form";
import { Provider } from "react-redux";
import { rootReducer } from "./reducers/rootReducer";

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <Form />
    </Provider>
  );
}
