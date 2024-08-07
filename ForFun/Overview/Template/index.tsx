import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  useColorScheme,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  RefreshControl
} from 'react-native';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Card } from 'react-native-paper';
import { reviceHeart } from '../../function';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  getPostData,
  getCommentData,
  sendHeart,
  sendComment,
  COMMENTDATA,
  POSTDATA,
} from './function';
import Video, { VideoRef } from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';

const emptyBanana = '../../../asset/emptyBanana.png';
const fullBanana = '../../../asset/fullBanana.png';

type ItemProps = {
  name: string;
  mockTitle: string;
  avatarUrl: string;
  description: string;
  image: boolean;
  contentUri: string;
  hearts: number;
  like: boolean;
  viewable: boolean;
  handleComment: any;
};

const Item = ({
  name,
  mockTitle,
  avatarUrl,
  description,
  image,
  contentUri,
  hearts,
  like,
  viewable,
  handleComment,
}: ItemProps) => {
  const theme = useColorScheme();
  const color = theme === 'dark' ? 'white' : 'black';
  const [heart, setHeart] = useState(like);
  const [heartNum, setHeartNum] = useState(hearts);
  const [showMore, setShowMore] = useState(false);
  const desc = description.substring(0, 49);
  const moredesc = description.substring(49);
  const videoRef = useRef<VideoRef>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(!viewable);
    setMuted(!viewable);
  }, [viewable]);
  return (
    <View style={styles.item}>
      <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={[styles.name, { color: color }]}>{name}  {mockTitle}</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        {image ? (
          <Image source={{ uri: contentUri }} style={styles.content} />
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            touchSoundDisabled={true}
            onPress={() => {
              setPaused(prev => !prev);
            }}>
            <Video
              // Can be a URL or a local file.
              source={{ uri: contentUri }}
              ref={videoRef}
              muted={muted}
              paused={paused}
              style={{ height: 350, width: '100%' }}
              resizeMode="cover"
            />
            <Pressable
              style={{
                position: 'absolute',
                left: 5,
                bottom: 5,
                backgroundColor: 'gray',
                borderRadius: 20,
                height: 30,
                width: 30,
                justifyContent: 'center',
              }}
              onPress={() => {
                setMuted(prev => !prev);
              }}>
              <Icon
                name={muted ? 'volume-mute' : 'volume-high'}
                size={20}
                style={{ alignSelf: 'center' }}
                color="white"
              />
            </Pressable>
            <Pressable
              style={{
                position: 'absolute',
                alignSelf: 'center',
                right: 5,
                bottom: 5,
                backgroundColor: 'gray',
                borderRadius: 20,
                height: 30,
                width: 30,
                justifyContent: 'center',
              }}
              onPress={() => {
                setPaused(prev => !prev);
              }}>
              <Icon
                name={paused ? 'play' : 'pause'}
                size={20}
                style={{ alignSelf: 'center' }}
                color="white"
              />
            </Pressable>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ padding: 5 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Pressable
            onPress={() => {
              handleComment();
            }}
            style={{ marginRight: 10 }}>
            <Icon
              name="chatbubble-outline"
              color={color}
              size={28}
              style={{}}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              // 修改愛心剩餘數量
              reviceHeart(heart, () => {
                setHeart(prev => !prev);
                setHeartNum(prev => prev + 1);
              });

              // 回傳後端用戶喜歡某貼文
              // sendHeart(pid)
            }}>
            <Image
              source={!heart ? require(emptyBanana) : require(fullBanana)}
              style={{ height: 30, width: 30, marginRight: 10 }}
              tintColor={
                theme == 'light' && !heart
                  ? 'black'
                  : !heart
                    ? 'white'
                    : undefined
              }
            />
          </Pressable>
          <Text style={[{ color: color, fontSize: 15 }]}>{heartNum}</Text>
        </View>

        {desc.length < 49 ? (
          <View>
            <Text style={{ fontWeight: '500', color: color, fontSize: 16 }}>
              {desc}
            </Text>
          </View>
        ) : (
          <View>
            {!showMore ? (
              <View>
                <Text style={{ fontWeight: '500', color: color, fontSize: 16 }}>
                  {desc}
                </Text>
                <Pressable
                  onPress={() => {
                    setShowMore(prev => !prev);
                  }}>
                  <Text style={{ fontWeight: '500', fontSize: 16 }}>
                    顯示更多...
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Text style={{ fontWeight: '500', color: color, fontSize: 16 }}>
                {desc}
                {moredesc}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

type CommentItemProps = {
  id: number;
  username: string;
  content: string;
  avatarUrl: string;
  mockTitle: string;
  timestamp: string;
};

const CommentItem = ({
  id,
  username,
  content,
  avatarUrl,
  mockTitle,
  timestamp,
}: CommentItemProps) => {
  const theme = useColorScheme();
  const color = theme === 'dark' ? 'white' : 'black';
  return (
    <View style={{ marginVertical: 10, padding: 10, flexDirection: 'row' }}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View>
        <Text
          style={{
            color: color,
            fontWeight: '500',
            marginBottom: 5,
            fontSize: 18,
            width: 320,
          }}>
          {username}  {mockTitle}
        </Text>
        <Text style={{ color: color, fontWeight: '500', width: 320 }}>
          {content}
        </Text>
      </View>
    </View>
  );
};

export default ({ kind, scrollY }: any) => {
  const theme = useColorScheme();
  const [postData, setPostData] = useState(POSTDATA);
  const [moreData, setMoreData] = useState(POSTDATA);
  const [commentData, setCommentData] = useState(COMMENTDATA);
  const [comment, setComment] = useState('');
  const [page, setPage] = useState(1);
  //先將loading設為false，若是後端完成後要設為true
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // useEffect(()=>{
  //   getPostData(setPostData,kind,page)
  //   setLoading(false)
  // }
  //   ,[])

  const focus = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  // 設定當前觀看的item是哪一個
  const [viewItem, setViewItem] = useState(0);
  // for item focus
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70, // Percentage of item that needs to be visible to consider it "in view"
  };
  // 當目前觀看的item改變時
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    viewableItems.forEach((item: any) => {
      setViewItem(item.index);
    });
  }, []);
  const loadMoreData = useCallback(() => {
    if (!loading) {
      setLoading(true);
      // 調用getpostdata 來獲取更多數據，如果寫好則可以替代下面兩行
      // getPostData(setMoreData,page + 1, kind)
      // setPostData((prev)=>[...prev,...MoreData])
      setMoreData(POSTDATA);
      setPostData(prev => [...prev, ...prev]);
      setLoading(false);
    }
  }, [page, kind, loading]);

  // for comment area
  const handleSnapPress = useCallback((index: any) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleCloseComment = () => {
    sheetRef.current?.close();
    setIsVisible(false);
};
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch new data
      // getPostData(setPostData,kind,page)
    } catch (error) {
      console.error('Error fetching new data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return <Text style={{ alignSelf: 'center' }}>loading...</Text>;
  } else {
    return (
      <>
        <FlatList
          data={postData}
          renderItem={({ item, index }) => {
            let viewable = false;
            if (viewItem == index && focus == true) {
              viewable = true;
            }

            return (
              <Item
                name={item.name}
                mockTitle={item.mockTitle}
                avatarUrl={item.avatarUrl}
                description={item.description}
                image={item.image}
                contentUri={item.contentUri}
                hearts={item.hearts}
                like={item.like}
                key={index}
                viewable={viewable}
                handleComment={() => {
                  handleSnapPress(0);
                  setIsVisible(true)
                  // getCommentData(item.id);
                }}

              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={<View style={{ height: 80 }} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          // onEndReached={loadMoreData}
          // onEndReachedThreshold={1}
          // ListFooterComponent={loading ? <Text style={{ alignSelf: "center", padding: 10 }}>載入中...</Text> : null}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                目前沒有文章,快來新增一篇吧!
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme === 'dark' ? 'white' : 'black'}
            />
          }
        />
        {isVisible && (
                    <TouchableWithoutFeedback onPress={handleCloseComment}>
                        <View style={styles.overlay} />
                    </TouchableWithoutFeedback>
                )}
        <BottomSheet
          ref={sheetRef}
          index={-1}
          enablePanDownToClose
          snapPoints={snapPoints}
          backgroundStyle={[
            styles.commentContainer,
            { backgroundColor: theme === 'dark' ? '#1C1C1E' : 'white' },
          ]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <BottomSheetFlatList
              data={commentData}
              ListHeaderComponent={<View style={{ height: 60 }}></View>}
              keyExtractor={(item, index) => item.id.toString()} // Ensure each id is a string or use a different keyExtractor
              renderItem={({ item, index }) => (
                <CommentItem
                  id={item.id}
                  username={item.username}
                  content={item.content}
                  timestamp={item.timestamp}
                  avatarUrl={item.avatarUrl}
                  mockTitle={item.mockTitle}
                  key={index} // key is not necessary here, as FlatList handles keys internally
                />
              )}
            />
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme === 'dark' ? '#1C1C1E' : 'white' },
              ]}>
              <TextInput
                style={[
                  styles.input,
                  { color: theme === 'dark' ? 'white' : 'black' },
                ]}
                value={comment}
                onChangeText={setComment}
                placeholder="寫下你的評論..."
                placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
              />
              <TouchableOpacity
                onPress={() => {
                  // sendComment(0, comment);
                  handleCloseComment()
                  setComment('')
                }}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>發送</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </BottomSheet>
      </>
    );
  }
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    padding: 10,
    flex: 1,
  },
  commentContainer: {
    backgroundColor: 'gray',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // 垂直居中对齐
  },
  flexContainer: {
    flex: 3,
  },
  name: {
    fontSize: 16,

    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'white',
  },
  content: {
    width: '100%',
    height: 350,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,

    borderTopColor: '#ccc',
    position: 'absolute',
    top: 0,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '0%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 半透明黑色背景
    zIndex: 0, // 確保覆蓋在底部視圖上
}
});
