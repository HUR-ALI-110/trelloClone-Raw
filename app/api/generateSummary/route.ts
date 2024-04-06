import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();

export async function POST(req: Request) {
  const { todos } = await req.json();
  console.log(todos);

  // communicate with Gpt
  const res = await await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    stream: false,
    n: 1,
    messages: [
      {
        role: "system",
        content: `When responsding, welcome the user always Mr.Sonny and say welcome to in our todolist and limit the response till 200 character.`,
      },
      {
        role: "user",
        content: `Hi there! provide the summary of todos , count how many todos are in each category such as todo,in progress , done and then tell the user to have a productive day ! here's is the data :${JSON.stringify(
          todos
        )} `,
      },
    ],
  });

  const data = res;
  console.log(`Data is : ${data}`);
  console.log(data.choices[0].message);

  return NextResponse.json(data.choices[0].message);
}
