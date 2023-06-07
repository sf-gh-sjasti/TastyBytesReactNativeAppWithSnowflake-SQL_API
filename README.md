# Developing Tasty Bytes React Native Application using Snowflake, SQL API
In today's data-driven landscape, the majority of applications have evolved to become highly data intensive. However, developing successful data applications can be challenging, particularly as user numbers grow and the volume and complexity of data increase. Snowflake is the driving force behind numerous data applications, empowering software teams to enhance their engineering velocity and create scalable applications without the burden of operational complexities. With its focus on increasing engineering speed, Snowflake offers exceptional performance and scalability for applications. 

To expedite the development of Data Apps, Snowflake offers the SQL API, a RESTful API that enables seamless access and manipulation of data within the Snowflake Database. The SQL API serves as a bridge between your application and Snowflake, allowing you to retrieve and update data programmatically.

In this tutorial, the application you are building helps fictitious food truck company, Tasty Bytes and Truck drivers to see the Orders placed by the customers and truck driver can complete the orders upon delivery. This tutorial will guide you through the process of utilizing the SQL API to develop a React Native application for Truck Drivers. 

To run the app locally,
### Step 1: Get the Source Code
1. Clone the repo using ``` git clone https://github.com/sf-gh-sjasti/TastyBytesReactNativeAppWithSnowflake-SQL_API.git reactNativeApp ```
2. Navigate to the folder, ``` cd reactNativeApp ```
3. Run ``` npm install ``` to install dependancies

### Step 2: Configure the application
1. Open the ``` reactNativeApp ``` folder in VS Code or IDE of your choice.
2. Open the ``` .env ``` file and update ``` PRIVATE_KEY ``` value with the private key. Copy and paste the whole private key from ``` ~/.ssh/snowflake_app_key.pub ``` including header(``` -----BEGIN RSA PRIVATE KEY----- ```) and footer(``` -----END RSA PRIVATE KEY----- ```).
3. If you are located in us-west region, Update ``` SNOWFLAKE_ACCOUNT_IDENTIFIER ``` with your Snowflake Account
   (or) If you are located outside the us-west region, Update ``` SNOWFLAKE_ACCOUNT_IDENTIFIER ``` as '<SNOWFLAKE ACCOUNT>.<REGION>'.
   To get the snowflake_account value from Snowflake, run ``` SELECT CURRENT_ACCOUNT() ``` in Snowsight. 
   To get the region value from Snowflake, run ``` SELECT CURRENT_REGION() ``` in Snowsight. 
   SNOWFLAKE_ACCOUNT_IDENTIFIER and SNOWFLAKE_ACCOUNT would be same for us-west. 
4. Update ``` SNOWFLAKE_ACCOUNT ``` with your Snowflake Account.
5. Update ``` PUBLIC_KEY_FINGERPRINT ``` with your user Public Key FingerPrint. To get Public Key Fingerprint, Run the following SQL in Snowsight  ```DESCRIBE USER data_app_demo ``` and get RSA_PUBLIC_KEY_FP property value.

### Step 3: Review the Source Code
We are using Key Pair Authentication to authenticate with Snowflake using SQL API. You can refer to the ``` Tokens.js ``` to understand how we are generating the JWT token. ``` Orders.js ``` has the source code to render Orders screen. You can also refer to this file to find out how to initiate a SQL API call and the headers needed. ``` OrderDetails.js ``` has the source code to render Order Details Screen.

### Step 4: Test the application
1. Run ``` npx expo start --clear ``` and hit ``` w ``` key to run the app in a web browser
2. This launches the app in Web Browser
3. Upon Launch, You can see the InQueue Orders Screen
4. Now Click on View Order button to see the Order Details.
5. Click on ORDER READY button to complete the order. This action updates the Order Status value to Completed for this Order and take you back to the InQueue Orders Screen
6. Now, Click on Order History tab to see the completed orders.

For detailed steps, Refer to the Quickstart.

