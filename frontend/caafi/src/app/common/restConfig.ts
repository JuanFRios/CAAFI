import { baseURL } from './baseurl';

// Function for setting the default restangular configuration
export function RestangularConfigFactory (RestangularProvider,Restangular) {
  RestangularProvider.setBaseUrl(baseURL);
  RestangularProvider.setDefaultHeaders({"Access-Control-Allow-Origin" : "*","X-Requested-With":"XMLHttpRequest"});
  RestangularProvider.setDefaultHttpFields({
	    withCredentials: true
	});
 
  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
	  if (response.status === 401) {
		 // localStorage.removeItem('tokenUser');
	  }
	  });
}
