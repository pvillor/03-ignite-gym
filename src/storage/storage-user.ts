import { UserDTO } from "@dtos/user-dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE } from "./storage-config";

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}