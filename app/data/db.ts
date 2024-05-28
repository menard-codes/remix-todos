import fs from 'node:fs/promises';

export interface Todo {
    id: string;
    task: string;
    completed: boolean;
}

interface JsonDB {
    title: string;
    tables: Todo[];
}

export class DB {
    private jsonFilePath: string;
    private db: JsonDB;

    constructor(jsonFilePath: string) {
        this.jsonFilePath = jsonFilePath;
        this.db = {
            title: "",
            tables: []
        };
    }

    async connect() {
        try {
            const content = await fs.readFile(this.jsonFilePath, {encoding: 'utf8'});
            const data = JSON.parse(content);
            this.db = data;
        } catch (error) {
            console.error(error);
        }
    }

    async commit() {
        try {
            await fs.writeFile(this.jsonFilePath, JSON.stringify(this.db, null, 4));
        } catch (error) {
            console.error(error);
        }
    }

    async get<T extends Todo>(id: T['id']) {
        await this.connect()
        const data = this.db.tables.find(t => t.id === id);
        if (data === undefined) {
            throw new NotFoundError(`No record found in the database with id of "${id}"`);
        }
        return data;
    }

    async getAll() {
        await this.connect();
        return this.db.tables;
    }

    async add<T extends Todo>(task: T['id']) {
        await this.connect();
        const newTodo: Todo = {
            id: String(Date.now() + Math.floor(Math.random() * 10_000)),
            task,
            completed: false
        };
        this.db.tables.push(newTodo);
        await this.commit();
    }

    async edit<T extends Todo>(id: T['id'], { task, completed }: Partial<Pick<Todo, 'task' | 'completed'>>) {
        await this.connect();
        const taskIndex = this.db.tables.findIndex(t => t.id === id);
        if (taskIndex < 0) {
            throw new NotFoundError(`No record found in the database with id of "${id}"`);
        }
        if (task !== undefined) {
            this.db.tables[taskIndex].task = task;
        }

        if (completed !== undefined) {
            this.db.tables[taskIndex].completed = completed;
        }
        await this.commit();
    }

    async delete<T extends Todo>(id: T['id']) {
        await this.connect();
        this.db.tables = this.db.tables.filter(t => t.id !== id);
        await this.commit();
    }
}


class NotFoundError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
    }
}
