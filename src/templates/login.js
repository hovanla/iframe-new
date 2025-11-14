import { html } from 'hono/html';

export const loginTemplate = (error = []) => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Login - iFrame Manager</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/bootstrap.min.css">
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
    
    .login-container {
      max-width: 450px;
      margin: 0 auto;
    }
    
    .login-card {
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
    
    .login-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    
    .login-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .login-header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .login-body {
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
    
    .btn-login {
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
    
    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .btn-login:active {
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
    
    .login-footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 13px;
    }
    
    .login-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .login-footer a:hover {
      text-decoration: underline;
    }
    
    .input-icon {
      position: relative;
    }
    
    .input-icon i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
    }
    
    .input-icon .form-control {
      padding-left: 45px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Welcome Back</h2>
          <p>Login to manage your iFrames</p>
        </div>
        
        <div class="login-body">
          ${error.length > 0 ? html`
            <div class="alert alert-danger">
              <strong>⚠️ Error!</strong> ${error.join(', ')}
            </div>
          ` : ''}
          
          <form action="/login" method="post">
            <div class="form-group">
              <label for="Username">Username</label>
              <input 
                type="text" 
                class="form-control" 
                id="Username" 
                placeholder="Enter your username" 
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
                placeholder="Enter your password" 
                name="psw" 
                required
              >
            </div>
            
            <button type="submit" class="btn btn-login">
              Login
            </button>
          </form>
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
