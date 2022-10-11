import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    Alert,
    Animated
} from 'react-native';
import { DynamicCollage, LayoutData } from '@qeepsake/react-native-images-collage';
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PanGestureHandler } from 'react-native-gesture-handler'
import RNFetchBlob from 'rn-fetch-blob';




const photos = ["https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400"];


const Imagecollection = () => {
    const collageRef = useRef(null);
    const ref = useRef(null);
    const [mylink, setmylink] = useState(null)


    const download = () => {
        ref.current.capture().then(uri => {
            console.log("do something with ", uri);
            setmylink(uri);
            console.log("new link???????? ", (uri).toString());
        });

    }

    const handleDownload = () => {
        CameraRoll.save(mylink)
            .then(Alert.alert('Success', 'Photo added to camera roll!'))
    };

    function replaceImage(source, m, i) {
        collageRef.current.replaceImage("https://picsum.photos/400", i, m);
    };


    let translateX = new Animated.Value(0)
    let translateY = new Animated.Value(0)

    let handleGesture = Animated.event([{ nativeEvent: { translationX: translateX, translationY: translateY } }], { useNativeDriver: true });

    let circleTransformStyle
    circleTransformStyle = {
        transform: [
            {
                translateY: translateY
            },
            {
                translateX: translateX
            }
        ]
    }




    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <ViewShot ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
                    <View style={styles.sectionContainer}>
                        <DynamicCollage
                            ref={collageRef}
                            width={"100%"}
                            height={300}
                            images={photos}
                            matrix={[3, 4]}

                        />
                    </View>
                </ViewShot>
                <TouchableOpacity onPress={download} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: 'green', width: 200, height: 50, alignSelf: 'center' }}>
                    <Text>download</Text>
                </TouchableOpacity>
                <PanGestureHandler onGestureEvent={handleGesture}>
                    <Animated.View style={[ circleTransformStyle]}>
                        <TouchableOpacity onPress={handleDownload} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: 'green', width: 200, height: 50, alignSelf: 'center' }}>
                            <Text>save to gallary</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </PanGestureHandler>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "blue",
        width: 25,
        height: 25,
        zIndex: 9999
    },
    sectionContainer: {
        paddingHorizontal: 24,
    },
});

export default Imagecollection;




