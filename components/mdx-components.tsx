import { MDX_COMPONENTS } from "@/features/mdx/mdx-components";

// Re-export the MDX components map and provide a small hook for compatibility
export function useMDXComponents() {
  return MDX_COMPONENTS;
}

export { MDX_COMPONENTS };

export default useMDXComponents;
