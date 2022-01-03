export default function userErrorHandler(error) {
  let field = null;
  let missingFields = [];

  for (field in error.errors) {
    // Check for all missing required fields
    let missingField = error.errors[field].path;

    switch (missingField) {
      case 'firstName':
        missingFields.push('First Name');
        break;

      case 'lastName':
        missingFields.push('Last Name');
        break;

      case 'email':
        missingFields.push('Email Address');
        break;

      case 'password':
        missingFields.push('Password');
        break;

      case 'homeAddress':
        missingFields.push('Home Address');
        break;

      case 'contactNum':
        missingFields.push('Contact Number');
        break;
    }
  }

  return missingFields;
}
