class File {
    constructor(name, content = '') {
        this.name = name;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateContent(newContent) {
        this.content = newContent;
        this.updatedAt = new Date();
        if (this._vfs) {
            this._vfs.saveToLocalStorage();
        }
    }

    _setVFS(vfsInstance) {
        this._vfs = vfsInstance;
    }
}

class Directory {
    constructor(name, parent = null) {
        this.name = name;
        this.contents = {};
        this.createdAt = new Date();
        this.parent = parent;
    }

    addFile(file) {
        this.contents[file.name] = file;
        file._setVFS(this._vfs);
        this._saveChanges();
    }

    addDirectory(directory) {
        directory.parent = this;
        directory._setVFS(this._vfs);
        this.contents[directory.name] = directory;
        this._saveChanges();
    }

    getItem(name) {
        return this.contents[name];
    }

    removeItem(name) {
        delete this.contents[name];
        this._saveChanges();
    }

    listContents() {
        return Object.keys(this.contents);
    }

    _saveChanges() {
        if (this._vfs) {
            this._vfs.saveToLocalStorage();
        } else {
            //console.error('Cannot save to local storage: VFS instance is not set.');
        }
    }

    _setVFS(vfsInstance) {
        this._vfs = vfsInstance;
    }

    toJSON() {
        const json = {
            name: this.name,
            contents: {}
        };
        for (const [key, value] of Object.entries(this.contents)) {
            json.contents[key] = value instanceof Directory ? value.toJSON() : { name: value.name, content: value.content, createdAt: value.createdAt, updatedAt: value.updatedAt };
        }
        return json;
    }
}

class VFS {
    constructor() {
        this.root = VFS.loadFromLocalStorage();
        this.currentDirectory = this.root;
        this._setVFSForAllDirectories(this.root);
    }

    _setVFSForAllDirectories(directory) {
        directory._setVFS(this);
        for (const item of Object.values(directory.contents)) {
            if (item instanceof Directory) {
                this._setVFSForAllDirectories(item);
            } else if (item instanceof File) {
                item._setVFS(this);
            }
        }
    }

    createFile(name, content = '') {
        const file = new File(name, content);
        this.currentDirectory.addFile(file);
    }

    createDirectory(name) {
        const directory = new Directory(name, this.currentDirectory);
        this.currentDirectory.addDirectory(directory);
    }

    changeDirectory(name) {
        if (name === '/') {
            this.currentDirectory = this.root;
        } else if (name === '..') {
            if (this.currentDirectory.parent) {
                this.currentDirectory = this.currentDirectory.parent;
            }
        } else {
            const dir = this.currentDirectory.getItem(name);
            if (dir instanceof Directory) {
                this.currentDirectory = dir;
            } else {
                console.error('Directory not found');
            }
        }
    }

    listContents() {
        return this.currentDirectory.listContents();
    }

    readFile(name) {
        const file = this.currentDirectory.getItem(name);
        if (file instanceof File) {
            return file.content;
        } else {
            console.error('File not found');
        }
    }

    writeFile(name, content) {
        const file = this.currentDirectory.getItem(name);
        if (file instanceof File) {
            file.updateContent(content);
        } else {
            console.error('File not found');
        }
    }

    removeItem(name) {
        this.currentDirectory.removeItem(name);
    }

    clear() {
        this.root = new Directory('/');
        this.currentDirectory = this.root;
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        if (this.root) {
            const json = this.root.toJSON();
            localStorage.setItem('vfsData', JSON.stringify(json));
        } else {
            // console.error('Cannot save to local storage: Root is not initialized.');
        }
    }

    static loadFromLocalStorage() {
        const data = localStorage.getItem('vfsData');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                return VFS._parseDirectory(parsedData);
            } catch (e) {
                console.error('Failed to load VFS data from local storage', e);
            }
        }
        return new Directory('/');
    }

    static _parseDirectory(data, parent = null) {
        const directory = new Directory(data.name, parent);
        for (const [key, value] of Object.entries(data.contents)) {
            if (value.contents) {
                directory.addDirectory(VFS._parseDirectory(value, directory));
            } else {
                const file = new File(value.name, value.content);
                file.createdAt = new Date(value.createdAt);
                file.updatedAt = new Date(value.updatedAt);
                directory.addFile(file);
            }
        }
        return directory;
    }
}

export { File, Directory, VFS };
