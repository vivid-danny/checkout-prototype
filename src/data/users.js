export const USER_PROFILES = {
  new: {
    label: 'New Customer',
    savedAddresses: [],
    savedCards: [],
    fillData: {
      address: {
        name: 'John Doe', phone: '(312) 555-0192', addressLine1: '233 S Wacker Dr',
        city: 'Chicago', postalCode: '60606', state: 'Illinois', country: 'US',
      },
      billingAddress: {
        name: 'Jane Doe', phone: '(312) 555-0199', addressLine1: '100 N Michigan Ave',
        city: 'Chicago', postalCode: '60601', state: 'Illinois', country: 'US',
      },
      card: {
        cardNumber: '4111111145804580', expiry: '03/32', cvv: '123', name: 'John Doe',
        phone: '(312) 555-0192', addressLine1: '233 S Wacker Dr', city: 'Chicago',
        postalCode: '60606', state: 'Illinois', country: 'US', saveCard: false,
      },
    },
  },

  returning: {
    label: 'Returning Customer',
    savedAddresses: [
      {
        name: 'Marcus Webb', phone: '(312) 555-0141', addressLine1: '875 N Michigan Ave',
        city: 'Chicago', postalCode: '60611', state: 'Illinois', country: 'US',
      },
    ],
    savedCards: [
      {
        lastFour: '8472', expiry: '06/27',
        billingForm: {
          name: 'Marcus Webb', phone: '(312) 555-0141', addressLine1: '875 N Michigan Ave',
          city: 'Chicago', postalCode: '60611', state: 'Illinois', country: 'US',
        },
      },
    ],
    fillData: {
      address: {
        name: 'Marcus Webb', phone: '(312) 555-0141', addressLine1: '875 N Michigan Ave',
        city: 'Chicago', postalCode: '60611', state: 'Illinois', country: 'US',
      },
      billingAddress: {
        name: 'Aisha Grant', phone: '(312) 555-0288', addressLine1: '321 N Clark St',
        city: 'Chicago', postalCode: '60654', state: 'Illinois', country: 'US',
      },
      card: {
        cardNumber: '5555555555554444', expiry: '12/30', cvv: '321', name: 'Marcus Webb',
        phone: '(312) 555-0141', addressLine1: '875 N Michigan Ave', city: 'Chicago',
        postalCode: '60611', state: 'Illinois', country: 'US', saveCard: false,
      },
    },
  },

  power: {
    label: 'Power User',
    savedAddresses: [
      {
        name: 'Elena Torres', phone: '(312) 555-0223', addressLine1: '1060 W Addison St',
        city: 'Chicago', postalCode: '60613', state: 'Illinois', country: 'US',
      },
      {
        name: 'David Kim', phone: '(312) 555-0334', addressLine1: '333 N Michigan Ave',
        city: 'Chicago', postalCode: '60601', state: 'Illinois', country: 'US',
      },
      {
        name: 'Nina Patel', phone: '(312) 555-0445', addressLine1: '200 E Randolph Dr',
        city: 'Chicago', postalCode: '60601', state: 'Illinois', country: 'US',
      },
    ],
    savedCards: [
      {
        lastFour: '3892', expiry: '02/28',
        billingForm: {
          name: 'Elena Torres', phone: '(312) 555-0223', addressLine1: '1060 W Addison St',
          city: 'Chicago', postalCode: '60613', state: 'Illinois', country: 'US',
        },
      },
      {
        lastFour: '7251', expiry: '08/26',
        billingForm: {
          name: 'David Kim', phone: '(312) 555-0334', addressLine1: '333 N Michigan Ave',
          city: 'Chicago', postalCode: '60601', state: 'Illinois', country: 'US',
        },
      },
      {
        lastFour: '4916', expiry: '11/29',
        billingForm: {
          name: 'Nina Patel', phone: '(312) 555-0445', addressLine1: '200 E Randolph Dr',
          city: 'Chicago', postalCode: '60601', state: 'Illinois', country: 'US',
        },
      },
    ],
    fillData: {
      address: {
        name: 'Elena Torres', phone: '(312) 555-0223', addressLine1: '1060 W Addison St',
        city: 'Chicago', postalCode: '60613', state: 'Illinois', country: 'US',
      },
      billingAddress: {
        name: 'Raj Mehta', phone: '(312) 555-0556', addressLine1: '20 W Kinzie St',
        city: 'Chicago', postalCode: '60654', state: 'Illinois', country: 'US',
      },
      card: {
        cardNumber: '378282246310005', expiry: '04/28', cvv: '1234', name: 'Elena Torres',
        phone: '(312) 555-0223', addressLine1: '1060 W Addison St', city: 'Chicago',
        postalCode: '60613', state: 'Illinois', country: 'US', saveCard: false,
      },
    },
  },
}
