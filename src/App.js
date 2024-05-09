import React, { useState } from 'react';
import { Card, ListGroup, Button, Form, Spinner, Alert } from 'react-bootstrap';
import Web3 from 'web3';

// Defina o ABI e o endereço do contrato aqui
const policyContractABI = [] // ABI do Contrato de Apólice
const policyContractAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'; // Endereço do Contrato de Apólice
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // Conexão Web3

const policyContract = new web3.eth.Contract(policyContractABI, policyContractAddress);

function App() {
  const [accounts, setAccounts] = useState([]); // Contas Ethereum
  const [policyDetails, setPolicyDetails] = useState(''); // Detalhes da Apólice
  const [claimStatus, setClaimStatus] = useState(''); // Status do Sinistro
  const [newPolicyData, setNewPolicyData] = useState({ // Dados para criar uma nova apólice
    insuredAddress: '',
    premium: '',
    coverage: '',
    shipmentDetails: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(null); // Erros

  // Carregar contas Ethereum
  const loadAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accs = await web3.eth.getAccounts();
      setAccounts(accs);
    } catch (error) {
      setError("Erro ao carregar contas: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar uma nova apólice
  const createPolicy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { insuredAddress, premium, coverage, shipmentDetails } = newPolicyData;
      await policyContract.methods.createPolicy(insuredAddress, premium, coverage, shipmentDetails).send({ from: accounts[0] });
    } catch (error) {
      setError("Erro ao criar apólice: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar detalhes da apólice
  const fetchPolicy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const policyId = "" /* Substitua pelo ID da apólice */;
      const details = await policyContract.methods.getPolicyDetails(policyId).call();
      setPolicyDetails(JSON.stringify(details));
    } catch (error) {
      setError("Erro ao buscar apólice: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submeter um sinistro
  const submitClaim = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const policyId = "" /* Substitua pelo ID da apólice para qual o sinistro está sendo submetido */;
      const claimAmount = "" /* Substitua pelo valor do sinistro */;
      await policyContract.methods.submitClaim(policyId, claimAmount).send({ from: accounts[0] });
    } catch (error) {
      setError("Erro ao submeter sinistro: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {/* Carregar contas */}
      <Button variant="info" onClick={loadAccounts}>
        Carregar Contas
      </Button>

      {/* Buscar e exibir detalhes da apólice */}
      <Button variant="info" onClick={fetchPolicy}>
        Buscar Apólice
      </Button>
      <Card style={{ width: '18rem', marginTop: '20px' }}>
        <Card.Body>
          <Card.Title>Gerenciamento de Apólice</Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Endereço Segurado: {accounts[0]}</ListGroup.Item>
            <ListGroup.Item>Detalhes da Apólice: {policyDetails}</ListGroup.Item>
          </ListGroup>

          {/* Formulário para criação de apólice */}
          <Form>
            <Form.Group controlId="insuredAddress">
              <Form.Label>Endereço Segurado</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Endereço Segurado" 
                value={newPolicyData.insuredAddress}
                onChange={(e) => setNewPolicyData({ ...newPolicyData, insuredAddress: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="premium">
              <Form.Label>Valor do Prêmio</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Valor do Prêmio" 
                value={newPolicyData.premium}
                onChange={(e) => setNewPolicyData({ ...newPolicyData, premium: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="coverage">
              <Form.Label>Valor da Cobertura</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Valor da Cobertura" 
                value={newPolicyData.coverage}
                onChange={(e) => setNewPolicyData({ ...newPolicyData, coverage: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="shipmentDetails">
              <Form.Label>Detalhes do Envio</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Detalhes do Envio"
                value={newPolicyData.shipmentDetails}
                onChange={(e) => setNewPolicyData({ ...newPolicyData, shipmentDetails: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" onClick={createPolicy}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Criar Apólice"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Gerenciamento de Sinistro */}
      <Card style={{ width: '18rem', marginTop: '20px' }}>
        <Card.Body>
          <Card.Title>Gerenciamento de Sinistro</Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Status do Sinistro: {claimStatus}</ListGroup.Item>
          </ListGroup>
          <Button variant="danger" onClick={submitClaim}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Submeter Sinistro"}
          </Button>
        </Card.Body>
      </Card>

      {/* Exibir erros */}
      {error && <Alert variant="danger" style={{ marginTop: '20px' }}>{error}</Alert>}
    </div>
  );
}

export default App;