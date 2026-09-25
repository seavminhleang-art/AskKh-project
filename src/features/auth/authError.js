export function authError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') {
    if (error.toLowerCase().includes('cors')) {
      return 'The server rejected this request due to CORS policy. Please ensure the backend allows requests from this domain.';
    }
    if (error.includes('SMTPSendFailedException') || error.includes('sending limit exceeded') || error.includes('mail.smtp')) {
      return 'The email verification service is temporarily at its daily limit. Please contact the administrator or try again in a few hours.';
    }
    if (error.startsWith('SyntaxError:')) {
      return fallback;
    }
    return error;
  }

  // Handle string inside error.data
  if (typeof error.data === 'string') {
    if (error.data.toLowerCase().includes('cors')) {
      return 'The server rejected this request due to CORS policy. Please ensure the backend allows requests from this domain.';
    }
    if (error.data.includes('SMTPSendFailedException') || error.data.includes('sending limit exceeded') || error.data.includes('mail.smtp')) {
      return 'The email verification service is temporarily at its daily limit. Please contact the administrator or try again in a few hours.';
    }
    if (error.data.trim().startsWith('<') || error.data.startsWith('SyntaxError:')) {
      return fallback;
    }
    return error.data;
  }

  // Handle string inside error.data.message / detail / error
  const msg = error.data?.message || error.data?.detail || error.data?.error;
  if (typeof msg === 'string') {
    if (msg.toLowerCase().includes('cors')) {
      return 'The server rejected this request due to CORS policy. Please ensure the backend allows requests from this domain.';
    }
    if (msg.includes('SMTPSendFailedException') || msg.includes('sending limit exceeded') || msg.includes('mail.smtp')) {
      return 'The email verification service is temporarily at its daily limit. Please contact the administrator or try again in a few hours.';
    }
    if (msg.startsWith('SyntaxError:')) {
      return fallback;
    }
    return msg;
  }

  // Handle string inside error.error (RTK Query error field)
  if (typeof error.error === 'string') {
    if (error.error.toLowerCase().includes('cors')) {
      return 'The server rejected this request due to CORS policy. Please ensure the backend allows requests from this domain.';
    }
    if (error.error.startsWith('SyntaxError:')) {
      return fallback;
    }
    return error.error;
  }

  if (error.status === 401 || error.originalStatus === 401) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return 'Unable to reach the server. Please check your internet connection and try again.';
  }

  if (error.status === 'PARSING_ERROR') {
    return 'Received an unexpected response from the server. Please try again.';
  }

  return fallback;
}

export default authError;
