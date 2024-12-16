"use client";

import Link from "next/link";
import { logout } from "@/actions/user";
import { Button } from "react-daisyui";
// import ManageSubscriptionButton from "./ManageSubscriptionButton";

export default function SideBarLinks({ sessionExists }) {
  return (
    <>
      <li className="mb-10">
        <Link
          className="text-xl font-bold"
          href="/"
          onClick={() =>
            (document.getElementById("my-drawer-2").checked = false)
          }
        >
          BlockDraft AI
        </Link>
      </li>
      {sessionExists && (
        <>
          <li>
            {/* on click close the sidebar */}
            <Link
              className="font-semibold"
              href="/edit"
              onClick={() =>
                (document.getElementById("my-drawer-2").checked = false)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Editor
            </Link>
          </li>
          <li>
            <Link
              href="/import-urls"
              className="font-semibold"
              onClick={() =>
                (document.getElementById("my-drawer-2").checked = false)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                />
              </svg>
              Import
            </Link>
          </li>
          <li>
            <Link
              href="/drafts"
              className="font-semibold"
              onClick={() =>
                (document.getElementById("my-drawer-2").checked = false)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              Drafts
            </Link>
          </li>
          <li>
            <Button onClick={async () => {
              await fetch('/api/stripe/billing')
                .then(res => res.json())
                .then((data) => {
                  console.log(data);
                  window.location.href = data.url;
                });
            }}>Manage Plan</Button>
          </li>
          <li className="mt-10">
            <a href="#" onClick={logout} className="font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              Log Out
            </a>
          </li>

          {/* redirect to plan page */}
          <li className="mt-10 font-semibold">
            
            <Link href='/#pricing'>
                Upgrade
            </Link>
            
           
          </li>
        </>
      )}
      {!sessionExists && (
        <li>
          <Link
            href="/auth"
            onClick={() =>
              (document.getElementById("my-drawer-2").checked = false)
            }
          >
            Login
          </Link>
        </li>
      )}
    </>
  );
}
