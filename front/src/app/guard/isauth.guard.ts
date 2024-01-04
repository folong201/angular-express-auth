import { CanActivateFn } from '@angular/router';

export const isauthGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = checkCookie(); // Vérifier le cookie pour l'authentification

  if (isAuthenticated) {
    return true; // Laisser passer l'utilisateur s'il est authentifié
  } else {
    // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
    // Remplacez '/login' par le chemin de votre page de connexion
    window.location.href = '/login';
    return false;
  }
};

function checkCookie() {
  const allCookies = document.cookie;
  const authCookieName = 'jwt'; // Remplacez par le nom de votre cookie d'authentification

  if (allCookies.includes(`${authCookieName}=`)) {
    return true;
  } else {
    return false;
  }
}
