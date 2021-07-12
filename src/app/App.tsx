import React from 'react';
import '../styles/app.css';
import '~/app/App.css';
import { containerBuilder } from './app.container';
import './app.i18n';
import AppRouter from './AppRouter';
import { NavBar, Chart } from './layout';
import { getData } from './layout/mockData';
import Card from '@material-ui/core/Card';
import { Button } from '@material-ui/core';
import { useMoralis } from 'react-moralis';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { XGrid } from '@material-ui/x-grid';

containerBuilder();

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function App() {
  const classes = useStyles();
  const [mockData, setMockData] = React.useState([]);
  const [chainData, setChainData] = React.useState([]);
  const { authenticate, isAuthenticated, user, Moralis, logout, isInitialized } = useMoralis();
  console.log(isInitialized);
  if (mockData.length === 0) {
    getData().then((data: any) => {
      // console.log(data);
      setMockData(data);
    });
  }

  const displayUserName = () => {
    if (!isAuthenticated) return '';
    console.log(Moralis.User.transactions);
    console.log(Moralis.User.current);
    return user.get('username');
  };

  const getRecords = async () => {
    if (isAuthenticated) {
      const query = new Moralis.Query('BscTransactions');
      query.equalTo('from_address', user.get('ethAddress'));
      const results = await query.find();
      const temp: React.SetStateAction<any[]> = [];
      await results.forEach((point: { attributes: any }) => {
        const tempObj = {
          id: point.attributes.transaction_index,
          ...point.attributes
        };
        console.log(tempObj);
        temp.push(tempObj);
        console.log(temp);
      });
      await setChainData(temp);
      console.log(temp);
      await console.log(results[0].attributes);
    } else {
      return;
    }
  };

  console.log(chainData);

  // function createData(
  //   block_hash: string,
  //   block_number: string,
  //   block_timestamp: string,
  //   confirmed: string,
  //   createdAt: string,
  //   from_address: string,
  //   gas: string,
  //   gas_price: string,
  //   hash: string,
  //   input: string,
  //   nonce: string,
  //   receipt_contract_address: string,
  //   receipt_cumulative_gas_used: string,
  //   receipt_gas_used: string,
  //   receipt_root: string,
  //   receipt_status: string,
  //   to_address: string,
  //   transaction_index: string
  // ) {
  //   return {
  //     block_hash,
  //     block_number,
  //     block_timestamp,
  //     confirmed,
  //     createdAt,
  //     from_address,
  //     gas,
  //     gas_price,
  //     hash,
  //     input,
  //     nonce,
  //     receipt_contract_address,
  //     receipt_cumulative_gas_used,
  //     receipt_gas_used,
  //     receipt_root,
  //     receipt_status,
  //     to_address,
  //     transaction_index
  //   };
  // }

  const columns = [
    { title: 'block_hash', field: 'block_hash' },
    { title: 'block_number', field: 'block_number' },
    { title: 'block_timestamp name', field: 'block_timestamp' },
    { title: 'confirmed name', field: 'confirmed' },
    { title: 'createdAt', field: 'createdAt' },
    { title: 'from_address', field: 'from_address' },
    { title: 'gas', field: 'gas' },
    { title: 'gas_price name', field: 'gas_price' },
    { title: 'hash name', field: 'hash' },
    { title: 'input', field: 'input' },
    { title: 'nonce', field: 'nonce' },
    // { title: 'receipt_contract_address', field: 'receipt_contract_address' },
    { title: 'receipt_cumulative_gas_used name', field: 'receipt_cumulative_gas_used' },
    { title: 'receipt_gas_used name', field: 'receipt_gas_used' },
    // { title: 'receipt_root', field: 'receipt_root' },
    { title: 'receipt_status', field: 'receipt_status' },
    { title: 'to_address', field: 'to_address' },
    { title: 'transaction_index', field: 'transaction_index' }
  ];

  const renderGraph = () => {
    if (mockData.length) {
      return (
        <Card style={{ backgroundColor: 'rgb(55 53 53)', width: 'fit-content', margin: '24px auto' }}>
          <Chart data={mockData} />
        </Card>
      );
    } else {
      return null;
    }
  };
  return (
    <div className={'primaryBackground'}>
      <NavBar />
      <Button style={{ background: 'lightgreen', width: '150px', margin: '30px' }} onClick={() => authenticate()}>
        Authenticate
      </Button>
      <Button style={{ background: 'red', width: '150px', margin: '30px' }} onClick={() => logout()}>
        Logout
      </Button>
      <Button style={{ background: 'grey', width: '150px', margin: '30px' }} onClick={() => getRecords()}>
        Refresh Stats
      </Button>

      <h3>Welcome {displayUserName()}</h3>
      <div style={{ height: 800, width: '100%', backgroundColor: '#ae5e5e' }}>
        <XGrid rows={chainData} columns={columns} />
      </div>

      {renderGraph()}
      <AppRouter />
    </div>
  );
}
// block_hash: "0x7ddfd0777a0486b1a386e130ba8cf3d3cda129a635a5bc09cd7ab8ffd7d0d07a"
// block_number: 3095103
// block_timestamp: Mon Dec 14 2020 10:19:38 GMT-0600 (Central Standard Time) {}
// confirmed: true
// createdAt: Thu Jul 08 2021 15:20:02 GMT-0500 (Central Daylight Time) {}
// from_address: "0xc572779d7839b998df24fc316c89bed3d450ed13"
// gas: 27753
// gas_price: 20000000000
// hash: "0x914827f71c7bc395a0e0bc5d6187aa33fa12c89b2e81479e80f60f6c7bb09edb"
// input: "0x095ea7b300000000000000000000000005ff2b0db69458a0750badebc4f9e13add608c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
// nonce: 2
// receipt_contract_address: null
// receipt_cumulative_gas_used: 872046
// receipt_gas_used: 25230
// receipt_root: null
// receipt_status: 1
// to_address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
// transaction_index: 3
