export default function transactionErrorHandler(error) {
  let field = null;
  let missingFields = [];

  for (field in error.errors) {
    // Check for all missing required fields
    let missingField = error.errors[field].path;

    switch (missingField) {
      case 'dateCreated':
        missingFields.push('Date Creation');
        break;

      case 'orderStatus':
        missingFields.push('Order Status');
        break;

      case 'type':
        missingFields.push('Type');
        break;

      case 'fullName':
        missingFields.push('Full Name');
        break;

      case 'email':
        missingFields.push('Email Address');
        break;

      case 'contactNum':
        missingFields.push('Contact Number');
        break;

      case 'order':
        missingFields.push('Order');
        break;

      case 'totalPrice':
        missingFields.push('Total Price');
        break;
    }
  }

  return missingFields;
}
