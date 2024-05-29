import type { Todo } from "~/data/db";
import { DB } from "~/data/db";

export const getTodo = async <T extends Todo>(todoId: T['id']) => {
    const db = new DB(process.cwd() + '/app/data/data.json');
    return db.get(todoId);
}

export const editTodo = async <T extends Todo>(formData: FormData, todoId: T['id']) => {
    const formObject = JSON.parse(JSON.stringify(Object.fromEntries(formData)));
    switch (formObject.completed) {
        case "todo":
            formObject.completed = false;
            break;
        case "done":
            formObject.completed = true;
        break;
        default:
            // TODO: Better response handling
            throw new Error("Unknown value of `completed`");
    }
    
    const db = new DB(process.cwd() + '/app/data/data.json');
    await db.edit(todoId, formObject);
}

export const deleteTodo = async <T extends Todo>(todoId: T['id']) => {
    const db = new DB(process.cwd + '/app/data/data.json');
    await db.delete(todoId);
}
