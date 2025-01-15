import { createContext, ReactNode, useState } from "react";

import { UserDTO } from "@dtos/user-dto";

export interface AuthContextDataProps {
  user: UserDTO
}


export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
      id: '1',
      name: 'Paulo Victor',
      email:  'villo@rocketseat.com',
      avatarUrl: 'https://github.com/pvillor.png',
  })

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}