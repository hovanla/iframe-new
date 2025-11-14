import { html } from 'hono/html';

export const passwordTemplate = (error = []) => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Change Password - iFrame Manager</title>
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
    
    .password-container {
      max-width: 450px;
      margin: 0 auto;
    }
    
    .password-card {
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
    
    .password-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 22px 30px;
      text-align: center;
      color: white;
    }
    
    .password-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .password-header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .password-body {
      padding: 10px 30px;
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
    
    .btn-change {
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
    
    .btn-change:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .btn-change:active {
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
    
    .password-footer {
      text-align: center;
      padding: 14px;
      color: #666;
      font-size: 13px;
    }
    
    .password-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .password-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="password-container">
      <div class="password-card">
        <div class="password-header">
          <h2>Change Password</h2>
          <p>Update your account security</p>
        </div>
        
        <div class="password-body">
          ${error.length > 0 ? html`
            <div class="alert alert-danger">
              <strong>⚠️ Error!</strong> ${error.join(', ')}
            </div>
          ` : ''}
          
          <form action="/password" method="post">
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
              <label for="oldpass">Current Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="oldpass" 
                placeholder="Enter current password" 
                name="oldpass" 
                required
              >
            </div>
            
            <div class="form-group">
              <label for="newpass">New Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="newpass" 
                placeholder="Enter new password" 
                name="newpass" 
                required
              >
            </div>
            
            <div class="form-group">
              <label for="newpasss">Confirm New Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="newpasss" 
                placeholder="Confirm new password" 
                name="newpasss" 
                required
              >
            </div>
            
            <button type="submit" class="btn btn-change">
              Change Password
            </button>
          </form>
        </div>
        
        <div class="password-footer">
          <a href="/manage">← Back to Dashboard</a>
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
