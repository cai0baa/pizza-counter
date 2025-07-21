import { useState, useCallback } from 'react';
import { validateParticipantName, validatePizzaCount, checkForDuplicateName } from '../utils/validation';

export default function useValidation() {
  const [validationErrors, setValidationErrors] = useState({});

  const validateName = useCallback((name, existingParticipants = [], excludeId = null) => {
    const nameValidation = validateParticipantName(name);
    const duplicateCheck = checkForDuplicateName(name, existingParticipants, excludeId);
    
    const errors = [
      ...nameValidation.errors,
      ...(duplicateCheck.error ? [duplicateCheck.error] : [])
    ];

    return {
      isValid: nameValidation.isValid && !duplicateCheck.isDuplicate,
      errors,
      sanitized: nameValidation.sanitized
    };
  }, []);

  const validateCount = useCallback((count) => {
    return validatePizzaCount(count);
  }, []);

  const setFieldError = useCallback((fieldName, errors) => {
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: errors
    }));
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const hasErrors = useCallback((fieldName = null) => {
    if (fieldName) {
      return validationErrors[fieldName] && validationErrors[fieldName].length > 0;
    }
    return Object.keys(validationErrors).length > 0;
  }, [validationErrors]);

  const getErrors = useCallback((fieldName) => {
    return validationErrors[fieldName] || [];
  }, [validationErrors]);

  return {
    validateName,
    validateCount,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    hasErrors,
    getErrors,
    validationErrors
  };
}