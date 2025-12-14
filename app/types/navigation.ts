export type SubLink = {
  label: string;
  href: string;
};

export type NavLink = 
  | {
      label: string;
      icon: React.ReactNode;
      href: string;
    }
  | {
      label: string;
      icon: React.ReactNode;
      subLinks: SubLink[];
    };
