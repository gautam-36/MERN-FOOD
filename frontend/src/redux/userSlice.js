import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: localStorage.getItem("email") || "",
  firstName: localStorage.getItem("firstName") || "",
  image: localStorage.getItem("image") || "",
  lastName: localStorage.getItem("lastName") || "",
  _id: localStorage.getItem("_id") || "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      const { _id, firstName, lastName, email, image } = action.payload.data;
      state._id = _id;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.image = image;

      // Save user data to localStorage
      localStorage.setItem("email", email);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("image", image);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("_id", _id);
    },
    logoutRedux: (state) => {
      state._id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.image = "";

      // Remove user data from localStorage
      localStorage.removeItem("email");
      localStorage.removeItem("firstName");
      localStorage.removeItem("image");
      localStorage.removeItem("lastName");
      localStorage.removeItem("_id");
    },
  },
});

export const { loginRedux, logoutRedux } = userSlice.actions;

export default userSlice.reducer;
