import React from 'react'
import { Image, ImageBackground } from 'react-native'

export default function Avatar({size}) {
    return(
        <Image 
        source={require('../assets/users/None-user.jpg')}
        resizeMode='cover'
        style={{width: size, height: size, borderRadius: 25 }}
        />
    )
}