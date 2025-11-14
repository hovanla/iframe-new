import { html } from 'hono/html';

export const notFoundTemplate = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>404 - Page Not Found</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    
    /* Floating shapes background */
    .shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .shape {
      position: absolute;
      opacity: 0.1;
      animation: float 20s infinite ease-in-out;
    }
    
    .shape:nth-child(1) {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .shape:nth-child(2) {
      width: 120px;
      height: 120px;
      background: white;
      border-radius: 20px;
      top: 60%;
      left: 80%;
      animation-delay: 2s;
      transform: rotate(45deg);
    }
    
    .shape:nth-child(3) {
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      top: 80%;
      left: 20%;
      animation-delay: 4s;
    }
    
    .shape:nth-child(4) {
      width: 100px;
      height: 100px;
      background: white;
      border-radius: 30px;
      top: 20%;
      left: 70%;
      animation-delay: 1s;
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-30px) rotate(180deg);
      }
    }
    
    .container-404 {
      text-align: center;
      z-index: 10;
      position: relative;
      padding: 20px;
      max-width: 800px;
    }
    
    /* Animated 404 number */
    .error-code {
      font-size: 180px;
      font-weight: 900;
      color: white;
      margin: 0;
      line-height: 1;
      text-shadow: 0 10px 40px rgba(0,0,0,0.3);
      animation: glitch 3s infinite;
      position: relative;
      letter-spacing: -10px;
    }
    
    @keyframes glitch {
      0%, 100% {
        transform: translate(0);
      }
      20% {
        transform: translate(-2px, 2px);
      }
      40% {
        transform: translate(-2px, -2px);
      }
      60% {
        transform: translate(2px, 2px);
      }
      80% {
        transform: translate(2px, -2px);
      }
    }
    
    .error-code span {
      display: inline-block;
      animation: bounce 2s infinite;
    }
    
    .error-code span:nth-child(1) {
      animation-delay: 0s;
    }
    
    .error-code span:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    .error-code span:nth-child(3) {
      animation-delay: 0.2s;
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }
    
    /* Icon decoration */
    .icon-wrapper {
      position: relative;
      margin: 30px 0;
    }
    
    .icon-circle {
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255, 255, 255, 0.3);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
      }
    }
    
    .icon-circle i {
      font-size: 70px;
      color: white;
    }
    
    .error-title {
      font-size: 42px;
      font-weight: 700;
      color: white;
      margin: 30px 0 15px;
      text-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }
    
    .error-message {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 40px;
      line-height: 1.6;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .btn-home {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: white;
      color: #667eea;
      padding: 16px 40px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border: none;
    }
    
    .btn-home:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.3);
      color: #764ba2;
    }
    
    .btn-home i {
      font-size: 18px;
    }
    
    .suggestions {
      margin-top: 50px;
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .suggestion-link {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 12px;
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .suggestion-link:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      color: white;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .error-code {
        font-size: 120px;
      }
      
      .error-title {
        font-size: 32px;
      }
      
      .error-message {
        font-size: 16px;
        padding: 0 20px;
      }
      
      .icon-circle {
        width: 120px;
        height: 120px;
      }
      
      .icon-circle i {
        font-size: 50px;
      }
      
      .suggestions {
        flex-direction: column;
        padding: 0 20px;
      }
    }
    
    /* Easter egg - spinning on click */
    .error-code.spin {
      animation: spin 1s ease-in-out;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg) scale(1);
      }
      50% {
        transform: rotate(180deg) scale(1.2);
      }
      to {
        transform: rotate(360deg) scale(1);
      }
    }
  </style>
</head>
<body>
  <div class="shapes">
    <div class="shape"></div>
    <div class="shape"></div>
    <div class="shape"></div>
    <div class="shape"></div>
  </div>
  
  <div class="container-404">
    <h1 class="error-code" id="errorCode">
      <span>4</span><span>0</span><span>4</span>
    </h1>
    
    <div class="icon-wrapper">
      <div class="icon-circle">
        <i class="fas fa-ghost"></i>
      </div>
    </div>
    
    <h2 class="error-title">Oops! Page Not Found</h2>
  </div>
  
  <script>
    // Easter egg: Click on 404 to spin it
    document.getElementById('errorCode').addEventListener('click', function() {
      this.classList.add('spin');
      setTimeout(() => {
        this.classList.remove('spin');
      }, 1000);
    });
    
    // Random ghost icon variations
    const icons = ['fa-ghost', 'fa-face-sad-tear', 'fa-compass', 'fa-map-location-dot', 'fa-question'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    document.querySelector('.icon-circle i').className = 'fas ' + randomIcon;
  </script>
</body>
</html>
`;
