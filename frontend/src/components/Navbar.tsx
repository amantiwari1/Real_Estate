import { Navbar as NavbarMantine, NavLink } from "@mantine/core";
import { useRouter } from "next/router";
import { navlinks } from "~/constants";

const Navbar = () => {
  const router = useRouter();
  return (
    <NavbarMantine
      width={{ base: 210 }}
      className="flex flex-col justify-between"
    >
      <div>
        <NavbarMantine.Section className="space-y-5 p-5">
          {navlinks.map((link) => (
            <div key={link.name} className="flex justify-center">
              <NavLink
                label={link.name}
                onClick={() => {
                  if (link.name === "logout") {
                    // disconnect && disconnect();
                  } else {
                    router.push(link.link);
                  }
                }}
                className="rounded-full capitalize"
                icon={<link.icon />}
              />
            </div>
          ))}
        </NavbarMantine.Section>
      </div>
    </NavbarMantine>
  );
};

export default Navbar;
