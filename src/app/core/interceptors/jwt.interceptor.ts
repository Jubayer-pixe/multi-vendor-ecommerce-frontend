
import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Attach JWT only to our backend API requests.
  if (req.url !== API_BASE_URL && !req.url.startsWith(`${API_BASE_URL}/`)) {
    return next(req);
  }

  // Public authentication endpoints do not need an existing token.
  if (req.url === API_ENDPOINTS.login || req.url === API_ENDPOINTS.register) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
