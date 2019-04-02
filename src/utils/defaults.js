export const checkIfActiveUser = () => {
  if (!sessionStorage.getItem("active_user")) {
   return  window.location.pathname = "users";
  }
};
