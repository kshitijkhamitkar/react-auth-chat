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
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Debug: Log environment and state
  useEffect(() => {
    console.log('🐛 SignUp Component Debug:');
    console.log('  API URL:', process.env.REACT_APP_API_URL);
    console.log('  Loading state:', loading);
    console.log('  Error state:', error);
  }, [loading, error]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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
    
    console.log('🚀 SignUp Form Submitted:');
    console.log('  Username:', formData.username);
    console.log('  Password length:', formData.password.length);
    console.log('  Password validation:', passwordValidation);
    
    if (!validatePassword(formData.password)) {
      console.log('❌ Password validation failed');
      setValidationError('Password must meet all requirements');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      console.log('❌ Passwords do not match');
      setValidationError('Passwords do not match');
      return;
    }
    
    console.log('✅ Dispatching signUp action...');
    dispatch(signUp({
      username: formData.username,
      password: formData.password,
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign Up</h1>
          <p>Create an account to get started</p>
        </div>
        
        {/* Debug info - remove in production */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '10px', 
          marginBottom: '10px', 
          fontSize: '12px',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <strong>Debug Info:</strong><br/>
          API URL: {process.env.REACT_APP_API_URL || 'Not set'}<br/>
          Loading: {loading.toString()}<br/>
          Error: {error || 'None'}
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {(error || validationError) && (
            <div className="error-message">{error || validationError}</div>
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
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