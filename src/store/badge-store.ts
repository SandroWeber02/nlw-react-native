import { create } from "zustand";
import  {createJSONStorage, persist} from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";


export type BadgeStore ={
    id: string
    name: string
    email: string
    eventTitle: string
    checkInURL: string
    image?: string
}

type StateProps = {
    data: BadgeStore | null
    save: (badge: BadgeStore ) => void
    uptadeAvatar: (uri: string) => void
    remove: () => void
}

export const useBadgeStore = create(persist
<StateProps>((set) => ({
  data:null,

  save: (data: BadgeStore) => set(() => ({data: data})),
  remove: () => set(() => ({data: null})),
  uptadeAvatar: (uri: string) => set((state) => ({
    data: state.data?{ ...state.data, image: uri} : state.data
  }))

}),
    {
    name: "nwl-unite:Badge",
    storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
