
const initialState = {
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      address1: '',
      address2: '',
      country: '',
      zipCode: '',
    },
    countries: [],
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_FORM_DATA':
        return { ...state, formData: action.payload };
  
      case 'CLEAR_FORM_DATA':
        return { ...state, formData: initialState.formData };
  
      case 'SET_COUNTRIES':
        return { ...state, countries: action.payload };
  
      default:
        return state;
    }
  };
  
  export default reducer;
  