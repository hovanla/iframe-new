import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';
import { parseBody } from './utils/request.js';

// Import templates
import { iframeTemplate } from './templates/iframe.js';
import { loginTemplate } from './templates/login.js';
import { registerTemplate } from './templates/register.js';
import { passwordTemplate } from './templates/password.js';
import { manageTemplate } from './templates/manage.js';
import { notFoundTemplate } from './templates/404.js';

// Import utils
import { KVDatabase } from './utils/db.js';
import { hashPassword, comparePassword, checkToken } from './utils/auth.js';

const KV_NAME = 'xem_report';

const app = new Hono();

// Routes
app.get('/register', (c) => c.html(registerTemplate()));

app.post('/register', async (c) => {
  const db = new KVDatabase(c.env[KV_NAME]);
  const body = await c.req.parseBody();
  
  const existingUser = await db.findUser(body.username);
  if (existingUser) {
    return c.html(registerTemplate(['Username exists!']));
  }

  const hashedPassword = await hashPassword(body.psw);
  await db.addUser({ username: body.username, password: hashedPassword });
  
  return c.redirect('/login');
});

app.get('/login', (c) => c.html(loginTemplate()));

app.post('/login', async (c) => {
  const db = new KVDatabase(c.env[KV_NAME]);
  const body = await c.req.parseBody();

  const user = await db.findUser(body.username);
  if (!user) {
    return c.html(loginTemplate(['Username or password is incorrect!']));
  }

  const isMatch = await comparePassword(body.psw, user.password);
  if (!isMatch) {
    return c.html(loginTemplate(['Username or password is incorrect!']));
  }

  const token = await sign({ user: body.username }, 'iframe');
  setCookie(c, 'authcookieif', token, {
    maxAge: 86400,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  });

  return c.redirect('/manage');
});

app.get('/password', (c) => c.html(passwordTemplate()));

app.post('/password', async (c) => {
  const db = new KVDatabase(c.env[KV_NAME]);
  const body = await c.req.parseBody();
  const errors = [];

  const user = await db.findUser(body.username);
  if (!user) {
    return c.html(passwordTemplate(['Username does not exist!']));
  }

  const isMatch = await comparePassword(body.oldpass, user.password);
  if (!isMatch) errors.push('Wrong old password!');

  if (body.newpass !== body.newpasss) {
    errors.push("The new password doesn't match!");
  }

  if (errors.length > 0) {
    return c.html(passwordTemplate(errors));
  }

  const newHash = await hashPassword(body.newpass);
  await db.updateUser(body.username, { password: newHash });

  deleteCookie(c, 'authcookieif');
  return c.redirect('/login');
});

app.get('/logout', checkToken, (c) => {
  deleteCookie(c, 'authcookieif');
  return c.redirect('/login');
});

app.get('/manage', checkToken, async (c) => {
  try {
    const db = new KVDatabase(c.env[KV_NAME]);
    const posts = await db.getPosts();
    const user = c.get('user');
    return c.html(manageTemplate(posts, user));
  } catch (error) {
    return c.text('Internal Server Error: ' + error.message, 500);
  }
});


app.delete('/user/:us', checkToken, async (c) => {
  const db = new KVDatabase(c.env[KV_NAME]);
  const success = await db.deleteUser(c.req.param('us'));
  return c.json(success ? 'success' : 'no success');
});

app.post('/api/insert', checkToken, async (c) => {
  try {
    if (!c.env[KV_NAME]) {
      return c.json({ error: 'KV binding not found' }, 500);
    }
    const body = await parseBody(c); 
    if (!body.param) {
      return c.json({ error: 'Missing param field' }, 400);
    }
    body.param = body.param.toLowerCase();
    const db = new KVDatabase(c.env[KV_NAME]);
    const existing = await db.findPost(body.param);
    if (existing) {
      return c.json({ status: 'duplicate', id: body.id });
    }
    await db.addPost(body);
    return c.json({ status: 'success' });
    
  } catch (error) {
    return c.json({ 
      error: error.message,
      stack: error.stack 
    }, 500);
  }
});


app.post('/update-querystr', checkToken, async (c) => {
  const db = new KVDatabase(c.env[KV_NAME]);
  const { id, querystr } = await c.req.json();

  const post = await db.updatePost(id, { querystr });
  if (post) {
    return c.json(post);
  }
  
  return c.json({ message: 'Post not found' }, 404);
});
// Update note endpoint
app.put('/api/update-note/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { note } = await c.req.json();
    
    const db = new KVDatabase(c.env[KV_NAME]);
    const post = await db.findPostById(id);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    const updated = await db.updatePost(id, { note: note || '' });
    
    if (updated) {
      return c.json({ success: true, note: note });
    } else {
      return c.json({ error: 'Failed to update note' }, 500);
    }
  } catch (error) {
    console.error('Update note error:', error);
    return c.json({ error: error.message }, 500);
  }
});
app.put('/api/update/:id', checkToken, async (c) => {
  try {
    const id = c.req.param('id');
    let body;
    const contentType = c.req.header('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await c.req.json();
    } else {
      body = await c.req.parseBody();
      if (body.querystr === 'on' || body.querystr === 'true') {
        body.querystr = true;
      } else {
        body.querystr = false;
      }
    }
    if (!body.param) {
      return c.json({ error: 'Missing param field' }, 400);
    }
    body.param = body.param.toLowerCase();
    if (!c.env[KV_NAME]) {
      return c.json({ error: 'KV binding not found' }, 500);
    }
    
    const db = new KVDatabase(c.env[KV_NAME]);
    
    // Check duplicate param
    const existing = await db.findPost(body.param);
    const oldPost = await db.findPostById(id);
    if (existing && existing.id !== id) {
      return c.json({ 
        status: 'duplicate', 
        ifold: oldPost,
        message: `Param "${body.param}" already exists` 
      });
    }

    // Update
    const updated = await db.updatePost(id, body);
    if (!updated) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    return c.json({ status: 'success', data: updated });
    
  } catch (error) {
    return c.json({ 
      error: error.message,
      stack: error.stack 
    }, 500);
  }
});


app.delete('/api/delete/:id', checkToken, async (c) => {
  const db = new KVDatabase(c.env[KV_NAME]);
  await db.deletePost(c.req.param('id'));
  return c.json({ status: 'success' });
});

app.get('/:param/*', async (c) => {
   const { param } = c.req.param();
  const db = new KVDatabase(c.env.KV);
  const post = await db.findPost(param);
  
  if (!post) {
    return c.html(notFoundTemplate());
  }
  // Build iframe URL
  let iframeUrl = post.urliframe;
  if (post.querystr) {
    const queryString = c.req.url.split('?');
    if (queryString) {
      iframeUrl += (iframeUrl.includes('?') ? '&' : '?') + queryString;
    }
  }
  
  const html = iframeTemplate(post, iframeUrl);

  return c.html(html, 200, {
    'Content-Security-Policy': "frame-src *; frame-ancestors *; child-src *;",
    'X-Frame-Options': 'ALLOWALL',
    'X-Content-Type-Options': 'nosniff'
  });
});

app.get('*', (c) => c.html(notFoundTemplate(), 404));

export default app;
