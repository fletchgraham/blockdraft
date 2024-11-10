// app/api/blocks/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const blocks = [
    {
      _id: "1",
      title: "Sample Block 1",
      text: "This is a sample block.",
      thumbnailUrl: "",
    },
    {
      _id: "2",
      title: "Sample Block 2",
      text: "Another sample block.",
      thumbnailUrl: "",
    },
    {
      _id: "3",
      title: "Sample Block 3",
      text: "Yet another sample block.",
      thumbnailUrl: "",
    },
  ];
  return NextResponse.json(blocks);
}
