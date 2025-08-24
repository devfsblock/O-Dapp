import * as React from "react";

export const KeyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    {...props}
    className={"w-5 h-5 text-[#4F6BFE] mr-2 " + (props.className || "")}
  >
    <path d="M12.5 2a5.5 5.5 0 1 0 4.47 8.8l.03.03 1.72 1.72a1 1 0 0 0 1.41-1.41l-1.72-1.72-.03-.03A5.5 5.5 0 0 0 12.5 2zm-3 5.5a3 3 0 1 1 6 0a3 3 0 0 1-6 0z" />
  </svg>
);
