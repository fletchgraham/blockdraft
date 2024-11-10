// app/api/sync/route.js
import { NextResponse } from "next/server";

// Placeholder for in-memory storage
let lists = [
  { id: "list1", blockIds: ["1", "2"] },
  { id: "list2", blockIds: ["3"] },
];

export async function POST(request) {
  const updatedLists = await request.json();
  lists = updatedLists; // Replace in-memory data with updated data
  return NextResponse.json({ success: true });
}
