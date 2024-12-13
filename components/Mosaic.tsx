import { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system';
// import * as ExternalStorageManager from "../modules/external-storage-manager";


const deleteFile = (path: string) => {
    // if (Platform.OS === "android") {
    //   return ExternalStorageManager.deleteExternalFileAsync(path);
    // }
  
    // return FileSystem.deleteAsync(path);
    return true;
  };

export function Mosaic() {

    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions(
        {
            granularPermissions: ["photo"],
        }
    );

    // const [isExternalStorageManager, requestExternalStoragePermission] =
    //     ExternalStorageManager.usePermission();

    async function getPhotos() {
        if (permissionResponse?.status !== "granted") {
            await requestPermission();
          }
        // if (isExternalStorageManager === false) {
        //     await requestExternalStoragePermission();
        //   }


        let fetchedPhotos = await MediaLibrary.getAssetsAsync({
            first : 5,
        });
        console.log("zizi")

        const localMaxFetch = fetchedPhotos.totalCount

        if(Platform.OS === "ios"){
            console.log("test")
            fetchedPhotos = await MediaLibrary.getAssetsAsync({
                first : localMaxFetch,
            });
            const tempRand = Math.floor(Math.random() * localMaxFetch)
            console.log(fetchedPhotos.assets[tempRand])
            setPhotos([fetchedPhotos.assets[tempRand]])
            
        } else if (Platform.OS === "android"){
            console.log("test")
            const tempRand = Math.floor(Math.random() * localMaxFetch)
            console.log(tempRand, localMaxFetch)
            let fetchedPhotos = await MediaLibrary.getAssetsAsync({
                first : 1,
                after: tempRand.toFixed(),
            });
            console.log(fetchedPhotos.assets)

            setPhotos(fetchedPhotos.assets)
        }
  }


  if(photos.length === 0){
    return (
            <Button onPress={getPhotos} title="Test">
            </Button>
    );
    } else {
        return (
            <ThemedView>
                <Image source={{uri:photos[0].uri}} style={{width:300,height:300}}/>
                <Button title="Delete" onPress={
                    async () =>  {
                        try {
                            const done = await deleteFile(photos[0].uri);
            
                            if (done) {
                              setPhotos(photos.filter((p) => p.id !== photos[0].id));
                            } else {
                              alert("Failed to delete file");
                            }
                          } catch (e) {
                            console.error(e);
                          }
                    }
                    }></Button>
                <Button title="Next" onPress={getPhotos}></Button>
            </ThemedView>
        );
    }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
