import axios from 'axios';

const api = axios.create({
  baseURL: "http://10.140.0.11:8080/v1",
  headers: {
    'Content-Type': 'application/json',
  },
});

// // --- Auth Service ---
// export const authService = {
//   login: async (credentials: any) => {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   },
//   register: async (data: any) => {
//     const response = await api.post('/auth/register', data);
//     return response.data;
//   },
//   getProfile: async () => {
//     const response = await api.get('/auth/me');
//     return response.data;
//   },
// };

// // --- Dashboard Service ---
// export const dashboardService = {
//   getPendingCounts: async () => {
//     const response = await api.get('/dashboard/pending-counts');
//     return response.data;
//   },
// };


// // --- Fund Service ---
// export const fundService = {
//   list: async () => {
//     const response = await api.get('/funds');
//     return response.data;
//   },
//   create: async (data: any) => {
//     const response = await api.post('/funds', data);
//     return response.data;
//   },
//   getById: async (id: string) => {
//     const response = await api.get(`/funds/${id}`);
//     return response.data;
//   },
//   approve: async (id: string, status: 'APPROVED' | 'REJECTED', fundWalletPublicKey?: string) => {
//     const response = await api.patch(`/funds/${id}/approval`, { 
//       status,
//       ...(fundWalletPublicKey && { fundWalletPublicKey })
//     });
//     return response.data;
//   },
//   deactivate: async (id: string) => {
//     const response = await api.patch(`/funds/${id}/deactivate`);
//     return response.data;
//   },
//   issueQuotas: async (id: string, amount: number) => {
//     const response = await api.post(`/funds/${id}/issue`, { amount });
//     return response.data;
//   },
// };


export default api;
