import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Dimensions, Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles from './Styles';
import bearerToken from "./Tokens";
import { SNOWFLAKE_ACCOUNT_IDENTIFIER } from '@env';

export default function Orders({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [truckId, setTruckId] = useState(50);
  const [inQueueData, setInQueueData] = useState([]);
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [isInqueueDataFetched, setIsInqueueDataFetched] = useState(false);
  const [isHistoryDataFetched, setIsHistoryDataFetched] = useState(false);
  const [currentDate, setCurrentDate] = useState([]);

  const getInQueueData = async () => {
    try {
      const date = new Date();
      setCurrentDate(date.toLocaleString());
      const response = await fetch('https://' + SNOWFLAKE_ACCOUNT_IDENTIFIER + '.snowflakecomputing.com/api/v2/statements', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT',
        Authorization: 'Bearer ' + bearerToken()
        },
        body: JSON.stringify({
          "statement": `SELECT DISTINCT TOP 50 order_id, first_name, last_name, order_total, order_ts 
                        FROM frostbyte_tasty_bytes_app.analytics.data_app_orders_v
                        WHERE date(order_ts) = current_date()
                        AND order_status = 'INQUEUE'
                        ORDER BY order_ts;`,
          "timeout": 1200,
          "database": "FROSTBYTE_TASTY_BYTES_APP",
          "schema": "FROSTBYTE_TASTY_BYTES_APP.ANALYTICS",
          "warehouse": "TASTY_APP_WH",
          "role": "TASTY_BYTES_DATA_APP_DEMO"
          }),
      });
      const json = await response.json();
      setInQueueData(json.data);
      setIsInqueueDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getOrderHistoryData = async () => {
    try {
      const response = await fetch('https://' + SNOWFLAKE_ACCOUNT_IDENTIFIER + '.snowflakecomputing.com/api/v2/statements', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT',
        Authorization: 'Bearer ' + bearerToken()
        },
        body: JSON.stringify({
          "statement": `SELECT DISTINCT TOP 50 order_id, first_name, last_name, order_total, order_ts
                        FROM frostbyte_tasty_bytes_app.analytics.data_app_orders_v
                        WHERE date(order_ts) = current_date()
                        AND order_status = 'COMPLETED'
                        ORDER BY order_ts DESC;`,
          "timeout": 1200,
          "database": "FROSTBYTE_TASTY_BYTES_APP",
          "schema": "FROSTBYTE_TASTY_BYTES_APP.ANALYTICS",
          "warehouse": "TASTY_APP_WH",
          "role": "TASTY_BYTES_DATA_APP_DEMO"
          }),
      });
      const json = await response.json();
      setOrderHistoryData(json.data);
      setIsHistoryDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
        getInQueueData();
    });
  }, [navigation]);

  const InQueue = () => (
    <View style={Styles.container}>
      {isInqueueDataFetched &&
        <FlatList
          data={inQueueData}
          scrollEnabled={true}
          vertical
          ItemSeparatorComponent={() => {
            return (<View style={Styles.horizontalLine} />);
          }}
          ListEmptyComponent={
            <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{ height: 50 }}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
            </View>}
          renderItem={({ item }) =>
            <ListItem>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('./Images/avatar.png')}
              />
              <View>
                <Text style={[Styles.content, { paddingLeft: 10 }]}>
                  <Text style={Styles.contentHeading}>
                    {(item[1] && item[2]) ? (item[1] + " " + item[2]) : 'Unknown Walk-up'} {'\n'}
                  </Text>
                  {'$' + (parseFloat(item[3]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} {'\n'}
                  {'Order # ' + item[0]}
                </Text>
                <Text style={{ height: 5 }}>{'\n'}</Text>
                <TouchableOpacity style={Styles.subButton}
                  onPress={() => navigation.navigate('Details', {
                    firstName: item[1] ? item[1] : 'Unknown',
                    lastName: item[2] ? item[2] : 'Walk-up',
                    orderTotal: item[3],
                    orderNum: item[0],
                    truckId: truckId
                  })}
                >
                  <Text style={Styles.subButtonText}>View Order</Text>
                </TouchableOpacity>
              </View>
            </ListItem>
          }
        />
      }
    </View>
  );

  const OrderHistory = () => (
    <View style={Styles.container}>
      {isHistoryDataFetched &&
        <FlatList
          data={orderHistoryData}
          scrollEnabled={true}
          vertical
          ItemSeparatorComponent={() => {
            return (<View style={Styles.horizontalLine} />);
          }}
          ListEmptyComponent={
            <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{ height: 50 }}>{'\n'}</Text>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
            </View>}
          renderItem={({ item }) =>
            <ListItem>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('./Images/avatar.png')}
              />
              <View>
                <Text style={[Styles.content, { paddingLeft: 10 }]}>
                  <Text style={Styles.contentHeading}>
                    {(item[1] && item[2]) ? (item[1] + " " + item[2]) : 'Unknown Walk-up'} {'\n'}
                  </Text>
                  {'$' + (parseFloat(item[3]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} {'\n'}
                  {'Order # ' + item[0]}
                </Text>
                <Text style={{ height: 5 }}>{'\n'}</Text>
                <TouchableOpacity style={Styles.subButton}
                  onPress={() => navigation.navigate('Details', {
                    firstName: item[1] ? item[1] : 'Unknown',
                    lastName: item[2] ? item[2] : 'Walk-up',
                    orderTotal: item[3],
                    orderNum: item[0],
                    truckId: truckId
                  })}
                >
                  <Text style={Styles.subButtonText}>View Order</Text>
                </TouchableOpacity>
              </View>
            </ListItem>
          }
        />
      }
    </View>
  );

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'inQueue', title: 'In Queue' },
    { key: 'orderHistory', title: 'Order History' },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{flex: 1}}>
        <View style={{ paddingTop: 20, paddingLeft: 30, paddingBottom: 10 }}>
          <Text style={Styles.content}>{"Truck ID: " + truckId}</Text>
          <Text style={Styles.content}>{"Date: " + currentDate}</Text>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={props => (
            <TabBar
              {...props}
              renderLabel={({ route }) => (
                <Text style={[Styles.contentHeading, { color: '#11567F', margin: 8 }]}>
                  {route.title}
                </Text>
              )}
              indicatorStyle={{ backgroundColor: '#000000', height: 1 }}
              style={{ backgroundColor: 'white' }}
              onTabPress={({ route }) => {
                if (route.key === 'inQueue') {
                  getInQueueData();
                }
                if (route.key === 'orderHistory') {
                  getOrderHistoryData();
                }
              }}
            />
          )}
          renderScene={SceneMap({
            inQueue: () => <InQueue />,
            orderHistory: () => <OrderHistory />,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          style={{}}
        />
      </View>
    </View>
  );
};