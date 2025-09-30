import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true
});

// const apiPost = async ({isLoadingState, errorState, body, url}) => {
//   try {
//     isLoadingState(true);
//     errorState('');
//     await api.post(url, body, {headers: {
//       'Authorization': `Bearer ${localStorage.getItem('access_token')}`
//     }});
//     isLoadingState(false);
//   }
//   catch (e) {
//     if (!e.status){
//       errorState('There is error with the server');
//     } else {
//       errorState(e.response.data.message);
//     }
//     isLoadingState(false);
//     return;
//   }
// }

export { api };