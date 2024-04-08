import { View, Image, StatusBar, Alert} from "react-native"
import { useState } from "react"
import { Link, router } from "expo-router"
import { Input } from "@/components/input"
import {FontAwesome6, MaterialIcons} from "@expo/vector-icons"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"

import axios from "axios"
import  api  from "@/serve/api"
import {useBadgeStore} from "@/store/badge-store"

const EVENT_ID = "9e9bd979-9d10-4915-b339-3786b1634f33"

export default function register(){
    const badgeStore = useBadgeStore()
    const [name, setName] = useState("")
    const [email, setEmail]= useState("")
    const [isLoading, setisLoading] = useState(false)

async function handleRegister(){
    try{
        if(!name.trim()|| !email.trim()) {
            return Alert.alert("Incrição", "Prencha os dados")
        }
        setisLoading(true)

    const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {name, email,})

    if(registerResponse.data.attendeeId){
        const BadgeResponse = await api.get(`/attendees/${registerResponse.data.attendeeId}/badge`)

        badgeStore.save(BadgeResponse.data.badge)

       Alert.alert("Incrição realaziada com sucesso! ", "ok",[
        { text: "ok", onPress: () =>{ router.push("/ticket") }}
       ]  )
    }

    
    } catch(error){
       console.log(error)
       setisLoading(false)


       if(axios.isAxiosError(error)){
         if(String(error.response?.data.messsage).includes("already registered")){
            return Alert.alert("Incrição", "Este email ja esta cadastrado!")
         }
       }



       Alert.alert("Erro na Inscrição")
     
    }
}
        
    
    return (
        <View className="flex-1 bg-green-500 items-center justify-center">
            <StatusBar barStyle="light-content"/>

            <Image source={require("@/assets/logo.png")} className="h-16" resizeMode="contain" />
            
            <View className="w-full mt-12 gap-3">

                <Input>
                <FontAwesome6 name="user-circle" size={25} color={colors.white} />
                <Input.Field placeholder="Nome Completo" 
                onChangeText={setName}
                />

                </Input>

                <Input>
                <MaterialIcons name="alternate-email" size={25} color={colors.white} />
                <Input.Field placeholder="E-mail" keyboardType="email-address" 
                onChangeText={setEmail}/>

                </Input>


                <Button title="Realizar Inscrição" onPress={handleRegister} isLoading={isLoading}/>
                <Link 
                href="/" className="text-gray-100 text-base font-bold text-center mt-8">
                   Ja Possui Ingresso
                    </Link>
            </View>
        </View>
    )
}

