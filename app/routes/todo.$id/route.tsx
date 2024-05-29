import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, Form, useNavigate, redirect } from "@remix-run/react";
import { deleteTodo, editTodo, getTodo } from "./adapters";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const todoId = params?.id;

    if (todoId === undefined) {
        // TODO: Should throw a better response
        throw new Error('No `id` param present');
    }

    const data = await getTodo(todoId);
    return json({data});
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const todoId = params?.id;

    if (todoId === undefined) {
        // TODO: Better error handling
        throw new Error('No `id` param present');
    }

    switch (request.method.toLowerCase()) {
        case "put": {
            const formData = await request.formData();
            await editTodo(formData, todoId);
            // TODO: Better response handling
            return {message: "Success"};
        } case "delete": {
            await deleteTodo(todoId);
            return redirect('/');
        }
    }
    
    // TODO: Should have a better response handling
    return null;
}

export default function TodoItem() {
    const { data } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen grid place-content-center">
            <div className="w-96">
                <button onClick={() => navigate(-1)} type="button">
                👈 Cancel
                </button>
                <h1 className="text-3xl font-semibold text-center p-4">Task Item</h1>
                <Form method="PUT" className="w-full mx-auto grid gap-4">
                    <div>
                        <label htmlFor="task" className="block font-bold">Task</label>
                        <input
                            defaultValue={data.task}
                            name="task"
                            id="task"
                            placeholder="Task item"
                            className="bg-zinc-200 px-3 py-1 rounded min-w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="completed" className="block font-bold">Status</label>
                        <select
                            name="completed"
                            id="completed"
                            defaultValue={data.completed ? "done" : "todo"}
                            className="border-2 border-solid border-zinc-400 w-full p-2 rounded-lg"
                            required
                        >
                            <option value="done">DONE</option>
                            <option value="todo">TODO</option>
                        </select>
                    </div>
                    <button className="py-2 mt-4 bg-zinc-500 text-zinc-50 rounded-xl">Save</button>
                </Form>
                <Form method="DELETE">
                    <button className="bg-red-600 text-white w-full mt-4 py-2 rounded-xl">Delete</button>
                </Form>
            </div>
        </div>
    )
}
