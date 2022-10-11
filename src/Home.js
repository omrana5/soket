import { 
  SafeAreaView,
   StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  Platform,} from 'react-native'
import React,{useState,useRef} from 'react'
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
// import {PESDK, PhotoEditorModal, Configuration} from 'react-native-photoeditorsdk';

import PhotoEditor from 'react-native-photo-editor'
import { FILTERS } from '../imagefilter/imagefilter';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');


const Home = () => {
  const navigation = useNavigation();
  const [Images , setImages] = useState('https://w7.pngwing.com/pngs/340/956/png-transparent-profile-user-icon-computer-icons-user-profile-head-ico-miscellaneous-black-desktop-wallpaper.png')
  const [selectedFilterIndex, setIndex] = useState(0);
  const [Flage, setFlage] = useState(false);
  const stickers = [];
  const defaltUrl = 'https://w7.pngwing.com/pngs/340/956/png-transparent-profile-user-icon-computer-icons-user-profile-head-ico-miscellaneous-black-desktop-wallpaper.png';
  const extractedUri = useRef(defaltUrl);
  const opencamera = () =>{
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      avoidEmptySpaceAroundImage:true,
      ropperActiveWidgetColor:"#9E200B",
      cropperStatusBarColor:'#000000',
      cropperToolbarColor:'#CFE814',
      cropperToolbarWidget:'#2DE814',
      freeStyleCropEnabled:true,
      cropperCircleOverlay:true,
      compressImageQuality:0.7,
      compressImageMaxHeight:300,
      compressImageMaxWidth:300,
      // useFrontCamera:true,
      enableRotationGesture:true
    }).then(image => {
      console.log(image);
      setImages(image.path)
    });

  }

  const opengallary = (data) =>{
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      avoidEmptySpaceAroundImage:true,
      cropperActiveWidgetColor:"#9E200B",
      cropperStatusBarColor:'#000000',
      cropperToolbarColor:'#CFE814',
      cropperToolbarWidget:'#2DE814',
      freeStyleCropEnabled:true,
      cropperCircleOverlay:true,
      useFrontCamera:true,
      enableRotationGesture:true,
      compressImageQuality:0.7,
      compressImageMaxHeight:300,
      compressImageMaxWidth:300,
      includeBase64:true,
      multiple: true
    }).then(data => {
      console.log("includeBase64 ===>",data);
     const seconddata = data.map(data => data.path)
      console.log("hello ===>",seconddata);
      setImages(seconddata)
    });

  }
  const onEdit =  () => {
    try {
      // const path =  PhotoEditor.open({
      //   path: Images,
      //   // path: photo.path,
      //   stickers,
      // });
      // console.log("ok==>");
      // setImages({
      //   ...Images,
      //   path,
      // });
      // console.log('resultEdit', path);
      PhotoEditor.Edit({
        path:Images
        // path: RNFS.DocumentDirectoryPath + "/photo.jpg"

    });
    } catch (e) {
      console.log('e==>', e);
    }
  }

  const checkPermission = async () => {
    
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission
 
    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };
 
  const downloadImage = () => {
    // Main function to download the image
    
    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = Images;    
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' + 
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };
 
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ?
             /[^.]+$/.exec(filename) : undefined;
  };
  const onSelectFilter = selectedIndex => {
    console.log("Index anf Selected index", selectedIndex);
    setIndex(selectedIndex);
  };

  const onExtractImage = ({ nativeEvent }) => {
    extractedUri.current = nativeEvent.uri;
    console.log("========-L>",extractedUri.current);
  };

  const renderFilterComponent = ({ item, index }) => {
    
    const FilterComponent = item.filterComponent;
      console.log("Images.path==>",Images.path);
    const image = ( 
      <Image
        style={styles.filterSelector}
        source={{
          uri: Images ? Images : defaltUrl,
        }}
        resizeMode={'contain'}
      />

    );
    return (
      <TouchableOpacity onPress={() => onSelectFilter(index)}>
        <Text style={styles.filterTitle}>{item.title}</Text>
        <FilterComponent image={image} />
      </TouchableOpacity>
    );
  };

  const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;
    return (
      <SafeAreaView style={{flex:1,justifyContent:'center'}}>
        <ScrollView style={{flex:1}}>
    <View style={{justifyContent:'center',flex:1}}>
       {selectedFilterIndex === 0 ? (
      <Image
            style={styles.image}
            source={{
              uri: Images[0],
            }}
          />
          ) : (
            <SelectedFilterComponent
            onExtractImage={onExtractImage}
            extractImageEnabled={true}
            image={
              <Image
                // style={{ height: '30%', width: '90%', alignSelf: "center", marginTop: 20, resizeMode: 'contain',backgroundColor:"red" }}
                style={styles.image}
                source={{
                  uri: Images ? Images : defaltUrl,
                }}
              />
            }
          />
        )}
          {
            Flage && <FlatList
            data={FILTERS}
            keyExtractor={item => item.title}
            horizontal={true}
            renderItem={renderFilterComponent}

            showsHorizontalScrollIndicator={false}
          />
          }
          
      <TouchableOpacity
       onPress={opencamera} 
       style={{backgroundColor:"red",borderRadius:10,width:'90%',height:"5%",justifyContent:'center',alignSelf:'center',marginTop:'10%'}}>
      <Text style={{fontSize:20,alignSelf:'center',fontWeight:'900'}}>opencamera</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={opengallary} 
      style={{marginTop:30,backgroundColor:"red",borderRadius:10,width:'90%',height:"5%",justifyContent:'center',alignSelf:'center'}}>
      <Text style={{fontSize:20,alignSelf:'center',fontWeight:'900'}}>openGallary</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={checkPermission} style={{marginTop:30,backgroundColor:"red",borderRadius:10,width:'90%',height:"5%",justifyContent:'center',alignSelf:'center'}}>
      <Text style={{fontSize:20,alignSelf:'center',fontWeight:'900'}}>Download</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onEdit} style={{marginTop:30,backgroundColor:"red",borderRadius:10,width:'90%',height:"5%",justifyContent:'center',alignSelf:'center'}}>
      <Text style={{fontSize:20,alignSelf:'center',fontWeight:'900'}}>onpen Editor</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop:'20%' }}>
          <TouchableOpacity style={{
            height: 40,
            width: 100,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
            onPress={() => setFlage(true)}
          >
            <Text style={styles.titleOpen}>open fileter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={{
            height: 40,
            width: 100,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setFlage(false)}
          >
            <Text style={styles.titleOpen}>close fileter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          // onPress={()=> {navigation.navigate('Mergeimage',{Images})}} 
          style={{
            height: 40,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Text style={styles.titleOpen}>Image Merge</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> {navigation.navigate('Imagecollection',{Images})}} style={{
            height: 40,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Text style={styles.titleOpen}>Image Frame</Text>
          </TouchableOpacity>
          
        </View>
        <TouchableOpacity onPress={()=> {navigation.navigate('Customeimageframe',{Images})}} style={{
            height: 90,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Text style={styles.titleOpen}>custome Frame</Text>
          </TouchableOpacity>
      </View>

  
    </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
    alignSelf: 'center',
    resizeMode:'contain',
    borderRadius:20
  },
  titleOpen: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 12,
  },
  openPicker: {
    margin: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSelector: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius:50,
    // backgroundColor:'red'
  },
  filterTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  
})