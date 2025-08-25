// Validation utilities for forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email обязателен';
  if (!emailRegex.test(email)) return 'Неверный формат email';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Пароль обязателен';
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} обязательно для заполнения`;
  }
  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  if (!phone) return 'Телефон обязателен';
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Неверный формат телефона';
  return null;
};

export const validateAmount = (amount) => {
  if (!amount) return 'Сумма обязательна';
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 0) return 'Сумма должна быть положительным числом';
  return null;
};

export const validateProbability = (probability) => {
  if (probability === undefined || probability === null) return 'Вероятность обязательна';
  const numProb = parseFloat(probability);
  if (isNaN(numProb) || numProb < 0 || numProb > 100) return 'Вероятность должна быть от 0 до 100';
  return null;
};

export const validateDate = (date) => {
  if (!date) return 'Дата обязательна';
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) return 'Неверная дата';
  return null;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Specific form validators
export const validateLoginForm = (data) => {
  return validateForm(data, {
    email: [validateEmail],
    password: [validatePassword]
  });
};

export const validateDealForm = (data) => {
  // Смягчаем правила: обязательные только название, сумма, вероятность и дата (без ограничения по прошлому)
  return validateForm(data, {
    title: [(value) => validateRequired(value, 'Название сделки')],
    amount: [validateAmount],
    probability: [validateProbability],
    expectedClose: [validateDate]
  });
};

export const validateLeadForm = (data) => {
  // Имя обязательно. Email/Телефон — опциональны, но если указаны, проверяем формат. Компания — опционально.
  const rules = {
    name: [(value) => validateRequired(value, 'Имя')]
  };
  if (data.email) rules.email = [validateEmail];
  if (data.phone) rules.phone = [validatePhone];
  return validateForm(data, rules);
};

export const validateContactForm = (data) => {
  return validateForm(data, {
    name: [(value) => validateRequired(value, 'Имя')],
    email: [validateEmail],
    phone: [validatePhone]
  });
};
