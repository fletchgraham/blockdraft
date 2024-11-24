"use client";

import Link from "next/link";
import { logout } from "@/actions/user";

export default function SideBarLinks({ sessionExists }) {
  return (
    <>
      <li className="mb-10">
        <Link
          className="text-xl btn btn-ghost"
          href="/"
          onClick={() =>
            (document.getElementById("my-drawer-2").checked = false)
          }
        >
          blockdraft.ai
        </Link>
      </li>
      {sessionExists && (
        <>
          <li>
            {/* on click close the sidebar */}
            <Link
              className="btn btn-ghost"
              href="/edit"
              onClick={() =>
                (document.getElementById("my-drawer-2").checked = false)
              }
            >
              Editor
            </Link>
          </li>
          <li>
            <Link
              className="btn btn-ghost"
              href="/import-urls"
              onClick={() =>
                (document.getElementById("my-drawer-2").checked = false)
              }
            >
              Import urls
            </Link>
          </li>
          <li>
            <Link
              className="btn btn-ghost"
              href="/drafts"
              onClick={() =>
                (document.getElementById("my-drawer-2").checked = false)
              }
            >
              Drafts
            </Link>
          </li>
          <li>
            <form className="btn btn-ghost" action={logout}>
              <button
                onClick={() =>
                  (document.getElementById("my-drawer-2").checked = false)
                }
              >
                Log Out
              </button>
            </form>
          </li>
        </>
      )}
      {!sessionExists && (
        <li>
          <Link
            href="/login"
            className="btn btn-ghost"
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
