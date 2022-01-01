/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {Formik} from 'formik';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const ACCESS_KEY = '03fde200e5938379edded87062557a22';

export interface ConvertValues {
  amount: boolean;
  coinFrom: String;
  coinTo: String;
}

interface Props {
  initialValues: ConvertValues;
}
const App = (initialValues: Props) => {
  const [coins, setCoins] = useState([]);
  const [coinsValues, setCoinsValues] = useState([]);
  const [convert, setConvert] = useState(0);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const response = await fetch(
          `http://api.coinlayer.com/api/live?access_key=${ACCESS_KEY}`,
        );
        const responseJson = await response.json();
        const resultCoins = [];
        const resultCoinValues = [];
        responseJson.rates.map(i => {
          resultCoins.push(i);
          resultCoinValues.push([i, responseJson.rates[i]]);
        });
        setCoins(resultCoins);
        setCoinsValues(resultCoinValues);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCoins();
  }, [setCoins]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleSubmitCurrency = useCallback(
    (values: any) => {
      let valueCoinFrom = 0;
      let valueCoinTo = 0;
      coinsValues.map(val => {
        if (val[0] === values.coinFrom) {
          valueCoinFrom = val[1];
        }
        if (val[0] === values.coinTo) {
          valueCoinTo = val[1];
        }
      });
      const result =
        valueCoinFrom * valueCoinTo * values.amount;
      console.log(result);
      setConvert(result);
    },
    [coinsValues, setConvert],
  );
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmitCurrency}>
      {({values, handleChange, setFieldValue, handleSubmit}) => (
        <SafeAreaView style={backgroundStyle}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
              }}>
              <View>
                <Text style={styles.item}>Conversión de Monedas</Text>
              </View>
              <View style={styles.container}>
                <Picker
                  selectedValue={values.coinFrom}
                  onValueChange={e => {
                    setFieldValue('coinFrom', e);
                  }}>
                  <Picker.Item key="0" label="From" value="all" />
                  {coins.map(item => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
              <View style={styles.container}>
                <Picker
                  selectedValue={values.coinTo}
                  onValueChange={e => {
                    setFieldValue('coinTo', e);
                  }}>
                  <Picker.Item key="0" label="To" value="all" />
                  {coins.map(item => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
              <View style={styles.container}>
                <TextInput
                  placeholder="Monto"
                  keyboardType="numeric"
                  textAlign="left"
                  autoCapitalize="none"
                  value={values.amount}
                  onChangeText={handleChange('amount')}
                />
              </View>
              <Button title="Guardar" onPress={handleSubmit} />
              {convert && <Text style={styles.item}>{convert}</Text>}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default App;
