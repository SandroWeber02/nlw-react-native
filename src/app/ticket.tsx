import React, { useState } from "react";
import {Redirect} from "expo-router"
import { MotiView } from "moti";
import { colors } from "@/styles/colors";
import {FontAwesome} from "@expo/vector-icons"
import { View, StatusBar, Text , ScrollView, TouchableOpacity, Alert, Modal, Share} from "react-native";
import { Header } from "@/components/header";
import { Credencial } from "@/components/credential";
import { Button } from "@/components/button";
import * as ImagePicker from "expo-image-picker";
import { QrCode } from "@/components/qrcode";
import {useBadgeStore} from "@/store/badge-store"




export default function Ticket(){
    
    const[onExpamdQRCode, setonExpamdQRCode] = useState(false)
    const badgeStore = useBadgeStore()

    async function handleShare() {
      try {
        if(badgeStore.data?.checkInURL){
          await Share.share({
            message: badgeStore.data.checkInURL,
          })
        }
      } catch (error){
        console.log(error)

        Alert.alert("Compartilhar", "Não Foi Possivel Compartilhar.")
      }
    }


    async function handleSelectImage(){
        try {
           const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,4],
           })
            if (result.assets){
                badgeStore.uptadeAvatar(result.assets [0].uri)
           }
        } catch (error){
            console.log(error)
            Alert.alert("Foto", "Nao foi possivel selecionar imagem")
        }
    }
    if (!badgeStore.data?.checkInURL) {
     return <Redirect href="/" />
    }

    return(

    <View className="flex-1 bg-green-500">
    <StatusBar barStyle="light-content" />
    <Header title="Minha Credencial" />
    <ScrollView className="-mt-28 -z-10" contentContainerClassName="px-8 pb-8">

    <Credencial data ={badgeStore.data} OnChangeAvatar={handleSelectImage}
    onExpamdQRCode={() =>setonExpamdQRCode(true)}/>

    <MotiView
    from={{
      translateY: 0,
    }}
    animate={{
      translateY: 10,
    }}
    transition={{
      loop: true,
      type: "timing",
      duration: 700
    }}>
     <FontAwesome
     name="angle-double-down"
     color={colors.gray[300]}
     size={24}
     className="self-center my-6"
     />
     </MotiView>

     <Text className="text-white font-bold text-2xl mt-4">
       Compartilhar Credencial
     </Text>
     <Text className="text-white font-regular text-base mt-1 mb-6">
        Mostre ao Mundo que Você vai participar do {badgeStore.data.eventTitle}
        </Text>

        <Button title="Compartilhar" onPress={handleShare}/>
        <TouchableOpacity activeOpacity={0.7} className="mt-10" onPress={() => badgeStore.remove()}>
           <Text className=" text-base text-white font-bold text-center">Remover Ingresso</Text> 
        </TouchableOpacity>

        </ScrollView>

        <Modal visible={onExpamdQRCode} animationType="fade">
          <View className="flex-1 bg-green-500 items-center justify-center">
            <QrCode value="teste" size={300} />
            <TouchableOpacity activeOpacity={0.7} onPress={() => setonExpamdQRCode(false)}>
              <Text className="font-body text-orange-500 text-sm mt-10 text-center">
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
    </View>
  ) 
}