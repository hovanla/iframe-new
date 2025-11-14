import { html } from 'hono/html';

export const registerTemplate = (error = []) => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Register - iFrame Manager</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/bootstrap.min.css">
  <script src="/jquery.min.js"></script>
  <script src="/bootstrap.bundle.min.js"></script>
  <style>
    body {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .register-container {
      max-width: 450px;
      margin: 0 auto;
    }
    
    .register-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
      animation: slideUp 0.5s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .register-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    
    .register-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .register-header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .register-body {
      padding: 40px 30px;
    }
    
    .form-group {
      margin-bottom: 25px;
    }
    
    .form-group label {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .form-control {
      height: 50px;
      border-radius: 10px;
      border: 2px solid #e0e0e0;
      padding: 0 20px;
      font-size: 15px;
      transition: all 0.3s;
    }
    
    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
    }
    
    .btn-register {
      width: 100%;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s;
      margin-top: 10px;
    }
    
    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .btn-register:active {
      transform: translateY(0);
    }
    
    .alert {
      border-radius: 10px;
      border: none;
      animation: shake 0.5s;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    .register-footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 13px;
    }
    
    .register-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .register-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2>Create Account</h2>
          <p>Join iFrame Manager today</p>
        </div>
        
        <div class="register-body">
          ${error.length > 0 ? html`
            <div class="alert alert-danger">
              <strong>⚠️ Error!</strong> ${error.join(', ')}
            </div>
          ` : ''}
          
          <form action="/register" method="post">
            <div class="form-group">
              <label for="Username">Username</label>
              <input 
                type="text" 
                class="form-control" 
                id="Username" 
                placeholder="Choose a username" 
                name="username" 
                required
                autofocus
              >
            </div>
            
            <div class="form-group">
              <label for="psw">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="psw" 
                placeholder="Create a password" 
                name="psw" 
                required
              >
            </div>
            
            <button type="submit" class="btn btn-register">
              Register
            </button>
          </form>
        </div>
        
        <div class="register-footer">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: white; font-size: 13px;">
        <p>© 2025 iFrame Manager</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
