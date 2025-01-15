import { createContext, ReactNode, useState } from "react";

import { UserDTO } from "@dtos/user-dto";
import { api } from "@services/api";

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => void
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('sessions', {
        email,
        password
      })
  
      if(data.user) {
        setUser(user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}