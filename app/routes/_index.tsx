import type { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const data = [
    {
      id: "111",
      task: "Wash the dishes",
      completed: false
    },
    {
      id: "112",
      task: "Buy groceries",
      completed: true
    },
    {
      id: "113",
      task: "Walk the dog",
      completed: true
    }
  ];

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-semibold text-center p-4">TODOs</h1>
      <Form method="POST" className="grid gap-4 max-w-96 m-auto">
        <div>
          <label htmlFor="task" className="block">
            Enter a new task
          </label>
          <input
            id="task"
            name="task"
            placeholder="Wash the dishes..."
            className="bg-zinc-200 px-3 py-1 rounded min-w-full"
          />
        </div>
        <button className="block bg-slate-900 hover:bg-slate-600 text-slate-100 px-3 py-1 rounded-lg">Add</button>
      </Form>

      <hr className="block my-8 max-w-96 mx-auto" />

      <ul className="max-w-96 mx-auto grid gap-2">
        {
          data.map(({ id, task, completed }) => (
            <Link to={`/todo/${id}`} key={id}>
              <li
                className="
                  border-2 border-solid border-zinc-500 hover:bg-zinc-200 px-4 py-2 rounded-md flex justify-between hover:scale-105
                  transition-transform duration-100 ease-in
                "
              >
                <span>{task}</span>
                {
                  completed
                    ? <span className=" bg-green-600 text-green-50 px-4 rounded-md text-sm flex items-center">DONE</span>
                    : <span className=" bg-zinc-600 text-zinc-50 px-4 rounded-md text-sm flex items-center">TODO</span>
                }
              </li>
            </Link>
          ))
        }
      </ul>
    </div>
  );
}
