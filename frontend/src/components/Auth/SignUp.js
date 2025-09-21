import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signUp, clearError } from '../../store/authSlice';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false
  });
  
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      setLoadingMessage('Creating account...');
      
      // After 10 seconds, show cold start message
      const timer = setTimeout(() => {
        setLoadingMessage('Backend is starting up (this may take up to 60 seconds on first use)...');
      }, 10000);
      
      return () => clearTimeout(timer);
    } else {
      setLoadingMessage('');
    }
  }, [loading]);

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password)
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === 'password') {
      validatePassword(value);
    }
    
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      setValidationError('Password must meet all requirements');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    dispatch(signUp({
      username: formData.username,
      password: formData.password,
    }));
  };

  const isTimeoutError = error && error.includes('timeout');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign Up</h1>
          <p>Create an account to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {isTimeoutError ? (
                <div>
                  <strong>Backend is starting up...</strong><br/>
                  This happens on first use. Please wait 30-60 seconds and try again.<br/>
                  <button 
                    type="button" 
                    onClick={() => window.open('https://chat-app-backend-p2y6.onrender.com/health', '_blank')}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#007bff', 
                      textDecoration: 'underline', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}
                  >
                    Click here to wake up the backend
                  </button>
                </div>
              ) : (
                error
              )}
            </div>
          )}
          
          {validationError && (
            <div className="error-message">{validationError}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div className="password-requirements">
              <div className={`requirement ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
                <span className="requirement-icon">
                  {passwordValidation.minLength ? '✓' : '×'}
                </span>
                At least 8 characters
              </div>
              <div className={`requirement ${passwordValidation.hasUppercase ? 'valid' : 'invalid'}`}>
                <span className="requirement-icon">
                  {passwordValidation.hasUppercase ? '✓' : '×'}
                </span>
                One uppercase letter
              </div>
              <div className={`requirement ${passwordValidation.hasLowercase ? 'valid' : 'invalid'}`}>
                <span className="requirement-icon">
                  {passwordValidation.hasLowercase ? '✓' : '×'}
                </span>
                One lowercase letter
              </div>
              <div className={`requirement ${passwordValidation.hasNumber ? 'valid' : 'invalid'}`}>
                <span className="requirement-icon">
                  {passwordValidation.hasNumber ? '✓' : '×'}
                </span>
                One number
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="form-input password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={loading || !Object.values(passwordValidation).every(Boolean)}
          >
            {loading ? loadingMessage || 'Creating account...' : 'Sign Up'}
          </button>
          
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '12px', 
              fontSize: '14px', 
              color: '#666',
              lineHeight: '1.4'
            }}>
              {loadingMessage.includes('starting up') && (
                <>
                  <div>⏱️ First time loading can take up to 60 seconds</div>
                  <div>🔄 Backend is waking up from sleep mode</div>
                </>
              )}
            </div>
          )}
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;