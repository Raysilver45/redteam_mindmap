import { MdxNote } from "./MdxNote";
import { MdxPre } from "./MdxPre";
import { MdxYouTube } from "./MdxYouTube";
import CommandGroup, { Command } from "./CommandGroup";

export const MDX_COMPONENTS = {
  YouTube: MdxYouTube,
  Note: MdxNote,
  pre: MdxPre,
  CommandGroup,
  Command,
};