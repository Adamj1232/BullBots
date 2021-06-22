import React from 'react';
import '../styles/app.css';
import '~/app/App.css';
import { containerBuilder } from './app.container';
import './app.i18n';
import AppRouter from './AppRouter';
import { NavBar, Chart } from './layout';
import { getData } from './layout/mockData';
import Card from '@material-ui/core/Card';

containerBuilder();

export default function App() {
  const [mockData, setMockData] = React.useState([]);
  if (mockData.length === 0) {
    getData().then((data: any) => {
      console.log(data);
      setMockData(data);
    });
  }

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
      {renderGraph()}
      <AppRouter />
    </div>
  );
}
