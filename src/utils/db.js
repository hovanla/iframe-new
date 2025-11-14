export class KVDatabase {
  constructor(kv) {
    this.kv = kv;
  }

  async getPosts() {
    const data = await this.kv.get('posts', 'json');
    return data || [];
  }

  async getUsers() {
    const data = await this.kv.get('users', 'json');
    return data || [];
  }

  async savePosts(posts) {
    await this.kv.put('posts', JSON.stringify(posts));
  }

  async saveUsers(users) {
    await this.kv.put('users', JSON.stringify(users));
  }

  async findUser(username) {
    const users = await this.getUsers();
    return users.find(u => u.username === username);
  }

  async addUser(user) {
    const users = await this.getUsers();
    users.push(user);
    await this.saveUsers(users);
  }

  async updateUser(username, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      await this.saveUsers(users);
      return true;
    }
    return false;
  }

  async deleteUser(username) {
    const users = await this.getUsers();
    const filtered = users.filter(u => u.username !== username);
    await this.saveUsers(filtered);
    return filtered.length < users.length;
  }

  async findPost(param) {
    const posts = await this.getPosts();
    return posts.find(p => p.param === param.toLowerCase());
  }

  async findPostById(id) {
    const posts = await this.getPosts();
    return posts.find(p => p.id === id);
  }

  async addPost(post) {
    const posts = await this.getPosts();
    posts.push(post);
    await this.savePosts(posts);
  }

  async updatePost(id, updates) {
    const posts = await this.getPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      await this.savePosts(posts);
      return posts[index];
    }
    return null;
  }

  async deletePost(id) {
    const posts = await this.getPosts();
    const filtered = posts.filter(p => p.id !== id);
    await this.savePosts(filtered);
    return true;
  }
}
