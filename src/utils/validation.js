// Input validation utilities that support emojis and numbers

export const VALIDATION_RULES = {
  PARTICIPANT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 30,
    TRIM_WHITESPACE: true
  },
  PIZZA_COUNT: {
    MIN: 0,
    MAX: 100, // Reasonable maximum for pizza eating contests
  }
};

export const validateParticipantName = (name) => {
  const errors = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Nome é obrigatório');
    return { isValid: false, errors, sanitized: '' };
  }

  // Trim whitespace but preserve internal spaces
  const trimmed = name.trim();
  
  if (trimmed.length < VALIDATION_RULES.PARTICIPANT_NAME.MIN_LENGTH) {
    errors.push('Nome muito curto');
  }
  
  if (trimmed.length > VALIDATION_RULES.PARTICIPANT_NAME.MAX_LENGTH) {
    errors.push(`Nome deve ter no máximo ${VALIDATION_RULES.PARTICIPANT_NAME.MAX_LENGTH} caracteres`);
  }

  // Check for potentially dangerous characters (XSS prevention)
  // Allow letters, numbers, spaces, emojis, and common punctuation
  const dangerousPattern = /[<>{}[\]\\]/;
  if (dangerousPattern.test(trimmed)) {
    errors.push('Nome contém caracteres não permitidos');
  }

  // Sanitize: remove dangerous chars but keep emojis, numbers, letters, spaces
  const sanitized = trimmed.replace(/[<>{}[\]\\]/g, '');

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
};

export const validatePizzaCount = (count) => {
  const errors = [];
  
  if (typeof count !== 'number' || isNaN(count)) {
    errors.push('Quantidade inválida');
    return { isValid: false, errors, sanitized: 0 };
  }

  const sanitized = Math.max(
    VALIDATION_RULES.PIZZA_COUNT.MIN, 
    Math.min(VALIDATION_RULES.PIZZA_COUNT.MAX, Math.floor(count))
  );

  if (count < VALIDATION_RULES.PIZZA_COUNT.MIN) {
    errors.push(`Mínimo ${VALIDATION_RULES.PIZZA_COUNT.MIN} fatias`);
  }
  
  if (count > VALIDATION_RULES.PIZZA_COUNT.MAX) {
    errors.push(`Máximo ${VALIDATION_RULES.PIZZA_COUNT.MAX} fatias`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
};

export const checkForDuplicateName = (name, existingParticipants, excludeId = null) => {
  const normalizedName = name.trim().toLowerCase();
  const isDuplicate = existingParticipants.some(p => 
    p.id !== excludeId && p.name.trim().toLowerCase() === normalizedName
  );
  
  return {
    isDuplicate,
    error: isDuplicate ? 'Já existe um participante com este nome' : null
  };
};

// Fun emoji validation - ensure we support emojis properly
export const containsEmoji = (text) => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
};

export const getEmojiCount = (text) => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches.length : 0;
};