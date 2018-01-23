import { baseURL } from './baseurl';

// Function for setting the default restangular configuration
export function RestangularConfigFactory (RestangularProvider) {
  RestangularProvider.setBaseUrl(baseURL);
  RestangularProvider.setDefaultHeaders({"Access-Control-Allow-Origin" : "*","X-Requested-With":"XMLHttpRequest"});
  RestangularProvider.setDefaultHttpFields({
	    withCredentials: true
	});
}
