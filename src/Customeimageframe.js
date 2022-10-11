import { View, Text, ImageBackground, FlatList, Image, Animated, Dimensions, Alert, ScrollView } from 'react-native'
import React, { useState, useCallback, useRef, createRef } from 'react'
import { imagedata } from '../src/Jasonedata';
import { useRoute } from '@react-navigation/native'
import { PanGestureHandler, TouchableOpacity, PinchGestureHandler, State } from 'react-native-gesture-handler'
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";


const Customeimageframe = () => {
  const tag = '[GESTURE]'
  const [currentframe, setcurrentframe] = useState(null);
  const rout = useRoute();
  console.log('??????>>>>>???>>', rout.params)
  const [mylink, setmylink] = useState(null)
  const ref = useRef(null);

  const [panEnabled, setPanEnabled] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event([{
    nativeEvent: { scale }
  }],
    { useNativeDriver: true });

  const onPanEvent = Animated.event([{
    nativeEvent: {
      translationX: translateX,
      translationY: translateY
    }
  }],
    { useNativeDriver: true });

  const handlePinchStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true
        }).start();

        setPanEnabled(false);
      }
    }
  };


  const renderItem = useCallback(
    (data) => (
      <View style={{ marginHorizontal: 5, }}>
        <TouchableOpacity onPress={() => setcurrentframe(data.item.image)} style={{ justifyContent: 'center', borderWidth: 1, borderColor: 'black', padding: 5 }}>
          <Image style={{ height: 80, width: 80, resizeMode: 'contain' }} source={data.item.image}></Image>
        </TouchableOpacity>
      </View>
    ),
    []
  );

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


  let handleGesture = Animated.event([{ nativeEvent: { translationX: translateX, translationY: translateY } }], { useNativeDriver: true });

  return (
    <View style={{ flex: 1 }}>
    <ScrollView>
      <ViewShot ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
        <View style={{ width: '100%', height: 400, overflow: 'hidden', alignSelf: 'center' }}>
          <View pointerEvents="none">
            <Image style={{ height: '100%', width: '100%', resizeMode: 'cover', borderWidth: 1, borderColor: 'white', }} source={currentframe} />
          </View>
          <View style={[{ height: '100%', width: '100%', alignSelf: 'center', position: 'absolute', zIndex: -1, top: 0 }]}>
            <PanGestureHandler
              onGestureEvent={onPanEvent}
              ref={panRef}
              simultaneousHandlers={[pinchRef]}
              // enabled={panEnabled}
              failOffsetX={[-1000, 1000]}
              shouldCancelWhenOutside>
              <Animated.View>
                <PinchGestureHandler
                  ref={pinchRef}
                  onGestureEvent={onPinchEvent}
                  // simultaneousHandlers={[panRef]}
                  // onHandlerStateChange={handlePinchStateChange}
                  >
                  <Animated.Image source={{ uri: rout.params.Images[0] }} style={{ height: '100%', width: '100%', resizeMode: 'cover', transform: [{ scale }, { translateX }, { translateY }] }} />
                </PinchGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </View>
      </ViewShot>

      <FlatList
        data={imagedata}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 5, alignSelf: 'center' }}
      />
      <View style={{ flexDirection: 'row', bottom: 10,marginTop:50 }}>
        <TouchableOpacity onPress={download} style={{ height: 60, width: 200, alignSelf: 'center', backgroundColor: 'red', bottom: 20, borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownload} style={{ height: 60, width: 200, alignSelf: 'center', backgroundColor: 'green', bottom: 20, borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '600' }}>Download</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  )
}

export default Customeimageframe
