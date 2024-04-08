import { View, Image, StatusBar, Alert} from "react-native"
import { useState } from "react"
import { Link, Redirect } from "expo-router"

import { Input } from "@/components/input"
import {MaterialCommunityIcons} from "@expo/vector-icons"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"
import api from "@/serve/api"
import {useBadgeStore} from "@/store/badge-store"

export default function Home(){
    const[code, setCode] = useState("")
    const[isLoading, setisLoading] = useState(false)
    const badgeStore = useBadgeStore ()

   async function handleAccessCredential(){
        try{
        if(!code.trim()){
            return Alert.alert("Ingresso","Informe a credencial")
        }

        setisLoading(true)
    const {data} = await api.get(`/attendees/${code}/badge`)
    badgeStore.save(data.badge)



    }catch(error){
        console.log(error)
        setisLoading(false)
        Alert.alert("Ingresso", "Ingresso Não Encontrado")
        
    }
    }

    if(badgeStore.data?.checkInURL){
        return <Redirect href="/ticket" />
    }

    return (
    

        <View className="flex-1 bg-green-500 items-center justify-center">
            <StatusBar barStyle="light-content"/>

            <Image source={require("@/assets/logo.png")} className="h-16" resizeMode="contain" />
            
            <View className="w-full mt-12 gap-3">
                <Input>
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={25} color={colors.white} />
                <Input.Field placeholder="Codigo"
                onChangeText={setCode}
                />

                </Input>

                <Button title="Acessar Credencial" onPress={handleAccessCredential} isLoading ={isLoading}/>
                <Link 
                href="/register" className="text-gray-100 text-base font-bold text-center mt-8">
                    Ainda Não possui ingresso 
                    </Link>
            </View>
        </View>
    )
}