import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image } from 'react-native';
import { ListItem } from "react-native-elements";
import { ScrollView } from 'react-native-gesture-handler';
import SpinnerButton from 'react-native-spinner-button';
import Styles from './Styles';
import bearerToken from "./Tokens";
import { SNOWFLAKE_ACCOUNT } from '@env';

export default function OrderDetails({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonColorCode, setButtonColorCode] = useState('#11567F');
  const [buttonText, setButtonText] = useState('ORDER READY');
  const [defaultLoading, setDefaultLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const getOrderDetailData = async (orderNum) => {
    try {
      const date = new Date();
      setCurrentDate(date.toLocaleString());
      const response = await fetch('https://' + SNOWFLAKE_ACCOUNT + '.snowflakecomputing.com/api/v2/statements', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT',
        Authorization: 'Bearer ' + bearerToken()
        },
        body: JSON.stringify({
          "statement": `SELECT SUM(quantity), menu_item_name, unit_price, order_total, order_tax_amount, order_status 
                        FROM frostbyte_tasty_bytes_app.analytics.data_app_orders_v 
                        WHERE order_id = ` + orderNum +
                        `AND unit_price > 0
                        GROUP BY 2,3,4,5,6;`,
          "timeout": 1200,
          "database": "FROSTBYTE_TASTY_BYTES_APP",
          "schema": "FROSTBYTE_TASTY_BYTES_APP.ANALYTICS",
          "warehouse": "TASTY_APP_WH",
          "role": "TASTY_BYTES_DATA_APP_DEMO"
          }),
      });
      const json = await response.json();
      setOrderDetailData(json.data);
      setIsDataFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (orderNum) => {
    try {
      setDefaultLoading(true);
      const response = await fetch('https://' + SNOWFLAKE_ACCOUNT + '.snowflakecomputing.com/api/v2/statements', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT',
        Authorization: 'Bearer ' + bearerToken()
        },
        body: JSON.stringify({
          "statement": `UPDATE frostbyte_tasty_bytes_app.raw.app_order_header
                        SET order_status = 'COMPLETED'
                        WHERE order_id = ` + orderNum + `;`,
          "timeout": 1200,
          "database": "FROSTBYTE_TASTY_BYTES_APP",
          "schema": "FROSTBYTE_TASTY_BYTES_APP.ANALYTICS",
          "warehouse": "TASTY_APP_WH",
          "role": "TASTY_BYTES_DATA_APP_DEMO"
          }),
      });
      if (response.status == 200) {
        setDefaultLoading(false);
        setIsButtonDisabled(true);
        setButtonColorCode('#8A999E');
        setButtonText('ORDER COMPLETED');
        setTimeout(() => {
          navigation.navigate('Orders');
        }, 700);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrderDetailData(orderNum);
  }, []);

  function handleClick() {
    updateOrderStatus(orderNum);
  }

  const { firstName, lastName, orderTotal, orderNum, truckId } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ paddingTop: 20, paddingLeft: 30, paddingBottom: 40 }}>
          <Text style={Styles.content}>{"Truck ID: " + truckId}</Text>
          <Text style={Styles.content}>{"Date: " + currentDate}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', paddingLeft: 24, paddingRight: 24 }}>
          <Image
            style={{ width: 100, height: 100 }}
            source={require('./Images/avatar.png')}
          />
          <View>
            <Text style={[Styles.content, { padding: 20 }]}>
              <Text style={Styles.contentHeading}>
                {firstName + " " + lastName} {'\n'}
              </Text>
              {'$' + (parseFloat(orderTotal).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} {'\n'}
              {'Order # ' + orderNum}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 20 }}>
            { isDataFetched &&
              <FlatList
                data={orderDetailData}
                scrollEnabled={true}
                vertical
                ListEmptyComponent={
                  <View style= {{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{ height: 50 }}>{'\n'}</Text>
                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#11567F', fontFamily: 'lato' }}>No Data Found</Text>
                  </View>}
                renderItem={({ item }) =>
                  <ListItem>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                      <Text style={Styles.content}>
                        {item[0] + "x " + item[1]}
                      </Text>
                      <Text style={Styles.content}>
                        {'$' + ((item[2] * item[0]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                      </Text>
                    </View>
                  </ListItem>
                }
                ListFooterComponent={() => {
                  return (<View style={Styles.horizontalLine} />);
                }}
              />
            }
          </View>
          <View style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 10 }}>
            {orderDetailData[0] && orderDetailData[0].length > 0 &&
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10 }}>
                  <Text style={{ fontWeight: '900', fontSize: 16, fontFamily: 'lato' }}>Total</Text>
                  <Text style={Styles.content}>{'$' + ((parseFloat((orderDetailData[0])[3]).toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))}</Text>
                </View>
              </View>
            }
          </View>
          <View style={{ paddingTop: 30 }}>
            {orderDetailData[0] && orderDetailData[0].length > 0 &&
              <SpinnerButton
                buttonStyle={{ alignItems: 'center', backgroundColor: ((orderDetailData[0])[5] == 'COMPLETED' ? '#8A999E' : buttonColorCode), padding: 20, marginLeft: 25, marginRight: 25, borderRadius: 50 }}
                isLoading={defaultLoading}
                spinnerType='MaterialIndicator'
                onPress={handleClick}
                disabled={(orderDetailData[0])[5] == 'COMPLETED' ? true : isButtonDisabled}
              >
                <Text style={{ color: '#FFFFFF', fontFamily: 'texta-black', fontSize: 20, fontWeight: 700 }}>{(orderDetailData[0])[5] == 'COMPLETED' ? 'ORDER COMPLETED' : buttonText}</Text>
              </SpinnerButton>
            }
          </View>
          <Text style={{ height: 30 }}>{'\n'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};