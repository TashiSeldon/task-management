// /utils/validateInput.js

export function validateInput(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      return { isValid: false, message: 'Password must be at least 8 characters and contain at least one letter and one number.' };
    }
  
    return { isValid: true };
  }
  