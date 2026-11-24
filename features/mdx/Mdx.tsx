import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Suspense } from "react";
import { MDX_COMPONENTS } from "./mdx-components";
import { rehypePlugin } from "./mdx-plugin";

type MdxProps = { source?: any; children?: string };

export const Mdx = ({ source, children }: MdxProps) => {
  // Prefer raw children string if provided (keeps prior example flow).
  if (children && typeof children === "string") {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MDXRemote
          source={children}
          options={{
            mdxOptions: {
              rehypePlugins: rehypePlugin,
            },
          }}
          components={MDX_COMPONENTS}
        />
      </Suspense>
    );
  }

  // Otherwise accept a serialized object
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {source && typeof source === "object" && "compiledSource" in source ? (
        <MDXRemote source={(source as any).compiledSource} components={MDX_COMPONENTS} />
      ) : (
        <MDXRemote {...source} components={MDX_COMPONENTS} />
      )}
    </Suspense>
  );
};