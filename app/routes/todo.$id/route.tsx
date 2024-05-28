import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, Form } from "@remix-run/react";
import { DB } from "~/data/db";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const todoId = params?.id;

    if (todoId === undefined) {
        // TODO: Should throw a better response
        throw new Error('No `id` param present');
    }

    const db = new DB(process.cwd() + '/app/data/data.json');
    const data = await db.get(todoId);
    return json({data});
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const todoId = params?.id;

    if (todoId === undefined) {
        // TODO: Better error handling
        throw new Error('No `id` param present');
    }

    if (request.method.toLowerCase() === "put") {
        const formData = await request.formData();
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
        // TODO: Better response handling
        return {message: "Success"};
    }
    
    // TODO: Should have a better response handling
    return null;
}

export default function TodoItem() {
    const { data } = useLoaderData<typeof loader>();

    return (
        <Form method="PUT">
            <div>
                <label htmlFor="task">Task</label>
                <input
                    defaultValue={data.task}
                    name="task"
                    id="task"
                    placeholder="Task item"
                    required
                />
            </div>
            <div>
                <label htmlFor="completed">Status</label>
                <select name="completed" id="completed" defaultValue={data.completed ? "done" : "todo"} required>
                    <option value="done">DONE</option>
                    <option value="todo">TODO</option>
                </select>
            </div>
            <button>Save</button>
        </Form>
    )
}
