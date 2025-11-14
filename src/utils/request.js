export async function parseBody(c) {
  const contentType = c.req.header('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await c.req.json();
  }
  
  if (contentType.includes('multipart/form-data') || 
      contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await c.req.parseBody();
    
    // Normalize boolean values
    for (const key in formData) {
      if (formData[key] === 'on' || formData[key] === 'true') {
        formData[key] = true;
      } else if (formData[key] === 'off' || formData[key] === 'false') {
        formData[key] = false;
      }
    }
    
    return formData;
  }
  
  // Default fallback
  return await c.req.parseBody();
}
