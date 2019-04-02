export const api_url = "https://opentdb.com";

export const getActiveUser = () =>
  JSON.parse(sessionStorage.getItem("active_user"));

export const checkIfActiveUser = () => !!getActiveUser();
