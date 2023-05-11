import axios from 'axios';

const client = axios.create({
	baseURL: 'http://localhost:4000/api/',
	withCredentials: true,
});



client.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 403) {
			
			return (window.location.href = '/');
		}
		return Promise.reject(error);
	}
);

client.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 404) {
			
			return (window.location.href = '/');
		}
		return Promise.reject(error);
	}
);

export default client;


