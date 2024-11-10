// app/api/lists/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const lists = [
    {
      id: "list1",
      blockIds: ["1", "2"],
    },
    {
      id: "list2",
      blockIds: ["3"],
    },
  ];
  return NextResponse.json(lists);
}
