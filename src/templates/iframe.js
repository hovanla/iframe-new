import { html } from 'hono/html';

export const iframeTemplate = (ifr, name, s2, s3) => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${name}</title>
    <style>
        html {top: 0; bottom: 0; left: 0; right: 0;}
        html,
        body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
        }
        iframe {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <iframe id="myIframe" frameBorder="0" src="${ifr}${s2}${s3}"></iframe>
    <script>
        function setCookie(name, value, minutes) {
            const date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            console.log(expires)
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        }
        
        if(getCookie("ioeasy") != null) {
            let data = JSON.parse(getCookie("ioeasy"));
            if(data.tb_user_url && data.token){
                const iframe = document.getElementById("myIframe");
                iframe.src = data.tb_user_url + "?accessToken=" + data.token;
            }   
        } 
        
        window.addEventListener('message', (event) => {
            if(event.data.length > 0){
                setCookie('ioeasy', JSON.stringify(event.data), 30); 
            }
        });
    </script>
</body>
</html>
`;
