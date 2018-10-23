function getMessage(errorMessage) {
  switch (errorMessage) {
    case 'LOGIN_FAILED':
      return 'Inloggen is niet gelukt.';

    case 'LOGOUT_FAILED':
      return 'Uitloggen is niet gelukt.';

    case 'AUTHORIZE_FAILED':
      return 'Authenticeren is niet gelukt.';

    case 'UPLOAD_FAILED':
      return 'Het uploaden van de foto is niet gelukt.';

    case 'FETCH_CATEGORIES_FAILED':
      return 'Inladen van categorieën is niet gelukt.';

    case 'PRIORITY_FRAILED':
      return 'Het zetten van de urgentie van deze melding is niet gelukt.';

    default:
      return 'Een onbekende fout heeft zich voorgedaan.';
  }
}

export default getMessage;
