class VFS {
    constructor() {
      this.fs = this.loadFileSystem();
    }
  
    loadFileSystem() {
      const savedFS = localStorage.getItem('virtualFS');
      return savedFS ? JSON.parse(savedFS) : { root: {} };
    }
  
    saveFileSystem() {
      localStorage.setItem('virtualFS', JSON.stringify(this.fs));
    }
  
    createFile(path, content) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
  
      current[parts[parts.length - 1]] = { type: 'file', content };
      this.saveFileSystem();
    }
  
    readFile(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (const part of parts) {
        if (!current[part]) {
          throw new Error('File not found');
        }
        current = current[part];
      }
  
      if (current.type !== 'file') {
        throw new Error('Not a file');
      }
  
      return current.content;
    }
  
    deleteFile(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          throw new Error('Path not found');
        }
        current = current[parts[i]];
      }
  
      if (!current[parts[parts.length - 1]]) {
        throw new Error('File not found');
      }
  
      delete current[parts[parts.length - 1]];
      this.saveFileSystem();
    }
  
    createDirectory(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (const part of parts) {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
  
      this.saveFileSystem();
    }
  
    listDirectory(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (const part of parts) {
        if (!current[part]) {
          throw new Error('Directory not found');
        }
        current = current[part];
      }
  
      return Object.keys(current).map(key => ({
        name: key,
        type: typeof current[key] === 'object' && !current[key].type ? 'directory' : 'file'
      }));
    }
  
    reset() {
      this.fs = { root: {} };
      this.saveFileSystem();
    }
  
    exists(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (const part of parts) {
        if (!current[part]) {
          return false;
        }
        current = current[part];
      }
  
      return true;
    }
  
    isFile(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (const part of parts) {
        if (!current[part]) {
          return false;
        }
        current = current[part];
      }
  
      return current.type === 'file';
    }
  
    isDirectory(path) {
      const parts = path.split('/').filter(Boolean);
      let current = this.fs.root;
  
      for (const part of parts) {
        if (!current[part]) {
          return false;
        }
        current = current[part];
      }
  
      return typeof current === 'object' && !current.type;
    }
  }
  
  export default VFS;