const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Password validation function
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters long' : null,
      hasUppercase: !hasUppercase ? 'Password must contain at least one uppercase letter' : null,
      hasLowercase: !hasLowercase ? 'Password must contain at least one lowercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain at least one number' : null,
    }
  };
};

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const errorMessages = Object.values(passwordValidation.errors).filter(Boolean);
      return res.status(400).json({ 
        message: 'Password validation failed',
        errors: errorMessages
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ 
      username, 
      password,
      credits: 100, // Initial credits
      notifications: [
        {
          id: Date.now().toString(),
          message: 'Welcome to the chat application!',
          timestamp: new Date(),
          read: false
        },
        {
          id: (Date.now() + 1).toString(),
          message: 'Your account has been created successfully.',
          timestamp: new Date(),
          read: false
        }
      ]
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send Message (Decrease Credits)
router.post('/send-message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has credits
    if (user.credits <= 0) {
      return res.status(400).json({ 
        message: 'Insufficient credits. You need credits to send messages.',
        credits: user.credits 
      });
    }

    // Decrease credits by 1
    user.credits -= 1;

    // Add notification for low credits
    if (user.credits <= 10 && user.credits > 0) {
      user.notifications.push({
        id: Date.now().toString(),
        message: `Low credits warning! You have ${user.credits} credits remaining.`,
        timestamp: new Date(),
        read: false
      });
    } else if (user.credits === 0) {
      user.notifications.push({
        id: Date.now().toString(),
        message: 'You have run out of credits! Please purchase more to continue.',
        timestamp: new Date(),
        read: false
      });
    }

    await user.save();

    // Simulate AI response (you can integrate with actual AI service here)
    const aiResponse = `I received your message: "${message}". This is a sample AI response. You have ${user.credits} credits remaining.`;

    res.json({
      message: 'Message sent successfully',
      aiResponse,
      credits: user.credits,
      userMessage: message
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Credits
router.get('/credits', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update notifications
router.post('/notifications/read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.notifications.forEach(notification => {
      notification.read = true;
    });
    await user.save();
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark specific notification as read
router.post('/notifications/:id/read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const notification = user.notifications.find(n => n.id === req.params.id);
    
    if (notification) {
      notification.read = true;
      await user.save();
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;