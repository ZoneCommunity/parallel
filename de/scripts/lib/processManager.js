class Process {
    constructor(pID, name) {
        this.pID = pID;
        this.name = name;
    }

    getpID() {
        return this.pID;
    }

    stop() {
        console.log(`Process ${this.pID} (${this.name}) is stopped.`);
        const element = document.getElementById(`${this.pID}`);
        if (element) {
            element.remove();
        }
    }
}

class processManager {
    constructor() {
        this.processes = [];
        this.nextpID = 0;
    }

    createProcess(name) {
        const process = new Process(++this.nextpID, name);
        this.processes.push(process);
        console.log(`Process ${this.nextpID} (${name}) is running.`);
        return process;
    }

    stopProcess(pID) {
        const proc = this.getProcess(pID);
        if (proc) {
            proc.stop();
        } else {
            console.log(`Process ${pID} is already stopped or doesn't exist.`);
        }
    }

    getProcess(pID) {
        return this.processes.find(proc => proc.pID === pID);
    }

    listProcesses() {
        return this.processes.map(proc => ({
            pID: proc.pID,
            name: proc.name
        }));
    }
}

export { processManager };
