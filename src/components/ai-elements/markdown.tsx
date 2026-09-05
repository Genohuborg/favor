import Link from "next/link";
import React, { memo } from "react";
import dynamic from "next/dynamic";
import type { StreamdownProps } from "streamdown";

// Streamdown is loaded CLIENT-SIDE ONLY, and that is load-bearing.
//
// Statically imported, its `Streamdown` export is `undefined` in the server
// bundle, so SSR throws
//
//   Element type is invalid: expected a string (for built-in components) or a
//   class/function (for composite components) but got: undefined.
//
// <ChatInterface /> is rendered from the ROOT LAYOUT, so that single undefined
// component returned HTTP 500 on EVERY server-rendered route of the site --
// `/`, `/about`, `/team`, `/terms`, every variant page -- not just the chat.
//
// Two things were needed, and neither works alone:
//
//   1. the webpack alias in next.config.mjs, which points streamdown at its
//      ESM entry. Without it the build fails outright ("ESM packages (shiki)
//      need to be imported"), because webpack resolves the package's CJS
//      build, which `require()`s the ESM-only shiki.
//   2. this ssr:false dynamic import. With the alias alone the build passes
//      but the export is still undefined during SSR, and the 500s remain.
//
// Deferring costs nothing: the chat is a closed popover on first paint, so
// there is no markdown to render until a user opens it.
//
// If you make this a static import again, test a server-rendered route, not
// just the chat -- the failure shows up site-wide, far from this file.
const Streamdown = dynamic(
  () => import("streamdown").then((m) => m.Streamdown),
  { ssr: false },
);

type Components = StreamdownProps["components"];

const components: Partial<Components> = {
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => (
  <Streamdown>{children}</Streamdown>
);

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
