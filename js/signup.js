/* ============================================
   MODERN SIGNUP/LOGIN FUNCTIONALITY
   With smooth animations and transitions
   ============================================ */

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (typeof Auth !== 'undefined' && Auth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }

    // Form submission handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    // Password toggle handler
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', handlePasswordToggle);
    }

    // Social button handlers
    setupSocialButtons();

    // Input animations
    setupInputAnimations();
});

// Handle form submission with animation
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    const signupBtn = document.querySelector('.btn-primary');
    const signupText = document.getElementById('signupText');
    const signupSpinner = document.getElementById('signupSpinner');
    const errorDiv = document.getElementById('signupError');
    const successDiv = document.getElementById('signupSuccess');
    
    // Show loading state
    setLoadingState(true, signupBtn, signupText, signupSpinner);
    hideMessages(errorDiv, successDiv);
    
    try {
        // Validate inputs
        if (!email || !password) {
            throw new Error('All fields are required');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Check if Auth is available
        if (typeof Auth === 'undefined') {
            throw new Error('Authentication system not loaded');
        }

        // Attempt login
        const result = await Auth.login(email, password, remember);
        
        if (result.success) {
            // Show success message briefly
            showSuccess(successDiv, 'Login successful!');
            
            // Show success animation overlay
            showSuccessAnimation();
            
            // Redirect after animation
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            throw new Error(result.message || 'Login failed');
        }
    } catch (error) {
        showError(errorDiv, error.message);
        setLoadingState(false, signupBtn, signupText, signupSpinner);
    }
}

// Show success animation overlay
function showSuccessAnimation() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        
        // Animate card zoom out
        const card = document.querySelector('.auth-card');
        if (card) {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'scale(0.95)';
            card.style.opacity = '0.5';
        }
    }
}

// Handle password visibility toggle
function handlePasswordToggle() {
    const passwordInput = document.getElementById('password');
    const currentType = passwordInput.getAttribute('type');
    const newType = currentType === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', newType);
    
    // Change icon (optional - you can add different SVG for eye-off)
    const btn = document.getElementById('togglePassword');
    btn.style.color = newType === 'text' ? '#7c3aed' : '#9ca3af';
}

// Set loading state for button
function setLoadingState(isLoading, button, textElement, spinnerElement) {
    button.disabled = isLoading;
    if (textElement) textElement.style.display = isLoading ? 'none' : 'block';
    if (spinnerElement) spinnerElement.style.display = isLoading ? 'block' : 'none';
}

// Show error message
function showError(errorDiv, message) {
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Shake animation
    errorDiv.style.animation = 'shake 0.5s ease-in-out';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(successDiv, message) {
    if (!successDiv) return;
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

// Hide all messages
function hideMessages(errorDiv, successDiv) {
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Setup input animations
function setupInputAnimations() {
    const inputs = document.querySelectorAll('.form-group input');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            
            // Animate label (if you want to add floating labels later)
            const label = this.parentElement.querySelector('label');
            if (label) {
                label.style.color = '#7c3aed';
            }
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
            
            const label = this.parentElement.querySelector('label');
            if (label) {
                label.style.color = '#374151';
            }
        });

        // Add filled state
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });
}

// Setup social button handlers
function setupSocialButtons() {
    document.querySelectorAll('.btn-social').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.classList.contains('btn-google') ? 'Google' : 
                           this.classList.contains('btn-linkedin') ? 'LinkedIn' : 'Social';
            
            console.log(`${provider} login clicked - to be implemented`);
            
            // Show toast notification
            showToast(`${provider} login coming soon!`, 'info');
        });
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Prevent form submission on Enter in text fields (optional)
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = document.getElementById('signupForm');
        if (form && document.activeElement.form === form) {
            // Let the form submit naturally
        }
    }
});