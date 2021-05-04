import styled from 'styled-components';
import QueryForm from './components/form/QueryForm';
import 'antd/dist/antd.css';

const DataContainer = styled.div`
  width:100%;
  height:100%;
`;

function App() {
  return (
    <DataContainer>
      <QueryForm />
    </DataContainer>
  );
}

export default App;
