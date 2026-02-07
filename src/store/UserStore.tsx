"use client";

import { createContext, useState } from "react";
import { User } from "@/types/User";

const UserStoreContext = createContext<{
  user: User | null;
  fetchUser: () => void;
}>(null!);

export const UserStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user] = useState(null);

  const fetchUser = async () => {
    // const response = await fetch("http://localhost:3000/api/user/1");
    // const data = await response.json();
    // setUser(data);
  };

  return (
    <UserStoreContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserStoreContext.Provider>
  );
};
