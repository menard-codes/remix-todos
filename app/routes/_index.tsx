import type { MetaFunction } from "@remix-run/node";
import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { DB } from "~/data/db";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const db = new DB(process.cwd() + "/app/data/data.json");
  const data = await db.getAll();
  return json({data});
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

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
            
              <li
                className="
                  border-2 border-solid border-zinc-500 hover:bg-zinc-200 px-4 py-2 rounded-md flex justify-between
                  transition-transform duration-100 ease-in
                "
                key={id}
              >
                <Link to={`/todo/${id}`} key={id} className="underline hover:decoration-blue-700">
                  <span className={`hover:text-blue-700 ${completed ? "line-through italic text-zinc-500" : ""}`}>{task}</span>
                </Link>
                <Form action={`/todo/${id}`} method="PUT">
                  {
                    completed
                      ? <>
                          <input hidden type="checkbox" name="completed" defaultChecked />
                          <button className=" bg-green-600 hover:bg-green-500 text-green-50 px-4 py-1 rounded-md text-sm flex items-center">DONE</button>
                        </>
                      : <>
                          <input hidden type="checkbox" name="completed" />
                          <button className=" bg-zinc-600 hover:bg-zinc-500 text-zinc-50 px-4 py-1 rounded-md text-sm flex items-center">TODO</button>
                        </>
                  }
                </Form>
              </li>
          ))
        }
      </ul>
    </div>
  );
}
