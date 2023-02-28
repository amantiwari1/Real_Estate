import {
  IconHome,
  IconSquarePlus,
  IconClipboardPlus,
  IconNotes,
  IconUser,
} from "@tabler/icons-react";

export const navlinks = [
  {
    name: "market",
    icon: IconHome,
    link: "/marketplace",
  },
  {
    name: "Create NFT",
    icon: IconSquarePlus,
    link: "/real_estate/new",
  },
  {
    name: "My Collection",
    icon: IconClipboardPlus,
    link: "/collection",
  },
  {
    name: "My Drafts",
    icon: IconNotes,
    link: "/drafts",
  },
  {
    name: "My Flovatars",
    icon: IconUser,
    link: "/account/flovatar",
  },
  {
    name: "My Account",
    icon: IconUser,
    link: "/account",
  },
  {
    name: "Discover Flowns",
    icon: IconUser,
    link: "/account/flowns",
  }
];
